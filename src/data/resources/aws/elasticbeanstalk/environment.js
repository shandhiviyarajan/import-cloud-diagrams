angular.module('designer.model.resources.aws.elasticbeanstalk.environment', ['designer.model.resource'])
  .factory('AWS_ElasticBeanstalk_Environment', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELASTICBEANSTALK ENVIRONMENT';
        resource.status_list = {
          "launching": "warn",
          "updating": "warn",
          "ready": "good",
          "terminating": "warn",
          "terminated": "stopped"
        };

        resource.health_list = {
          "Green": "good",
          "Yellow": "warn",
          "Red": "bad",
          "Grey": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.load_balancers = this.getLoadBalancers();
          info.instances = this.getInstances();
          info.autoscaling_group = this.getAutoscalingGroup();
          info.application = this.getApplication();
          info.application_version = this.getApplicationVersion();
          info.environment_map = {};

          _.each(this.getEnvironments(), function(e) {
            info.environment_map[e.environment_name] = e;
          });

          return info;
        };

        resource.getLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancing::LoadBalancer").concat(
            environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer")
          ).concat(
            environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer")
          );
        }

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Instance");
        };

        resource.getAutoscalingGroup = function() {
          return environment.connectedTo(this, "Resources::AWS::AutoScaling::AutoScalingGroup")[0];
        };

        resource.getApplication = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Application")[0];
        };

        resource.getApplicationVersion = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::ApplicationVersion")[0];
        };

        resource.getEnvironments = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment");
        };

        return resource;
      }
    }
  }]);
