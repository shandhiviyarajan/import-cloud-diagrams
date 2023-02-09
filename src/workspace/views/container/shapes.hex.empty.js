angular.module('designer.workspace.views.container.shapes.hex.empty',
  ['designer.workspace.views.container.shapes.hex'])
.service('EmptyHexElement', ['HexElement', function(HexElement) {
  return HexElement.extend({
    defaults: joint.util.defaultsDeep({
      attrs: {
        'path': { "stroke": "#A5A5A5", "x": 0, "y": 0, "fill": "none", "stroke-width": 1, "stroke-dasharray": 5  }
      }
    }, HexElement.prototype.defaults),

    updateContainerText: function(paper) {
      // Do noooothing
    },

    updateTheme: function() {
      // Do nothing!
    }
  });
}]);
