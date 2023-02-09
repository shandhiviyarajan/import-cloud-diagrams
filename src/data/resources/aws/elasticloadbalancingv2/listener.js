angular.module('designer.model.resources.aws.elastic_load_balancing_v2.listener', ['designer.model.resource'])
  .factory('AWS_ALBListener', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LISTENER';

        resource.info = function() {
          var info = {};
          info.rules = this.getRules();
          info.load_balancers = this.getApplicationLoadBalancers().concat(this.getNetworkLoadBalancers());

          return info;
        };

        resource.getRules = function() {
          var val = _.map(environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::Rule"), function(rule){
            rule.loadData();
            return rule;
          });
          return val;
        };

        resource.getTargetGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::TargetGroup");
        };

        resource.getApplicationLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer");
        };

        resource.getNetworkLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer");
        };

        return resource;
      }
    }
  }]);
