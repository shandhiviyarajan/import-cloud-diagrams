angular.module('designer.model.resources.aws.efs.mount_target', ['designer.model.resource'])
  .factory('AWS_EFSMountTarget', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'EFS MOUNT TARGET';

        resource.info = function() {
          var info = {};

          info.subnet = this.getSubnet();
          info.network_interface = this.getNetworkInterface();

          return info;
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet")[0];
        };

        resource.getNetworkInterface = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::NetworkInterface")[0];
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getFileSystems = function() {
          return environment.connectedTo(this, "Resources::AWS::EFS::FileSystem");
        };

        resource.highlightableConnections = function() {
          return this.getFileSystems();
        };

        return resource;
      }
    }
  }]);
