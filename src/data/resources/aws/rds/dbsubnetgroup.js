angular.module('designer.model.resources.aws.rds.db_subnet_group', ['designer.model.resource'])
  .factory('AWS_DBSubnetGroup', ["Resource", function(Resource) {
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
          return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
        };

        resource.highlightableConnections = function() {
          return this.getSubnets();
        };

        return resource;
      }
    }
  }]);
