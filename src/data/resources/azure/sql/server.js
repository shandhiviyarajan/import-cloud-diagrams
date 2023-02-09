angular.module('designer.model.resources.azure.sql.server', ['designer.model.resource'])
  .factory('Azure_SQL_Server', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SQL SERVER';

        resource.info = function() {
          var info = {};
          info.data_bases = resource.getDataBases()

          return info;
        };

        resource.getDataBases = function () {
          return environment.connectedTo(this, "Resources::Azure::SQL::DataBase")
        }

        return resource;
      }
    }
  }]);
