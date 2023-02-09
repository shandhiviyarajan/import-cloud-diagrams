angular.module('designer.model.resources.gcp.compute.sslpolicy', ['designer.model.resource'])
  .factory('GCP_ComputeSslPolicy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SSL POLICY';

        resource.info = function() {
          var info = {};

          info.target_https_proxies = this.getRegionTargetHTTPSProxies().concat(this.getTargetHTTPSProxies());
          info.target_ssl_proxies = this.getTargetSSLProxies();

          return info;
        };

        resource.getRegionTargetHTTPSProxies = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionTargetHTTPSProxy");
        };

        resource.getTargetHTTPSProxies = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetHTTPSProxy");
        };

        resource.getTargetSSLProxies = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetSSLProxy");
        };

        return resource;
      }
    }
  }]);
