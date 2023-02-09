angular.module('designer.workspace.views.container.shapes.namespace',
  ['designer.workspace.views.container.shapes.aws.service'])
.service('NamespaceElement', ["AWSServiceElement", function(AWSServiceElement) {
  return AWSServiceElement.extend({
    defaults: joint.util.defaultsDeep({
      z: 18
    }, AWSServiceElement.prototype.defaults),

    updateContainerText: function(paper) {
      var resource = this.get("resource");

      var name = resource.name || "";
      var status = resource.status || "";

      this.attr(".title/text", name);
      this.attr(".status/text", status);
      this.attr(".type/text", resource.launch_type || "");
    }
  });
}]);
