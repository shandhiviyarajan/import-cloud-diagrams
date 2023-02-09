angular.module('designer.model.resources.gcp.compute.networkendpointgroup', ['designer.model.resource'])
  .factory('GCP_ComputeNetworkEndpointGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NETWORK ENDPOINT GROUP';

        resource.info = function() {
          var info = {};
          info.instance_map = {};
          info.forwarding_rule_map = {};
          info.backend_service_map = {};
          info.health_check_map = {};

          info.network         = this.getNetwork();
          info.subnetwork      = this.getSubnetwork();
          var instances        = this.getInstances();
          var forwarding_rule = this.getForwardingRules();
          var backend_service = this.getBackendServices();
          var health_check    = this.getHealthChecks();

          _.each(instances, function(n) {
            info.instance_map[n.name] = n;
          });

          _.each(forwarding_rule, function(n) {
            info.forwarding_rule_map[n.self_link] = n;
          });

          _.each(backend_service, function(n) {
            info.backend_service_map[n.self_link] = n;
          });

          _.each(health_check, function(n) {
            info.health_check_map[n.self_link] = n;
          });

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getSubnetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork")[0];
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        resource.getForwardingRules = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule");
        };

        resource.getBackendServices = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendService");
        };

        resource.getHealthChecks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::HealthCheck");
        };

        return resource;
      }
    }
  }]);
