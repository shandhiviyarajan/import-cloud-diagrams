angular.module('designer.model.resources.aws.apigateway.stage', ['designer.model.resource'])
  .factory('AWS_Stage', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'STAGE';

        resource.info = function() {
          var info = {};

          info.deployment_map = {};
          info.rest_api = this.getRestAPI();
          info.deployments = this.getDeployments();

          _.each(info.deployments, function(deployment) {
            info.deployment_map[deployment.name] = deployment;
          });

          return info;
        };

        resource.getDeployments = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Deployment");
        };

        resource.getRestAPI = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI")[0];
        };

        return resource;
      }
    }
  }]);
