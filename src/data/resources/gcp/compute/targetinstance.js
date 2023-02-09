angular.module('designer.model.resources.gcp.compute.targetinstance', ['designer.model.resource'])
  .factory('GCP_ComputeTargetInstance', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET INSTANCE';

        resource.info = function() {
          var info = {};

          info.instance = this.getInstance();
          info.forwarding_rules = this.getForwardingRules();

          return info;
        };

        resource.getInstance = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance")[0];
        };

        resource.getForwardingRules = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule").concat(
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule"));
        };

        return resource;
      }
    }
  }]);
