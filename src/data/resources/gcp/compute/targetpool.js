angular.module('designer.model.resources.gcp.compute.targetpool', ['designer.model.resource'])
  .factory('GCP_ComputeTargetPool', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET POOL';

        resource.info = function() {
          var info = {};

          info.target_pool = this.getTargetPool();
          info.instances = this.getInstances();
          info.health_checks = this.getHealthChecks();
          info.forwarding_rule = this.getForwardingRule();

          return info;
        };

        resource.getTargetPool = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetPool")[0];
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        resource.getHealthChecks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::HTTPHealthCheck");
        };

        resource.getForwardingRule = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule")[0] ||
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule")[0];
        };

        resource.getInstanceGroups = function() {
          const managers = environment.connectedTo(this, "Resources::GCP::Compute::InstanceGroupManager").concat(
            environment.connectedTo(this, "Resources::GCP::Compute::RegionInstanceGroupManager")
          );

          return _.map(managers, (m) => m.getInstanceGroup());
        };

        resource.getConnectables = function() {
          return this.getInstances();
        };

        return resource;
      }
    }
  }]);
