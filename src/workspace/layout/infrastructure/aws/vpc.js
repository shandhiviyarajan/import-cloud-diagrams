angular.module('designer.workspace.layout.infrastructure.aws.vpc', [
  'designer.workspace.layout.infrastructure.aws.subnet'
])
.factory('InfrastructureLayoutAWSVPC', ["InfrastructureLayoutAWSSubnet", function(InfrastructureLayoutAWSSubnet) {
  return {
    load: function(vpc, environment) {

      vpc.getData = function() {
        var subnets = _.map(environment.connectedTo(this, "Resources::AWS::EC2::Subnet"), function(s) { return InfrastructureLayoutAWSSubnet.load(s, environment) });
        var azs = _.uniq(_.map(subnets, function(s) { return s.availability_zone })).sort();

        var sortable_cidr = function(cidr) {
          var parts = cidr.replace("/", ".").split(".");

          return _.map(parts, function(p) { return p.padStart(3, "0") }).join("");
        }

        var public_rows = _.sortBy(_.filter(subnets, function(s) { return s.isPublic() }), [function(s) { return sortable_cidr(s.cidr_block) }]);
        var private_rows = _.sortBy(_.reject(subnets, function(s) { return s.isPublic() }), [function(s) { return sortable_cidr(s.cidr_block) }]);

        var chunks = [
          { type: "subnet", resources: public_rows },
          { type: "subnet", resources: private_rows }
        ];

        _.each(chunks, function(chunk) {
          chunk["azs"] = _.map(azs, function(az) { return { az: az } });
          _.each(chunk["azs"], function(az) {
            az["resources"] = _.filter(chunk.resources, function(r) { return r.availability_zone === az.az });
          });

          // Turn rows into columns
          chunk["transpose"] = _.zip.apply(_, _.map(chunk["azs"], function(az) { return az["resources"] }))
          delete chunk["resources"];
          delete chunk["azs"];
        }, this);

        var rows = [];
        _.each(chunks, function(chunk) {
          _.each(chunk["transpose"], function(row) {
            // Remove nulls
            row = _.compact(row);

            var cols = [];
            _.each(azs, function(az) {
              var col = _.find(row, function(r) { return r.availability_zone === az });

              // Next column if this is empty
              if (!col) {
                cols.push({ az: az, resources: [], subnet_groups: [] });
              }
              else {
                // Get resources
                var column_subnet = _.find(subnets, function(s) { return s.id === col.id });
                cols.push(column_subnet.getData());
              }
            }, this);

            rows.push({ type: "subnet", columns: cols });

          }, this);
        }, this);

        // Add in some ELB rows eh dawgs whatever
        var elbsubnet_map = {};
        _.each(this.getLoadBalancers(), function(elb) {
          var elb_subnets = environment.connectedTo(elb, "Resources::AWS::EC2::Subnet");
          _.each(elb_subnets, function(s) {
            if(!elbsubnet_map[s.id])
              elbsubnet_map[s.id] = [];
            elbsubnet_map[s.id].push(elb.id);
          })
        }, this);

        var final_rows = [];
        var drawn_lbs = [];
        _.each(rows, function(row) {
          var lb_row = { type: "load_balancer", resources: [] };

          _.each(row.columns, function(subnet_info) {
            var lbs = _.reject((elbsubnet_map[subnet_info["id"]] || []), function(lb) { return _.includes(drawn_lbs, lb) });
            lb_row.resources = lb_row.resources.concat(lbs);
            drawn_lbs = drawn_lbs.concat(lbs);
          });

          if(lb_row.resources.length > 0)
            final_rows.push(lb_row);
          final_rows.push(row);
        });

        return {
          id: this.id,
          center: final_rows,
          top: this.loadTop(),
          right: this.loadRight(),
          left: this.loadLeft(),
          bottom: []
        };
      };

      vpc.getLoadBalancers = function() {
        var lb_types = [
          "Resources::AWS::ElasticLoadBalancing::LoadBalancer",
          "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer",
          "Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer"
        ];
        var load_balancers = [];
        var all_lbs = _.filter(environment.facet.resources, function(r) { return _.includes(lb_types, r.type) });
        _.each(all_lbs, function(lb) {
          var vpc_connection = environment.connectedTo(lb, "Resources::AWS::EC2::VPC");
          if(vpc_connection.length) {
            // Add it if it's connected to this VPC
            if(vpc_connection[0].id === this.id)
              load_balancers.push(lb)
          }
          else {
            // No VPC connection, check if it has a subnet connection
            var subnets = environment.connectedTo(lb, "Resources::AWS::EC2::Subnet");
            var connected = false;

            while(!connected && subnets.length) {
              var subnet = subnets.shift;
              vpc_connection = environment.connectedTo(subnet, "Resources::AWS::EC2::VPC");
              if(vpc_connection.length) {
                // Add it if it's connected to this VPC
                if(vpc_connection[0].id === this.id) {
                  load_balancers.push(lb);
                  connected = true;
                }
              }
            }
          }
        }.bind(this), true);

        return _.sortBy(load_balancers, ['type','name']);
      };

      // Generic Resources
      vpc.getGenericVPCResources = function() {
        return environment.connectedTo(this, "Resources::AWS::Generic::VPCResource");
      }

      vpc.loadTop = function() {
        var left = [];
        var right = [];

        right = right.concat(this.getInternetGateways());
        right = right.concat(this.getEgressOnlyInternetGateways());
        right = right.concat(this.getVPNGateways());
        right = right.concat(this.getCustomerGateways());
        right = right.concat(this.getWAFWebACLs());
        right = right.concat(this.getTransitGateways());
        left = left.concat(this.getGenericVPCResources());

        left = left.concat(this.getHostedZones());
        left = left.concat(this.getCloudFrontDistributions());

        return {
          left: _.map(left, function(r) { return r.id }),
          right: _.map(right, function(r) { return r.id })
        }
      };

      vpc.loadRight = function() {
        var resources = [];

        resources = resources.concat(this.getVPCEndpoints());
        resources = resources.concat(this.getDirectConnectGateways());
        resources = resources.concat(this.getVPCPeeringConnections());

        return _.map(resources, function(r) { return r.id });
      };

      vpc.loadLeft = function() {
        var resources = [];

        resources = resources.concat(this.getS3Buckets());
        resources = resources.concat(this.getAPIGateways());
        resources = resources.concat(this.getWorkSpaces());
        resources = resources.concat(this.getElasticBeanstalkEnvironments());

        // Get buckets connected to the VPC endpoint
        _.each(this.getVPCEndpoints(), function(vpce) {
          resources = resources.concat(environment.connectedTo(vpce, "Resources::AWS::S3::Bucket"));
        })

        return _.uniq(_.map(resources, function(r) { return r.id }));
      };

      return vpc;
    }
  }
}]);
