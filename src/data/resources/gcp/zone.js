angular.module('designer.model.resources.gcp.zone', ['designer.model.resource'])
  .factory('GCP_Zone', ["Resource", function(Resource) {
    return {
      load: function(resource, data) {
        resource = Resource.load(resource);
        resource.type_name = 'ZONE';
        
        resource.info = function() {
          var info = {};

          info.subnets = _.uniq(data.subnets);

          return info;
        };

        return resource;
      }
    }
  }]);
