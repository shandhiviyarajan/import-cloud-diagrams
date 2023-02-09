angular.module('designer.model.resources.azure.compute.availability_set', ['designer.model.resource'])
  .factory('Azure_AvailabilitySet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'AVAILABILITY SET';

        resource.info = function() {
          var info = {};

          info.virtual_machines = resource.getVirtualMachines();

          return info;
        };

        // TODO: this seems to return duplicates :/ ALL THE DAMN TIME
        resource.getVirtualMachines = function() {
          return environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachine");
        };

        return resource;
      }
    }
  }]);
