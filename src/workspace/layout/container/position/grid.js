angular.module('designer.workspace.layout.container.position.grid', [])
.service('ContainerLayoutGridPosition', [function() {
  const CONTAINER_PADDING = {top: 50, right: 20, bottom: 50, left: 20};

  // TODO: we should be able to define margin and padding for each element
  const CONTAINER_SPACING = 20;

  function translate_cell(cell, x, y, w, h) {
    if (cell.fit_to_width) {
      cell.w = w;
      cell.fit_to_width = false;
      // TODO: this is to handle load balancers in ECS. We need to handle this in the layout itself in future
      cell.style = { width: "100%", margin: 0, height: "50px" };
    }

    if (cell["cells"]) {
      _.each(cell.cells, (subcell) => translate_cell(subcell, x, y, w, h));
    }
  }

  return {
    position: function(container, config) {
      let cells = container.cells;
      let total_cells = cells.length;
      let container_spacing = config["container_spacing"] || CONTAINER_SPACING;

      // Determine columns and rows and knock up a grid
      let columns = Math.max(Math.ceil(total_cells / 5), 1);

      if (config["max_columns"] && config["max_columns"] < columns) {
        columns = config.max_columns
      }

      let rows = Math.max(Math.ceil(total_cells / columns), 1);

      // If they've set max_rows we need to rejig the logic
      if (config["max_rows"] && config["max_rows"] < rows) {
        rows = config.max_rows;
        columns = Math.ceil(total_cells / rows);
      }

      // Helpers for angular layout
      container.rows = _.map(new Array(rows), (x, i) => i );
      container.columns = _.map(new Array(columns), (x, i) => i );

      let cell_index = -1;
      let grid = [...Array(rows)].map(() => (
        [...Array(columns)].map(() => (
          (++cell_index) >= total_cells ? null : cells[cell_index]
        ))
      ));

      // Determine maximum height of rows
      let row_heights = [...Array(rows)].map(() => 0);
      let column_widths = [...Array(columns)].map(() => 0);
      _.each(grid, (row, row_index) => (
        _.each(row, (cell, column_index) => {
          if (!cell) return;

          row_heights[row_index] = Math.max(row_heights[row_index], cell.h);
          column_widths[column_index] = Math.max(column_widths[column_index], cell.w);
        })
      ));

      // Add container position
      container.w = CONTAINER_PADDING.left + (_.reduce(column_widths, (sum, val) => sum + val, 0)) + (container_spacing * (column_widths.length - 1)) + CONTAINER_PADDING.right;
      container.h = CONTAINER_PADDING.top + (_.reduce(row_heights, (sum, val) => sum + val, 0)) + (container_spacing * (row_heights.length - 1)) + CONTAINER_PADDING.bottom;

      // Set minimum dimensions
      // TODO: this is to account for empty containers atm, need to expand columns to fit I'm guessing?
      if (config["min_width"] && container.w < config["min_width"]) {
        container.w = config.min_width
      }

      if (config["min_height"] && container.h < config["min_height"]) {
        container.h = config.min_height
      }

      // Position everything else
      let current_row_offset = CONTAINER_PADDING.top;

      _.each(grid, (row, row_index) => {
        let current_column_offset = CONTAINER_PADDING.left;

        _.each(row, (cell, column_index) => {
          if (cell) {
            translate_cell(
              cell,
              current_column_offset,
              current_row_offset,
              column_widths[column_index],
              row_heights[row_index]
            )
          }

          current_column_offset += column_widths[column_index];

          if (!(column_index === column_widths.size - 1)) {
            current_column_offset += container_spacing;
          }
        });

        current_row_offset += row_heights[row_index];

        if (!(row_index === row_heights.size - 1)) {
          current_row_offset += container_spacing;
        }
      });

      return container;
    }
  }
}]);
