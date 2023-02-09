angular
  .module("designer.workspace.layout.security.azure", ['designer.model.helpers.ports'])
  .factory("SecurityLayoutAzure", ["portMapper",
    function (portMapper) {
      return {
        load: function (environment) {
          const layout = {};

          // Define types we will use later to fetch certain types
          const PREFIX = "Resources::Azure::Network";
          const SUBNET = `${PREFIX}::Subnet`;
          const VNET = `${PREFIX}::VirtualNetwork`;
          const NSG = `${PREFIX}::NetworkSecurityGroup`;
          const ASG = `${PREFIX}::ApplicationSecurityGroup`;
          const INTERFACE = `${PREFIX}::NetworkInterface`;
          const RULE = `${PREFIX}::NetworkSecurityGroup::SecurityRule`;
          const IPCONFIG = `${PREFIX}::NetworkInterface::IpConfiguration`;

          /**
           * Go through the network resources and arrows
           * Find the arrows' position i.e where it begins and where it ends
           */
          layout.position_arrows = function (full, scoped, scoped_arrows) {
            const { resources } = environment.facet;

            scoped_arrows.forEach(function (arrow) {
              // Calculate source, destination positions
              let src_pos = full.findIndex((r) => {
                return r.id == arrow.src && r.network_id === arrow.network_id;
              });
              let dst_pos = full.findIndex((r) => {
                return r.id == arrow.dst && r.network_id === arrow.network_id;
              });

              // If the source/destination is a resource
              // Must search in the full list, otherwise search in
              // Scoped list, as they could be service tags
              if (resources.find((r) => r.id === arrow.src)) {
                src_pos = full.findIndex((f) => f.id == arrow.src);
              }

              if (resources.find((r) => r.id === arrow.dst)) {
                dst_pos = full.findIndex((f) => f.id == arrow.dst);
              }

              if (src_pos === -1 || dst_pos === -1) return;

              // Caclulate lower, higher positions
              const lower_pos = _.min([src_pos, dst_pos]);
              const higher_pos = _.max([src_pos, dst_pos]);
              const size = higher_pos - lower_pos;

              // New properties
              const positions = {
                lower_pos,
                higher_pos,
                size,
                src_pos,
                dst_pos,
              };

              // Assign new properties to the existing arrows
              Object.assign(arrow, positions);
            });

            return scoped_arrows;
          };

          /**
           * Handy function to get the connected resources
           */
          layout.getConnected = function (resource, type) {
            const connected = [];

            _.each(resource.connections, function (connection) {
              if (connection.remote_resource_id === resource.id) return;

              const connected_to = environment.getResource(
                connection.remote_resource_id
              );

              if (connected_to && connected_to.type === type) {
                connected_to.connection_data = connection.data;
                connected.push(connected_to);
              }
            });
            return connected;
          };

          /**
           * Fetch Network Security Groups
           */
          layout.network_security_groups = function (resources) {
            return resources.filter((r) => r.type === NSG && environment.connectedTo(r, "Resources::Azure::Network::VirtualNetwork").length > 0);
          };

          /**
           * Fetch individual rules by NSGs
           * Map them together by NSG id and return
           */
          layout.network_security_group_rules = function (nsgs) {
            let all_rules = [];

            nsgs.forEach((nsg) => {
              const { id } = nsg;
              let rules = this.getConnected(nsg, RULE);
              let vnet = this.getConnected(nsg, VNET)[0];
              rules.forEach((rule) => {
                rule.nsg_id = id;
                rule.nsg = nsg;
                rule.network_id = vnet.id;
                rule.network_name = vnet.name;
              });
              all_rules = all_rules.concat(rules);
            });

            return all_rules;
          };

          /**
           * Go through all the rules
           * Retreive all sources and destinations
           */
          layout.get_source_destination = function (rules) {
            const endpoints = rules.map((rule) => {
              const { src, dst } = rule;
              return [src, dst];
            });

            return _.uniq(endpoints.flat());
          };

          /**
           * Go through all the resources
           * Find the resources that can be drawn the diagram
           * Return their identifiers
           */
          layout.find_groups = function (resources) {
            const identifiers = {};

            // Subnets
            const subnets = resources.filter((r) => r.type === SUBNET);
            subnets.forEach((subnet) => {
              identifiers[subnet.address_prefix] = subnet;
            });

            // Network Interfaces
            const interfaces = resources.filter((r) => r.type === INTERFACE);
            interfaces.forEach((nic) => {
              const ip_config = this.getConnected(nic, IPCONFIG)[0];
              identifiers[ip_config.private_ipaddress] = nic;
            });

            // Application Security Groups
            const asgs = resources.filter((r) => r.type === ASG);
            asgs.forEach((asg) => {
              identifiers[asg.provider_id] = asg;
            });

            return identifiers;
          };

          /**
           * Need to figure this out later
           * Return all the rules from the raw rules
           */
          layout.create_arrows = function (rules) {
            if (_.isEmpty(rules)) return [];
            const mapped_rules = [];

            rules.forEach(function (rule) {
              const values = rule;

              const source_ports = _.compact(
                _.flatten([values.source_port_ranges, values.source_port_range])
              );

              const destination_ports = _.compact(
                _.flatten([
                  values.destination_port_ranges,
                  values.destination_port_range,
                ])
              );

              const source_ranges = _.compact(
                _.flatten([
                  values.source_address_prefixes,
                  values.source_address_prefix,
                  values.source_application_security_group_id &&
                    values.source_application_security_group_id.toLowerCase(),
                ])
              );

              const destination_ranges = _.compact(
                _.flatten([
                  values.destination_address_prefixes,
                  values.destination_address_prefix,
                  values.destination_application_security_group_id &&
                    values.destination_application_security_group_id.toLowerCase(),
                ])
              );

              const direction = values.direction;

              source_ranges.forEach(function (source_range) {
                destination_ranges.forEach(function (destination_range) {
                  source_ports.forEach(function (source_port) {
                    destination_ports.forEach(function (destination_port) {
                      const r = {
                        src: source_range === "*" ? "Any" : source_range,
                        dst:
                          destination_range === "*" ? "Any" : destination_range,
                        protocol: rule.protocol === "*" ? "ALL" : rule.protocol,
                        from_port: source_port === "*" ? "ALL" : source_port,
                        to_port:
                          destination_port === "*" ? "ALL" : destination_port,
                        direction: direction,
                        access: values.access.toLowerCase(),
                        priority: values.priority,
                        nsg_id: values.nsg_id,
                        nsg: values.nsg,
                        network_id: values.network_id,
                        network_name: values.network_name,
                        provider: "azure",
                      };

                      r.from_proto = portMapper[r.from_port];
                      r.to_proto = portMapper[r.to_port];

                      mapped_rules.push(r);
                    });
                  });
                });
              });
            });

            return mapped_rules;
          };

          /**
           * From the resources that CAN be drawn
           * Pick the resources which are part of the rules
           */
          layout.find_groups_in_rules = function (resources, endpoints) {
            return _.pickBy(resources, function (_, key) {
              return endpoints.includes(key);
            });
          };

          // Now find all the rules in the group that refer to other groups within
          // our collection, so we can create the vertical arrows
          // Now we want to create our arrows, we base these on which rules span
          // from a src to a dst. Groups are Subnets, NIC and ASG
          layout.format_groups_in_arrows = function (groups, arrows) {
            arrows.forEach(function (arrow) {
              if (groups[arrow.src]) arrow.src = groups[arrow.src].id;
              if (groups[arrow.dst]) arrow.dst = groups[arrow.dst].id;
            });

            return arrows;
          };

          // Helper function to test wheter something's an ip or not
          layout.isIP = function (endpoint) {
            const isIp = ipaddr.isValid(endpoint);
            let isCidr = false;

            try {
              ipaddr.parseCIDR(endpoint);
              isCidr = true;
            } catch (e) {
              isCidr = false;
            }

            return isIp || isCidr;
          };

          layout.get_groups = function (groups, arrows) {
            const group_rows = [];

            // Populate the groups with an Id and a name
            arrows.forEach((arrow) => {
              const { src, dst } = arrow;
              [src, dst].forEach((endpoint) => {
                if (groups[endpoint]) {
                  const { id, name } = groups[endpoint];
                  const depth = 2;
                  group_rows.push({ id, resource_id: id, value: name, depth });
                } else {
                  const isIP = this.isIP(endpoint);
                  const value = endpoint;
                  const id = value;
                  group_rows.push({ id, value, depth: isIP ? 3 : 1 });
                }
              });
            });

            // Sort the groups without static resources
            // And append them at the beginning later
            const top = ["Internet", "VirtualNetwork", "Any"];

            const uniq = _.uniqBy(group_rows, "id");
            const resources = uniq.filter((r) => top.indexOf(r.id) === -1);
            resources.sort((r1, r2) => r1.depth - r2.depth);

            const static_r = uniq.filter((r) => top.indexOf(r.id) !== -1);
            static_r.sort((r1, r2) => top.indexOf(r1.id) - top.indexOf(r2.id));

            return static_r.concat(resources);
          };

          // Get Vnet for a given resource
          // Use it for the segragation of the security view by vnet
          layout.getVnetAssociated = function (resource) {
            return environment.connectedTo(resource, "Resources::Azure::Network::VirtualNetwork")[0];
          };

          // Create rows and make sure to order them by vnet
          layout.create_rows = function (vnets, r_map, arrows) {
            let rows = [];
            const { resources } = environment.facet;

            // Separate views
            vnets.forEach((vnet, index) => {
              let vnet_rows = this.get_groups(r_map, arrows);
              vnet_rows = vnet_rows.filter((vnet_row) => {
                const { resource_id } = vnet_row;
                if (resource_id) {
                  const resource = resources.find((r) => r.id === resource_id);

                  // Vnet association
                  const net = this.getVnetAssociated(resource);
                  if (net.id === vnet.id) {
                    vnet_row.network_id = vnet.id;
                    vnet_row.network_name = vnet.name;
                  }
                  return net.id === vnet.id;
                } else {
                  vnet_row.network_id = vnet.id;
                  vnet_row.network_name = vnet.name;
                  return true;
                }
              });

              // Concat them
              // This is where the seperation of the network happens
              rows.push(vnet_rows);
              const blank_row = { id: "blank", name: "blank", type: "blank" };
              const blank_rows = Array(2).fill(blank_row);
              if (vnets.length !== index + 1) rows.push(blank_rows);
            });

            return rows;
          };

          layout.getData = function () {
            const { resources } = environment.facet;

            const vnets = resources.filter((r) => r.type === VNET);

            const nsgs = this.network_security_groups(resources);
            const all_rules = this.network_security_group_rules(nsgs);

            // Make a flat set of rules
            // [{ src, dst, proto, from_port, to_port }]
            let arrows = this.create_arrows(all_rules);

            // This has to be done to make the arrow labels work
            // TODO read ports from the rule itself
            arrows.forEach(function (arrow) {
              arrow.ports = [arrow];
              arrow.id = _.uniqueId();
            });

            // Get all the src and dst (ips,asg) in the rules
            const sources_destinations = this.get_source_destination(arrows);

            // Get an array of hashes containing ip/resource (Subnets, NICS, ASG)
            const available_security_resources_map =
              this.find_groups(resources);

            // Find groups that are resources in the rules
            const resources_map = this.find_groups_in_rules(
              available_security_resources_map,
              sources_destinations
            );

            // Get rows from arrows
            // Create an array of the IPs, Subnets, NICs that make up our rows
            let grouped_rows = this.create_rows(vnets, resources_map, arrows);
            let all_rows = grouped_rows.flat();

            arrows = this.format_groups_in_arrows(resources_map, arrows);

            // Return nothing if there's nothing worth displaying
            if (_.isEmpty(arrows)) return { rows: [], arrows: [] };

            // Pass scoped and full rows for positioning arrows
            // Use full rows for resources and scoped for non-resource types
            vnets.forEach((vnet) => {
              const scoped_rows = all_rows.filter((r) => r.network_id === vnet.id);
              const scoped_arrows = arrows.filter((a) => a.network_id === vnet.id);
              this.position_arrows(all_rows, scoped_rows, scoped_arrows);
            });

            // Sort arrows by NSG, Direction and then Priority
            arrows.sort(function (a1, a2) {
              if (a1.nsg_id === a2.nsg_id) {
                if (a1.direction === a2.direction) {
                  return a1.priority - a2.priority;
                }
                return a1.direction > a2.direction ? 1 : -1;
              }
              return a1.nsg_id > a2.nsg_id ? -1 : 1;
            });

            // Finally return the layout
            return { rows: all_rows, arrows };
          };

          return layout;
        },
      };
    },
  ]);
