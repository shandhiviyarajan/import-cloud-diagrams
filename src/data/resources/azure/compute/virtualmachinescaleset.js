angular.module('designer.model.resources.azure.compute.virtual_machine_scale_set', ['designer.model.resource'])
  .factory('Azure_VirtualMachine_Scaleset', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL MACHINE SCALE SET';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "succeeded": "good",
          "failed": "bad",
          "canceled": "stopped"
        };

        resource.info = function() {
          var info = {};
          
          info.virtual_machines = resource.getVirtualMachines();

          return info;
        };

        resource.getVirtualMachines = function() {
          return environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachine");
        };
        
        return resource;
      }
    }
  }]);
