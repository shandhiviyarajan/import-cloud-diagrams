angular.module('designer.model.resources.aws.waf.rule', ['designer.model.resource'])
  .factory('AWS_WAFRule', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WAF RULE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
