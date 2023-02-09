angular.module('designer.workspace.views.container.shapes.kubernetes.service',
  ['designer.workspace.canvases.jointjs.shapes.container'])
.service('KubeServiceElement', ["ContainerElement", function(ContainerElement) {
  var prebuilt_markup = V('<g>' +
    '<g class="scalable">' +
    '<rect class="mainRect" />' +
    '</g>' +
    '<use/>' +
    '<text class="label1"/>' +
    '<text class="label2"/>' +
    '<text class="label3"/>' +
    '</g>');

  return ContainerElement.extend({
    prebuilt_markup: prebuilt_markup,
    markup: " ",
    defaults: joint.util.defaultsDeep({
      shape: "aws.subnet",
      size: { width: 200, height: 200 },
      z: 20,
      attrs: {
        '.label1': { 'font-size': 12, x: 55, y: 19, fill: 'black', text: '', ref: '.mainRect' },
        '.label2': { 'font-size': 12, x: 55, y: 36, fill: 'black', text: '', ref: '.mainRect' },
        '.label3': { 'font-size': 12, x: 55, y: 53, fill: 'black', text: '', ref: '.mainRect' },
        'use': { 'width': 40, 'height': 40, 'x':5, 'y':10 },
        '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 1, rx: 5, ry: 5, fill: "#FFFFFF" }
      }
    }, ContainerElement.prototype.defaults),

    updateTheme: function() {
      var resource = this.get("resource");
      resource.setImageUrl();
      this.attr("use/href", resource.image);
    },

    updateContainerText: function(paper) {
      var resource = this.get("resource");
      var label1 = resource.name;
      var label2 = resource.cluster_ip;
      var label3 = resource.service_type;

      if(label1.length > 30) {
        label1 = label1.substring(0, 29) + "...";
      }

      this.attr(".label1/text", label1);
      this.attr(".label2/text", label2);
      this.attr(".label3/text", label3);
    }
  });
}]);
