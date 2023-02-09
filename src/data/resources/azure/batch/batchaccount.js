angular.module('designer.model.resources.azure.batch.batch_account', ['designer.model.resource'])
  .factory('Azure_BatchAccount', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function() {
          var info = {};

          info.storage = {};
          _.each(this.getStorage(), function(store) {
            info.storage[store.provider_id] = store;
          });

          info.pools = [];
          _.each(resource.getPools(), function(pool) {
            var pool_info = pool;
            pool_info.subnet = pool.getSubnet();
            info.pools.push(pool_info);
          });

          info.resource_group = resource.getResourceGroup();

          info.applications = [];
          _.each(resource.getApplications(), function(app) {
            var app_info = app;
            app_info.packages = app.getApplicationPackages();
            info.applications.push(app_info);
          });

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.account_endpoint,
            info3: null
          }
        };

        resource.getStorage = function() {
          return environment.connectedTo(this, "Resources::Azure::Storage::StorageAccount");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet");
        };

        resource.getPools = function() {
          return environment.connectedTo(this, "Resources::Azure::Batch::Pool");
        };

        resource.getApplications = function() {
          return environment.connectedTo(this, "Resources::Azure::Batch::Application");
        };

        resource.getResourceGroup = function() {
          return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
        };

        resource.getConnectables = function() {
          return this.getPools();
        };
        
        return resource;
      }
    }
  }]);
