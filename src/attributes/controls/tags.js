angular.module('designer.attributes.tags', [])
  .directive('resourceTags', [function() {
    return {
      templateUrl: '/designer/attributes/controls/tags.html',
      link: function (scope, element, attrs) {
        scope.$watch("selected_resource", function(val) {
          if(val && val["tags"]) {
            if ($.isArray(val["tags"])) {
              var hash_tags = {};
              var filtered_tags = _.reject(val["tags"], function(tag) { return (tag["key"] || "").startsWith("aws:cloudformation") });
              _.each(filtered_tags, function(at){ hash_tags[at.key] = at.value });
              scope.tags = hash_tags;
            }
            else {
              scope.tags = val["tags"];
            }
          }
          else {
            scope.tags = {};
          }

          scope.has_tags = _.size(scope.tags);
        });
      }
    }
  }]);
