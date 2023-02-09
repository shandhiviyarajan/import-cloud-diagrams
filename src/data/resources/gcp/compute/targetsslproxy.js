angular.module('designer.model.resources.gcp.compute.targetsslproxy', ['designer.model.resource'])
  .factory('GCP_ComputeTargetSslProxy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function() {
          var info = {};

          info.backend_service = this.getBackendService();
          info.ssl_certificate = this.getSSLCertificate();
          info.ssl_policy = this.getSSLPolicy();
          info.forwarding_rule = this.getForwardingRule();

          return info;
        };

        resource.getBackendService = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendService")[0];
        };

        resource.getSSLCertificate = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::SSLCertificate")[0];
        };

        resource.getSSLPolicy = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::SSLPolicy")[0];
        };

        resource.getForwardingRule = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule")[0] ||
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule")[0];
        };

        return resource;
      }
    }
  }]);
