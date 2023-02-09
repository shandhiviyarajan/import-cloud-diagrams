angular.module('designer.model.resources.aws.rds.db_cluster', ['designer.model.resource'])
  .factory('AWS_DBCluster', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.type_name = 'RDS CLUSTER';
        resource.status_list = {
          "available": "good",
          "backing-up": "warn",
          "backtracking": "warn",
          "cloning-failed": "warn",
          "creating": "warn",
          "deleting": "warn",
          "failing-over": "warn",
          "inaccessible-encryption-credentials": "warn",
          "maintenance": "warn",
          "migrating": "warn",
          "migration-failed": "bad",
          "modifying": "warn",
          "promoting": "warn",
          "renaming": "warn",
          "resetting-master-credentials": "warn",
          "starting": "warn",
          "stopped": "stopped",
          "stopping": "warn",
          "update-iam-db-auth": "bad",
          "upgrading": "warn"
        };

        resource.info = function() {
          var info = {};

          info.security_groups = this.getSecurityGroups();
          info.hosted_zone = this.getHostedZone();
          info.db_cluster_members = this.getRDSInstances();
          info.subnet_group = this.getSubnetGroup();

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.engine,
            info2: this.allocated_storage + " GB",
            info3: this.capacity + " CU"
          }
        };

        resource.getHostedZone = function() {
          return environment.connectedTo(this, "Resources::AWS::Route53::HostedZone")[0];
        };

        resource.getRDSInstances = function() {
          return environment.connectedTo(this, "Resources::AWS::RDS::DBInstance");
        };

        resource.getSubnetGroup = function() {
          return environment.connectedTo(this, "Resources::AWS::RDS::DBSubnetGroup")[0];
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        return resource;
      }
    }
  }]);
