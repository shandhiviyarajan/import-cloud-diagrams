angular.module('designer.workspace.views.container.shapes.cluster',
  ['designer.workspace.canvases.jointjs.shapes.container'])
.service('ClusterElement', ["ContainerElement", function(ContainerElement) {
  var prebuilt_markup = V('<g>' +
    '<g class="scalable">' +
    '<rect class="mainRect" />' +
    '</g>' +
    '<text class="status"/>' +
    '<text class="description1"/>' +
    '<text class="title"/>' +
    '</g>');

  return ContainerElement.extend({
    prebuilt_markup: prebuilt_markup,
    markup: " ",
    defaults: joint.util.defaultsDeep({
      shape: "aws.subnet",
      size: { width: 200, height: 200 },
      z: 15,
      attrs: {
        '.title': { fill: '#979797' },
        '.description1': { fill: '#979797' },
        '.description2': { fill: '#979797' },
        '.status': { 'font-size': 12, x: -20, y: 20, "text-anchor": "end", fill: 'green', text: '', ref: '.mainRect', 'ref-x': 0.9999999, 'ref-y': 0.0001 },
        '.mainRect': { stroke: '#077a07', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 1, fill: "#FFFFFF" },
        '.subnetGroupDisplay': { ref: '.mainRect', 'ref-x': 0, 'ref-y': 0.9999999, x: 1, y: -55, "ref-width": '96%', "y-alignment": "top", height: 100 }
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

      if(name !== resource.provider_id && resource.type !== "Resources::Kubernetes::Cluster::Cluster") {
        desc = resource.provider_id;
      }

      this.attr(".title/text", name);
      this.attr(".description1/text", desc);
      this.attr(".status/text", status);
    }
  });
}]);
