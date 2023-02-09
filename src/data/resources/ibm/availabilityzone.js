angular.module('designer.model.resources.ibm.availabilityzone', ['designer.model.resource'])
  .factory('IBM_AvailabilityZone', ["Resource", function(Resource) {
    return {
      load: function(resource, data) {
        resource = Resource.load(resource);
        resource.type_name = 'AVAILABILITY ZONE';

        resource.info = function() {
          var info = {};

          info.subnets = data.subnets;

          return info;
        };

        return resource;
      }
    }
  }]);
