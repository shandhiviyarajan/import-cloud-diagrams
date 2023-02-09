angular.module('designer.workspace.views.container.shapes.aws.service',
  ['designer.workspace.canvases.jointjs.shapes.container'])
.service('AWSServiceElement', ["ContainerElement", function(ContainerElement) {
  var prebuilt_markup = V('<g>' +
    '<g class="scalable">' +
    '<rect class="mainRect" />' +
    '</g>' +
    '<text class="type"/>' +
    '<text class="status"/>' +
    '<foreignObject class="infoDisplay">' +
    '<div xmlns="http://www.w3.org/1999/xhtml">' +
    '<div class="details" style="height:20px; direction: rtl; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>' +
    '</div>' +
    '</foreignObject>' +
    '<text class="title"/>' +
    '</g>');

  return ContainerElement.extend({
    prebuilt_markup: prebuilt_markup,
    markup: " ",
    defaults: joint.util.defaultsDeep({
      shape: "aws.subnet",
      size: { width: 200, height: 200 },
      z: 20,
      attrs: {
        '.title': { fill: '#979797' },
        '.details': { fill: '#979797' },
        '.status': { 'font-size': 12, x: -20, y: 20, "text-anchor": "end", fill: 'green', text: '', ref: '.mainRect', 'ref-x': 0.9999999, 'ref-y': 0.0001 },
        '.type': { 'font-size': 12, x: 10, y: 20, fill: 'blue', text: '', ref: '.mainRect' },
        '.infoDisplay': { 'font-size': 11, x: -20, y: -39, width: 360, height: 15, "text-anchor": "end", ref: '.mainRect', 'ref-y': 0.9999999, 'ref-width': 1 },
        '.mainRect': { stroke: '#0e7fba', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, fill: "#FFFFFF" }
      }
    }, ContainerElement.prototype.defaults),

    updateTheme: function() {
      var resource = this.get("resource");
    },

    updateContainerText: function(paper) {
      var resource = this.get("resource");

      var name = resource.name || "";
      var desc = "";
      var status = resource.status || "";
      var el = paper.findViewByModel(this).el;

      if(name !== resource.provider_id) {
        desc = resource.provider_id;
      }

      $(el).find('.details').text(desc);
      this.attr(".title/text", name);
      this.attr(".status/text", status);
      this.attr(".type/text", resource.launch_type || "");
    }
  });
}]);
