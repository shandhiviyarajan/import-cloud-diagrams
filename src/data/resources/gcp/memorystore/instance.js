angular.module('designer.model.resources.gcp.memorystore.instance', ['designer.model.resource'])
.factory('GCP_MemoryStoreInstance', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'MEMORYSTORE';
      resource.name = resource.display_name || resource.name.split("/").slice(-1)[0];
      resource.status_list = {
        "state_unspecified": "warn",
        "creating": "warn",
        "ready": "good",
        "updating": "warn",
        "deleting": "warn",
        "repairing": "warn",
        "maintenance": "warn",
        "importing": "warn",
        "failing_over": "bad"
      };

      // TODO: we want to show redis config at some point too, but need to see how it's laid out and what info we get
      resource.info = function() {
        var info = {};

        info.network = this.getNetwork();

        return info;
      };

      resource.getExtendedInformation = function() {
        return {
          info1: this.tier,
          info2: this.redis_version,
          info3: this.host
        }
      };

      resource.getNetwork = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
      };

      return resource;
    }
  }
}]);
