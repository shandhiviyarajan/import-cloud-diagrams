angular.module('designer.model.resources.aws.direct_connect.connection', ['designer.model.resource'])
  .factory('AWS_Connection', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DIRECT CONNECT CONNECTION';
        resource.status_list = {
          "available": "good",
          "down": "bad",
          "ordering": "warn",
          "requested": "warn",
          "pending": "warn",
          "deleting": "warn",
          "deleted": "stopped",
          "rejected": "bad",
          "unknown":  "warn",
        };

        resource.info = function() {
          var info = {};

          info.virtual_interface = this.getVirtualInterface();
          info.lag = this.getLAG();

          return info;
        };

        resource.getVirtualInterface = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::VirtualInterface")[0];
        };

        resource.getLAG = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::LAG")[0];
        };

        return resource;
      }
    }
  }]);
