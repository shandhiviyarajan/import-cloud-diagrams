angular.module('designer.model.resources.aws.waf.web_acl', ['designer.model.resource'])
  .factory('AWS_WAFWebACL', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WAF CLASSIC WEB ACL';

        resource.info = function() {
          var info = {};

          info.rules = this.getRuleInfo();
          info.load_balancers = this.getAllLoadBalancers();

          return info;
        };

        // Get all connections for rules and then grab the remote resource
        resource.getRuleInfo = function() {
          var rules = this.getAllRules();

          return _.map(this.rules, function(r) {
            r.rule = _.find(rules, function(x) { return x.provider_id === r.rule_id });

            return r;
          }.bind(this));
        };

        resource.getAllRules = function() {
          return environment.connectedTo(this, "Resources::AWS::WAF::RateBasedRule")
            .concat(environment.connectedTo(this, "Resources::AWS::WAF::Rule"))
            .concat(environment.connectedTo(this, "Resources::AWS::WAF::RuleGroup"));
        };

        resource.getAllLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer")
            .concat(environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer"));
        };


        return resource;
      }
    }
  }]);
