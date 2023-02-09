angular.module('designer.model.resources.aws.apigateway.api_key', ['designer.model.resource'])
  .factory('AWS_APIKey', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'API KEY';

        resource.info = function() {
          var info = {};

          info.stages = this.getStages();
          info.usage_plans = this.getUsagePlans();

          return info;
        };

        // Do we want to keep it? currently the API is not returning in get_api_keys only on get_api_key
        resource.getStages = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Stage");
        };

        resource.getUsagePlans = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::UsagePlan");
        };

        return resource;
      }
    }
  }]);
