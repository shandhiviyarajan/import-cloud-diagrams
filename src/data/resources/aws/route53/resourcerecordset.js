angular.module('designer.model.resources.aws.route53.resource_record_set', ['designer.model.resource'])
  .factory('AWS_Route53ResourceRecordSet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        return resource;
      }
    }
  }]);
