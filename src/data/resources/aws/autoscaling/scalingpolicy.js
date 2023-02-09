angular.module('designer.model.resources.aws.autoscaling.scaling_policy', ['designer.model.resource'])
  .factory('AWS_AutoScalingScalingPolicy', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SCALING POLICY';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
