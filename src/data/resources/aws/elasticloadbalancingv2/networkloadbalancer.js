angular.module('designer.model.resources.aws.elastic_load_balancing_v2.network_load_balancer', [
  'designer.model.resource',
  'designer.model.resources.aws.elastic_load_balancing_v2.application_load_balancer'
])
  .factory('AWS_NetworkLoadBalancer', ["AWS_ApplicationLoadBalancer", function(AWS_ApplicationLoadBalancer) {
    return {
      load: function(resource, environment) {
        resource = AWS_ApplicationLoadBalancer.load(resource, environment);
        resource.type_name = "NETWORK LOAD BALANCER";
        
        return resource;
      }
    }
  }]);
