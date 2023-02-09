angular.module('designer.model.resources.gcp.compute.sslcertificate', ['designer.model.resource'])
  .factory('GCP_ComputeSslCertificate', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SSL CERTIFICATE';

        resource.info = function() {
          var info = {};

          info.target_https_proxy = this.getTargetHTTPSProxy();
          info.target_ssl_proxy = this.getTargetSSLProxy();

          return info;
        };

        resource.getTargetHTTPSProxy = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetHTTPSProxy")[0];
        };

        resource.getTargetSSLProxy = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetSSLProxy")[0];
        };

        return resource;
      }
    }
  }]);
