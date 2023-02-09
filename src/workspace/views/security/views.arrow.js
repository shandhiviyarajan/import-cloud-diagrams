angular.module('designer.workspace.views.security.views.arrow', ['designer.workspace.canvases.jointjs.views.container'])
.service('ArrowView', ["ContainerView", function(ContainerView) {
  return ContainerView.extend({
    select: function(instant) {
      var opts = instant ? { delay: 0, duration: 0 }  :
        { delay: 0, duration: 150 };

      opts.valueFunction = joint.util.interpolate.hexColor;
      this.containerBorderColor = this.model.attr(".mainRect/stroke");
      this.model.transition('attrs/.mainRect/stroke-width', 5, { delay: 0, duration: 150 });

      this.selected = true;
    },

    deselect: function() {
      var opts = {
        delay: 0,
        duration: 150,
        timingFunction: joint.util.timing.linear
      };

      opts.valueFunction = joint.util.interpolate.hexColor;
      this.model.transition('attrs/.mainRect/stroke-width', 2, { delay: 0, duration: 150 });

      this.selected = false;
    },
  });
}]);
