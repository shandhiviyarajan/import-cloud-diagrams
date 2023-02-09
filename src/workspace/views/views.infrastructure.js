angular.module('designer.workspace.views.infrastructure', [
  "designer.configuration",
  "designer.model.view",
  "designer.workspace.canvases.jointjs.graph",
  "designer.workspace.views.infrastructure.aws.shapes.subnet",
  "designer.workspace.views.infrastructure.aws.shapes.vpc",
  'designer.workspace.views.infrastructure.aws.shapes.availability-zone',

  "designer.workspace.views.infrastructure.ibm.shapes.subnet",
  "designer.workspace.views.infrastructure.ibm.shapes.vpc",
  'designer.workspace.views.infrastructure.ibm.shapes.availability-zone',

  "designer.workspace.views.infrastructure.azure.shapes.subnet",
  "designer.workspace.views.infrastructure.azure.shapes.virtual-network",
  "designer.workspace.views.infrastructure.azure.shapes.resource-group",

  "designer.workspace.views.infrastructure.gcp.shapes.subnetwork",
  "designer.workspace.views.infrastructure.gcp.shapes.network",
  "designer.workspace.views.infrastructure.gcp.shapes.zone",

  "designer.model.resources.aws.availabilityzone",
  "designer.model.resources.ibm.availabilityzone",
  "designer.model.resources.gcp.zone",
])
.factory('InfrastructureView', [
  "View", "Graph", "SubnetElement", "VpcElement", "AZElement", "AzureSubnetElement", "AzureVirtualNetworkElement", "AzureResourceGroupElement",
  "GCPNetworkElement", "GCPSubnetworkElement", "GCPZoneElement", "DesignerConfig", "AWS_AvailabilityZone", "GCP_Zone",
  "IBMVpcElement", "IBMSubnetElement", "IBMAZElement", "IBM_AvailabilityZone",
  function(View, Graph, SubnetElement, VpcElement, AZElement, AzureSubnetElement, AzureVirtualNetworkElement, AzureResourceGroupElement,
           GCPNetworkElement, GCPSubnetworkElement, GCPZoneElement, DesignerConfig, AWS_AvailabilityZone, GCP_Zone,
           IBMVpcElement, IBMSubnetElement, IBMAZElement, IBM_AvailabilityZone) {
    return {
      create: function(obj) {
        var view = View.create(obj);

        view.name = "Infrastructure";
        view.canvas = "jointjs";
        view.positioned = false;
        view.height = 0;
        view.width  = 0;
        view.az_padding = 16;
        view.model = new Graph();

        // Set some of our own shapes
        view.model.shapes.custom = {
          "Resources::AWS::EC2::VPC": VpcElement,
          "Resources::AWS::EC2::Subnet": SubnetElement,
          "Resources::AWS::AvailabilityZone": AZElement,

          "Resources::Azure::Network::VirtualNetwork": AzureVirtualNetworkElement,
          "Resources::Azure::Network::Subnet": AzureSubnetElement,
          "Resources::Azure::Resources::ResourceGroup": AzureResourceGroupElement,

          "Resources::GCP::Compute::Network": GCPNetworkElement,
          "Resources::GCP::Compute::Subnetwork": GCPSubnetworkElement,
          "Resources::GCP::Zone": GCPZoneElement,

          "Resources::IBM::EC2::VPC": IBMVpcElement,
          "Resources::IBM::EC2::Subnet": IBMSubnetElement,
          "Resources::IBM::AvailabilityZone": IBMAZElement,
        };

        // Allow visio export
        view.supported_exports.vsdx = true;

        view.isEmpty = function() {
          return this.model.resourceCells.length === 0 && this.model.resourceLinks.length === 0;
        };

        view.load_with_positions = function(model, coords) {
          this.coordinates = coords;

          this.loadResources(model);
          this.loadAzs(model);

          if(DesignerConfig.get("loadConnections"))
            this.loadResourceConnections(model);

          this.loadDimensions();

          this.positioned = true;
        };

        view.reposition = function(model, coords) {
          this.coordinates = coords;
          var resource_ids = _.uniq(_.map(coords, function(c) { return c.id }));
          _.each(resource_ids, function(id) {
            var geom = this.geometry(id);
            var cells = this.model.findByResourceId(id);
            _.each(geom, function(g) {
              var cell = cells.shift();
              if (cell) {
                cell.position(g.x, g.y);
                cell.resize(g.w, g.h);
              }
            })
          }.bind(this));

          // Reload AZ's and dimensions
          this.loadAzs(model);
          this.loadDimensions();
        };

        view.geometry = function(resource_id) {
          return _.filter(this.coordinates, function(geometry) { return geometry["id"] === resource_id });
        };

        view.loadResources = function(model) {
          _.each(model.facet.resources, function(resource) {
            var geom = this.geometry(resource.id);

            if(resource.drawable(true) && geom.length > 0) {
              _.each(geom, function(g) { this.model.createResourceCell(resource, g) }.bind(this));
            }
          }.bind(this));
        };

        view.loadAzs = function(model) {
          // Draw each VPC separately
          var vpcs = model.getResourcesByType("Resources::AWS::EC2::VPC");

          if(vpcs.length === 0) {
            this.calculateAzs(model.getResourcesByType("Resources::AWS::EC2::Subnet"));
          }
          else {
            _.each(vpcs, function(vpc) {
              this.calculateAzs(model.getResourcesByType("Resources::AWS::EC2::Subnet", vpc), vpc.id);
            }.bind(this));
          }

          // Just copy the above for IBM for now
          var vpcs = model.getResourcesByType("Resources::IBM::EC2::VPC");

          if(vpcs.length === 0) {
            this.calculateAzs(model.getResourcesByType("Resources::IBM::EC2::Subnet"));
          }
          else {
            _.each(vpcs, function(vpc) {
              this.calculateAzs(model.getResourcesByType("Resources::IBM::EC2::Subnet", vpc), vpc.id);
            }.bind(this));
          }

          // Draw zones for GCP... assume we always have a network
          var networks = model.getResourcesByType("Resources::GCP::Compute::Network");
          _.each(networks, function(network) {
            this.calculateZones(model, network);
          }.bind(this));
        };

        view.calculateAzs = function(subnets_to_wrap, parent_id) {
          // Group subnets by AZ
          var subnets = {};
          var is_ibm = (subnets_to_wrap[0] && subnets_to_wrap[0].type === "Resources::IBM::EC2::Subnet");

          _.each(subnets_to_wrap, function(r) {
            var az = r.availability_zone || "";

            if(!subnets[az])
              subnets[az] = [];

            subnets[az].push(r);
          });

          // Make sure the az wraps the subnets
          var azs = [];
          var globalMaxY = 0;
          _.each(subnets, function(sns, az_name) {
            var az    = { name: az_name, x: 0, y: 0, width: 0, height: 0 },
              max_x = 0,
              max_y = 0;

            _.each(sns, function(sn) {
              var g = this.geometry(sn.id)[0];

              // Set the origin if needed
              if(az.x === 0 || g.x < az.x) az.x = g.x;
              if(az.y === 0 || g.y < az.y) az.y = g.y;

              // Set max values so we can set height and width later
              var sn_max_x = g.x + g.w;
              var sn_max_y = g.y + g.h;
              if(max_x === 0 || max_x < sn_max_x) max_x = sn_max_x;
              if(max_y === 0 || max_y < sn_max_y) max_y = sn_max_y;
            }.bind(this));

            // Set width and height
            az.width  = max_x - az.x;
            az.height = max_y - az.y;

            // Pad it
            az.x -= this.az_padding;
            az.y -= this.az_padding;

            az.width += this.az_padding*2;
            az.height += this.az_padding*3;

            // AZ's can start at different points but they all need to end at the same point
            if(max_y > globalMaxY) globalMaxY = max_y;

            azs.push(az);
          }.bind(this));

          _.each(azs, function(az) {
            az.id = az.name + "_" + parent_id;
            az.type = is_ibm ? "Resources::IBM::AvailabilityZone" : "Resources::AWS::AvailabilityZone";

            // Make sure it reaches the bottom
            if(az.y + az.height < globalMaxY) {
              az.height = globalMaxY - az.y + this.az_padding*2;
            }

            // If we're repositioning then just update it
            var azs = this.model.findByResourceId(az.id);
            var geom = { x: az.x, y: az.y, w: az.width, h: az.height };

            if(azs.length) {
              azs[0].position(az.x, az.y);
              azs[0].resize(az.width, az.height);
            }
            else {
              var az_class = is_ibm ? IBM_AvailabilityZone : AWS_AvailabilityZone;
              az = az_class.load(az, {subnets: subnets[az.name] });
              this.model.createResourceCell(az, geom);
            }

          }.bind(this));
        };

        view.calculateZones = function(model, network) {
          var all_zones = {};
          var visible_zones = [];

          _.each(model.getResourcesByType("Resources::GCP::Compute::Subnetwork", network), function(subnet) {
            var resources = model.connectedTo(subnet, null, true);

            // Keep track of the subnet cells on the diagram
            subnet.cells = [];

            // Let's grab any zones that aren't undefined
            subnet.zones = _.reject(_.uniq(_.map(resources, function(r) { return r.zone })).sort(), function(zone) {
              return zone === undefined;
            });

            // No zones, we don't draw it in one
            if(subnet.zones.length === 0)
              return;

            // Figure out how many cells we have per subnet and which are in which zones
            _.each(this.geometry(subnet.id), function(g) {
              var subnet_cell = {
                id: subnet.id,
                x: g.x,
                y: g.y,
                w: g.w,
                h: g.h,
                max_x: g.x + g.w,
                max_y: g.y + g.h,
                zone_top_left: {},
                zones: []
              };

              // If any resources are within this subnet cell then it's part of that zone
              _.each(resources, function(r) {
                _.each(this.geometry(r.id), function(r_g) {
                  if((r_g.x >= subnet_cell.x && r_g.x <= subnet_cell.max_x) && (r_g.y >= subnet_cell.y && r_g.y <= subnet_cell.max_y)) {
                    subnet_cell.zones.push(r.zone);

                    // Keep track of zones that have visible resources in them, otherwise there's no point showing it
                    visible_zones.push(r.zone);

                    // Keep track of the top left coords so we can draw the zone there if required
                    if(!subnet_cell.zone_top_left[r.zone] || r_g.x < subnet_cell.zone_top_left[r.zone])
                      subnet_cell.zone_top_left[r.zone] = r_g.x;
                  }
                }.bind(this));
              }.bind(this));

              subnet_cell.zones = _.uniq(subnet_cell.zones).sort();

              subnet.cells.push(subnet_cell);
            }.bind(this));

            _.each(subnet.zones, function(zone) {
              if(!all_zones[zone])
                all_zones[zone] = [];

              all_zones[zone].push(subnet);
            }.bind(this));
          }.bind(this));

          // Make sure the az wraps the subnets
          var zones = [];
          
          var globalMaxY = 0;
          _.each(all_zones, function(subnets, zone_name) {
            if(zone_name === "") return;

            var zone = { name: zone_name, x: 0, y: 0, width: 0, height: 0 },
              max_x  = 0,
              max_y  = 0;

            _.each(subnets, function(subnet) {
              _.each(subnet.cells, function(cell) {
                // Only for this zone bro
                if(cell.zones.indexOf(zone_name) === -1) return;

                // Set top and bottom, these are the same regardless of span
                if(zone.y === 0 || cell.y < zone.y) zone.y = cell.y;
                if(max_y === 0 || max_y < cell.max_y) max_y = cell.max_y;

                if (cell.zones.length === 1) {
                  // If we only have one cell we can set side and width too
                  if(zone.x === 0 || cell.x < zone.x) zone.x = cell.x;
                  if(max_x === 0 || max_x < cell.max_x) max_x = cell.max_x;
                }
                else {
                  // We span multiple zones, so we need to do our best to figure out where this cell starts -_-
                  var top_left = cell.zone_top_left[zone_name];
                  if (top_left && (zone.x === 0 || top_left < zone.x)) zone.x = (top_left-16);

                  // If this is the last cell then use the right hand side as our width
                  if (cell.zones.indexOf(zone_name) === (cell.zones.length-1)) {
                    if(max_x === 0 || max_x < cell.max_x) max_x = cell.max_x;
                  }
                }
              }.bind(this));
            }.bind(this));

            // Okaaay so grab resources in this zone and check if any are further down the page
            var resources_in_zone = _.filter(model.facet.resources, function(r) { return r["zone"] === zone_name });
            _.each(resources_in_zone, function(r) {
              _.each(this.geometry(r.id), function(g) {
                if (g.y + g.h > max_y)
                  max_y = g.y + g.h + (this.az_padding*2);
              }.bind(this));
            }.bind(this));

            // Set width and height
            if(max_x)
              zone.width  = max_x - zone.x;
            if (max_y)
              zone.height = max_y - zone.y;

            // AZ's can start at different points but they all need to end at the same point
            if(max_y > globalMaxY) globalMaxY = max_y;

            zones.push(zone);
          }.bind(this));

          // Remove invisible zones, filter, sort
          visible_zones = _.uniq(visible_zones);
          zones = _.filter(zones, (z) => _.includes(visible_zones, z.name));
          zones = _.sortBy(zones, (z) => z.name);

          // If we have no width then base it on the next zone along
          for (var i = 0; i < zones.length; i++) {
            var zone = zones[i];
            var next_zone = zones[i+1];

            if (zone.width === 0 && next_zone) {
              zone.width = (next_zone.x - zone.x - 48);
            }
          }

          _.each(zones, function(zone) {
            if(!zone.name || !_.includes(visible_zones, zone.name)) return;

            // Make sure the name is unique
            zone.id = zone.name + "_" + network.id;
            zone.type = "Resources::GCP::Zone";

            // Pad it
            zone.x -= this.az_padding;
            zone.y -= this.az_padding;
            zone.width += this.az_padding*2;
            zone.height += this.az_padding*3;
            
            // Make sure it reaches the bottom
            if(zone.y + zone.height < globalMaxY) {
              zone.height = globalMaxY - zone.y + this.az_padding*2;
            }

            var geom = { x: zone.x, y: zone.y, w: zone.width, h: zone.height };
            // If we're repositioning then just update it
            var zones = this.model.findByResourceId(zone.id);
            if(zones.length) {
              zones[0].position(zone.x, zone.y);
              zones[0].resize(zone.width, zone.height);
            }
            else {
              var az = GCP_Zone.load(zone, {subnets: all_zones[zone.name] });
              this.model.createResourceCell(az, geom);
            }
          }.bind(this));
        };

        view.loadResourceConnections = function(environment) {
          var connection_map = [];
          _.each(environment.facet.resources, function (resource) {
            if(resource.drawable() && this.geometry(resource.id).length > 0) {
              var connectables = resource.getDisplayableConnections();

              _.each(connectables, function(c) {
                // Check if we've already done this connection
                if(connection_map[resource.id] && _.includes(connection_map[resource.id], c.id)) {
                  return;
                }
                else {
                  if(!connection_map[resource.id]) connection_map[resource.id] = [];
                  connection_map[resource.id].push(c.id)
                }

                var provideCells = this.model.getResourceCellsForResource(resource.id);
                var dependCells  = this.model.getResourceCellsForResource(c.id);

                _.each(provideCells, function(provideCell) {
                  _.each(dependCells, function(dependCell) {
                    this.model.createResourceLink(provideCell, dependCell, {});
                  }.bind(this));
                }.bind(this));
              }.bind(this));
            }
          }.bind(this));
        };

        view.loadDimensions = function() {
          this.width = this.height = 0;

          _.each(this.coordinates, function(g) {
            if(g && g.x && g.y) {
              var max_x = g.x + g.w;
              var max_y = g.y + g.h;

              if(max_x > this.width)  this.width  = max_x;
              if(max_y > this.height) this.height = max_y;
            }
          }.bind(this));
        };

        return view;
      }
    }
  }]);
