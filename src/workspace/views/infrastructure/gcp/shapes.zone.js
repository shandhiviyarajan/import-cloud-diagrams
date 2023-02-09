angular.module('designer.workspace.views.infrastructure.gcp.shapes.zone', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('GCPZoneElement', ["ContainerElement", "ResourceImages", function(ContainerElement, ResourceImages) {
    return ContainerElement.extend({
      defaults: joint.util.defaultsDeep({
        shape: "gcp.zone",
        size: { width: 200, height: 200 },
        z: 14,
        attrs: {
          '.title': { fill: '#979797' },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#000077', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 }
        }
      }, ContainerElement.prototype.defaults),

      updateContainerText: function(paper) {
        var resource = this.get("resource");
        this.attr(".title/text", (resource.name || ""));
      },

      updateTheme: function() {
        var style = ResourceImages.getStyle("gcp", this.attributes.shape);
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      }
    });
  }]);

