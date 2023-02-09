angular.module('designer.model.resources.azure.mysql.server', ['designer.model.resource'])
.factory('Azure_MySQLServer', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'MYSQL SERVER';

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
        return environment.connectedTo(this, "Resources::Azure::Mysql::Database");
      };

      resource.getFirewallRules = function() {
        return environment.connectedTo(this, "Resources::Azure::Mysql::FirewallRule");
      };

      resource.getConfigurations = function() {
        return environment.connectedTo(this, "Resources::Azure::Mysql::Configuration");
      };

      resource.getMasterServer = function() {
        return environment.connectedTo(this, "Resources::Azure::Mysql::Server")[0];
      };

      return resource;
    }
  }
}]);
