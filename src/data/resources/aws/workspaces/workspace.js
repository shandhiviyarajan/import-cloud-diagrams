angular.module('designer.model.resources.aws.workspaces.workspace', ['designer.model.resource'])
  .factory('AWS_WorkSpacesWorkSpace', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WORKSPACE';
        resource.status_list = {
          "pending": "warn",
          "available": "good",
          "impaired": "bad",
          "unhealthy": "bad",
          "rebooting": "warn",
          "starting": "warn",
          "rebuilding": "warn",
          "restoring": "warn",
          "maintenance": "stopped",
          "admin_maintenance": "stopped",
          "terminating": "warn",
          "terminated": "stopped",
          "suspended": "stopped",
          "updating": "warn",
          "stopping": "warn",
          "stopped": "stopped",
          "error": "bad"
        };

        resource.info = function() {
          var info = {};

          info.security_groups = this.getSecurityGroups();
          info.ip_groups = this.getIPGroups();
          info.directory = this.getWorkSpaceDirectory();

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.user_name,
            info3: this.ip_address
          }
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getIPGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::WorkSpaces::IPGroup");
        };

        resource.getWorkSpaceDirectory = function() {
          return environment.connectedTo(this, "Resources::AWS::WorkSpaces::Directory")[0];
        };

        return resource;
      }
    }
  }]);
