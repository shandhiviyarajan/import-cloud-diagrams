angular.module('designer.workspace.layout.infrastructure.aws.subnet', [])
.factory('InfrastructureLayoutAWSSubnet', [function() {
  return {
    load: function(subnet, environment) {

      subnet.getData = function() {
        var resources = [];
        var subnet_groups = [];
        var instances = this.getInstances();
        var autoscale_groups = [];

        resources = resources.concat(this.getNATGateways());

        _.each(instances, function(instance) {
          // Only add it if it's not part of an ASG
          var asgs = environment.connectedTo(instance, "Resources::AWS::AutoScaling::AutoScalingGroup");

          if (asgs.length) {
            autoscale_groups = autoscale_groups.concat(asgs);
          }
          else {
            resources.push(instance);
          }
        })

        resources = resources.concat(_.uniq(autoscale_groups));
        resources = resources.concat(this.getRDSClusters());
        resources = resources.concat(this.getRDSInstances());
        resources = resources.concat(this.getRedshiftNodes());
        resources = resources.concat(this.getElasticacheNodes());
        resources = resources.concat(this.getEFSFileSystems());
        resources = resources.concat(this.getWorkSpaces());
        resources = resources.concat(this.getDirectories());
        resources = resources.concat(this.getLambdas());

        subnet_groups = subnet_groups.concat(this.getDBSubnetGroups());
        subnet_groups = subnet_groups.concat(this.getClusterSubnetGroups());
        subnet_groups = subnet_groups.concat(this.getCacheSubnetGroups());

        return {
          id: this.id,
          az: this.availability_zone,
          name: this.name,
          cidr_block: this.cidr,
          resources: _.map(resources, function(r) { return r.id }),
          subnet_groups: _.map(subnet_groups, function(r) { return r.id })
        }
      };

      subnet.getInstances = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Instance");
      };

      subnet.getDBSubnetGroups = function() {
        return environment.connectedTo(this, "Resources::AWS::RDS::DBSubnetGroup");
      };

      subnet.getClusterSubnetGroups = function() {
        return environment.connectedTo(this, "Resources::AWS::Redshift::ClusterSubnetGroup");
      };

      subnet.getCacheSubnetGroups = function() {
        return environment.connectedTo(this, "Resources::AWS::ElastiCache::CacheSubnetGroup");
      };

      subnet.getRDSClusters = function() {
        return _.filter(environment.connectedTo(this, "Resources::AWS::RDS::DBCluster"), function(o) {
          return o.db_cluster_members.length === 0 && _.includes(o.availability_zones, this.availability_zone);
        }.bind(this));
      };

      subnet.getRDSInstances = function() {
        return environment.connectedTo(this, "Resources::AWS::RDS::DBInstance");
      };

      subnet.getRedshiftNodes = function() {
        return environment.connectedTo(this, "Resources::AWS::Redshift::ClusterNode");
      };

      subnet.getElasticacheNodes = function() {
        return environment.connectedTo(this, "Resources::AWS::ElastiCache::CacheNode");
      };

      subnet.getInstances = function() {
        var instances = environment.connectedTo(this, "Resources::AWS::EC2::Instance");
        var nics = environment.connectedTo(this, "Resources::AWS::EC2::NetworkInterface");

        _.each(nics,  function(nic) {
          instances = instances.concat(environment.connectedTo(nic, "Resources::AWS::EC2::Instance"))
        });

        return _.uniq(instances);
      };

      subnet.getNATGateways = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::NATGateway");
      };

      subnet.getRouteTables = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::RouteTable");
      };

      subnet.getEFSFileSystems = function() {
        return environment.connectedTo(this, "Resources::AWS::EFS::FileSystem");
      };

      subnet.getWorkSpaces = function() {
        return environment.connectedTo(this, "Resources::AWS::WorkSpaces::WorkSpace");
      };

      subnet.getDirectories = function() {
        return environment.connectedTo(this, "Resources::AWS::DirectoryService::Directory");
      };

      subnet.getLambdas = function() {
        return environment.connectedTo(this, "Resources::AWS::Lambda::Function");
      };

      // Generic Resources
      subnet.getGenericSubnetResources = function() {
        return environment.connectedTo(this, "Resources::AWS::Generic::SubnetResource");
      }

      subnet.isPublic = function() {
        var route_tables = this.getRouteTables();
        var pub = false;

        _.each(route_tables, function(route_table) {
          var connections = _.filter(route_table.connections, function(c) { return c.remote_resource_type === "Resources::AWS::EC2::InternetGateway" });

          _.each(connections, function(c) {
            if (c["data"]["destination_cidr_block"] === "0.0.0.0/0")
              pub = true;
          });
        });

        return pub;
      };

      return subnet;
    }
  }
}]);
