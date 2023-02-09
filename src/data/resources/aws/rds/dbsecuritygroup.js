angular.module('designer.model.resources.aws.rds.db_security_group', ['designer.model.resource'])
  .factory('AWS_DBSecurityGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DB SECURITY GROUP';
        resource.status_list = {
          "authorizing": "warn",
          "authorized": "good",
          "revoking": "warn",
          "revoked": "stopped"
        };

        return resource;
      }
    }
  }]);
