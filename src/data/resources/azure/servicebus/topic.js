angular.module('designer.model.resources.azure.servicebus.topic', ['designer.model.resource'])
.factory('Azure_SBTopic', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SERVICE BUS TOPIC';

      resource.info = function() {
        var data = {};

        data.namespace = this.getNamespace();

        return data;
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };

      resource.getNamespace = function() {
        return environment.connectedTo(this, "Resources::Azure::ServiceBus::Namespace")[0];
      };

      return resource;
    }
  }
}]);
