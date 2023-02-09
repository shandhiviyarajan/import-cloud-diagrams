angular.module('designer.model.resources.aws.apigateway.resource', ['designer.model.resource'])
  .factory('AWS_APIGatewayResource', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'API GATEWAY RESOURCE';

        resource.info = function() {
          var info = {};

          info.rest_api = this.getRestAPI();
          info.methods = this.getMethods();
          info.resource_tree = this.getResourceTree();

          return info;
        };

        resource.getRestAPI = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI")[0];
        };

        resource.getResources = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Resource");
        };

        resource.getMethods = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Method");
        };

        resource.getResourceTree = function() {
          var parent = null;

          _.each(this.getResources(), function(resource) {
            if(this.provider_id === resource.parent_id){
              this.children = [resource];
            } else if(resource.provider_id === this.parent_id) {
              resource.children = [this];
              parent = resource;
            }
          }.bind(this));
          return parent;
        };

        return resource;
      }
    }
  }]);
