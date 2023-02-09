angular.module('designer.workspace.canvases.jointjs.handler.selection', [])
  .factory('SelectionHandler', [function() {
    function SelectionHandler(paper) {
      this.selected_cells = [];
      this.paper = paper;
    }

    SelectionHandler.prototype.deselectCells = function() {
      if(this.selected_cells.length) {
        _.each(this.selected_cells, function(cell) {
          cell.deselect();
          this.paper.hideLinks(cell.model);
        }.bind(this));

        this.selected_cells = [];
      }
    };

    SelectionHandler.prototype.selectCell = function(cellView, instant) {
      var selected = this.selected_cells;
      this.deselectCells();

      if(_.includes(selected, cellView)) return;

      // If the resource has multiple positions make sure we select them all
      var resource = cellView.model.get("resource");
      var views = resource ? _.map(this.paper.model.getCellsByResourceId(resource.id), function(cell) { return this.paper.findViewByModel(cell) }.bind(this)) : [];

      // Select em all
      _.each(views, function(v) {
        this.selected_cells.push(v);
        v.select(instant);
        this.paper.showLinks(v.model);
      }.bind(this));
    };

    SelectionHandler.prototype.cancelSelection = function(evt, x, y) {
      this.deselectCells();
    };

    // In case the design refreshes and we lose focus on the selected element
    SelectionHandler.prototype.refreshSelected = function() {
      if(this.selected_cells.length == 0) return;

      var resource_id = this.selected_cells[0].model.resource_id;
      var cells = this.paper.model.getCellsByResourceId(resource_id);
      var cellView = this.paper.findViewByModel(cells[0]);

      this.selectCell(cellView, true);
    };

    return SelectionHandler;
  }]);
