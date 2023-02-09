angular.module('designer.model.resources.ibm.elastic_load_balancing_v2.target_group', ['designer.model.resource'])
  .factory('IBM_ALBTargetGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET GROUP';

        resource.info = function() {
          var info = {};
          info.instances = this.getInstances();
          info.services = this.getECSServices();
          info.load_balancers = this.getApplicationLoadBalancers().concat(this.getNetworkLoadBalancers());
          
          return info;
        };

        resource.getApplicationLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::IBM::ElasticLoadBalancingV2::ApplicationLoadBalancer");
        };

        resource.getNetworkLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::IBM::ElasticLoadBalancingV2::NetworkLoadBalancer");
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Instance");
        };

        resource.getECSServices = function() {
          return environment.connectedTo(this, "Resources::IBM::ECS::Service");
        };

        return resource;
      }
    }
  }]);
