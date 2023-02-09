angular.module('designer.model.resources.aws.ec2.instance', ['designer.model.resource'])
.factory('AWS_Instance', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'INSTANCE';
      resource.status_list = {
        "pending": "warn",
        "running": "good",
        "stopping": "warn",
        "stopped": "stopped",
        "rebooting": "warn",
        "shutting-down": "warn",
        "terminated": "stopped"
      };

      resource.summary_line =
        '<span class="resource-summary">' +
          resource.instance_type + " (" + resource.architecture + ")" + "&nbsp;&nbsp;&nbsp;" +
          resource.private_ip_address +
        '</span>';

      // If the resource is stopped then display it faded out
      resource.display_faded = (resource.status === 'stopped');

      resource.info = function() {
        var info = {};

        info.subnet = this.getSubnet();
        info.addresses = this.getAddresses();
        info.volumes = this.getVolumes();
        info.security_groups = this.getSecurityGroups();
        info.autoscaling_group = this.getAutoscalingGroup();
        info.network_interfaces = this.getNetworkInterfaces();
        info.ecs_clusters = this.getECSClusters();
        info.placement_group = this.getPlacementGroup();
        info.beanstalk_environment = this.getElasticBeanstalkEnvironment();

        // Can have multiple IP's based on NICs, and they all link to different subnets. Weeee.
        var primary_ips = [];
        var secondary_ips = [];
        _.each(info.network_interfaces, function(nic) {
          var primary     = nic.getPrimaryPrivateIP();
          var secondaries = nic.getSecondaryPrivateIPs();
          var subnet      = nic.getSubnet();

          if(primary) {
            primary_ips.push({
              ip: primary.private_ip_address,
              subnet: subnet,
              nic: nic
            });
          }
          if(secondaries.length) {
            _.each(secondaries, function(ip) {
              secondary_ips.push({
                ip: ip.private_ip_address,
                subnet: subnet,
                nic: nic
              });
            });
          }
        });

        info.primary_private_ips = primary_ips;
        info.secondary_private_ips = secondary_ips;

        return info;
      };

      resource.summary = {
        "AMI": resource.ami,
        "AZ": resource.availability_zone,
        "Instance Type": resource.instance_type,
        "Private IP": resource.private_ip_address,
        "Arch": resource.architecture
      };

      resource.getExtendedInformation = function() {
        return {
          info1: this.provider_id,
          info2: this.private_ip_address,
          info3: this.public_ip_address
        }
      };

      resource.getIconInformation = function() {
        var txt = this.instance_type.split(".")[0].toUpperCase();

        return {
          txt: txt,
          fill: "#d86613",
          'font-size': 18,
          dx: txt.length === 3 ? 20 : 22,
          dy: 40
        }
      };

      resource.getSubnet = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Subnet")[0];
      };

      resource.getAddresses = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Address");
      };

      resource.getSecurityGroups = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
      };

      resource.getVolumes = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Volume");
      };

      resource.getNetworkInterfaces = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::NetworkInterface");
      };

      resource.getPlacementGroup = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::PlacementGroup")[0];
      };

      // TODO: we actually have a direct link to the VPC now ... will we always have it though? Gots to checks out CF
      resource.getVpc = function() {
        var subnet = this.getSubnet();

        return (subnet) ? subnet.getVpc() : null;
      };

      resource.getELBs = function() {
        return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancing::LoadBalancer");
      };

      resource.getALBs = function() {
        var albs = [];

        _.each(environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::TargetGroup"), function(target_group) {
          albs = albs.concat(target_group.getApplicationLoadBalancers());
        });

        return albs;
      };

      resource.getNLBs = function() {
        var nlbs = [];

        _.each(environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::TargetGroup"), function(target_group) {
          nlbs = nlbs.concat(target_group.getNetworkLoadBalancers());
        });

        return nlbs;
      };

      resource.getAutoscalingGroup = function() {
        return environment.connectedTo(this, "Resources::AWS::AutoScaling::AutoScalingGroup")[0];
      };

      resource.getElasticBeanstalkEnvironment = function() {
        return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment")[0];
      };

      resource.getConnectables = function() {
        return this.getELBs().concat(this.getALBs()).concat(this.getNLBs());
      };

      // Can we have more than one ECS cluster?
      resource.getECSClusters = function() {
        var clusters = [];

        _.each(environment.connectedTo(this, "Resources::AWS::ECS::ContainerInstance"), function(container_instance) {
          clusters.push(container_instance.getCluster());
        });

        return _.uniq(clusters);
      };

      return resource;
    }
  }
}]);
