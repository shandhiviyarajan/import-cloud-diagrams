angular.module('designer.model.resources.aws.efs.file_system', ['designer.model.resource'])
  .factory('AWS_EFSFileSystem', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'EFS FILE SYSTEM';

        resource.info = function() {
          var info = {};

          info.mount_targets = _.map(this.getMountTargets(), function(target) {
            return {
              target: target,
              subnet: target.getSubnet(),
              nic: target.getNetworkInterface(),
              security_groups: target.getSecurityGroups()
            }
          });

          return info;
        };

        resource.getExtendedInformation = function() {
          var size = this.size_in_bytes || 0;

          return {
            info1: this.provider_id,
            info2: (Math.round((size / 1000 / 1000 / 1000) * 100) / 100) + "Gb",
            info3: null
          }
        };

        resource.getMountTargets = function() {
          return environment.connectedTo(this, "Resources::AWS::EFS::MountTarget");
        };

        return resource;
      }
    }
  }]);
