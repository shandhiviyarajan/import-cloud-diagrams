angular.module('designer.model.resources.aws.elasticbeanstalk.application', ['designer.model.resource'])
  .factory('AWS_ElasticBeanstalk_Application', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELASTICBEANSTALK APPLICATION';

        resource.info = function() {
          var info = {};

          info.beanstalk_environment = this.getElasticBeanstalkEnvironment();

          return info;
        };

        resource.getElasticBeanstalkEnvironment = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment")[0];
        };

        return resource;
      }
    }
  }]);
