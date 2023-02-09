angular.module('designer.model.resources.aws.apigateway.deployment', ['designer.model.resource'])
  .factory('AWS_Deployment', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DEPLOYMENT';

        resource.info = function() {
          var info = {};

          info.rest_api = this.getRestAPI();
          info.stages = this.getStages();

          return info;
        };

        resource.getRestAPI = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI")[0];
        };


        resource.getStages = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Stage");
        };

        return resource;
      }
    }
  }]);
