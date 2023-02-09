angular.module('designer.model.resources.ibm.ec2.vpc_peering_connection', ['designer.model.resource'])
  .factory('IBM_VpcPeeringConnection', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPC PEERING CONNECTION';

        resource.info = function() {
          var info = {};

          info.vpc_map = {};
          _.each(this.getVPCs(), function(vpc) {
            info.vpc_map[vpc.provider_id] = vpc;
          });

          return info;
        };

        resource.getVPCs = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPC");
        };

        return resource;
      }
    }
  }]);
