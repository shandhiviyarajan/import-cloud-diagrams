angular
  .module("designer.workspace.layout.security", [
    "designer.configuration",
    "designer.workspace.layout.security.azure",
    "designer.workspace.layout.security.aws",
    "designer.configuration",
    "designer.state",
  ])
  .directive("securityLayout", ["$timeout", "SecurityLayoutAzure", "SecurityLayoutAWS", "DesignerConfig", "DesignerState", "$rootScope",
    function ($timeout, SecurityLayoutAzure, SecurityLayoutAWS, DesignerConfig, DesignerState, $rootScope) {
      return {
        controllerAs: "SecurityLayoutAzure",
        bindToController: true,
        scope: {
          environment: "=",
        },
        controller: [
          "$scope",
          "$element",
          "$attrs",
          function ($scope) {
            this.layout = function () {
              if (this.environment.current_view.type === "Views::Security") {
                var views = [];

                var Strategies = [SecurityLayoutAWS, SecurityLayoutAzure];

                Strategies.forEach((Strategy) => {
                  var { rows, arrows } = Strategy.load(
                    this.environment
                  ).getData();

                  if (!_.isEmpty(rows) && !_.isEmpty(arrows)) {
                    views.push({ rows, arrows });
                  }
                });

                $scope.views = views;
              }
            };
          },
        ],
        link: function (scope, element, attrs, ctrl) {
          // Get the model
          ctrl.layout();
          ctrl.hidden = false;
          ctrl.position = function () {
            let { views } = scope;
            let all_rows = [];
            let all_arrows = [];
            let all_nsg_blocks = [];
            let view_height = 0;
            let view_padding = 200;

            views.forEach((view, view_index) => {
              let { rows, arrows } = view;

              var hideDefaultArrows = DesignerState.get("hideDefaultArrows");
              ctrl.hidden = hideDefaultArrows;
              if (hideDefaultArrows) {
                arrows = arrows.filter((arrow) => {
                  const { dst, ports } = arrow;

                  const internet = dst === "internet";
                  return _.every(ports, (port) => {
                    const { protocol, from_port, to_port, direction } = port;
                    const egress = direction === "egress";
                    const r = new Set([protocol, from_port, to_port]);
                    const defaultRule = r.size == 1 && r.has("ALL") && egress;
                    return !(internet && defaultRule);
                  });
                });
              }

              // Security layout configs
              const offset = 500;
              const arrow_width = 150;
              const flat_arrow_width = 200;
              const row_height = 125;

              // Calculate how many flat and normal arrows we have
              const f_arrows = arrows.filter((a) => a.size === 0).length;
              const n_arrows = arrows.filter((a) => a.size !== 0).length;

              // Offset by some and we have flat arrows and normal arrows
              // Combine all of them and calculate final length
              let row_width = offset;
              row_width += flat_arrow_width * f_arrows + arrow_width * n_arrows;

              // Push NSG Blocks
              var padding_y = 100;
              var padding_x = 70;

              var flat_arrow_padding = 100;
              var normal_arrow_padding = 150;
              var padding_between_nsgs = 120;

              var nsg_blocks = [];
              var nsg_map = _.groupBy(arrows, "nsg_id");

              // Start with offset
              let x = offset;
              // Calculate positions and push them to NSG blocks
              _.each(nsg_map, function (group, nsg_id) {
                // Calculate Arrow positions
                group.forEach((arrow, i) => {
                  const position = {
                    x,
                    y: arrow["lower_pos"] * row_height + view_height,
                    w: arrow["size"] === 0 ? flat_arrow_width : arrow_width,
                    h: row_height * (arrow["size"] + 1),
                  };

                  // Assign to existing arrow object
                  Object.assign(arrow, position);

                  // Adjust X
                  if (arrow["size"] === 0) {
                    x += flat_arrow_width;
                  } else {
                    x += arrow_width;
                  }
                });

                // Add some space after NSG
                x += padding_between_nsgs;
                row_width += padding_between_nsgs;

                var sorted = _.sortBy(group, (ar) => ar.x);
                var left_arrow = sorted[0];
                var right_arrow = sorted[sorted.length - 1];

                var padding_right = flat_arrow_padding + 2 * padding_x;
                if (right_arrow.size === 0) {
                  padding_right = normal_arrow_padding + 2 * padding_x;
                }

                // If AWS, nsg_map will have a key "undefined"
                // Hacky but it works and does not requires lot of changes
                if (nsg_id !== "undefined") {
                  nsg_blocks.push({
                    id: nsg_id,
                    x: left_arrow.x - padding_x,
                    y: -padding_y + view_height,
                    w: right_arrow.x - left_arrow.x + padding_right,
                    h: view.rows.length * row_height + 2 * padding_y,
                  });
                }
              });

              // Add co-ordinates
              rows.forEach((row, index) => {
                const position = {
                  id: row["id"],
                  name: row["id"],
                  x: 0,
                  y: row_height * index + view_height,
                  w: row_width,
                  h: row_height,
                };

                // Assign new properties
                Object.assign(row, position);
              });

              rows = rows.filter((row) => row.type !== "blank")

              // Push to final list
              all_rows = all_rows.concat(rows);
              all_arrows = all_arrows.concat(arrows);
              all_nsg_blocks = all_nsg_blocks.concat(nsg_blocks);

              // Adjust view height
              view_height += row_height * rows.length + view_padding;
            });

            // Group everything by network_id and add name label positions
            let network_group_labels = [];
            _.forEach(_.groupBy(all_rows, "network_id"), function(rows, group_id) {
              let label = { text: rows[0].network_name, x: 60, y: null, w: rows[0].w, h: rows[0].h }
              _.each(rows, function(row) {
                if(label.y === null || row.y < label.y) label.y = row.y;
              });

              // Pad it out
              label.y -= (label.h - 80);

              network_group_labels.push(label);
            });

            // Finally all the layout information to the view
            const positions = {
              rows: all_rows,
              arrows: all_arrows,
              nsg_blocks: all_nsg_blocks,
              labels: network_group_labels
            };
            const { environment } = ctrl;
            const { current_view } = environment;

            scope.$emit("view:positioned", current_view.type, positions);
            return positions;
          };

          $timeout(function () {
            ctrl.position();
          });


          ctrl.count += 1
          // Listen to the view options hide all toggle
          $rootScope.$on("view:hide_all", function (event, hide) {
            // Basically check if we need to trigger change
            if ((hide && !ctrl.hidden) || (!hide && ctrl.hidden)) {
            // Reposition
            const positions = ctrl.position();

            // Reset resources
            const { current_view } = ctrl.environment;
            current_view.model.resourceCells = [];

            // and load again
            current_view.load_with_positions(ctrl.environment, positions);
            $rootScope.$broadcast("view:modified", current_view);
            }
          });
        },
      };
    },
  ]);
