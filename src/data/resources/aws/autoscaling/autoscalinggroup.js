angular.module('designer.model.resources.aws.autoscaling.auto_scaling_group', ['designer.model.resource'])
  .factory('AWS_AutoScalingGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'AUTOSCALING GROUP';

        resource.has_badge = true;

        resource.info = function() {
          var info = {};

          info.instances = this.getInstances();
          info.scaling_policy = this.getScalingPolicy();
          info.launch_config = this.getLaunchConfiguration();
          info.beanstalk_environment = this.getElasticBeanstalkEnvironment();

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: "Min: " + this.min_size,
            info3: "Max: " + this.max_size
          }
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Instance");
        };

        resource.getElbs = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancing::LoadBalancer")
        };

        resource.getALBs = function() {
          var albs = [];
          var instances = this.getInstances();

          _.each(instances, function(instance) {
            albs = albs.concat(instance.getALBs());
          });

          return albs;
        };

        resource.getNLBs = function() {
          var nlbs = [];
          var instances = this.getInstances();

          _.each(instances, function(instance) {
            nlbs = nlbs.concat(instance.getNLBs());
          });

          return nlbs;
        };

        resource.getScalingPolicy = function() {
          return environment.connectedTo(this, "Resources::AWS::AutoScaling::ScalingPolicy")[0];
        };

        resource.getLaunchConfiguration = function() {
          return environment.connectedTo(this, "Resources::AWS::AutoScaling::LaunchConfiguration")[0];
        };

        resource.getElasticBeanstalkEnvironment = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment")[0];
        };

        resource.badgeContent = function(subnet) {
          if(!subnet) return;

          return _.filter(this.getInstances(), function(i) {
            return i.availability_zone === subnet.get("resource").availability_zone;
          }).length;
        };

        resource.getConnectables = function() {
          var connectables = _.map(this.getInstances(), function(i) { return i.getELBs() });
          connectables = connectables.concat(this.getElbs());
          connectables = connectables.concat(this.getALBs());
          connectables = connectables.concat(this.getNLBs());

          return _.uniq(_.flatten(connectables));
        };

        return resource;
      }
    }
  }]);
