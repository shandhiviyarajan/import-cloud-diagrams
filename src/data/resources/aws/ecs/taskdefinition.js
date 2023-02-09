angular.module('designer.model.resources.aws.ecs.task_definition', ['designer.model.resource'])
.factory('AWS_ECSTaskDefinition', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'ECS TASK DEFINITION';
      resource.status_list = {
        "active": "good",
        "inactive": "stopped"
      };
      
      resource.info = function() {
        var info = {};

        info.services = this.getServices();
        info.tasks = this.getTasks();

        return info;
      };

      resource.getServices = function() {
        return environment.connectedTo(this, "Resources::AWS::ECS::Service");
      };

      resource.getTasks = function() {
        return environment.connectedTo(this, "Resources::AWS::ECS::Task");
      };

      return resource;
    }
  }
}]);
