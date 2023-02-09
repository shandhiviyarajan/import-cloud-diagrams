angular.module('designer.model.resources.aws.waf.rule_group', ['designer.model.resource'])
  .factory('AWS_WAFRuleGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WAF RULE GROUP';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
