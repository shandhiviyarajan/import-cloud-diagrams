angular.module('designer.model.resources.gcp.compute.nodegroup', ['designer.model.resource'])
  .factory('GCP_ComputeNodeGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NODE GROUP';
        resource.status_list = {
          "pending": "warn",
          "running": "good",
          "done": "stopped"
        };

        resource.info = function() {
          var info = {};
          info.instance_map = {};

          var instances      = this.getInstances();
          info.node_template = this.node_template.split("/").slice(-1)[0];

          _.each(instances, function(n) {
            info.instance_map[n.self_link] = n;
          });

          return info;
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        return resource;
      }
    }
  }]);
