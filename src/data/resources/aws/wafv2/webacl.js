angular.module('designer.model.resources.aws.wafv2.web_acl', ['designer.model.resource'])
  .factory('AWS_WAFV2WebACL', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'WAF WEB ACL';

        resource.info = function() {
          var info = {};

          info.load_balancers = this.getAllLoadBalancers();
          // TODO: can connect to cloudfront and api gateway too

          return info;
        };

        resource.getAllLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer")
            .concat(environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer"));
        };

        return resource;
      }
    }
  }]);
