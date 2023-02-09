angular.module('designer.model.resources.aws.directory_service.directory', ['designer.model.resource'])
.factory('AWS_Directory', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'DIRECTORY SERVICE';
      resource.status = resource.stage;

      resource.status_list = {
        "requested": "warn",
        "creating": "warn",
        "created": "good",
        "active": "good",
        "inoperable": "bad",
        "impaired": "bad",
        "restoring": "warn",
        "restoreFailed": "bad",
        "deleting": "warn",
        "deleted": "stopped",
        "failed": "bad"
      };

      resource.info = function() {
        var info = {};
        
        var vpcs    = this.getVpcs();
        var subnets = this.getSubnets();
        if(vpcs)      info.vpcs = vpcs;
        if(subnets)   info.subnets = subnets;

        info.domain_controllers = this.getDomainControllers();
        info.trusts = this.getTrusts();

        return info;
      };

      resource.getStatus = function() {
        return {
          'available': resource.stage === 'Active',
          'unavailable': _.includes(['Inoperable','Impaired','RestoreFailed','Failed'], resource.stage),
          'problem': _.includes(['Requested','Creating','Created','Restoring','Deleting','Deleted'], resource.stage),
        };
      };

      resource.getExtendedInformation = function() {
        return {
          info1: this.provider_id,
          info2: this.directory_type,
          info3: this.size
        }
      };

      resource.getDomainControllers = function() {
        return environment.connectedTo(this, "Resources::AWS::DirectoryService::DomainController");
      };

      resource.getTrusts = function() {
        return environment.connectedTo(this, "Resources::AWS::DirectoryService::Trust");
      };

      resource.getVpcs = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::VPC");
      };

      resource.getSubnets = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
      };

      

      return resource;
    }
  }
}]);
