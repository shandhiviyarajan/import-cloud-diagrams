angular.module('designer.model.resources.gcp.compute.regiondisktype', ['designer.model.resource'])
  .factory('GCP_ComputeRegionDiskType', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION DISK TYPE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
