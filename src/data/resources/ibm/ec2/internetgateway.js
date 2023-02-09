angular.module('designer.model.resources.ibm.ec2.internet_gateway', ['designer.model.resource'])
.factory('IBM_InternetGateway', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'PUBLIC GATEWAY';

      resource.getVpc = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
      };

      return resource;
    }
  }
}]);
