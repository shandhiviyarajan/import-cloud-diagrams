angular.module('designer.workspace.layout.container.kubernetes.service', [])
.factory('ContainerLayoutKubernetesService', [function() {
  return {
    load: function(service, environment) {
      service.getData = function() {
        return {
          id: this.id,
          cells: [],
          type: "service",
          container: false,
          x: 0,
          y: 0,
          w: 0,
          h: 50
        }
      };

      return service;
    }
  }
}]);
