angular.module('designer.workspace.views.infrastructure.azure.shapes.subnet', ['designer.workspace.canvases.jointjs.shapes.container', 'designer.workspace.views.infrastructure.azure.views.subnet'])
  .service('AzureSubnetElement', ["ContainerElement", "AzureSubnetView", "ResourceImages", function(ContainerElement, AzureSubnetView, ResourceImages) {
    var prebuilt_markup = V('<g>' +
      '<g class="scalable">' +
      '<rect class="mainRect"/>' +
      '</g>' +
      '<foreignObject class="securityGroupDisplay">' +
      '<div class="securityGroupContainer" xmlns="http://www.w3.org/1999/xhtml">' +
      '</div>' +
      '</foreignObject>' +
      '<text class="description1"/>' +
      '<text class="title"/>' +
      '</g>');

    return ContainerElement.extend({
      view: AzureSubnetView,
      prebuilt_markup: prebuilt_markup,
      markup: "  ",
      defaults: joint.util.defaultsDeep({
        shape: "azure.subnet",
        size: { width: 200, height: 200 },
        z: 20,
        attrs: {
          '.title': { fill: '#979797' },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 },
          '.securityGroupDisplay': { ref: '.mainRect', 'ref-x': 0.99999999, 'ref-y': 0, x: -48, y: 8, width: "40px", height: "80px" }
        }
      }, ContainerElement.prototype.defaults),

      updateTheme: function() {
        var resource = this.get("resource");
        resource.setImageUrl();
        var style = ResourceImages.getStyle("azure", this.attributes.shape);
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      },

      updateContainerText: function(paper) {
        var resource = this.get("resource");

        var name = resource.name || "";
        var desc = resource.address_prefix || "";

        this.attr(".title/text", name);
        this.attr(".description1/text", desc);
      }
    });
  }]);
