angular.module('designer.model.resources.azure.storage.storage_account', ['designer.model.resource'])
  .factory('Azure_StorageAccount', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'STORAGE ACCOUNT';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };
        
        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
