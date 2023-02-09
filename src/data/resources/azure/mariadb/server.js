angular.module('designer.model.resources.azure.mariadb.server', ['designer.model.resource'])
.factory('Azure_MariaDBServer', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'MARIADB SERVER';

      resource.info = function() {
        var data = {};

        data.databases = this.getDatabases();
        data.firewall_rules = this.getFirewallRules();
        data.configurations = this.getConfigurations();
        data.master_server = this.getMasterServer();

        return data;
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };

      resource.getDatabases = function() {
        return environment.connectedTo(this, "Resources::Azure::MariaDB::Database");
      };

      resource.getFirewallRules = function() {
        return environment.connectedTo(this, "Resources::Azure::MariaDB::FirewallRule");
      };

      resource.getConfigurations = function() {
        return environment.connectedTo(this, "Resources::Azure::MariaDB::Configuration");
      };

      resource.getMasterServer = function() {
        return environment.connectedTo(this, "Resources::Azure::MariaDB::Server")[0];
      };

      return resource;
    }
  }
}]);
