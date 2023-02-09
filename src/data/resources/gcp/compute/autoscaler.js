angular.module('designer.model.resources.gcp.compute.autoscaler', ['designer.model.resource'])
  .factory('GCP_ComputeAutoscaler', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'AUTOSCALER';
        resource.status_list = {
          "deleting": "warn",
          "pending": "warn",
          "active": "good",
          "error": "bad"
        };

        resource.info = function() {
          var info = {};

          var instance_group_manager    = this.getInstanceGroupManager();

          if(instance_group_manager)    info.instance_group_manager = instance_group_manager;

          return info;
        };

        resource.getInstanceGroupManager = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InstanceGroupManager")[0];
        };

        return resource;
      }
    }
  }]);
