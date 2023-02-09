angular.module('designer.workspace.layout.container.position.hex', [])
.service('ContainerLayoutHexPosition', [function() {
  const CELL_HEIGHT = 100;
  const CELL_WIDTH = 86.6;

  function hex_radius(cell_count) {
    let radius = 1;
    let max = 1;

    while (max < cell_count) {
      radius++;
      max = radius * (radius - 1) * 3 + 1
    }

    return radius;
  }

  function cluster_cells(start_x, start_y, count) {
    let x = start_x;
    let y = start_y;
    let angle = Math.PI / 3;
    let dist = Math.sin(angle) * 100;
    let side = 0;
    let list = [];
    list.push({x, y});
    count--;

    while (count > 0) {
      let t = 0;

      while (t < Math.floor((side + 4) / 6) + (side % 6 === 0 ? 1 : 0) && count > 0) {
        y = y - dist * Math.cos(side * angle);
        x = x - dist * Math.sin(side * angle);
        list.push({x, y});
        count--;
        t++;
      }

      side++
    }

    return list;
  }

  return {
    position: function(container, max_cells, config={}) {
      let radius = hex_radius(max_cells);
      let center_x = (radius * CELL_WIDTH) - (CELL_WIDTH / 2);
      let center_y = (radius * CELL_HEIGHT) - (CELL_HEIGHT / 2);
      let cell_positions = cluster_cells(center_x, center_y, max_cells);

      // Add the cells
      let cells = [];

      _.each(cell_positions, (p) => {
        let cell = container.cells.shift();

        cells.push({
          x: p.x,
          y: p.y,
          w: CELL_WIDTH,
          h: CELL_HEIGHT,
          id: cell ? cell.id : "empty"
        })
      });

      container.x = 0;
      container.y = 0;
      container.h = center_y * 2 + CELL_HEIGHT;
      container.w = center_x * 2 + CELL_WIDTH;
      container.cells = cells;

      // Check config
      // TODO: center the hexes?
      if (config["min_width"] && container.w < config["min_width"]) {
        container.w = config.min_width
      }

      if (config["min_height"] && container.h < config["min_height"]) {
        container.h = config.min_height
      }

      return container;
    }
  }
}]);
