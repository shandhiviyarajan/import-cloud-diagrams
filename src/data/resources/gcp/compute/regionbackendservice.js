angular.module('designer.model.resources.gcp.compute.regionbackendservice', ['designer.model.resource'])
  .factory('GCP_ComputeRegionBackendService', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION BACKEND SERVICE';

        resource.info = function() {
          var info = {};
          info.group_map = {};

          var instance_groups         = this.getRegionInstanceGroups().concat(this.getInstanceGroups());
          var network_endpoint_groups = this.getNetworkEndpointGroups().concat(this.getRegionNetworkEndpointGroups()).concat(this.getGlobalNetworkEndpointGroups());

          info.health_checks    = this.getHealthChecks().concat(this.getRegionHealthChecks());
          info.ssl_policy       = this.getSSLPolicy();
          info.forwarding_rules = this.getForwardingRules().concat(this.getGlobalForwardingRules());
          info.url_map          = this.getURLMap();

          _.each(instance_groups.concat(network_endpoint_groups), function(n) {
            info.group_map[n.self_link] = n;
          });

          return info;
        };

        resource.getForwardingRules = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule");
        };

        resource.getGlobalForwardingRules = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule");
        };

        resource.getRegionInstanceGroups = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionInstanceGroup");
        };

        resource.getInstanceGroups = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InstanceGroup");
        };

        resource.getNetworkEndpointGroups = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::NetworkEndpointGroup");
        };

        resource.getRegionNetworkEndpointGroups = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionNetworkEndpointGroup");
        };

        resource.getGlobalNetworkEndpointGroups = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::GlobalNetworkEndpointGroup");
        };

        resource.getHealthChecks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::HealthCheck");
        };

        resource.getRegionHealthChecks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionHealthCheck");
        };

         resource.getSSLPolicy = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::SSLPolicy")[0];
        };

        resource.getURLMap = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionURLMap")[0];
        };

        resource.getConnectables = function() {
          var connectables = [];

          _.each(this.getRegionInstanceGroups().concat(this.getInstanceGroups()), function(j) {
            connectables = connectables.concat(j.getInstances());
          });

          var negs = this.getNetworkEndpointGroups().concat(this.getRegionNetworkEndpointGroups()).concat(this.getGlobalNetworkEndpointGroups());
          _.each(negs, function(neg) {
            connectables = connectables.concat(neg.getInstances());
          });

          return _.uniq(_.flatten(connectables));
        };

        return resource;
      }
    }
  }]);
