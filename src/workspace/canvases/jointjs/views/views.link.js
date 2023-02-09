angular.module('designer.workspace.canvases.jointjs.views.link', [])
.service('LinkView', [function() {
  return joint.dia.LinkView.extend({
    initialize: function() {
      joint.dia.LinkView.prototype.initialize.apply(this, arguments);

      this.options.interactive = false;

      // Hide em all by default
      this.$el.hide();
    },

    renderStringMarkup: function() {
      var children = this.model.prebuilt_markup.clone();
      // custom markup may contain only one children
      if (!Array.isArray(children)) children = [children];
      // Cache all children elements for quicker access.
      var cache = this._V; // vectorized markup;
      for (var i = 0, n = children.length; i < n; i++) {
        var child = children[i];
        var className = child.attr('class');
        if (className) {
          cache[$.camelCase(className)] = child;
        }
      }
      // partial rendering
      this.renderTools();
      this.renderVertexMarkers();
      this.renderArrowheadMarkers();
      this.vel.append(children);
    },

    select: function() {
      this.model.transition('attrs/.selected/stroke-width', 15, {
        delay: 0,
        duration: 150,
        timingFunction: function(t) { return t*t; },
        valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
      });
    },

    deselect: function() {
      this.model.transition('attrs/.selected/stroke-width', 3, {
        delay: 0,
        duration: 150,
        timingFunction: function(t) { return t*t; },
        valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
      });
    },

    update: function() {
      joint.dia.LinkView.prototype.update.apply(this, arguments);

      // Make sure we update the path of our selection node
      this._V.selected && this._V.selected.attr('d', this._V.connection.attr('d'));
    },

    getResource: function(section) {
      return this.paper.model.getCell(this.model.attributes[section].id).get("resource");
    }
  });
}]);
