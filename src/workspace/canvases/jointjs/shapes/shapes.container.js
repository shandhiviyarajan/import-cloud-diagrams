angular.module('designer.workspace.canvases.jointjs.shapes.container', ['designer.workspace.canvases.jointjs.views.container'])
.service('ContainerElement', ["ContainerView", function(ContainerView) {
  var prebuilt_markup = V('<g>' +
    '<g class="scalable">' +
    '<rect class="mainRect" />' +
    '</g>' +
    '<text class="description1"/>' +
    '<text class="title"/>' +
    '</g>');

  return joint.shapes.basic.Rect.extend({
    view: ContainerView,
    prebuilt_markup: prebuilt_markup,
    markup: " ",
    selectBorderColor: "#8A8A8A",
    container: true,
    defaults: joint.util.defaultsDeep({
      type: 'container',
      size: { width: 300, height: 300 },
      attrs: {
        'g': {
          'ref-width': '100%',
          'ref-height': '100%',
          opacity: 1
        },
        '.title': { 'font-size': 14, x: -20, y: -10, "text-anchor": "end", fill: 'red', text: '', ref: '.mainRect', 'ref-x': 0.9999999, 'ref-y': 0.9999999 },
        '.description1': { 'font-size': 11, x: -20, y: -25, "text-anchor": "end", fill: 'blue', text: '', ref: '.mainRect', 'ref-x': 0.9999999, 'ref-y': 0.9999999 }
        //'.description2': { 'font-size': 11, x: 10, y: -10, fill: 'blue', text: '', ref: '.mainRect', 'ref-x': 0.00001, 'ref-y': 0.9999999 }
      }
    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {
      joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    // Override the original method as it seems to save links and then borks when trying to translate them
    getEmbeddedCells: function() {
      if (this.collection) {
        return _.compact(_.map(this.get('embeds') || [], function(cellId) {
          var cell = this.collection.get(cellId);
          if(_.includes(["resource", "container"], cell.get("type"))) {
            return cell;
          }
        }.bind(this)));
      }
      return [];
    },

    updateTheme: function() {
      var resource = this.get("resource");
      if(resource) {
        resource.setImageUrl();
      }
    },

    updateContainerText: function(paper) {
      console.log("Override me!");
    }
  });
}]);
