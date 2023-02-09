angular.module('designer.model.resources.ibm.elastic_load_balancing_v2.application_load_balancer', ['designer.model.resource'])
  .factory('IBM_ApplicationLoadBalancer', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'APPLICATION LOAD BALANCER';

        resource.rule_status = {};
        resource.built_info = null;

        resource.info = function() {
          if (this.built_info)
            return this.built_info;
          
          this.built_info = {};
          this.built_info.expanded = {};
          this.built_info.target_groups = [];
          this.built_info.instances = [];
          this.built_info.subnets = this.getSubnets();
          this.built_info.beanstalk_environment = this.getElasticBeanstalkEnvironment();

          this.built_info.listeners = _.map(this.getListeners(), function(listener) {
            listener.rules = _.map(listener.getRules(), function(rule) {
              rule.target_group = rule.getTargetGroup();
              if (rule.priority == 'default') return rule;
            });

            return listener;
          });

          var autoscaling_groups = [];
          this.built_info.target_groups = _.map(this.getTargetGroups(), function(target_group) {
            _.each(target_group.getInstances(), function(instance) {
              var autoscaling_group = instance.getAutoscalingGroup();

              if (autoscaling_group) {
                if(!autoscaling_group["target_groups"])
                  autoscaling_group.target_groups = [];

                autoscaling_group.instances = autoscaling_group.instances ? _.uniq(autoscaling_group.instances.concat(instance)) : [instance];
                autoscaling_group.target_groups.push(target_group);
                autoscaling_groups = autoscaling_groups.concat(autoscaling_group);
              } else {
                if(!instance["target_groups"])
                  instance.target_groups = [];

                instance.target_groups.push(target_group);
                this.built_info.instances = this.built_info.instances.concat(instance);
              }
            }.bind(this));
            return target_group;
          }.bind(this));

          this.built_info.autoscaling_groups = _.uniq(autoscaling_groups);
          this.built_info.web_acls = this.getWebACLs();
          this.built_info.vpc_link = this.getVPCLinks();
          this.built_info.instances = _.uniq(this.built_info.instances);
          this.built_info.cloudfront_distributions = this.getCloudFrontDistributions();

          return this.built_info;
        };

        resource.getListeners = function() {
          return environment.connectedTo(this, "Resources::IBM::ElasticLoadBalancingV2::Listener");
        };

        resource.getTargetGroups = function() {
          return environment.connectedTo(this, "Resources::IBM::ElasticLoadBalancingV2::TargetGroup");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Subnet");
        };

        resource.getWebACLs = function() {
          return environment.connectedTo(this, "Resources::IBM::WAF::WebACL");
        };

        resource.getConnectables = function() {
          return this.getWebACLs();
        };

        resource.getVPCLinks = function() {
          return environment.connectedTo(this, "Resources::IBM::APIGateway::VpcLink");
        };

        resource.getCloudFrontDistributions = function() {
          return environment.connectedTo(this, "Resources::IBM::CloudFront::Distribution");
        };

        resource.getElasticBeanstalkEnvironment = function() {
          return environment.connectedTo(this, "Resources::IBM::ElasticBeanstalk::Environment")[0];
        };

        return resource;
      }
    }
  }]);
