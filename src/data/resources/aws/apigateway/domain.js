angular.module('designer.model.resources.aws.apigateway.domain', ['designer.model.resource'])
  .factory('AWS_Domain', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DOMAIN';

        resource.info = function() {
          var info = {};

          info.rest_apis = this.getRestAPIs();

          return info;
        };

        resource.getRestAPIs = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI");
        };

        return resource;
      }
    }
  }]);
