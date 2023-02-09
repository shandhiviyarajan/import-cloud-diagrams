angular.module('designer.model.resources.azure.sql.data_base', ['designer.model.resource'])
  .factory('Azure_SQL_DataBase', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SQL DATABASE';
        resource.status_list = {
          "online": "good",
          "offline": "stopped",
          "restoring": "warn",
          "recovering": "warn",
          "recovery pending": "warn",
          "suspect": "warn",
          "emergency": "bad"
        };

        resource.info = function() {
          var info = {};
          info.servers = resource.getServers()

          return info;
        };

        resource.getServers = function () {
          return environment.connectedTo(this, "Resources::Azure::SQL::Server")
        };

        return resource;
      }
    }
  }]);
