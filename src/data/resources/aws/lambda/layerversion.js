angular.module('designer.model.resources.aws.lambda.layer_version', ['designer.model.resource'])
  .factory('AWS_LayerVersion', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LAYER VERSION';

        resource.info = function() {
          var info = {};

          info.function = this.getFunction();
          info.layer = this.getLayer();

          return info;
        };

        resource.getFunction = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Function")[0];
        };

        resource.getLayer = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Layer")[0];
        };

        return resource;
      }
    }
  }]);
