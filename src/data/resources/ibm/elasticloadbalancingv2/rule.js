angular.module('designer.model.resources.ibm.elastic_load_balancing_v2.rule', ['designer.model.resource'])
  .factory('IBM_ALBRule', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function() {
          var info = {};

          return info;
        };

        // TODO: format condition info too? Maaaybe?
        resource.loadData = function() {
          _.each(this.actions, function(action, i){
            var config = {};
            if (action.type === 'forward'){
              config = action.forward_config;
            } else if (action.type === 'redirect'){
              config = action.redirect_config;
              this.actions[i].description = config["protocol"] + "://" + config["host"] + ":" + config["port"] + config["path"] + "?" + config["query"]
            } else if (action.type === 'fixed-response') {
              config = action.fixed_response_config;
              this.actions[i].description = config["status_code"]
            } else if (action.type === 'authenticate-cognito') {
              config = action.authenticate_cognito_config;
              this.actions[i].description = config["on_unauthenticated_request"]
            } else if (action.type ==='authenticate-oidc') {
              config = action.authenticate_oidc_config;
              this.actions[i].description = config["on_unauthenticated_request"]
            }
            this.actions[i].config = config

          }.bind(this));
        };

        resource.getTargetGroup = function() {
          return environment.connectedTo(this, "Resources::IBM::ElasticLoadBalancingV2::TargetGroup")[0];
        };


        return resource;
      }
    }
  }]);
