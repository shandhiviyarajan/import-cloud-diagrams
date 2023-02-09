angular.module('designer.model.resources.aws.lambda.event_source_mapping', ['designer.model.resource'])
  .factory('AWS_EventSourceMapping', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'EVENT SOURCE MAPPING';
        resource.status_list = {
          "enabled": "good",
          "creating": "warn",
          "enabling": "warn",
          "disabling": "warn",
          "disabled": "stopped",
          "updating": "warn",
          "deleting": "warn",
          "deleted": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.function = this.getFunction();

          return info;
        };

        resource.getFunction = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Function")[0];
        };

        return resource;
      }
    }
  }]);
