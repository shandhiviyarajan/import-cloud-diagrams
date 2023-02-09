angular.module('designer.model.resources.aws.ec2.security_group', ['designer.model.resource'])
  .factory('AWS_SecurityGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SECURITY GROUP';

        resource.info = function() {
          var info = {};

          var sg_permissions = this.getSecurityGroupPermissions();
          var ingress_rules = sg_permissions.filter(function(rule) {return rule.permission_type === "ingress";});
          var egress_rules = sg_permissions.filter(function(rule) {return rule.permission_type === "egress";});

          info.ingress_rules = _.map(ingress_rules, function(r) {
            return {
              range: this.translateRange(r),
              protocol: this.translateProtocol(r.ip_protocol),
              ip_ranges: r.ip_ranges,
              prefix_list_ids: r.prefix_list_ids,
              sources: r.getSourceGroups()
            }
          }.bind(this));

          info.egress_rules = _.map(egress_rules, function(r) {
            return {
              range: this.translateRange(r),
              protocol: this.translateProtocol(r.ip_protocol),
              ip_ranges: r.ip_ranges,
              prefix_list_ids: r.prefix_list_ids,
              sources: r.getSourceGroups()
            }
          }.bind(this));

          info.children = _.reject(environment.connectedTo(this, null, true), function(r) {
            return _.includes(["Resources::AWS::EC2::SecurityGroup","Resources::AWS::EC2::SecurityGroupPermission"], r.type);
          });

          return info;
        };

        resource.translateRange = function(rule) {
          var from_port = rule.from_port;
          var to_port   = rule.to_port;
          var protocol  = rule.ip_protocol;

          if(!from_port && !to_port && protocol === -1)
            return "ALL";

          return (from_port === to_port) ? from_port : from_port + " : " + to_port;
        };

        // TODO: for now we just care about ALL - will we want to handle all number versions at some point?
        resource.translateProtocol = function(protocol) {
          return (protocol == -1) ? "ALL" : protocol;
        };
        
        resource.highlightableConnections = function() {
          var highlightable = [];

          var connected = environment.connectedTo(this, null, true);
          _.each(connected, function(c) {
            if(c.type === "Resources::AWS::EC2::NetworkInterface") {
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if(c.type === "Resources::AWS::EFS::MountTarget") {
              // TODO: can we specify the actual icon? Each service is in multiple subnets but a sg can apply to only one sub
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if(c.type === "Resources::AWS::Redshift::Cluster") {
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if(c.type === "Resources::AWS::ElastiCache::CacheCluster") {
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if (c.type === "Resources::AWS::AutoScaling::LaunchConfiguration") {
              highlightable = highlightable.concat(c.highlightableConnections())
            }
            else {
              highlightable.push(c);
            }
          });

          return highlightable;
        };

        // SO I can get the permissions directly attached to this group, then from that I can link it to other groups
        resource.getSecurityGroupPermissions = function() {
          var permissions = [];

          _.each(this.connections, function(connection) {
            if (connection.remote_resource_type === "Resources::AWS::EC2::SecurityGroupPermission" && connection.resource_id === this.id) {
              permissions.push(environment.getResource(connection.remote_resource_id));
            }
          }.bind(this));

          return _.compact(permissions);
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
        };

        return resource;
      }
    }
  }]);
