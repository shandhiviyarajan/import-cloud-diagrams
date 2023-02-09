angular.module('designer.model.resources.aws.workspaces.ip_group', ['designer.model.resource'])
  .factory('AWS_WorkSpacesIPGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WORKSPACES IP GROUP';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
