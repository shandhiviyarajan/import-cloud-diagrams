angular.module('designer.workspace.revision.selector', [])
.directive('revisionSelector', ["$rootScope", function($rootScope) {
    return {
      templateUrl: '/designer/workspace/controls/revision.selector.html',
      replace: true,
      link: {
        post: function(scope, element, attrs, ctrl) {
          scope.revisions = [];
          scope.loading = null;
          scope.loading_next = false;
          scope.page_token = null;

          scope.selectRevision = function(revision) {
            if(revision.id === scope.Designer.environment.current_revision.id) return;
            
            scope.Designer.environment.setCurrentRevision(revision.id);
            scope.loading = revision;

            $rootScope.$broadcast("revision:selected", revision.id);
          };

          scope.showNextRevisions = function() {
            scope.loading_next = true;
            $rootScope.$broadcast("revisions:show-all", { token: scope.page_token });
          };

          scope.$on("environment:reloaded",  function() {
            if(scope.loading) {
              scope.loading = null;
            }
            else {
              scope.revisions = [];
              scope.page_token = null;
              scope.showNextRevisions();
            }
          });

          scope.$on("revisions:loaded",  function(event, revisions) {
            scope.loading_next = false;
            scope.page_token = revisions["next_page_token"];
            scope.revisions = scope.revisions.concat(revisions.results);
          });

          // On load grab the revisions
          scope.showNextRevisions();
        }
      }
    }
  }]);
