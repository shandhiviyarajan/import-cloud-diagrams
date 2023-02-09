angular
  .module("designer.workspace.layout.security.aws", ['designer.model.helpers.ports'])
  .factory("SecurityLayoutAWS", ["portMapper",
    function (portMapper) {
      return {
        load: function (environment) {
          const layout = {};

          // Define types we will use later to fetch certain types
          const PREFIX = "Resources::AWS";
          const GROUP = `${PREFIX}::EC2::SecurityGroup`;
          const PERMISSION = `${PREFIX}::EC2::SecurityGroupPermission`;

          // Create a list of the id/names of our returned SGs
          layout.findGroups = function (sgs) {
            return _.map(sgs, function (sg) {
              const { provider_id, id, name } = sg;
              const vpc = sg.getVpc();
              const network_id = vpc.provider_id;
              const network_name = vpc.name;
              return { provider_id, id, name, network_id, network_name };
            });
          };

          // Return an Array of the IP ranges contained in a permission
          layout.ipRanges = function (permission) {
            if (!permission.ip_ranges) return [];
            const { ip_ranges } = permission;
            return _.map(ip_ranges, (range) => range.cidr_ip);
          };

          // Rules with -1 are considered ALL
          layout.compress = function (permission) {
            const { ip_protocol, from_port, to_port } = permission;
            if (ip_protocol === "-1") {
              return { protocol: "ALL", from_port: "ALL", to_port: "ALL" };
            } else {
              return { protocol: ip_protocol, from_port, to_port };
            }
          };

          /**
           * Utility method that finds the connections
           * To a given resources and destination resource type
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
           * Utility method that takes in all required args
           * Outputs a rule aka arrow
           */
          layout.rule = function (compressed, range_or_id, group, direction) {
            const { protocol, from_port, to_port } = compressed;
            const rule = {};

            let src = range_or_id;
            let dst = group;
            if (direction == "egress") (src = group), (dst = range_or_id);

            const endpoints = { id: _.uniqueId(), src, dst };
            const from_proto = portMapper[from_port];
            const to_proto = portMapper[to_port]
            const port_rules = { protocol, from_port, to_port, direction, from_proto, to_proto };

            Object.assign(rule, endpoints, port_rules);
            return rule; // Aka arrow
          };

          /**
           * This is where we take in in individual permissions
           * Find out all the rules in it and create arrows
           */
          layout.findRules = function (permissions, group) {
            if (!permissions) return [];

            const rules = [];
            permissions.forEach((permission) => {
              const compressed = this.compress(permission);
              const { ip_ranges, permission_type } = permission;
              const direction = permission_type;

              // Push IP based rules
              if (ip_ranges) {
                const ranges = this.ipRanges(permission);
                ranges.forEach((range) => {
                  const rule = this.rule(compressed, range, group, direction);
                  rules.push(rule);
                });
              }

              // Push Security Group based rules
              const connections = this.getConnected(permission, GROUP);
              connections.forEach((connection) => {
                const conn_id = connection.provider_id;
                const rule = this.rule(compressed, conn_id, group, direction);
                rules.push(rule);
              });
            });

            return rules;
          };

          /**
           * This is where we take in in individual permissions
           * Find out all the rules in it and create arrows
           */
          layout.findInternalRules = function (sgs) {
            let rules = [];

            sgs.forEach((sg) => {
              const { provider_id } = sg;
              const permissions = this.getConnected(sg, PERMISSION);
              const reduced = this.findRules(permissions, provider_id);
              reduced.map((r) => (r.network_id = sg.getVpc().provider_id));
              reduced.map((r) => (r.security_group = sg));
              rules = rules.concat(reduced);
            });

            return rules;
          };

          /**
           * Create Arrows from compressed rules
           * From here on rules that are in security groups become arrows
           */
          layout.createArrows = function (group_ids, rules) {
            let arrows = rules.filter((rule) => {
              return group_ids.includes(rule.src);
            });

            // Now let's split them out to bidirectional arrows
            const bi_arrows = [];
            arrows.forEach((arrow) => {
              const { ports, src, dst, security_group, network_id, network_name } = arrow;
              const bi_ports = ports.filter((r) => r.direction === "bi");

              // Make bi_ports displayed on seperate arrows
              if (bi_ports.length > 0) {
                bi_arrows.push({ network_id, network_name, security_group, src, dst, direction: "bi", ports: bi_ports });

                arrow.ports = ports.filter((port) => {
                  return !bi_ports.includes(port);
                });
              }
            });

            // Add our bidirection arrows
            // Clear anything with empty rules
            // Add a unique Id
            arrows = arrows.concat(bi_arrows);
            arrows = arrows.filter((arrow) => arrow.ports.length);
            _.each(arrows, (arrow) => (arrow.id = _.uniqueId()));

            return arrows;
          };

          /**
           * Add positional details on arrows
           * Do not create new arrow group
           */
          layout.positionArrows = function (full, scoped_arrows) {
            const { resources } = environment.facet;

            // Filter out arrows which cannot be drawn
            const drawable = scoped_arrows.filter((arrow) => {
              const src_pos = full.findIndex(
                (f) => f.provider_id === arrow.src
              );
              const dst_pos = full.findIndex(
                (f) => f.provider_id === arrow.dst
              );

              if (src_pos === -1 || dst_pos === -1) return false;
              return true;
            });

            _.each(drawable, function (arrow) {
              // TODO: so either of those can be an IP rather than an sg id! Shit!
              // Calculate source, destination positions
              let src_pos = full.findIndex((r) => {
                return r.id === arrow.src && r.network_id === arrow.network_id;
              });
              let dst_pos = full.findIndex((r) => {
                return r.id === arrow.dst && r.network_id === arrow.network_id;
              });

              // If the source/destination is a resource
              // Must search in the full list, otherwise search in
              // Scoped list, as they could be service tags
              if (resources.find((r) => r.provider_id === arrow.src)) {
                src_pos = full.findIndex((f) => f.provider_id === arrow.src);
              }

              if (resources.find((r) => r.provider_id === arrow.dst)) {
                dst_pos = full.findIndex((f) => f.provider_id === arrow.dst);
              }

              // Required for arrow position
              const lower_pos = Math.min(src_pos, dst_pos);
              const higher_pos = Math.max(src_pos, dst_pos);
              const size = higher_pos - lower_pos;

              // a is down, c is up (for sorting later)
              let direction = src_pos < dst_pos ? "down" : "up";
              if (arrow.direction === "bi") direction = "two-way";

              const position = { direction, src_pos, dst_pos, lower_pos, size };

              position.sort_key = direction === "up" ? dst_pos : src_pos;
              Object.assign(arrow, position);
            });

            return drawable;
          };

          layout.rejectInternalRules = function (rules) {
            return _.reject(rules, function (x) {
              return x.src === x.dst;
            });
          };

          layout.rejectICMPRules = function (rules) {
            return _.reject(rules, function (x) {
              return x.protocol === "icmp";
            });
          };

          layout.fetchSGs = function (facet) {
            const sgs = _.filter(facet, function (x) {
              return x.type === GROUP;
            });

            return _.sortBy(sgs, function (s) {
              return s.name;
            });
          };

          layout.getData = function () {
            const { resources } = environment.facet;
            const sgs = this.fetchSGs(resources);

            // Get an array of hashes containing id/name keys
            const mini_rows = this.findGroups(sgs);
            const groups = _.groupBy(mini_rows, "network_id");

            // Create an array of the SGs that make up our rows
            const length = _.values(groups).length;
            let count = 0;
            _.each(groups, (v, network_id) => {
              const internet = {};
              internet.name = internet.id = internet.provider_id = "internet";
              internet.network_id = network_id;
              internet.network_name = v[0].network_name;
              v.unshift(internet);

              count += 1;

              const blank_row = { id: "blank", name: "blank", type: "blank" };
              const blank_rows = Array(2).fill(blank_row);
              if (count !== length) blank_rows.forEach((r) => v.push(r));
            });

            const rows = _.values(groups).flat();

            // Create an array of the SGs that make up our rows
            const group_ids = _.map(rows, (g) => g.provider_id);

            // Make a flat set of rules
            // Reject rules where the source and destination are the same
            let rules = this.findInternalRules(sgs);
            rules = this.rejectInternalRules(rules);

            // Batch rules which share same source and destination
            const batched = [];
            rules.forEach((rule) => {
              const { src, dst, network_id, network_name } = rule;
              const existing = batched.find((b) => {
                return b.src === src && b.dst === dst;
              });

              // Create a rule on a port level
              const { protocol, security_group, from_port, to_port, direction, from_proto, to_proto } = rule;
              const port_rule = { protocol, from_port, to_port, direction, from_proto, to_proto, security_group };

              if (existing) {
                existing.ports.push(port_rule);
              } else {
                batched.push({ security_group, src, dst, network_id, network_name, ports: [port_rule] });
              }
            });

            // Remove ICMP rules before determining bi-directional arrows
            _.each(batched, function (derp) {
              derp.ports = _.reject(derp.ports, function (x) {
                return x.protocol === "icmp";
              });
            });

            // Loop through each rule and check if we have any rules going the opposite direction
            const checked = [];
            batched.forEach((rule) => {
              const existing = checked.find((x) => {
                return x.src === rule.dst && x.dst === rule.src;
              });

              // We have a rule going in the opposite direction
              // Check if we share any ports which would create a bidirectional rule
              if (existing) {
                existing.ports.forEach((existing_port, i) => {
                  rule.ports.forEach((rule_port) => {
                    // Egress can't have a security group as a dst
                    // So we only check for ingress on group connections
                    // We share a port - mark one side bidirectional and the other as removeable
                    if (_.isEqual(existing_port, rule_port)) {
                      rule_port.direction = "bi";
                      existing.ports.splice(i, 1);
                    } else if (
                      existing_port.protocol === "ALL" &&
                      rule_port.protocol === "ALL" &&
                      existing_port.direction !== rule_port.direction
                    ) {
                      rule_port.direction = "bi";
                      existing.ports.splice(i, 1);
                    }
                  });
                });
              } else {
                checked.push(rule);
              }
            });

            // Now take any bidirectional rules and move them to a new rule
            // In case there are some rules that only go one direction
            const new_batch = [];
            batched.forEach((r) => {
              const both = r.ports.filter((x) => x.direction === "both");

              if (both.length > 0) {
                // TODO: does this work?
                new_batch.push({ src: r.src, network_id: r.network_id, dst: r.dst, ports: both });

                r.ports = r.ports.filter((x) => x.direction !== "both");
                if (r.ports.length > 0) new_batch.push(r);
              } else {
                new_batch.push(r);
              }
            });

            // Change rules to use 'internet' so we can match the security group
            new_batch.forEach((arrow) => {
              if (arrow.dst === "0.0.0.0/0") arrow.dst = "internet";
              if (arrow.src === "0.0.0.0/0") arrow.src = "internet";
            });

            // Create arrows from the rules
            // Position them in the view space
            // Sort by direction
            let arrows = [];
            let unsorted_arrows = this.createArrows(group_ids, new_batch);

            const grouped_arrows = _.groupBy(unsorted_arrows, "network_id");
            _.each(grouped_arrows, (scoped_arrows, network_id) => {
              const positioned = this.positionArrows(rows, scoped_arrows);
              arrows = arrows.concat(positioned);
            });

            arrows = _.sortBy(arrows, (arrow) => {
              return arrow.direction + arrow.sort_key;
            });

            // Return nothing if there's nothing worth displaying
            if (arrows.length === 0) return { rows: [], arrows: [] };
            return { rows, arrows };
          };

          return layout;
        },
      };
    },
  ]);
