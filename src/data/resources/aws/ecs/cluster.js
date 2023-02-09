angular.module('designer.model.resources.aws.ecs.cluster', ['designer.model.resource'])
  .factory('AWS_ECSCluster', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ECS CLUSTER';
        resource.status_list = {
          "active": "good",
          "provisioning": "good",
          "deprovisioning": "warn",
          "failed": "bad",
          "inactive": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.services = this.getServices();
          info.tasks = this.getTasks();
          info.container_instances = this.getContainerInstances();

          return info;
        };

        resource.getServices = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Service");
        };

        resource.getTasks = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Task");
        };

        resource.getContainerInstances = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::ContainerInstance");
        };

        return resource;
      }
    }
  }]);
