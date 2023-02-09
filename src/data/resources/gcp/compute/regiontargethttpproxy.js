angular.module('designer.model.resources.gcp.compute.regiontargethttpproxy', ['designer.model.resource'])
  .factory('GCP_ComputeRegionTargetHttpProxy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION TARGET HTTP PROXY';

        resource.info = function() {
          var info = {};

          info.url_map         = this.getRegionURLMap();
          info.forwarding_rule = this.getForwardingRule();

          return info;
        };

        resource.getRegionURLMap = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionURLMap")[0];
        };

        resource.getForwardingRule = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule")[0] ||
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule")[0];
        };

        return resource;
      }
    }
  }]);
