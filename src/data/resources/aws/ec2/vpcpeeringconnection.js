angular.module('designer.model.resources.aws.ec2.vpc_peering_connection', ['designer.model.resource'])
  .factory('AWS_VpcPeeringConnection', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPC PEERING CONNECTION';
        resource.status_list = {
          "pending": "warn",
          "deleting": "warn",
          "deleted": "stopped",
          "failed": "bad",
          "rejected": "bad",
          "rejecting": "warn",
          "failing": "bad",
          "expired": "bad",
          "provisioning": "good",
          "active": "good",
        };
        _.each(resource.status_list, function(k, v){ if(_.includes(resource.status.toLowerCase(), v)) resource.status = v});

        resource.info = function() {
          var info = {};

          info.vpc_map = {};
          _.each(this.getVPCs(), function(vpc) {
            info.vpc_map[vpc.provider_id] = vpc;
          });

          return info;
        };

        resource.getVPCs = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPC");
        };

        return resource;
      }
    }
  }]);
