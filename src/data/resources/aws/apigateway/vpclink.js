angular.module('designer.model.resources.aws.apigateway.vpc_link', ['designer.model.resource'])
  .factory('AWS_VPCLink', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPC LINK';
        resource.status_list = {
          "available": "good",
          "pending": "warn",
          "deleting": "warn",
          "failed": "bad"
        };

        resource.info = function() {
          var info = {};

          info.load_balancers = this.getNetworkLoadBalancers().concat(this.getApplicationLoadBalancers());

          return info;
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
