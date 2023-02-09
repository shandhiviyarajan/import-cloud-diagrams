angular.module('designer.model.resources.gcp.compute.interconnect', ['designer.model.resource'])
  .factory('GCP_ComputeInterconnect', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'INTERCONNECT';
        resource.status_list = {
          "active": "good",
          "cancelled": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.interconnect_attachments = this.getInterconnectAttachments();
          info.location = (this.location||"").split("/").slice(-1)[0];

          return info;
        };

        resource.getInterconnectAttachments = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InterconnectAttachment");
        };

        return resource;
      }
    }
  }]);
