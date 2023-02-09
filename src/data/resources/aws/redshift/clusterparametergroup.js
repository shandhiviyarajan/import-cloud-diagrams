angular.module('designer.model.resources.aws.redshift.parameter_group', ['designer.model.resource'])
  .factory('AWS_RedshiftParameterGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CLUSTER PARAMETER GROUP';

        return resource;
      }
    }
  }]);
