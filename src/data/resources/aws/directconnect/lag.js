angular.module('designer.model.resources.aws.direct_connect.lag', ['designer.model.resource'])
  .factory('AWS_LAG', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LAG';
        resource.status_list = {
          "requested": "warn",
          "pending": "warn",
          "available": "good",
          "down": "bad",
          "deleting": "warn",
          "deleted": "stopped",
          "unknown":  "warn",
        };

        resource.info = function() {
          var info = {};

          info.virtual_interfaces = this.getVirtualInterfaces();
          info.connections = this.getConnections();

          return info;
        };

        resource.getConnections = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::Connection");
        };

        resource.getVirtualInterfaces = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::VirtualInterface");
        };

        return resource;
      }
    }
  }]);
