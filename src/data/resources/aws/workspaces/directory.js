angular.module('designer.model.resources.aws.workspaces.directory', ['designer.model.resource'])
  .factory('AWS_WorkSpacesDirectory', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WORKSPACES DIRECTORY';
        resource.status_list = {
          "deregistered": "stopped",
          "registered": "good"
        };

        resource.info = function() {
          var info = {};

          info.security_groups = this.getSecurityGroups();
          info.subnets = this.getSubnets();
          info.ip_groups = this.getIPGroups();
          info.workspaces = this.getWorkSpaces();

          return info;
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
        };

        resource.getIPGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::WorkSpaces::IPGroup");
        };

        resource.getWorkSpaces = function() {
          return environment.connectedTo(this, "Resources::AWS::WorkSpaces::WorkSpace");
        };

        return resource;
      }
    }
  }]);
