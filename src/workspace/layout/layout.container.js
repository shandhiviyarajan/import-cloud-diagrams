angular.module('designer.workspace.layout.container', [
  "designer.state",
  "designer.workspace.layout.container.ecs.cluster",
  "designer.workspace.layout.container.kubernetes.cluster",
  "designer.workspace.layout.container.position.grid",
  "designer.workspace.layout.container.position.hex",
  "designer.workspace.layout.container.cell",
  "designer.workspace.layout.container.hexgrid"
])
.directive('containerLayout',
  ["DesignerState", "$timeout", "ContainerLayoutECSCluster", "ContainerLayoutKubernetesCluster", "ContainerLayoutGridPosition", "ContainerLayoutHexPosition",
    function(DesignerState, $timeout, ContainerLayoutECSCluster, ContainerLayoutKubernetesCluster, ContainerLayoutGridPosition, ContainerLayoutHexPosition) {
      return {
        templateUrl: '/designer/workspace/layout/layout.container.html',
        controllerAs: "ContainerLayout",
        bindToController: true,
        scope: {
          environment: "="
        },
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
          this.positions = [];

          this.loadContainers = function() {
            this.positions = [];

            if (this.environment.current_view.type === "Views::Container") {
              let ecs_clusters = _.filter(this.environment.facet.resources, function(r) { return r.type === "Resources::AWS::ECS::Cluster" });
              ecs_clusters = _.map(ecs_clusters, function(r) { return ContainerLayoutECSCluster.load(r, this.environment).getData() }.bind(this));

              let kubernetes_clusters = _.filter(this.environment.facet.resources, function(r) { return r.type === "Resources::Kubernetes::Cluster::Cluster" });
              kubernetes_clusters = _.map(kubernetes_clusters, function(r) { return ContainerLayoutKubernetesCluster.load(r, this.environment).getData() }.bind(this));

              return ecs_clusters.concat(kubernetes_clusters);
            }
          }

          this.layout = function() {
            if (_.includes(['Views::Container'], this.environment.current_view.type)) {
              let ecs_clusters = _.filter(this.environment.facet.resources, function(r) { return r.type === "Resources::AWS::ECS::Cluster" });
              ecs_clusters = _.map(ecs_clusters, function(r) { return ContainerLayoutECSCluster.load(r, this.environment).getData() }.bind(this));

              let kubernetes_clusters = _.filter(this.environment.facet.resources, function(r) { return r.type === "Resources::Kubernetes::Cluster::Cluster" });
              kubernetes_clusters = _.map(kubernetes_clusters, function(r) { return ContainerLayoutKubernetesCluster.load(r, this.environment).getData() }.bind(this));

              let containers = ecs_clusters.concat(kubernetes_clusters);

              _.each(containers, function(container) {
                this.layoutContainer(container);
              }.bind(this));

              console.log("Containers!", containers);

              $scope.view = {};
              $scope.view.containers = containers;
            }
          };

          this.layoutContainer = function(container) {
            _.each(container.cells, function(cell) {
              if(cell["tasks"]) {
                this.layoutHex(cell);
              }
              else {
                this.layoutContainer(cell)
              }
            }.bind(this));

            ContainerLayoutGridPosition.position(container, { min_width: 346.4 });
          }

          this.layoutHex = function(container) {
            var hex_cell = { id: null, type: "hex", cells: container.tasks };
            ContainerLayoutHexPosition.position(hex_cell, container.max_tasks, { min_width: 346.4 });

            // Now layout the whole container as a one column grid
            container.cells = [];
            container.cells = container.cells.concat(_.map(container.load_balancers, function(lb) { return { id: lb.id, fit_to_width: true, x: 0, y: 0, w: 0, h: 50 } }));
            container.cells.push(hex_cell);
            container.cells = container.cells.concat(_.map(container.volumes, function(v) { return { id: v.id, fit_to_width: true, x: 0, y: 0, w: 0, h: 50 } }));

            ContainerLayoutGridPosition.position(container, { max_columns: 1 })
          }

          this.savePositions = function(container) {
            this.addPosition(container)

            if(container["cells"]) {
              _.each(container.cells, function(c) { this.savePositions(c) }.bind(this));
            }
          };

          this.addPosition = function(container) {
            this.positions.push({
              id: container.id,
              x: container.x,
              y: container.y,
              w: container.w,
              h: container.h,
            })
          }
        }],
        link: function(scope, element, attrs, ctrl) {
          // var containers = ctrl.loadContainers();
          //
          // $timeout(function() {
          //   // TODO: new logic
          //   ctrl.layout();
          //
          //   // Position everything relative to the lowest cell
          //   _.each(containers, function(container) {
          //     ctrl.layoutContainer(container);
          //   });
          //
          //   ContainerLayoutGridPosition.position({ cells: containers }, { max_rows: 1, container_spacing: 75 });
          //
          //   // Now grab all the positions!
          //   _.each(containers, function(c) { ctrl.savePositions(c) });
          //
          //   scope.$emit("view:positioned", ctrl.environment.current_view.type, ctrl.positions);
          // });

          // NEW LAYOUT
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
