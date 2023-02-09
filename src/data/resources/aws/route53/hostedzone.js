angular.module('designer.model.resources.aws.route53.hosted_zone', ['designer.model.resource'])
  .factory('AWS_Route53HostedZone', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ROUTE53 HOSTED ZONE';

        resource.info = function() {
          var info = {};

          info.resource_record_sets = this.getResourceRecordSets();

          return info;
        };

        resource.getResourceRecordSets = function() {
          return environment.connectedTo(this, "Resources::AWS::Route53::ResourceRecordSet");
        };

        return resource;
      }
    }
  }]);
