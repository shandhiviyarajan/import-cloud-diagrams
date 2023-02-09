angular.module('designer.model.resources.gcp.compute.targettcpproxy', ['designer.model.resource'])
  .factory('GCP_ComputeTargetTcpProxy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET TCP PROXY';

        resource.info = function() {
          var info = {};

          info.backend_service = this.getBackendService();
          info.forwarding_rule = this.getForwardingRule();

          return info;
        };

        resource.getBackendService = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendService")[0];
        };

        resource.getForwardingRule = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule")[0] ||
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule")[0];
        };

        return resource;
      }
    }
  }]);
