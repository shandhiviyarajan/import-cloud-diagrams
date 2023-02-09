angular.module('designer.model.resources.azure.network.private_endpoint', ['designer.model.resource'])
.factory('Azure_PrivateEndpoint', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);

      resource.info = function() {
        var info = {};

        info.subnet = this.getSubnet();
        info.network_interfaces = this.getNetworkInterfaces();

        var services = this.getConnectables();
        info.private_link_service_connections = _.map(this.private_link_service_connections, function(c) {
          c.connected_resource = _.find(services, (s) => s.provider_id.toLowerCase() === c.private_link_service_id.toLowerCase());

          return c;
        });

        info.manual_private_link_service_connections = _.map(this.manual_private_link_service_connections, function(c) {
          c.connected_resource = _.find(services, (s) => s.provider_id.toLowerCase() === c.private_link_service_id.toLowerCase());

          return c;
        });

        info.network_interfaces = this.getNetworkInterfaces();

        return info;
      };

      resource.getSubnet = function() {
        return environment.connectedTo(this, "Resources::Azure::Network::Subnet")[0];
      };

      resource.getNetworkInterfaces = function() {
        return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface");
      };

      resource.getConnectables = function() {
        return environment.findConnectedTo(this, [
          "Resources::Azure::Batch::BatchAccount",
          "Resources::Azure::EventHub::Namespace",
          "Resources::Azure::Redis::RedisCache",
          "Resources::Azure::Network::ApplicationGateway",
          "Resources::Azure::MariaDB::Server",
          "Resources::Azure::Mysql::Server",
          "Resources::Azure::Postgresql::Server",
          "Resources::Azure::ServiceBus::Namespace",
          "Resources::Azure::SQL::Server",
          "Resources::Azure::Storage::StorageAccount"
        ]);
      };

      return resource;
    }
  }
}]);
