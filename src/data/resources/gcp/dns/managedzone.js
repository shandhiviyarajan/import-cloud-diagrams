angular.module('designer.model.resources.gcp.dns.managedzone', ['designer.model.resource'])
  .factory('GCP_DNSManagedZone', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DNS MANAGED ZONE';

        resource.info = function() {
          var info = {};

          info.networks = this.getNetworks();

          return info;
        };

        resource.getNetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network");
        };

        return resource;
      }
    }
  }]);
