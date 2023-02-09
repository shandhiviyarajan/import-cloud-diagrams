angular.module('designer.workspace.views.infrastructure.ibm.shapes.vpc', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('IBMVpcElement', ["ContainerElement", "ResourceImages", function(ContainerElement, ResourceImages) {

    return ContainerElement.extend({
      defaults: joint.util.defaultsDeep({
        shape: "ibm.vpc",
        size: { width: 600, height: 600 },
        z: 10,
        attrs: {
          '.title': { fill: '#979797' },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 }
        }
      }, ContainerElement.prototype.defaults),

      updateContainerText: function(paper) {
        var resource = this.get("resource");

        this.attr(".title/text", (resource.name || ""));
        this.attr(".description1/text", (resource.cidr_block || ""));
      },

      updateTheme: function() {
        var resource = this.get("resource");
        resource.setImageUrl();

        var style = ResourceImages.getStyle("ibm", this.attributes.shape); // VpcElement
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      }
    });
  }]);
