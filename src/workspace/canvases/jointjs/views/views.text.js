angular.module('designer.workspace.canvases.jointjs.views.text', [])
.service('TextView', [function() {
  return joint.dia.ElementView.extend({

    updateTheme: function() {
      this.model.updateTheme();
    },

    pointermove: function(evt, x, y) {
      // If the paper is locked then do nothing
      if(this.paper.locked) return;

      joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
    }
  });
}]);
