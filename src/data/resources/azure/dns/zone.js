angular.module('designer.model.resources.azure.dns.zone', ['designer.model.resource'])
  .factory('Azure_DNSZone', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.extended = { rs: true };

        resource.info = function() {
          var info = {};

          info.record_sets = this.getRecordSets();
          info.resource_group = this.getResourceGroup();

          var vnets = this.getVirtualNetworks();
          var find_network = function(vnet_id) {
            var vnet = _.find(vnets, (v) => v.id === vnet_id);

            return vnet ? vnet : { type: "not_found", name: vnet_id }
          }

          // TODO: we don't have any of these in prod so test with some dummy data
          info.registration_virtual_networks = _.map(this.registration_virtual_networks, find_network);
          info.resolution_virtual_networks = _.map(this.resolution_virtual_networks, find_network);

          return info;
        };

        resource.getResourceGroup = function() {
          return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
        };

        resource.getRecordSets = function() {
          return environment.connectedTo(this, "Resources::Azure::DNS::RecordSet");
        };

        resource.getVirtualNetworks = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::VirtualNetwork");
        };
        
        return resource;
      }
    }
  }]);
