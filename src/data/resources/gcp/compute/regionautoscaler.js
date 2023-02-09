angular.module('designer.model.resources.gcp.compute.regionautoscaler', ['designer.model.resource'])
  .factory('GCP_ComputeRegionAutoscaler', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION AUTOSCALER';
        resource.status_list = {
          "pending": "warn",
          "deleting": "warn",
          "active": "good",
          "error": "bad"
        };

        resource.info = function() {
          var info = {};

          info.instance_group_manager = this.getInstanceGroupManager();

          return info;
        };

        resource.getInstanceGroupManager = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionInstanceGroupManager")[0];
        };

        return resource;
      }
    }
  }]);
