angular.module('designer.workspace.sidebar', [
  "designer.attributes",
  'designer.workspace.views.selector',
  'designer.workspace.views.picker',
  'designer.workspace.revision.selector',
  'designer.configuration'
])
.directive('sidebar', ["DesignerConfig", function(DesignerConfig) {
    return {
      templateUrl: '/designer/workspace/controls/sidebar.html',
      replace: true,
      link: {
        post: function(scope, element, attrs, ctrl) {
          scope.selected_tab = "attributes";
          scope.show_revisions = DesignerConfig.get("showRevisions");
        }
      }
    }
  }]);
