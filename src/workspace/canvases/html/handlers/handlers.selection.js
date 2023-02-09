angular.module('designer.workspace.canvases.html.handler.selection', [])
  .factory('HtmlSelectionHandler', [function() {
    function SelectionHandler(diagram) {
      this.selected_elements = [];
      this.diagram = diagram;
    }

    SelectionHandler.prototype.deselectElements = function() {
      if(this.selected_elements.length) {
        _.each(this.selected_elements, function(el) {
          el.deselect();
        }.bind(this));

        this.selected_elements = [];
      }
    };

    SelectionHandler.prototype.selectElement = function(el, instant) {
      var selected = this.selected_elements;
      this.deselectElements();

      if(_.includes(selected, el)) return;

      // If the resource has multiple positions make sure we select them all
      // var resource = el.resource;
      // var views = _.map(this.diagram.model.getCellsByResourceId(resource.id), function(cell) { return this.diagram.findViewByModel(cell) }.bind(this));

      // TODO: do we need to handle multiple selects?
      this.selected_elements.push(el);
      el.select(instant);

      // // Select em all
      // _.each(views, function(v) {
      //   this.selected_elements.push(v);
      //   v.select(instant);
      // }.bind(this));
    };

    SelectionHandler.prototype.cancelSelection = function(evt, x, y) {
      this.deselectElements();
    };

    // In case the design refreshes and we lose focus on the selected element
    // SelectionHandler.prototype.refreshSelected = function() {
    //   if(this.selected_elements.length == 0) return;
    //
    //   var resource_id = this.selected_elements[0].model.resource_id;
    //   var cells = this.diagram.model.getCellsByResourceId(resource_id);
    //   var cellView = this.diagram.findViewByModel(cells[0]);
    //
    //   this.selectCell(cellView, true);
    // };

    return SelectionHandler;
  }]);
