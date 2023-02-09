angular.module('designer.model.resources.ibm.route53.resource_record_set', ['designer.model.resource'])
  .factory('IBM_Route53ResourceRecordSet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        return resource;
      }
    }
  }]);
