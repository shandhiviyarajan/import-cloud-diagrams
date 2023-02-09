angular.module('designer.model.resources.azure.network.application_gateway', ['designer.model.resource'])
  .factory('Azure_ApplicationGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'APPLICATION GATEWAY';

        resource.info = function() {
          var info = {};

          info.frontend_ip_addresses = resource.getFrontendIpConfigurations();
          info.backend_address_pools = resource.getBackendAddressPools();
          info.rules = resource.getRules();
          info.probes = resource.getProbes();

          return info;
        };

        resource.getFrontendIpConfigurations = function() {
          var frontend_ip_configurations = [];

          var frontend_ipconfs = environment.connectedTo(this, "Resources::Azure::Network::ApplicationGateway::FrontendIpConfiguration");
          
          _.each(frontend_ipconfs, function(fic){
            var fic_info = fic;
            fic_info.public_ip_address = fic.getPublicIpAddress();
          
            frontend_ip_configurations.push(fic_info);
          });

          return frontend_ip_configurations
        };

        resource.getBackendAddressPools = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ApplicationGateway::BackendAddressPool");
        };

        resource.getRules = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ApplicationGateway::Rule");
        };

        resource.getProbes = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ApplicationGateway::Probe");
        };
        
        return resource;
      }
    }
  }]);
