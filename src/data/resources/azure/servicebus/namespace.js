angular.module('designer.model.resources.azure.servicebus.namespace', ['designer.model.resource'])
.factory('Azure_SBNamespace', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SERVICE BUS NAMESPACE';

      resource.info = function() {
        var data = {};

        data.topics = this.getTopics();
        data.queues = this.getQueues();

        return data;
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };

      resource.getTopics = function() {
        return environment.connectedTo(this, "Resources::Azure::ServiceBus::Topic");
      };

      resource.getQueues = function() {
        return environment.connectedTo(this, "Resources::Azure::ServiceBus::Queue");
      };

      return resource;
    }
  }
}]);
