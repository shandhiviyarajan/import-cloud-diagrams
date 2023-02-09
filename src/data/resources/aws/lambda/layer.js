angular.module('designer.model.resources.aws.lambda.layer', ['designer.model.resource'])
  .factory('AWS_Layer', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'FUNCTION LAYER';

        resource.info = function() {
          var info = {};

          info.function = this.getFunction();
          info.layer_versions = this.getLayerVersions();

          return info;
        };

        resource.getFunction = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Function")[0];
        };

        resource.getLayerVersions = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::LayerVersion");
        };

        return resource;
      }
    }
  }]);
