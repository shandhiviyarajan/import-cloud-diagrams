angular.module('designer.model.resources.azure.eventhub.namespace', ['designer.model.resource'])
.factory('Azure_EHNamespace', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'EVENT HUB NAMESPACE';

      resource.info = function() {
        var data = {};

        data.event_hubs = this.getEventHubs();

        return data;
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };

      resource.getEventHubs = function() {
        return environment.connectedTo(this, "Resources::Azure::EventHub::EventHub");
      };

      return resource;
    }
  }
}]);
