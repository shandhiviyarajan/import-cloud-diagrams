angular.module('designer.model.resources.gcp.compute.interconnectattachment', ['designer.model.resource'])
  .factory('GCP_ComputeInterconnectAttachment', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'INTERCONNECT ATTACHMENT';
        resource.status_list = {
          "active": "good",
          "unprovisioned": "stopped",
          "pending_partner": "warn",
          "partner_request_received": "warn",
          "pending_customer": "warn",
          "defunct": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.router = this.getRouter();
          info.interconnect = this.getInterconnect();

          return info;
        };

        resource.getRouter = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Router")[0];
        };

        resource.getInterconnect = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Interconnect")[0];
        };

        return resource;
      }
    }
  }]);
