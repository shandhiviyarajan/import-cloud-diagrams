angular.module('designer.model.resources.aws.ecs.service', ['designer.model.resource'])
  .factory('AWS_ECSService', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ECS SERVICE';
        resource.status_list = {
          "active": "good",
          "inactive": "stopped",
          "draining": "warn"
        };

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.load_balancer = this.getLoadBalancer();
          info.target_group = this.getTargetGroup();
          info.tasks = this.getTasks();
          info.load_balancer_info = this.getLoadBalancerConnection()["data"];
          info.task_definition = this.getTaskDefinition();

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Cluster")[0];
        };

        resource.getTasks = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Task");
        };

        resource.getTaskDefinition = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::TaskDefinition")[0];
        };

        resource.getLoadBalancer = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancing::LoadBalancer")[0];
        };

        resource.getTargetGroup = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::TargetGroup")[0];
        };

        resource.getLoadBalancerConnection = function() {
          return _.find(this.connections, function(c) {
            return c.remote_resource_type === "Resources::AWS::ElasticLoadBalancing::LoadBalancer" ||
              c.remote_resource_type === "Resources::AWS::ElasticLoadBalancingV2::TargetGroup"
          }) || {};
        };

        return resource;
      }
    }
  }]);
