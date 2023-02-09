angular.module('designer.model.resources.ibm.ec2.subnet', ['designer.model.resource'])
  .factory('IBM_Subnet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SUBNET';

        resource.rerender = ["cidr_block", "availability_zone"];

        resource.info = function() {
          var info = {};

          info.children = environment.connectedTo(this, null, true);
          info.vpc = this.getVpc();

          return info;
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
        };

        resource.getSubnetGroups = function() {
          return environment.connectedTo(this, "Resources::IBM::RDS::DBSubnetGroup")
            .concat(environment.connectedTo(this, "Resources::IBM::ElastiCache::CacheSubnetGroup"))
            .concat(environment.connectedTo(this, "Resources::IBM::Redshift::ClusterSubnetGroup"));
        };

        resource.getNetworkACLs = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::NetworkACL");
        };

        return resource;
      }
    }
  }]);
