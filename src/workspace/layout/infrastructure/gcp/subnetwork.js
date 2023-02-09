angular.module('designer.workspace.layout.infrastructure.gcp.subnetwork', [])
.factory('InfrastructureLayoutGCPSubnetwork',
  [function() {
    return {
      load: function(subnet, environment) {

        subnet.getData = function() {
          var resources = this.getInstances().concat(this.getNATGateways());

          // Remember zones and regions can be nil :O
          var zones = _.uniq(_.map(resources, function(r) { return r.zone || " " })).sort();
          var regions = _.uniq(_.map(resources, function(r) { return r.region || " " })).sort();

          if(zones.length === 0)
            zones = [" "];

          var resource_map = {};
          _.each(resources, function(resource) {
            var region = resource.region || " ";
            var zone = resource.zone || " ";

            if(!resource_map[region]) resource_map[region] = {};
            if(!resource_map[region][zone]) resource_map[region][zone] = [];

            resource_map[region][zone].push(resource.id);
          });

          return {
            id: this.id,
            name: this.name,
            resources_map: resource_map,
            regions: regions,
            zones: zones,
            cidr_block: this.ip_cidr_range,
            colspan: 1
          }
        };

        return subnet;
      }
    }
  }]);
