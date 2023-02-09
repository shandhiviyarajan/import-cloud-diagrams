angular.module('designer.workspace.layout.infrastructure.gcp.network', [
  'designer.workspace.layout.infrastructure.gcp.subnetwork'
])
.factory('InfrastructureLayoutGCPNetwork',
  ["InfrastructureLayoutGCPSubnetwork", function(InfrastructureLayoutGCPSubnetwork) {
    return {
      load: function(network, environment) {

        network.getData = function() {
          var sortable_cidr = function(cidr) {
            var parts = cidr.replace("/", ".").split(".");

            return _.map(parts, function(p) { return p.padStart(3, "0") }).join("");
          }
          var all_subnets = _.sortBy(_.map(this.getSubnetworks(), function(r) {
            return InfrastructureLayoutGCPSubnetwork.load(r, environment).getData();
          }), [function(s) { return sortable_cidr(s.cidr_block) }]);
          var bottom_row_resources = this.getBottomRowResources();

          // Ignoring regions for the moment - empty subnets can be regional so I think we'll need it though
          var zones = _.uniq(_.compact(_.flatten(_.map(all_subnets, function(subnet) { return subnet.zones })).concat(
            _.map(bottom_row_resources, function(r) { return r.zone })
          ))).sort();

          var rows = [];
          var count = 0;
          while(all_subnets.length) {
            if(++count>500) {
              throw "Too many loops in GCP layout";
            }

            var row = { type: "subnet", columns: [] };
            var parsed_zones = [];
            var added_to_zones = [];
            var current_subnet = null;

            _.each(zones, function(zone) {
              if(!current_subnet) {
                // If we don't have a subnet find one that isn't in any previously parsed zones and IS in this zone
                current_subnet = _.find(all_subnets, function(s) { return _.includes(s.zones, zone) &&  _.intersection(s.zones, parsed_zones).length === 0 });
                if(current_subnet)
                  added_to_zones.push(zone);
                row.columns.push(angular.copy(current_subnet));
              }
              else if(_.includes(current_subnet.zones, zone)) {
                // If the last column was nil we've skipped it, so add another column of this subnet
                if(!row.columns[row.columns.length - 1]) {
                  row.columns.push(angular.copy(current_subnet))
                }
                else {
                  row.columns[row.columns.length - 1].colspan++;
                }

                added_to_zones.push(zone);
              }
              else {
                // We have a current subnet but it skips this zone, so add an empty column
                row.columns.push(null);
              }

              // If we've added the subnet to all zones close it off
              if (current_subnet && (added_to_zones.length >= current_subnet.zones.length)) {
                added_to_zones = [];
                all_subnets = _.reject(all_subnets, function(s) { return s.id === current_subnet.id });
                current_subnet = null;
              }

              // Add zones to the subnet so they can be filtered after
              var last_column = row.columns[row.columns.length-1];
              if (last_column) {
                if(!last_column["instanced_zones"])
                  last_column["instanced_zones"] = [];
                last_column["instanced_zones"].push(zone)
              }

              parsed_zones.push(zone);
            });

            // Filter the resources into zone groups then clean up the data
            _.each(row.columns, function(column) {
              if(!column) return;

              if(column.instanced_zones.length > 1) {
                column.zone_columns = [];
                _.each(column.resources_map, function(z, region) {
                  _.each(z, function(resources, zone) {
                    if(_.includes(column.instanced_zones, zone))
                      column.zone_columns.push({
                        name: zone,
                        resources: resources
                      });
                  });
                });

                column.zone_columns = _.sortBy(column.zone_columns, ["name"]);
              }
              else {
                column.resources = [];
                _.each(column.resources_map, function(z, region) {
                  _.each(z, function(resources, zone) {
                    if(_.includes(column.instanced_zones, zone))
                      column.resources = resources;
                  });
                })
              }
            });

            rows.push(row);
          }

          // Add in some load balancer rows, this is the same logic as in AWS. Can you dig it?
          var lbsubnet_map = {};
          _.each(this.getLoadBalancers(), function(lb) {
            _.each(environment.connectedTo(lb, "Resources::GCP::Compute::Subnetwork"), function(s) {
              if(!lbsubnet_map[s.id])
                lbsubnet_map[s.id] = [];
              lbsubnet_map[s.id].push(lb.id);
            });
          });

          // Add a spacer row because the css bunches it all up ... ewwww
          // TODO: we shouldn't need this now we're using chrome, yeah?
          if (rows.length > 0) {
            rows.push({ type: "subnet", columns: _.fill(Array(zones.length), null) })
          }

          var final_rows = [];
          var drawn_lbs = [];
          _.each(rows, function(row) {
            var lb_row = { type: "load_balancer", resources: [] };

            _.each(row.columns, function(subnet_info) {
              if(!subnet_info) return;

              var lbs = _.reject((lbsubnet_map[subnet_info.id] || []), function(lb) { return _.includes(drawn_lbs, lb) });
              lb_row.resources = lb_row.resources.concat(lbs);
              drawn_lbs = drawn_lbs.concat(lbs);
            });

            if(lb_row.resources.length)
              final_rows.push(lb_row);
            final_rows.push(row);
          });

          // Add a row for the remaining resources, if we have any
          if(bottom_row_resources.length) {
            var row = { type: "additional", zone_columns: [] };

            _.each(zones, function(zone) {
              row.zone_columns.push({
                name: zone,
                resources: _.map(_.filter(bottom_row_resources, function(r) { return r.zone === zone }), function(r) { return r.id })});
            });

            row.zone_columns = _.sortBy(row.zone_columns, ["name"]);

            final_rows.push(row);
          }

          return {
            id: this.id,
            center: final_rows,
            top: this.getTop(),
            right: this.getRight(),
            left: this.getLeft()
          };
        };

        network.getTop = function() {
          var left = [];
          var right = [];

          left = left.concat(this.getManagedZones());

          right = right.concat(this.getRouters());
          right = right.concat(this.getVPNGateways());
          right = right.concat(this.getTargetVPNGateways());
          right = right.concat(this.getExternalVPNGateways());

          return {
            left: _.map(left, function(r) { return r.id }),
            right: _.map(right, function(r) { return r.id })
          }
        };

        network.getRight = function() {
          var resources = [];

          resources = resources.concat(this.getInterconnects());
          resources = resources.concat(this.getExternalVPNGateways());

          return _.map(resources, function(r) { return r.id });
        };

        network.getLeft = function() {
          var resources = [];

          resources = resources.concat(this.getBuckets());

          return _.map(resources, function(r) { return r.id });
        };

        network.getBottomRowResources = function() {
          var resources = [];

          resources = resources.concat(this.getSQLInstances());
          resources = resources.concat(this.getMemoryStoreInstances());
          resources = resources.concat(this.getInstancesOutsideSubnets());

          return resources;
        };

        network.getGenericResources = function() {
            var genericUnits = environment.getResourcesByType("Resources::GCP::Generic::GlobalResource");
            return _.uniqBy(genericUnits, (gu) => gu.id).map((g) => g.id);
        }

        network.getLoadBalancers = function() {
          var lbs = [];

          _.each(["Resources::GCP::Compute::URLMap", "Resources::GCP::Compute::RegionURLMap", "Resources::GCP::Compute::TargetPool"], function(type) {
            lbs = lbs.concat(environment.connectedTo(this, type));
          }.bind(this));

          // Only show backend services if they aren't linked to a URL map
          var backend_services = environment.connectedTo(this, "Resources::GCP::Compute::BackendService").concat(
            environment.connectedTo(this, "Resources::GCP::Compute::RegionBackendService")
          );
          
          _.each(backend_services, function(bes) {
            var maps = environment.connectedTo(bes, "Resources::GCP::Compute::URLMap").concat(
              environment.connectedTo(bes, "Resources::GCP::Compute::RegionURLMap")
            );

            if(!maps.length)
              lbs.push(bes);
          });

          return _.uniq(lbs);
        };

        network.getInstancesOutsideSubnets = function() {
          return _.filter(environment.connectedTo(this, "Resources::GCP::Compute::Instance"), function(instance) {
            return environment.connectedTo(instance, "Resources::GCP::Compute::Subnetwork").length === 0;
          });
        };

        return network;
      }
    }
  }]);
