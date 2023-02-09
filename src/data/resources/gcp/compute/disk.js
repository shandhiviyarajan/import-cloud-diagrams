angular.module('designer.model.resources.gcp.compute.disk', ['designer.model.resource'])
  .factory('GCP_ComputeDisk', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DISK';
        resource.status_list = {
          "reserving": "warn",
          "reserved": "good",
          "in_use": "good"
        };
        
        resource.info = function() {
          var info = {};

          info.disk_type = this.getDiskType();
          info.instances = this.getInstances();
          if(this.source_snapshot) info.source_snapshot = this.source_snapshot.split("/").slice(-1)[0];
          if(this.source_image) info.source_image = this.source_image.split("/").slice(-1)[0];

          info.replica_zones = _.map(this.replica_zones, function(zone){
            return zone.split("/").slice(-1)[0];
          });

          return info;
        };

        resource.getDiskType = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::DiskType")[0];
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        return resource;
      }
    }
  }]);
