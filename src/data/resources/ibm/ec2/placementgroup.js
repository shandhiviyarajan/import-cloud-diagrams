angular.module('designer.model.resources.ibm.ec2.placement_group', ['designer.model.resource'])
.factory('IBM_PlacementGroup', ["Resource", function(Resource) {
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
        return environment.connectedTo(this, "Resources::IBM::EC2::Instance");
      };

      return resource;
    }
  }
}]);
