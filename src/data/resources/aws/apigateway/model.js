angular.module('designer.model.resources.aws.apigateway.model', ['designer.model.resource'])
  .factory('AWS_Model', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'MODEL';

        resource.info = function() {
          var info = {};
          
          info.schema = JSON.stringify(JSON.parse(this.schema), null, 2);
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
