angular.module('designer.model.resources.azure.batch.application', ['designer.model.resource'])
  .factory('Azure_BatchApplication', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'BATCH ACCOUNT APPLICATION';

        resource.info = function() {
          var info = {};

          return info;
        };

        resource.getApplicationPackages = function() {
          return environment.connectedTo(this, "Resources::Azure::Batch::ApplicationPackage");
        };

        return resource;
      }
    }
  }]);
