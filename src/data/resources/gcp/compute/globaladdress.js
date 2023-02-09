angular.module('designer.model.resources.gcp.compute.globaladdress', ['designer.model.resource'])
  .factory('GCP_ComputeGlobalAddress', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'GLOBAL ADDRESS';
        resource.status_list = {
          "reserving": "warn",
          "reserved": "good",
          "in-use": "good"
        };
        
        resource.info = function() {
          var info = {};

          info.network          = this.getNetwork();
          info.subnetwork       = this.getSubnetwork();
          info.instances        = this.getInstances();
          info.forwarding_rules = this.getGlobalForwardingRules();
          info.routers          = this.getRouters();
          info.nat_gateway      = this.getNATGateway();

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getNATGateway = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::NATGateway")[0];
        };

        resource.getSubnetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork")[0];
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        resource.getGlobalForwardingRules = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule");
        };

        resource.getRouters = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Router");
        };

        return resource;
      }
    }
  }]);
