angular.module('designer.model.resources.azure.resources.resource_group', ['designer.model.resource'])
  .factory('Azure_ResourceGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'RESOURCE GROUP';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };
        
        resource.resources_name = {
          "Resources::Azure::Batch::BatchAccount": "Batch Account",
          "Resources::Azure::Batch::Pool": "Batch Account Pool",
          "Resources::Azure::Compute::AvailabilitySet": "Availability Set",
          "Resources::Azure::Compute::VirtualMachine": "Virtual Machine",
          "Resources::Azure::Compute::VirtualMachineScaleSet": "Virtual Machine Scale Set",
          "Resources::Azure::DNS::Zone": "DNS Zone",
          "Resources::Azure::EventHub::Namespace": "Event Hub Namespace",
          "Resources::Azure::MariaDB::Server": "MariaDB Server",
          "Resources::Azure::Mysql::Server": "MySQL Server",
          "Resources::Azure::Network::ApplicationGateway": "Application Gateway",
          "Resources::Azure::Network::ApplicationSecurityGroup": "Application Security Group",
          "Resources::Azure::Network::ExpressRouteCircuit": "Express Route Circuit",
          "Resources::Azure::Network::LoadBalancer": "Load Balancer",
          "Resources::Azure::Network::LocalNetworkGateway": "Local Network Gateway",
          "Resources::Azure::Network::NetworkInterface": "Network Interface",
          "Resources::Azure::Network::NetworkSecurityGroup": "Network Security Group",
          "Resources::Azure::Network::PublicIpAddress": "Public IP Address",
          "Resources::Azure::Network::RouteTable": "Route Table",
          "Resources::Azure::Network::Subnet": "Subnet",
          "Resources::Azure::Network::VirtualNetwork": "Virtual Network",
          "Resources::Azure::Network::VirtualNetworkGateway": "Virtual Network Gateway",
          "Resources::Azure::Network::VirtualNetworkPeering": "Virtual Network Peering",
          "Resources::Azure::Postgresql::Server": "PostgreSQL Server",
          "Resources::Azure::Redis::RedisCache": "Redis Cache",
          "Resources::Azure::ServiceBus::Namespace": "Service Bus Namespace",
          "Resources::Azure::SQL::DataBase": "SQL Database",
          "Resources::Azure::Storage::StorageAccount": "Storage Account"
        };

        resource.info = function() {
          var info = {};

          var resources = resource.getAll();

          info.all = resources.reduce(function (types, currentValue) {
            if (types.indexOf(currentValue.type) === -1 && resource.resources_name[currentValue.type]) {
              types.push(currentValue.type);
            }
            return types;
          }, []).map(function (type) {
            return {
              type: type,
              name: resource.resources_name[type],
              resources: resources.filter(function (_el) {
                return _el.type === type;
              }).map(function (_el) {
                return _el;
              })
            }
          });

          return info;
        };

        resource.getAll = function() {
          return environment.connectedTo(this);
        };

        resource.getExpressRouteCircuits = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ExpressRouteCircuit");
        };

        resource.getStorageAccounts = function() {
          return environment.connectedTo(this, "Resources::Azure::Storage::StorageAccount");
        };

        resource.getBatchAccounts = function() {
          return environment.connectedTo(this, "Resources::Azure::Batch::BatchAccount");
        };

        resource.getBatchPools = function() {
          var pools_unassociated_subnet = []
          var all_batch_pools = environment.connectedTo(this, "Resources::Azure::Batch::Pool");
          _.each(all_batch_pools, function(pool){
            if(!pool.isSubnetPool()) pools_unassociated_subnet.push(pool);
          });
          return pools_unassociated_subnet;
        };

        resource.getEventHubNamespaces = function() {
          return environment.connectedTo(this, "Resources::Azure::EventHub::Namespace");
        };

        resource.getServicebusNamespaces = function() {
          return environment.connectedTo(this, "Resources::Azure::ServiceBus::Namespace");
        };

        return resource;
      }
    }
  }]);
