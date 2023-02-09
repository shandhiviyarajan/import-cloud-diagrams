angular.module('designer.workspace.sharer', [
  "designer.app-scope",
  "designer.configuration"
])
.directive('sharer', ["$window", "$appScope", "DesignerConfig", "$timeout", function($window, $appScope, DesignerConfig, $timeout) {
  return {
    templateUrl: '/designer/workspace/controls/sharer.html',
    replace: true,
    link: {
      post: function(scope, element, attrs, ctrl) {
        scope.show_share = false;
        scope.allow_embed = DesignerConfig.get("allowEmbed");
        scope.embeddable_host = DesignerConfig.get("embeddableHost");
        scope.embed_code = null;
        scope.loading_embed = false;
        scope.embed_error = false;
        scope.copy_state = { result: null };

        scope.toggleShareOptions = function() {
          scope.show_share = !scope.show_share;

          scope.show_share ?
            angular.element($window).on("click", scope.handleWindowClick) :
            angular.element($window).off("click", scope.handleWindowClick);
        };

        scope.loadEmbedCode = function() {
          scope.$emit("embed:load");
          scope.loading_embed = true;
          scope.embed_error = false;
        };

        scope.copyEmbedCode = function() {
          var content = angular.element("#embed-code-display").text().trim();
          navigator.clipboard.writeText(content).then(function() {
            scope.setCopyResult(true);
          }, function() {
            scope.setCopyResult(false);
          });
        };

        scope.setCopyResult = function(r) {
          $appScope.safeApply(function() {
            scope.copy_state.result = r;
          }, scope);

          $timeout(function() {
            scope.copy_state.result = null;
          }, 2000);
        }

        scope.upgradeAccount = function() {
          scope.$emit("trial:upgrade");
        };

        scope.$on("embed:loaded", function(e, code) {
          scope.embed_code = code;
          scope.loading_embed = false;
        });

        scope.$on("embed:error", function() {
          scope.loading_embed = false;
          scope.embed_error = true;
        });

        scope.$on("revision:selected", function() {
          scope.embed_code = null;
          scope.loading_embed = false;
          scope.embed_error = false;
        });

        scope.handleWindowClick = function(event) {
          var target = $(event.target);

          if (!target.parents('#share-options').length) {
            $appScope.safeApply(function() {
              scope.toggleShareOptions();
            }, scope);
          }
        }
      }
    }
  }
}]);
