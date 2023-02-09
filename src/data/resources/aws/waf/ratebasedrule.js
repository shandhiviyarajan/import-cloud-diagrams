angular.module('designer.model.resources.aws.waf.rate_based_rule', ['designer.model.resource'])
  .factory('AWS_WAFRateBasedRule', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WAF RATE BASED RULE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
