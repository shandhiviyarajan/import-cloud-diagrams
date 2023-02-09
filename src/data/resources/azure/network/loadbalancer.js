angular.module('designer.model.resources.azure.network.load_balancer', ['designer.model.resource'])
  .factory('Azure_LoadBalancer', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LOAD BALANCER';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };
        
        resource.info = function() {
          var info = {};

          info.virtual_machines    = resource.getVirtualMachines();
          info.frontend_ip_addresses = resource.getFrontendIpConfigurations();
          info.backend_address_pools = resource.getBackendAddressPools();
          info.rules = resource.getRules();
          info.probes = resource.getProbes();

          return info;
        };

        resource.getVirtualMachines = function() {
          var vms = [];
          var backend_address_pools = this.getBackendAddressPools();

          _.each(backend_address_pools, function(backend_address_pool){
            var ip_configs = backend_address_pool.getNetworkInterfaceIpConfiguration();

            _.each(ip_configs, function(ip_config) {
              vms.push(ip_config.getVirtualMachine());
            });

            // Scale set VMs can also be directly connected
            vms = vms.concat(backend_address_pool.getVirtualMachines());
          });

          // Add if any resources are connected via different routes
          if(resource.terraformMode()) {
            const virtual_machines = environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachine")
            vms = vms.concat(virtual_machines)
          }

          return _.uniq(vms);
        };

        resource.getFrontendIpConfigurations = function() {
          var frontend_ip_configurations = [];

          var frontend_ipconfs = environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer::FrontendIpConfiguration");

          _.each(frontend_ipconfs, function(fic){
            var fic_info = fic;
            fic_info.public_ip_address = fic.getPublicIpAddress();

            frontend_ip_configurations.push(fic_info);
          });

          return frontend_ip_configurations
        };

        resource.getBackendAddressPools = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer::BackendAddressPool");
        };

        resource.getRules = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer::Rule");
        };

        resource.getProbes = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer::Probe");
        };

        return resource;
      }
    }
  }]);
