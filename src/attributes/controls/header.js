angular.module("designer.attributes.header", [])
  .directive("resourceHeader", [function() {
    return {
      templateUrl: "/designer/attributes/controls/header.html",
      link: function (scope, element, attrs) {

        scope.$watch("selected_resource", function(resource) {
          if(resource) {
            scope.resource = resource;
            scope.resource.type_name = resource.type_name || resource.display_type.split(/(?=[A-Z][a-z])/).join(" ").toUpperCase();
            scope.display_status = scope.setStatusName(resource);
            scope.status_color = scope.getStatusColor(resource);
          }
        });

        scope.setStatusName = function(resource){
          if (!resource.status) return; 
          return resource.status.replace("_", " ").replace("-", " ").split(/(?=[A-Z][a-z])/).join(" ").toUpperCase();
        };

        scope.getStatusColor = function(resource) {
          if (!resource.status || !resource.status_list) return "stopped";

          var status_list = {};
          _.each(resource.status_list, function(k, v){ status_list[v.toLowerCase()] = k });
          return status_list[resource.status.toLowerCase()] || "stopped";
        };
      }
    }
  }]);
