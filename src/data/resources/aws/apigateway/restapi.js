angular.module('designer.model.resources.aws.apigateway.rest_api', ['designer.model.resource', 'designer.model.resources.aws.apigateway.resource.tree'])
  .factory('AWS_RestAPI', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REST API';

        resource.info = function() {
          var info = {};

          info.deployments_map = {};

          if (info.policy) {
            info.policy = JSON.stringify(JSON.parse(this.policy), null, 2);
          }

          info.deployments = this.getDeployments();
          info.authorizers = this.getAuthorizers();
          info.models = this.getModels();
          info.stages = this.getStages();
          info.resource_tree = this.getResourceTree(this.getResources());

          _.each(info.stages, function(stage) {
            info.deployments_map[stage.provider_id] = stage.getDeployments();
          });
     
          return info;
        };

        resource.getDeployments = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Deployment");
        };

        resource.getAuthorizers = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Authorizer");
        };

        resource.getModels = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Model");
        };

        resource.getStages = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Stage");
        };

        resource.getResources = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Resource");
        };

        resource.getResourceTree = function(resources) {
          var resource_tree = {};
          var parent = null;

          _.each(resources, function(resource) {
            resource_tree[resource.provider_id] = resource;
            resource.children = [];
          });

          _.each(_.sortBy(resource_tree, function(r) {return r.name}), function(resource) {
            if(resource.parent_id) {
              resource_tree[resource.parent_id].children.push(resource)
            }
            else {
              parent = resource;
            }
          });
          return parent;
        };

        return resource;
      }
    }
  }]);
