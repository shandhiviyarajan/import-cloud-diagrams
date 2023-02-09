angular.module('designer.model.resources.aws.apigateway.usage_plan', ['designer.model.resource'])
  .factory('AWS_UsagePlan', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'USAGE PLAN';

        resource.info = function() {
          var info = {};
          
          info.api_keys = this.getAPIKeys();
          info.api_stages = this.getStages();
          info.rest_apis = this.getRestAPIs();

          return info;
        };

        resource.getStages = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Stage");
        };

        resource.getAPIKeys = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::APIKey");
        };

        resource.getRestAPIs = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI");
        };

        

        return resource;
      }
    }
  }]);
