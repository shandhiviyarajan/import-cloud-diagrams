angular.module('designer.model.resources.gcp.compute.natgateway', ['designer.model.resource'])
.factory('GCP_ComputeNATGateway', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'NAT GATEWAY';

      resource.zone = "";

      resource.info = function() {
        var info = {};

        info.subnetworks = this.getSubnetworks();
        info.addresses = this.getAddresses();
        info.router = this.getRouter();

        info.subnetwork_map = {};
        _.each(info.subnetworks, function(s) {
          info.subnetwork_map[s.self_link] = s;
        });

        info.address_map = {};
        _.each(info.addresses, function(a) {
          info.address_map[a.self_link] = a;
        });

        return info;
      };

      resource.getSubnetworks = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork");
      };

      resource.getRouter = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Router")[0];
      };

      resource.getAddresses = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Address");
      };

      return resource;
    }
  }
}]);
