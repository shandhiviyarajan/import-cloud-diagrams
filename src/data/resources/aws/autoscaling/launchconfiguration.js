angular.module('designer.model.resources.aws.autoscaling.launch_configuration', ['designer.model.resource'])
  .factory('AWS_AutoScalingLaunchConfiguration', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LAUNCH CONFIGURATION';

        resource.info = function() {
          var info = {};

          info.autoscaling_group = this.getAutoscalingGroup();

          return info;
        };

        resource.getAutoscalingGroup = function() {
          return environment.connectedTo(this, "Resources::AWS::AutoScaling::AutoScalingGroup")[0];
        };

        resource.highlightableConnections = function() {
          return [this.getAutoscalingGroup()];
        };

        return resource;
      }
    }
  }]);
