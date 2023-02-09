angular.module('designer.model.resources.aws.lambda.lambda_alias', ['designer.model.resource'])
  .factory('AWS_LambdaAlias', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LAMBDA ALIAS';

        resource.info = function() {
          var info = {};

          info.function = this.getFunction();
          info.function_version = this.getFunctionVersion();

          return info;
        };

        resource.getFunction = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Function")[0];
        };

        resource.getFunctionVersion = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::FunctionVersion")[0];
        };

        return resource;
      }
    }
  }]);
