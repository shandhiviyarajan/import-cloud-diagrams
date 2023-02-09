angular.module('designer.model.resources.ibm.ec2.address', ['designer.model.resource'])
.factory('IBM_Address', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'ELASTIC IP';

      resource.info = function() {
        var info = {};

        info.vpc = this.getVpc();
        info.instance = this.getInstance();
        info.network_interface = this.getNetworkInterface();

        return info;
      };

      resource.getVpc = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
      };

      resource.getInstance = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::Instance")[0];
      };

      resource.getNetworkInterface = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::NetworkInterface")[0];
      };

      return resource;
    }
  }
}]);
