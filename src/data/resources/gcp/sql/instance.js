angular.module('designer.model.resources.gcp.sql.instance', ['designer.model.resource'])
.factory('GCP_SQLInstance', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SQL INSTANCE';
      resource.status_list = {
        "runnable": "good",
        "failed": "bad",
        "pending_create": "warn"
      };

      resource.info = function() {
        var info = {};

        info.network = this.getNetwork();

        return info;
      };

      resource.getExtendedInformation = function() {
        var ips = {};

        _.each(this.ip_addresses, function(ip) {
          ips[ip["type"]] = ip["ip_address"];
        }.bind(this));

        return {
          info1: this.settings["tier"],
          info2: ips["PRIMARY"],
          info3: ips["PRIVATE"]
        }
      };

      resource.getNetwork = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
      };

      return resource;
    }
  }
}]);
