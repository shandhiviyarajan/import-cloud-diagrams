angular.module('designer.model.resources.aws.directory_service.trust', ['designer.model.resource'])
  .factory('AWS_Trust', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TRUST';

        resource.info = function() {
          var info = {};

          info.directory = this.getDirectory();

          return info;
        };

        resource.getDirectory = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectoryService::Directory")[0];
        };

        return resource;
      }
    }
  }]);
