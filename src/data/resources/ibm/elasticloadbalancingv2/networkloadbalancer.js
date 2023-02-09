angular.module('designer.model.resources.ibm.elastic_load_balancing_v2.network_load_balancer', [
  'designer.model.resource',
  'designer.model.resources.ibm.elastic_load_balancing_v2.application_load_balancer'
])
  .factory('IBM_NetworkLoadBalancer', ["IBM_ApplicationLoadBalancer", function(IBM_ApplicationLoadBalancer) {
    return {
      load: function(resource, environment) {
        resource = IBM_ApplicationLoadBalancer.load(resource, environment);
        resource.type_name = "NETWORK LOAD BALANCER";
        
        return resource;
      }
    }
  }]);
