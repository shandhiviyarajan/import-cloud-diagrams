angular.module('designer.workspace.views.infrastructure.ibm.shapes.subnet',
  ['designer.workspace.canvases.jointjs.shapes.container', 'designer.workspace.views.infrastructure.ibm.views.subnet'])
  .service('IBMSubnetElement', ["ContainerElement", "IBMSubnetView", "ResourceImages", function(ContainerElement, IBMSubnetView, ResourceImages) {

    return ContainerElement.extend({
      defaults: joint.util.defaultsDeep({
        shape: "ibm.subnet",
        size: { width: 200, height: 200 },
        z: 20,
        attrs: {
          '.title': { fill: '#979797' },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 1, rx: 5, ry: 5, fill: "#FFFFFF" }
        }
      }, ContainerElement.prototype.defaults),

      updateTheme: function() {
        var resource = this.get("resource");
        resource.setImageUrl();
        var style = ResourceImages.getStyle("ibm", this.attributes.shape);
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      },

      updateContainerText: function(paper) {
        var resource = this.get("resource");

        var name = resource.name || "";
        var desc = resource.cidr_block || "";

        if(name !== resource.provider_id) {
          desc = resource.provider_id + " - " + desc;
        }

        this.attr(".title/text", name);
        this.attr(".description1/text", desc);
      }
    });
  }]);
