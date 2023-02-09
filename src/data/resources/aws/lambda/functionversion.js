angular.module('designer.model.resources.aws.lambda.function_version', ['designer.model.resource'])
  .factory('AWS_FunctionVersion', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'FUNCTION VERSION';

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
