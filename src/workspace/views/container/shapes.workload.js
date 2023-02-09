angular.module('designer.workspace.views.container.shapes.workload',
  ['designer.workspace.views.container.shapes.aws.service'])
.service('WorkloadElement', ["AWSServiceElement", function(AWSServiceElement) {
  return AWSServiceElement.extend({
    defaults: joint.util.defaultsDeep({
      z: 18
    }, AWSServiceElement.prototype.defaults),

    updateContainerText: function(paper) {
      var resource = this.get("resource");

      var name = resource.name || "";
      var desc = resource.type_name;
      var status = resource.status || "";
      var el = paper.findViewByModel(this).el;

      $(el).find('.details').text(desc);
      this.attr(".title/text", name);
      this.attr(".status/text", status);
      this.attr(".type/text", resource.launch_type || "");
    }
  });
}]);
