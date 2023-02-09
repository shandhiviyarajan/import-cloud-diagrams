angular.module('designer.model.resources.aws.ecs.container_instance', ['designer.model.resource'])
  .factory('AWS_ECSContainerInstance', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ECS CONTAINER INSTANCE';
        resource.status_list = {
          "registering": "warn",
          "registration_failed": "bad",
          "active": "good",
          "inactive": "stopped",
          "deregistering": "warn",
          "draining": "warn"
        };

        resource.agent_status_list = {
          "PENDING": "warn",
          "STAGING": "warn",
          "STAGED": "warn",
          "UPDATING": "warn",
          "UPDATED": "good",
          "FAILED": "bad"
        };

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.instance = this.getInstance();
          info.tasks = this.getTasks();

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Cluster")[0];
        };

        resource.getInstance = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Instance")[0];
        };

        resource.getTasks = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Task");
        };

        return resource;
      }
    }
  }]);
