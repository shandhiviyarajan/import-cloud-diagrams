angular.module('designer.model.resources.aws.apigateway.authorizer', ['designer.model.resource'])
  .factory('AWS_Authorizer', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'AUTHORIZER';

        resource.info = function() {
          var info = {};

          info.rest_api = this.getRestAPI();

          return info;
        };

        resource.getRestAPI = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI")[0];
        };

        return resource;
      }
    }
  }]);
