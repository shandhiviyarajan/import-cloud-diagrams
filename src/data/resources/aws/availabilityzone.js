angular.module('designer.model.resources.aws.availabilityzone', ['designer.model.resource'])
  .factory('AWS_AvailabilityZone', ["Resource", function(Resource) {
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
