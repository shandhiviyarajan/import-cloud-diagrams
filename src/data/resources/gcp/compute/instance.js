angular.module('designer.model.resources.gcp.compute.instance', ['designer.model.resource'])
  .factory('GCP_ComputeInstance', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'INSTANCE';
        resource.status_list = {
          "provisioning": "warn",
          "staging": "warn",
          "running": "good",
          "stopping": "warn",
          "suspending": "warn",
          "repairing": "warn",
          "terminated": "stopped"
        };

        // If the resource is stopped then display it faded out
        resource.display_faded = (resource.status.toLowerCase() === 'terminated');

        resource.info = function() {
          var info = {};
          info.network_map = {};
          info.subnetwork_map = {};
          info.disk_map = {};
          info.firewalls = _.uniq(this.getFirewalls());
          info.addresses = this.getAddresses().concat(this.getGlobalAddresses());
          info.instance_group = this.getInstanceGroup() || this.getRegionInstanceGroup();
          info.node_group = this.getNodeGroup();

          var networks    = this.getNetworks();
          var subnetworks = this.getSubnetworks();
          info.disks       = this.getDisks();

          _.each(networks, function(n) {
            info.network_map[n.self_link] = n;
          });

          _.each(subnetworks, function(n) {
            info.subnetwork_map[n.self_link] = n;
          });

          _.each(info.disks, function(n) {
            info.disk_map[n.self_link] = n;
          });

          info.machine_type = this.machine_type.split("/").slice(-1)[0];

          return info;
        };

        resource.getExtendedInformation = function() {
          var ips = _.map(resource.network_interfaces, function(r) { return r.network_ip; });

          return {
            info1: this.machine_type.split("/").slice(-1)[0],
            info2: ips[0],
            info3: ips[1]
          }
        };

        resource.getAddresses = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Address");
        };

        resource.getGlobalAddresses = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::GlobalAddress");
        };

        resource.getNetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network");
        };

        resource.getSubnetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork");
        };

        resource.getDisks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Disk");
        };

        resource.getFirewalls = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Firewall");
        };

        resource.getInstanceGroup = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InstanceGroup")[0];
        };

        resource.getRegionInstanceGroup = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionInstanceGroup")[0];
        };

        resource.getNodeGroup = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::NodeGroup")[0];
        };

        return resource;
      }
    }
  }]);
