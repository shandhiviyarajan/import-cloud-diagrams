angular.module('designer.model.resources.aws.redshift.cluster', ['designer.model.resource'])
  .factory('AWS_RedshiftCluster', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REDSHIFT CLUSTER';
        resource.status_list = {
          "available": "good",
          "cancelling-resize": "warn",
          "creating": "warn",
          "deleting": "warn",
          "final-snapshot": "warn",
          "hardware-failure": "bad",
          "incompatible-hsm": "bad",
          "incompatible-network": "bad",
          "incompatible-parameters": "bad",
          "incompatible-restore": "bad",
          "modifying": "warn",
          "paused": "stopped",
          "rebooting": "warn",
          "renaming": "warn",
          "resizing": "warn",
          "rotating-keys": "warn",
          "storage-full": "bad",
          "updating-hsm": "warn",
        };

        resource.info = function() {
          var info = {};

          info.subnet_group = this.getSubnetGroup();
          info.security_groups = this.getSecurityGroups();
          info.parameter_groups = this.getClusterParameterGroups();
          info.nodes = this.getNodes();

          return info;
        };

        resource.getClusterParameterGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::Redshift::ClusterParameterGroup");
        };

        resource.getSubnetGroup = function() {
          return environment.connectedTo(this, "Resources::AWS::Redshift::ClusterSubnetGroup");
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getNodes = function() {
          return environment.connectedTo(this, "Resources::AWS::Redshift::ClusterNode");
        };

        resource.highlightableConnections = function() {
          return this.getNodes();
        };
        
        return resource;
      }
    }
  }]);
