angular.module('designer.model.resources.azure.batch.pool', ['designer.model.resource'])
  .factory('Azure_BatchPool', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'BATCH ACCOUNT POOL';

        resource.info = function() {
          var info = {};
          info.resource_group = resource.getResourceGroup();
          info.subnet = resource.getSubnet();
          info.application_packages = {};
          _.each(this.getApplicationPackages(), function(pckg) {
            info.application_packages[pckg.provider_id] = pckg;
          });

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.vm_size,
            info3: null
          }
        };

        resource.getResourceGroup = function() {
          return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet")[0];
        };

        resource.getApplicationPackages = function() {
          return environment.connectedTo(this, "Resources::Azure::Batch::Application");
        };

        resource.isSubnetPool = function() {
          if (this.network_configuration && this.network_configuration.subnet_id) return true;
          return false;
        };

        return resource;
      }
    }
  }]);
