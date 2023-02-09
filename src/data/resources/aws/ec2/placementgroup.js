angular.module('designer.model.resources.aws.ec2.placement_group', ['designer.model.resource'])
.factory('AWS_PlacementGroup', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'PLACEMENT GROUP';
      resource.status_list = {
        "pending": "warn",
        "available": "good",
        "deleting": "warn",
        "deleted": "stopped"
      };

      resource.info = function() {
        var info = {};

        info.instances = this.getInstances()

        return info;
      };

      resource.getInstances = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Instance");
      };

      return resource;
    }
  }
}]);
