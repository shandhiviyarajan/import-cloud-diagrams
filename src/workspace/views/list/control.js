angular.module('designer.workspace.views.list.control', ["designer.app-scope"])
  .directive('listControl',
    ["$rootScope", "$appScope", "$window", function($rootScope, $appScope, $window) {
      return {
        templateUrl: '/designer/workspace/views/list/control.html',
        replace: true,
        controllerAs: "ListControl",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
          this.options = {
            sort_by: "name",
            sort_dir: "asc",
            display_types: [],
            show_service_select: false
          };
          this.sort_options = ["name", "price", "type"];
          this.types = { "AWS": [], "Azure": [], "GCP": [], "Kubernetes": [] };
          this.types_readable = "All";
          this.resources = _.compact($scope.resources);
          this.unfiltered_resources = angular.copy(this.resources);
          this.selected_resource = null;

          this.loadResourceTypes = function() {
            _.each(this.resources, function(resource) {
              var parts = resource.type.split("::");
              var provider = parts[1];
              var type = parts[2];

              if(this.types[provider]) {
                var exists = _.filter(this.types[provider], function(t) { return t === type }).length > 0;
                if (!exists) {
                  this.types[provider].push(type);
                }
              }
            }.bind(this));

            this.types["AWS"] = _.sortBy(this.types["AWS"], function(type) { return type; });
            this.types["Azure"] = _.sortBy(this.types["Azure"], function(type) { return type; });
            this.types["GCP"] = _.sortBy(this.types["GCP"], function(type) { return type; });
            this.types["Kubernetes"] = _.sortBy(this.types["Kubernetes"], function(type) { return type; });
          };
          
          this.sortResources = function() {
            this.resources = _.sortBy(this.resources, function(resource) {
              if(this.options.sort_by === 'name') {
                return (resource.name || "").toLowerCase();
              }
              else if(this.options.sort_by === 'type') {
                return resource.type;
              }
              else if(this.options.sort_by === 'price') {
                return resource.price || 0;
              }
              else {
                return resource.provider_id;
              }
            }.bind(this));

            if (this.options.sort_dir === "desc") {
              this.resources.reverse();
            }
          };

          this.toggleTypeDisplay = function(provider, type) {
            if (!provider) {
              this.options.display_types = [];
            }
            else if (this.isToggled(provider, type)) {
              this.options.display_types = _.reject(this.options.display_types, function(v) { return v.provider === provider && v.type === type });
            }
            else {
              this.options.display_types.push({ provider: provider, type: type});
            }

            // Filter by type then re-sort
            this.resources = _.filter(this.unfiltered_resources, function(r) {
              var parts = r.type.split("::");
              var provider = parts[1];
              var type = parts[2];

              return this.options.display_types.length === 0 || this.isToggled(provider, type);
            }.bind(this));
            this.sortResources();

            // Update display
            if (this.options.display_types.length === 0) {
              this.types_readable = "All";
            }
            else if (this.options.display_types.length === 1) {
              this.types_readable = this.options.display_types[0].type;
            }
            else {
              this.types_readable = this.options.display_types.length + " types";
            }
          };

          this.isToggled = function(provider, type) {
            return _.filter(this.options.display_types, function(t) { return t.provider === provider && t.type === type }).length;
          };

          this.toggleSortDirection = function() {
            this.options.sort_dir = (this.options.sort_dir === "asc" ? "desc" : "asc");
          };

          this.selectResource = function(resource) {
            var resource = _.find(this.resources, function(res) { return res.id === resource.id }) 
            if (this.selected_resource && resource && this.selected_resource.id === resource.id) return;
            this.selected_resource = resource;
            $rootScope.$broadcast("resource:selected", this.selected_resource);
          };

          this.toggleServiceSelect = function() {
            this.options.show_service_select = !this.options.show_service_select;

            this.options.show_service_select ?
              angular.element($window).on("click", $scope.handleWindowClick) :
              angular.element($window).off("click", $scope.handleWindowClick);
          };
        }],

        link: function(scope, element, attrs, ctrl) {
          ctrl.loadResourceTypes();

          scope.$watch(function() { return ctrl.options.sort_by }, function() { ctrl.sortResources() });
          scope.$watch(function() { return ctrl.options.sort_dir }, function() { ctrl.sortResources() });

          scope.$on("resource:select", function(evt, resource) {
            ctrl.selectResource(resource);

            var el = document.getElementById(resource.id);
            if(el)
              el.scrollIntoView({ behavior: "smooth" });
          });

          scope.handleWindowClick = function(event) {
            var target = $(event.target);

            if (!target.parents('.list-control-types').length) {
              $appScope.safeApply(function() {
                ctrl.toggleServiceSelect();
              }, scope);
            }
          };
        }
      }
    }]);
