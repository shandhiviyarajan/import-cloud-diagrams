angular.module('designer.workspace.layout.container.ecs.service', [])
.factory('ContainerLayoutECSService', [function() {
  return {
    load: function(service, environment) {
      service.getData = function() {
        var tasks  = _.orderBy(this.getTasks(), ["status", "name"])

        return {
          id: this.id,
          tasks: tasks,
          max_tasks: Math.max((this.desired_count || 0), tasks.length),
          load_balancers: this.getLoadBalancers(),
          volumes: [],
          type: "ecs_service",
          container: true,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          style: { "padding-top": "30px" }
        }
      };

      service.getLoadBalancers = function() {
        return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancing::LoadBalancer").concat(
          environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::TargetGroup")
        );
      }

      return service;
    }
  }
}]);
