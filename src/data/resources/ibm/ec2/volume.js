angular.module('designer.model.resources.ibm.ec2.volume', ['designer.model.resource'])
  .factory('IBM_Volume', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VOLUME';

        // TODO: bit of a dodgy hack for the minute to get this working for datapipe
        _.each(resource.tags, function(tag) {
          if(tag["key"].toLowerCase() === "name") {
            resource.name = tag["value"];
          }
        });

        resource.info = function() {
          var info = {};

          info.attachments = this.getAttachments();

          return info;
        };

        // Get attachments and add the resource so we can link to it
        resource.getAttachments = function() {
          // TODO: just get attached instances, none of this interface 'attached_to' crap
          var volumes = [];

          return volumes;
        };

        return resource;
      }
    }
  }]);
