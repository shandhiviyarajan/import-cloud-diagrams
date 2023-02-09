angular.module('designer.model.resources.aws.directory_service.domain_controller', ['designer.model.resource'])
  .factory('AWS_DomainController', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DOMAIN CONTROLLER';
        resource.status_list = {
          "creating": "warn",
          "active": "good",
          "impaired": "bad",
          "restoring": "warn",
          "deleting": "warn",
          "deleted": "stopped",
          "failed":  "bad",
        };

        resource.info = function() {
          var info = {};
          var vpc    = this.getVpc();
          var subnet = this.getSubnet();
          info.directory = this.getDirectory();

          if(vpc)      info.vpc = vpc;
          if(subnet)   info.subnet = subnet;

          return info;
        };

        resource.getDirectory = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectoryService::Directory")[0];
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet")[0];
        };

        return resource;
      }
    }
  }]);
