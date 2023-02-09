angular.module('designer.workspace.layout.container.ecs.cluster', [
  "designer.workspace.layout.container.ecs.service"
])
.factory('ContainerLayoutECSCluster', ["ContainerLayoutECSService", function(ContainerLayoutECSService) {
  return {
    load: function(cluster, environment) {
      cluster.getData = function() {
        var services  = _.orderBy(this.getServices(), ["name"]);

        return {
          id: this.id,
          cells: _.map(services, function(s) { return ContainerLayoutECSService.load(s, environment).getData() }),
          type: "cluster",
          container: true,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          style: { "padding-top": "20px", "padding-bottom": "35px" }
        }
      };

      return cluster;
    }
  }
}]);
