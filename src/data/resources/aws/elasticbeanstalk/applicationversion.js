angular.module('designer.model.resources.aws.elasticbeanstalk.applicationversion', ['designer.model.resource'])
  .factory('AWS_ElasticBeanstalk_ApplicationVersion', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELASTICBEANSTALK APPLICATION VERSION';
        resource.status_list = {
          "processed": "good",
          "unprocessed": "stopped",
          "failed":  "bad",
          "processing": "warn",
          "building": "warn"
        };

        resource.info = function() {
          var info = {};

          info.beanstalk_environment = this.getElasticBeanstalkEnvironment();
          info.application = this.getElasticBeanstalkApplication();

          return info;
        };

        resource.getElasticBeanstalkEnvironment = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment")[0];
        };

        resource.getElasticBeanstalkApplication = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment")[0];
        };

        return resource;
      }
    }
  }]);
