angular.module('designer.workspace.views.infrastructure.aws.shapes.subnet',
  ['designer.workspace.canvases.jointjs.shapes.container', 'designer.workspace.views.infrastructure.aws.views.subnet'])
  .service('SubnetElement', ["ContainerElement", "AwsSubnetView", "ResourceImages", function(ContainerElement, AwsSubnetView, ResourceImages) {
    var prebuilt_markup = V('<g>' +
      '<g class="scalable">' +
      '<rect class="mainRect" />' +
      '</g>' +
      '<text class="description1"/>' +
      '<text class="title"/>' +
      '<foreignObject class="subnetGroupDisplay">' +
      '<div class="subnetGroupContainer" xmlns="http://www.w3.org/1999/xhtml">' +
      '</div>' +
      '</foreignObject>' +
      '</g>');

    return ContainerElement.extend({
      view: AwsSubnetView,
      prebuilt_markup: prebuilt_markup,
      defaults: joint.util.defaultsDeep({
        shape: "aws.subnet",
        size: { width: 200, height: 200 },
        z: 20,
        attrs: {
          '.title': { fill: '#979797' },
          '.description1': { fill: '#979797' },
          '.description2': { fill: '#979797' },
          '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 1, rx: 5, ry: 5, fill: "#FFFFFF" },
          '.subnetGroupDisplay': { ref: '.mainRect', 'ref-x': 0, 'ref-y': 0.9999999, x: 1, y: -150, "ref-width": '96%', height: 100 }
        }
      }, ContainerElement.prototype.defaults),

      updateTheme: function() {
        var resource = this.get("resource");
        resource.setImageUrl();
        var style = ResourceImages.getStyle("aws", this.attributes.shape);
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
