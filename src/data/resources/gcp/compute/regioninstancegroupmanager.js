angular.module('designer.model.resources.gcp.compute.regioninstancegroupmanager', ['designer.model.resource'])
  .factory('GCP_ComputeRegionInstanceGroupManager', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION INSTANCE GROUP MANAGER';
        resource.status = resource.status["is_stable"] ? "stable" : "unstable"
        resource.status_list = {
          "stable": "good",
          "unstable": "bad"
        };

        resource.info = function() {
          var info = {};
          info.health_check_map = {};

          info.instance_group = this.getInstanceGroup();
          info.target_pools   = this.getTargetPools();
          info.autoscaler     = this.getAutoscaler();
          var health_checks   = this.getHealthChecks().concat(this.getRegionHealthChecks());

          _.each(health_checks, function(n) {
            info.health_check_map[n.self_link] = n;
          });

          info.distribution_policy_zones = [];
          if(this.distribution_policy && this.distribution_policy["zones"].length) {
            _.each(this.distribution_policy["zones"], function(z) {
              var parts = z["zone"].split("/");
              info.distribution_policy_zones.push(parts[parts.length - 1]);
            });
          }
          
          return info;
        };

        resource.getInstanceGroup = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionInstanceGroup")[0];
        };

        resource.getAutoscaler = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionAutoscaler")[0];
        };

        resource.getTargetPools = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetPool");
        };

        resource.getHealthChecks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::HealthCheck");
        };

        resource.getRegionHealthChecks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionHealthCheck");
        };

        return resource;
      }
    }
  }]);
