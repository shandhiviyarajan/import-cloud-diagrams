angular.module('designer.model.resources.gcp.compute.disktype', ['designer.model.resource'])
  .factory('GCP_ComputeDiskType', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DISK TYPE';
        resource.status_list = {
          "active": "good",
          "deprecated": "stopped",
          "obsolete": "stopped",
          "deleted": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.disks = this.getDisks();

          return info;
        };

        resource.getDisks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Disk");
        };

        return resource;
      }
    }
  }]);
