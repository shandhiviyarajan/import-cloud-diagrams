angular.module('designer.model.resources.gcp.compute.urlmap', ['designer.model.resource'])
  .factory('GCP_ComputeUrlMap', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'URL MAP';

        resource.info = function() {
          var info = {};
          info.service_map = {};

          info.backend_bucket = this.getBackendBucket();
          info.backend_service = this.getBackendService();
          info.frontends = this.getFrontendConnections();

          if(info.backend_bucket) info.service_map[info.backend_bucket.self_link] = info.backend_bucket;
          if(info.backend_service) info.service_map[info.backend_service.self_link] = info.backend_service;

          return info;
        };

        resource.getBackendBucket = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendBucket")[0];
        };

        resource.getBackendService = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendService")[0];
        };

        resource.getFrontendConnections = function() {
          var proxies = environment.connectedTo(this, "Resources::GCP::Compute::TargetHTTPProxy").concat(
            environment.connectedTo(this, "Resources::GCP::Compute::TargetHTTPSProxy")
          );

          _.each(proxies, function(proxy) {
            proxy.protocol = (proxy.type === "Resources::GCP::Compute::TargetHTTPProxy") ? "HTTP" : "HTTPS";
            proxy.forwarding_rule = proxy.getForwardingRule();
          });

          return proxies;
        };

        resource.getConnectables = function() {
          var connectables = [];
          var backend_bucket = this.getBackendBucket();
          var backend_service = this.getBackendService();

          if (backend_bucket) {
            connectables.push(backend_bucket.getBucket());
          }

          if (backend_service) {
            _.each(backend_service.getInstanceGroups(), function(j) {
              connectables = connectables.concat(j.getInstances());
            })
          }

          return _.uniq(_.flatten(connectables));
        };

        return resource;
      }
    }
  }]);
