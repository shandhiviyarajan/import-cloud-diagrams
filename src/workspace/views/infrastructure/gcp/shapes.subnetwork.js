angular.module('designer.workspace.views.infrastructure.gcp.shapes.subnetwork', ['designer.workspace.canvases.jointjs.shapes.container', 'designer.workspace.views.infrastructure.gcp.views.subnetwork'])
  .service('GCPSubnetworkElement', ["ContainerElement", "GCPSubnetworkView", "ResourceImages", function(ContainerElement, GCPSubnetworkView, ResourceImages) {
    var prebuilt_markup = V('<g>' +
      '<g class="scalable">' +
      '<rect class="mainRect"/>' +
      '</g>' +
      '<text class="description1"/>' +
      '<text class="title"/>' +
      '</g>');

    return ContainerElement.extend({
      view: GCPSubnetworkView,
      prebuilt_markup: prebuilt_markup,
      markup: " ",
      defaults: joint.util.defaultsDeep({
        shape: "gcp.subnetwork",
        size: { width: 200, height: 200 },
        z: 20,
        attrs: {
          '.title': { fill: '#979797' },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 },
        }
      }, ContainerElement.prototype.defaults),

      updateTheme: function() {
        var resource = this.get("resource");
        resource.setImageUrl();
        var style = ResourceImages.getStyle("gcp", this.attributes.shape);
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      },

      updateContainerText: function(paper) {
        var resource = this.get("resource");

        var name = resource.name || "";
        var desc = resource.ip_cidr_range || "";

        this.attr(".title/text", name);
        this.attr(".description1/text", desc);
      }
    });
  }]);
