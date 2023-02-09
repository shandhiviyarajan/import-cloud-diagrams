angular.module('designer.model.resources.gcp.compute.targethttpsproxy', ['designer.model.resource'])
  .factory('GCP_ComputeTargetHttpsProxy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET HTTPS PROXY';

        resource.info = function() {
          var info = {};

          info.url_map = this.getURLMap();
          info.ssl_certificate = this.getSSLCertificate();
          info.ssl_policy = this.getSSLPolicy();
          info.forwarding_rule = this.getForwardingRule();

          return info;
        };

        resource.getURLMap = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::URLMap")[0];
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
