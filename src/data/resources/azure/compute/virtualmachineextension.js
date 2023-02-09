angular.module('designer.model.resources.azure.compute.virtual_machine_extension', ['designer.model.resource'])
  .factory('Azure_VirtualMachineExtension', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL MACHINE EXTENSION';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "succeeded": "good",
          "failed": "bad",
          "canceled": "stopped"
        };
        
        resource.info = function() {

        };

        return resource;
      }
    }
  }]);
