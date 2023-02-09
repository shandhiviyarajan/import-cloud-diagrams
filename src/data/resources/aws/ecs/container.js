angular.module('designer.model.resources.aws.ecs.container', ['designer.model.resource'])
  .factory('AWS_ECSContainer', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ECS CONTAINER';
        resource.status = resource.last_status.toLowerCase();

        resource.status_list = {
          "provisioning": "warn",
          "registering": "warn",
          "pending": "warn",
          "activating": "warn",
          "active": "good",
          "running": "good",
          "deactivating": "warn",
          "deregistering": "warn",
          "stopping": "warn",
          "draining": "warn",
          "deprovisioning": "warn",
          "inactive": "stopped",
          "stopped": "stopped", 
          "registration_failed": "bad"
        };

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.task = this.getTask();

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Cluster")[0];
        };

        resource.getTask = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Task")[0];
        };

        return resource;
      }
    }
  }]);
