angular.module('designer.model.resources.ibm.rds.db_subnet_group', ['designer.model.resource'])
  .factory('IBM_DBSubnetGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'RDS SUBNET GROUP';

        resource.info = function() {
          var info = {};

          info.subnets = this.getSubnets();

          return info;
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Subnet");
        };

        resource.highlightableConnections = function() {
          return this.getSubnets();
        };

        return resource;
      }
    }
  }]);
