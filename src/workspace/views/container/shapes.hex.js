angular.module('designer.workspace.views.container.shapes.hex',
  ['designer.workspace.canvases.jointjs.shapes.resource', 'designer.workspace.views.container.views.hex'])
.service('HexElement', ['ResourceElement', "HexView", function(ResourceElement, HexView) {
  var prebuilt_markup = V('<g class="scalable">' +
    '<circle class="connectionPoint" />' +
    '<path d="M0 43.30127018922193L25 0L75 0L100 43.30127018922193L75 86.60254037844386L25 86.60254037844386Z"></path>' +
    '<text class="description1"/>' +
    '<text class="title"/>' +
    '</g>');

  return ResourceElement.extend({
    view: HexView,
    prebuilt_markup: prebuilt_markup,
    markup: " ",
    defaults: joint.util.defaultsDeep({
      size: { width: 100, height: 86.6 },
      attrs: {
        'path': { "stroke": "black", "x": 0, "y": 0, "fill": "none", "stroke-width": 1  }
      }
    }, ResourceElement.prototype.defaults),

    updateContainerText: function(paper) {
      ResourceElement.prototype.updateContainerText.apply(this, arguments);
    }
  });
}]);
