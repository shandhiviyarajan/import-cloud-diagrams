angular.module('designer.model.resources.azure.eventhub.eventhub', ['designer.model.resource'])
.factory('Azure_EHEventHub', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'EVENT HUB';

      resource.info = function() {
        var data = {};

        data.namespace = this.getNamespace();
        data.consumer_groups = this.getConsumerGroups();
        data.storage_account = this.getStorageAccount();

        return data;
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };

      resource.getNamespace = function() {
        return environment.connectedTo(this, "Resources::Azure::EventHub::Namespace")[0];
      };

      resource.getStorageAccount = function() {
        return environment.connectedTo(this, "Resources::Azure::Storage::StorageAccount")[0];
      };

      resource.getConsumerGroups = function() {
        return environment.connectedTo(this, "Resources::Azure::EventHub::ConsumerGroup");
      };

      return resource;
    }
  }
}]);
