angular.module('designer.workspace.views.html.element', [])
  .factory("Element", [function() {
    return {
      load: function(options, resource) {
        var element = {};

        element.options = options || {};
        element.resource = resource;
        element.template = "<div></div>";
        element.el = null;

        // Geometry
        element.geometry = {
          x: options["x"],
          y: options["y"],
          w: options["w"],
          h: options["h"]
        };

        element.render = function() {
          this.el = $(this.template);
          this.el.css("position", "absolute");
          this.el.css("top", this.geometry.y + "px");
          this.el.css("left", this.geometry.x + "px");
          this.el.css("width", this.geometry.w + "px");
          this.el.css("height", this.geometry.h + "px");
          this.el.data("view", this);
        };

        return element;
      }
    }
  }]);
