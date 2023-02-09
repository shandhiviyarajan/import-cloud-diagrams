angular.module('designer.model.resources.aws.ec2.dhcp_options', ['designer.model.resource'])
  .factory('AWS_DHCPOptions', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DHCP OPTIONS';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
