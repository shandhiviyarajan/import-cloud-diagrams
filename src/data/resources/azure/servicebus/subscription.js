angular.module('designer.model.resources.azure.servicebus.subscription', ['designer.model.resource'])
.factory('Azure_SBSubscription', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SERVICE BUS SUBSCRIPTION';

      resource.info = function() {
        var data = {};

        data.topic = this.getTopic();

        return data;
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };

      resource.getTopic = function() {
        return environment.connectedTo(this, "Resources::Azure::ServiceBus::Topic")[0];
      };

      return resource;
    }
  }
}]);
