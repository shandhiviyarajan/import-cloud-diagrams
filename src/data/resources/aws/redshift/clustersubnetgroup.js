angular.module('designer.model.resources.aws.redshift.cluster_subnet_group', ['designer.model.resource'])
  .factory('AWS_RedshiftClusterSubnetGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CLUSTER SUBNET GROUP';

        resource.info = function() {
          var info = {};

          info.subnets = this.getSubnets();
          info.clusters = this.getRedshiftClusters();


          return info;
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
        };

        resource.getRedshiftClusters = function() {
          return environment.connectedTo(this, "Resources::AWS::Redshift::Cluster");
        };

        resource.highlightableConnections = function() {
          return this.getSubnets();
        };

        return resource;
      }
    }
  }]);
