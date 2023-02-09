angular.module('designer.model.resources.gcp.compute.regionsslcertificate', ['designer.model.resource'])
  .factory('GCP_ComputeRegionSslCertificate', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION SSL CERTIFICATE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
