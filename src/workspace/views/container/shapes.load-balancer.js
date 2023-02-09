angular.module('designer.workspace.views.container.shapes.load-balancer',
  ['designer.workspace.canvases.jointjs.shapes.container'])
.service('LoadBalancerElement', ["ContainerElement", function(ContainerElement) {
  var prebuilt_markup = V('<g>' +
    '<g class="scalable">' +
    '<rect class="mainRect" />' +
    '</g>' +
    '<use/>' +
    '<text class="label1"/>' +
    '<text class="label2"/>' +
    '<text class="info1"/>' +
    '<text class="info2"/>' +
    '</g>');

  return ContainerElement.extend({
    prebuilt_markup: prebuilt_markup,
    markup: " ",
    defaults: joint.util.defaultsDeep({
      shape: "aws.subnet",
      size: { width: 200, height: 200 },
      z: 25,
      attrs: {
        '.label1': { 'font-size': 12, x: 55, y: 21, fill: 'black', text: '', ref: '.mainRect' },
        '.label2': { 'font-size': 12, x: 55, y: 38, fill: 'black', text: '', ref: '.mainRect' },
        '.info1': { 'font-size': 12, x: 120, y: 21, fill: '#979797', text: '', ref: '.mainRect' },
        '.info2': { 'font-size': 12, x: 120, y: 38, fill: '#979797', text: '', ref: '.mainRect' },
        'use': { 'width': 40, 'height': 40, 'x':5, 'y':5 },
        '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 1, rx: 5, ry: 5, fill: "#FFFFFF" }
      }
    }, ContainerElement.prototype.defaults),

    updateTheme: function() {
      var resource = this.get("resource");
      resource.setImageUrl();
      this.attr("use/href", resource.image);
    },

    updateContainerText: function() {
      var resource = this.get("resource");
      var label1 = "Container";
      var label2 = "Port";
      var info1 = "";
      var info2 = "";

      // Get connection data
      var connection = _.find(resource.connections, function(c) {
        return c.remote_resource_type === "Resources::AWS::ElasticLoadBalancing::LoadBalancer" ||
          c.remote_resource_type === "Resources::AWS::ElasticLoadBalancingV2::TargetGroup"
      });

      // Build up some infooooooo container_name, container_port
      if (connection) {
        var data = connection["data"];
        info1 = data["container_name"];
        info2 = data["container_port"];
      }

      this.attr(".label1/text", label1);
      this.attr(".label2/text", label2);
      this.attr(".info1/text", info1);
      this.attr(".info2/text", info2);
    }
  });
}]);
