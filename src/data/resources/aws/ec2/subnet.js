angular.module('designer.model.resources.aws.ec2.subnet', ['designer.model.resource'])
  .factory('AWS_Subnet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SUBNET';
        resource.status_list = {
          "available": "good",
          "pending": "warn"
        };

        resource.rerender = ["cidr_block", "availability_zone"];

        resource.info = function() {
          var info = {};

          info.children = environment.connectedTo(this, null, true);
          info.vpc = this.getVpc();

          return info;
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
        };

        resource.getSubnetGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::RDS::DBSubnetGroup")
            .concat(environment.connectedTo(this, "Resources::AWS::ElastiCache::CacheSubnetGroup"))
            .concat(environment.connectedTo(this, "Resources::AWS::Redshift::ClusterSubnetGroup"));
        };

        resource.getNetworkACLs = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::NetworkACL");
        };

        return resource;
      }
    }
  }]);
