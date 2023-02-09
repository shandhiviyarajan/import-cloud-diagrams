angular.module('designer.model.resources.aws.ecs.deployment', ['designer.model.resource'])
.factory('AWS_ECSDeployment', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'ECS DEPLOYMENT';
      resource.status_list = {
        "primary": "good", 
        "active": "good", 
        "inactive": "bad"
      };

      resource.info = function() {
        var info = {};

        info.service = this.getService();

        return info;
      };

      resource.getService = function() {
        return environment.connectedTo(this, "Resources::AWS::ECS::Service")[0];
      };

      return resource;
    }
  }
}]);
