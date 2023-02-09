angular.module('designer.model.resources.aws.ec2.internet_gateway', ['designer.model.resource'])
.factory('AWS_InternetGateway', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'INTERNET GATEWAY';

      resource.getVpc = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
      };

      return resource;
    }
  }
}]);
