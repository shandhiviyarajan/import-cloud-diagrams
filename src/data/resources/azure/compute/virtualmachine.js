angular.module('designer.model.resources.azure.compute.virtual_machine', ['designer.model.resource'])
  .factory('Azure_VirtualMachine', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL MACHINE';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };

        // If the resource is stopped then display it faded out
        // resource.display_faded = (resource.status === 'stopped'); // TODO: which states?

        resource.info = function() {
          var info = {};

          info.virtualmachine_scaleset = resource.getVirtualMachineScaleSet();
          info.network_interfaces = resource.getNetworkInterfaces();
          info.security_groups = resource.getSecurityGroups();
          info.application_security_groups = resource.getApplicationSecurityGroups();
          info.availability_set = resource.getAvailabilitySet();
          info.extensions = resource.getVirtualMachineExtensions();

          return info;
        };

        resource.getPrimaryPrivateIP = function() {
          var nic = resource.getNetworkInterfaces()[0];

          if (nic) {
            var ipconf = nic.getIpConfigurations()[0];

            return ipconf ? ipconf.private_ipaddress : null;
          }

          return null;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.vm_size,
            info3: this.getPrimaryPrivateIP()
          }
        };

        resource.getAvailabilitySet = function() {
          return environment.connectedTo(this, "Resources::Azure::Compute::AvailabilitySet")[0];
        };

        resource.getVirtualMachineScaleSet = function() {
          return environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachineScaleSet");
        };

        resource.getVirtualMachineExtensions = function() {
          return environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachineExtension");
        };

        resource.getNetworkInterfaces = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface");
        };

        resource.getBackendAddressPools = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer::BackendAddressPool");
        };
        
        resource.getLBs = function() {
          var load_balancers = [];

          _.each(this.getNetworkInterfaces(), function(nic) {
            _.each(nic.getIpConfigurations(), function(ip) {
              _.each(ip.getBackendAddressPools(), function(bk) {
                load_balancers.push(bk.getLoadBalancer());
              });
            });
          });

          // This can also be directly connected directly to a backend address pool if it's a scale set VM
          _.each(this.getBackendAddressPools(), function(bk) {
            load_balancers.push(bk.getLoadBalancer());
          });

          // Add if any resources are connected via different routes
          if(resource.terraformMode()) {
            const lbs = environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer")
            load_balancers = load_balancers.concat(lbs)
          }

          return _.uniq(load_balancers);
        };

        resource.getSecurityGroups = function() {
          var security_groups = [];

          _.each(this.getNetworkInterfaces(), function(nic){
            security_groups.push(nic.getSecurityGroups());
          });

          // Can also have direct connections if it's a scale set VM
          security_groups = security_groups.concat(environment.connectedTo(this, "Resources::Azure::Network::NetworkSecurityGroup"));

          return _.uniq(_.flatten(security_groups));
        };

        resource.getApplicationSecurityGroups = function() {
          var app_security_groups = [];

          _.each(this.getNetworkInterfaces(), function(nic){
            _.each(nic.getIpConfigurations(), function(ip){
              var app_sg = ip.getApplicationSecurityGroup();
              if(app_sg)
                app_security_groups.push(app_sg);
            });
          });

          return _.uniq(app_security_groups);
        };

        resource.getConnectables = function() {
          return this.getLBs();
        };

        resource.hasIPMatch = function(ip) {
          var matched = false;

          _.each(this.getNetworkInterfaces(), function(nic) {
            if(nic.hasIPMatch(ip)) {
              matched = true;
            }
          });

          return matched;
        };

        return resource;
      }
    }
  }]);
