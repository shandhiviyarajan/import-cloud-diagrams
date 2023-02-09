angular.module('designer.workspace.layout.infrastructure', [
  "designer.workspace.layout.infrastructure.aws.global",
  "designer.workspace.layout.infrastructure.azure.resource_group",
  "designer.workspace.layout.infrastructure.gcp.network",
  "designer.workspace.layout.infrastructure.ibm.global",
  'designer.workspace.layout.infrastructure.container',
  'designer.workspace.layout.infrastructure.parent',
  "designer.state"
])
.directive('infrastructureLayout',
  ["DesignerState", "InfrastructureLayoutAWSGlobal", "InfrastructureLayoutAzureResourceGroup", "InfrastructureLayoutGCPNetwork", "InfrastructureLayoutIBMGlobal", "$timeout",
    function(DesignerState, InfrastructureLayoutAWSGlobal, InfrastructureLayoutAzureResourceGroup, InfrastructureLayoutGCPNetwork, InfrastructureLayoutIBMGlobal, $timeout) {
    return {
      templateUrl: '/designer/workspace/layout/layout.infrastructure.html',
      controllerAs: "InfrastructureLayout",
      bindToController: true,
      scope: {
        environment: "="
      },
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        this.layout = function() {
          if (_.includes(['Views::Infrastructure', 'Views::Infrastructure::Extended'], this.environment.current_view.type)) {
            // AWS
            var aws_global = InfrastructureLayoutAWSGlobal.load(this.environment).getData();

            // Azure
            var resource_groups = _.filter(this.environment.facet.resources, function(r) { return r.type === "Resources::Azure::Resources::ResourceGroup" });
            resource_groups = _.map(resource_groups, function(r) { return InfrastructureLayoutAzureResourceGroup.load(r, this.environment).getData() }.bind(this));

            // GCP
            var networks = _.filter(this.environment.facet.resources, function(r) { return r.type === "Resources::GCP::Compute::Network" });
            var network_containers = _.map(networks, function(r) { return InfrastructureLayoutGCPNetwork.load(r, this.environment).getData() }.bind(this));
            var gcp_global = this.getParent(networks, network_containers);

            // IBM
            var ibm_global = InfrastructureLayoutIBMGlobal.load(this.environment).getData();

            var containers = [aws_global, ibm_global, gcp_global].concat(resource_groups)

            $scope.view = {};
            $scope.view.containers = containers;
            $scope.view.dimensions = this.dimensions(containers);
            $scope.view.styles = this.styles($scope.view.dimensions);
          }
        }

        this.getParent = function(networks, network_containers) {
          var bottom = _.uniq(_.flatten(networks.map((c) => c.getGenericResources())));
          return {
            id: null,
            parent: true,
            center: network_containers,
            bottom: bottom
          }
        }

        this.styles = function(dimensions) {
          var values = {};
          var layout = DesignerState.get("layout")[this.environment.current_view.type];

          // Handle extended infra differently
          if(this.environment.current_view.type === 'Views::Infrastructure') {
            values.service = {
              margin: [16, layout.resource_width, layout.resource_height, layout.resource_width].join("px ") + "px"
            }

            values.load_balancer = values.service;
            values.subnet_service = values.service;

            values.left_column = function(container) {
              return { 'min-width': (Math.ceil((container.left.length || 0 )/dimensions[container.id].max_height) * (layout.resource_width*2+100)) + 'px' };
            }

            values.right_column = function(container) {
              return { 'min-width': (Math.ceil((container.right.length || 0 )/dimensions[container.id].max_height) * (layout.resource_width*2+100)) + 'px' };
            }

            values.subnet = function(container_id) {
              return { width: ((dimensions[container_id].max_size + layout.subnet_width) * (layout.resource_width*2+64)) + "px" }
            }
          }
          else {
            values.service = {
              margin: [16, layout.resource_width, layout.resource_height, layout.resource_width].join("px ") + "px"
            }

            values.load_balancer = {
              margin: [16, 77 + layout.resource_width, layout.resource_height, 77 + layout.resource_width].join("px ") + "px"
            }

            values.left_column = function(container) {
              return { 'min-width': (Math.ceil((container.left.length || 0 )/dimensions[container.id].max_height) * (layout.resource_width*2+100)) + 'px' };
            }

            values.right_column = function(container) {
              return { 'min-width': (Math.ceil((container.right.length || 0 )/dimensions[container.id].max_height) * (layout.resource_width*2+100)) + 'px' };
            }

            values.subnet_service = {
              margin: [16, 112 + layout.resource_width, layout.resource_height, 16].join("px ") + "px"
            }

            values.subnet = function(container_id) {
              return { width: ((dimensions[container_id].max_size + layout.subnet_width + 2) * (layout.resource_width+112+16)) + "px" }
            }
          }

          return values;
        };

        this.dimensions = function(containers) {
          var dimensions = {};

          var subnet_size = function(resources) {
            var length = _.min([_.ceil((resources.length/6)+2), 10]);

            return length < 4 ? 4 : length;
          };

          var subnet_height = function(resources) {
            return _.ceil(resources.length / subnet_size(resources)) || 1;
          };

          _.each(containers, function(container) {
            if(container["parent"]) {
              dimensions = Object.assign({}, dimensions, this.dimensions(container["center"]))
            }
            else {
              var max_size = 0;
              var total_height = 0;
              _.each(container["center"], function(row) {
                if(row["type"] === "subnet") {
                  _.each(row["columns"], function(subnet) {
                    if (!subnet) return;

                    if (subnet["zone_columns"]) {
                      if (!dimensions[subnet["id"]])
                        dimensions[subnet["id"]] = {};

                      _.each(subnet["zone_columns"], function (zone_data) {
                        var size = subnet_size(zone_data["resources"]);
                        var height = subnet_height(zone_data["resources"]);

                        if (size > max_size)
                          max_size = size;

                        total_height += height;

                        dimensions[subnet["id"]] = { size: size, height: height };
                      });
                    } else {
                      var size = subnet_size(subnet["resources"]);
                      var height = subnet_height(subnet["resources"]);

                      if (size > max_size)
                        max_size = size;

                      total_height += height;

                      dimensions[subnet["id"]] = { size: size, height: height };
                    }
                  });
                }
                else {
                  // Load balancer row, add some height
                  total_height += 1;
                }
              });

              dimensions[container["id"]] = {
                max_size: _.max([max_size, 1]),
                max_height: _.max([total_height, 1]),
                colspan: _.max(_.map(container["center"], function(r) { return (r["columns"] || r["zone_columns"] || []).length } ))
              }
            }
          }.bind(this));

          return dimensions;
        }
      }],
      link: function(scope, element, attrs, ctrl) {
        ctrl.layout();

        $timeout(function() {
          var coordinates = [];
          var services = document.querySelectorAll(".positionable");
          for (var i = 0; i < services.length; ++i) {
            var service = services[i];
            var bounds  = service.getBoundingClientRect();
            coordinates.push({
              id: service.id,
              x: bounds.left,
              y: bounds.top,
              w: bounds.width,
              h: bounds.height
            });
          }

          scope.$emit("view:positioned", ctrl.environment.current_view.type, coordinates);
        });
      }
    }
  }]);
