angular.module('designer.model.resources.ibm.rds.db_security_group', ['designer.model.resource'])
  .factory('IBM_DBSecurityGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DB SECURITY GROUP';

        return resource;
      }
    }
  }]);
