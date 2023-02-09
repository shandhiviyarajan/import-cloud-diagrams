angular.module('designer.model.resources.aws.elastic_load_balancing.load_balancer', ['designer.model.resource'])
  .factory('AWS_LoadBalancer', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELB';

        resource.info = function() {
          var info = {};
          var autoscaling_groups = [];
          info.instances = [];

          var instances = this.getConnectedInstances();

          _.each(instances, function(instance) {
            var autoscaling_group = instance.getAutoscalingGroup();

            if (autoscaling_group) {
              autoscaling_group.instances = autoscaling_group.instances ? _.uniq(autoscaling_group.instances.concat(instance)) : [instance];
              autoscaling_groups = autoscaling_groups.concat(autoscaling_group);
            } else {
              info.instances = info.instances.concat(instance);
            }
          });

          info.autoscaling_groups = _.uniq(autoscaling_groups);
          info.security_groups = this.getSecurityGroups();
          info.subnets = this.getSubnets();
          info.services = this.getECSServices();
          info.cloudfront_distributions = this.getCloudFrontDistributions();
          info.beanstalk_environment = this.getElasticBeanstalkEnvironment();

          return info;
        };

        resource.getConnectedInstances = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Instance");
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet")[0];
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getECSServices = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Service");
        };

        resource.getCloudFrontDistributions = function() {
          return environment.connectedTo(this, "Resources::AWS::CloudFront::Distribution");
        };

        // TODO: do we even use direct anymore? Also we don't really have a guaranteed direct link to VPC anymore
        resource.getVpc = function(direct) {
          var vpc = environment.connectedTo(this, "Interfaces::AWS::VPC::ELB")[0];

          // When getting the VPC for security groups we may want to go through subnet. When connecting to subnets we MUST have a VPC - so we go direct
          if(direct || vpc) {
            return vpc;
          }

          var subnet = this.getSubnet();
          return (subnet) ? subnet.getVpc() : null;
        };

        resource.getWebACLs = function() {
          return environment.connectedTo(this, "Resources::AWS::WAF::WebACL");
        };

        resource.getConnectables = function() {
          return this.getWebACLs();
        };

        resource.getElasticBeanstalkEnvironment = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment")[0];
        };

        return resource;
      }
    }
  }]);
