angular.module('designer.model.resources.aws.apigateway.method', ['designer.model.resource'])
  .factory('AWS_Method', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'API GATEWAY  METHOD';

        resource.info = function() {
          var info = {};

          info.authorizer = this.getAuthorizer();
          info.rest_api = this.getRestAPI();
          info.api_resource = this.getResource();
          info.lambda = this.getLambda();

          return info;
        };

        resource.getAuthorizer = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Authorizer")[0];
        };

        resource.getRestAPI = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI")[0];
        };

        resource.getResource = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Resource")[0];
        };

        resource.getLambda = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Function")[0];
        };

        return resource;
      }
    }
  }]);
