angular.module('designer.model.resources.gcp.compute.packetmirroring', ['designer.model.resource'])
.factory('GCP_ComputePacketMirroring', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'PACKET MIRRORING';

      // TODO: collector and mirrored resources can be in separate networks. Even ... SHARED VPCS! Dun dun duuuunnnn
      resource.info = function() {
        var info = {};

        info.network = this.getNetwork();
        info.collector = this.getForwardingRule();
        info.mirrored = {};

        let subnets = this.getSubnetworks();
        let instances = this.getInstances();

        if(subnets.length)
          info.mirrored["Subnets"] = subnets;

        if(instances.length) {
          const direct_instance_ids = _.map(this.mirrored_resources["instances"] || [],  (i) => i["url"]);
          let direct_instances = [];
          let tag_instances = [];

          _.each(instances, function(i) {
            if(direct_instance_ids.includes(i.self_link)) {
              direct_instances.push(i);
            }
            else {
              tag_instances.push(i);
            }
          });

          if(direct_instances.length) info.mirrored["Instances"] = direct_instances;
          if(tag_instances.length) info.mirrored["Tags"] = tag_instances;
        }

        return info;
      };

      resource.getNetwork = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
      };

      resource.getSubnetworks = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork");
      };

      resource.getInstances = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
      };

      resource.getForwardingRule = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule")[0] ||
          environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule")[0];
      };

      return resource;
    }
  }
}]);
