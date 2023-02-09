angular.module('designer.workspace.layout.infrastructure.azure.resource_group', [
  'designer.workspace.layout.infrastructure.azure.virtual_network'
])
.factory('InfrastructureLayoutAzureResourceGroup',
  ["InfrastructureLayoutAzureVirtualNetwork", function(InfrastructureLayoutAzureVirtualNetwork) {
  return {
    load: function(resource_group, environment) {

      resource_group.getData = function() {
        return {
          id: this.id,
          top: this.getTop(),
          center: this.getCenter(),
          left: this.getLeft(),
          right: this.getRight(),
          bottom: this.getBottom(),
          parent: true
        };
      };

      resource_group.getCenter = function() {
        var vnets = environment.connectedTo(this, "Resources::Azure::Network::VirtualNetwork");
        return _.map(vnets, function(vnet) { return InfrastructureLayoutAzureVirtualNetwork.load(vnet, environment).getData() });
      };

      resource_group.getTop = function() {
        var public_zones = environment.connectedTo(this, "Resources::Azure::DNS::Zone").filter((z) => z.zone_type === "Public");

        return _.map(public_zones, function(r) { return r.id });
      }

      resource_group.getLeft = function() {
        var resources = [];

        resources = resources.concat(environment.connectedTo(this, "Resources::Azure::SQL::Server"));
        resources = resources.concat(environment.connectedTo(this, "Resources::Azure::Redis::RedisCache"));
        resources = resources.concat(environment.connectedTo(this, "Resources::Azure::MariaDB::Server"));
        resources = resources.concat(environment.connectedTo(this, "Resources::Azure::Mysql::Server"));
        resources = resources.concat(environment.connectedTo(this, "Resources::Azure::Postgresql::Server"));

        return _.map(resources, function(r) { return r.id });
      };

      resource_group.getRight = function() {
        return _.map(this.getExpressRouteCircuits(), function(r) { return r.id });
      };

      resource_group.getGenericResources = function() {
        var genericUnits = environment.getResourcesByType("Resources::Azure::Generic::GlobalResource")
        genericUnits = genericUnits.filter((g) => g.resource_group_name === resource_group.name)
        return _.uniqBy(genericUnits, (gu) => gu.id);
      }
      
      resource_group.getBottom = function() {
        var resources = [];

        resources = resources.concat(this.getBatchAccounts());
        resources = resources.concat(this.getBatchPools());
        resources = resources.concat(this.getStorageAccounts());
        resources = resources.concat(this.getGenericResources());
        resources = resources.concat(this.getEventHubNamespaces());
        resources = resources.concat(this.getServicebusNamespaces());

        return _.map(resources, function(r) { return r.id })
      };

      return resource_group;
    }
  }
}]);
