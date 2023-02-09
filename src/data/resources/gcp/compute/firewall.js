angular.module('designer.model.resources.gcp.compute.firewall', ['designer.model.resource'])
  .factory('GCP_ComputeFirewall', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'FIREWALL';

        resource.info = function() {
          var info = {};
          var instances_map = {};
          var connections = [];
          var remote_connections = [];

          var instances   = this.getInstances();
          info.network    = this.getNetwork();

          _.each(instances, function(instance) {
            instances_map[instance.id] = instance;
          }.bind(this));

          _.each(this.connections, function(connection) { 
            var current_resource = connection.resource_id === this.id;
            var resource_id = (current_resource) ? connection.remote_resource_id : connection.resource_id;
            var connected_to = instances_map[resource_id];
            
            if(connected_to) {
              if (current_resource) {
                connections.push(connected_to);
              } else {
                remote_connections.push(connected_to);
              }
            }
          }.bind(this));

          info.connections = _.sortBy(connections, function(connection) { return connection.name; });
          info.remote_connections = _.sortBy(remote_connections, function(connection) { return connection.name; });

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };
        
        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        resource.highlightableConnections = function() {
          return this.getInstances();
        };

        return resource;
      }
    }
  }]);
