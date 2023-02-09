angular.module('designer.model.resources.gcp.compute.targethttpproxy', ['designer.model.resource'])
  .factory('GCP_ComputeTargetHttpProxy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET HTTP PROXY';

        resource.info = function() {
          var info = {};

          info.url_map = this.getURLMap();
          info.forwarding_rule = this.getForwardingRule();

          return info;
        };

        resource.getURLMap = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::URLMap")[0];
        };

        resource.getForwardingRule = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule")[0] ||
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule")[0];
        };

        return resource;
      }
    }
  }]);
