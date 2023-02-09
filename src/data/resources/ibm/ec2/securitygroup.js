angular.module('designer.model.resources.ibm.ec2.security_group', ['designer.model.resource'])
  .factory('IBM_SecurityGroup', ["Resource", function(Resource) {
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
            return _.includes(["Resources::IBM::EC2::SecurityGroup","Resources::IBM::EC2::SecurityGroupPermission"], r.type);
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

          // If the linked resource is a nic then get what IT is connected to
          var connected = environment.connectedTo(this, null, true);
          _.each(connected, function(c) {
            if(c.type === "Resources::IBM::EC2::NetworkInterface") {
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if(c.type === "Resources::IBM::EFS::MountTarget") {
              // TODO: can we specify the actual icon? Each service is in multiple subnets but a sg can apply to only one sub
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if(c.type === "Resources::IBM::Redshift::Cluster") {
              highlightable = highlightable.concat(c.highlightableConnections());
            }
            else if(c.type === "Resources::IBM::ElastiCache::CacheCluster") {
              highlightable = highlightable.concat(c.highlightableConnections());
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
            if (connection.remote_resource_type === "Resources::IBM::EC2::SecurityGroupPermission" && connection.resource_id === this.id) {
              permissions.push(environment.getResource(connection.remote_resource_id));
            }
          }.bind(this));

          return _.compact(permissions);
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
        };

        return resource;
      }
    }
  }]);
