angular.module('designer.workspace.views.infrastructure.aws.shapes.availability-zone', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('AZElement', ["ContainerElement", "ResourceImages", function(ContainerElement, ResourceImages) {
    return ContainerElement.extend({
      selectBorderColor: "#FF9900",
      defaults: joint.util.defaultsDeep({
        shape: "aws.availability-zone",
        size: { width: 200, height: 200 },
        z: 14,
        attrs: {
          '.title': { fill: '#FF9900', y: -10 },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#FFAD32', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 1, rx: 5, ry: 5, fill: "#F4F8FA" }
        }
      }, ContainerElement.prototype.defaults),

      updateContainerText: function(paper) {
        var resource = this.get("resource");
        this.attr(".title/text", (resource.name || ""));
      },

      updateTheme: function() {
        var style = ResourceImages.getStyle("aws", this.attributes.shape);
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      }
    });
  }]);
