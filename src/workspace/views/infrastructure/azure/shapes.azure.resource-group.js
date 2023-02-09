angular.module('designer.workspace.views.infrastructure.azure.shapes.resource-group', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('AzureResourceGroupElement', ["ContainerElement", "ResourceImages", function(ContainerElement, ResourceImages) {
    return ContainerElement.extend({
      defaults: joint.util.defaultsDeep({
        shape: "azure.resource-group",
        size: { width: 200, height: 200 },
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

        var name = resource.name || "";
        // var desc = resource.address_space_prefix || "";

        this.attr(".title/text", name);
        // this.attr(".description1/text", desc);
      },

      updateTheme: function() {
        var style = ResourceImages.getStyle("azure", this.attributes.shape);
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      }
    });
  }]);
