angular.module('designer.workspace.layout.infrastructure.ibm.subnet', [])
.factory('InfrastructureLayoutIBMSubnet', [function() {
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
          var asgs = environment.connectedTo(instance, "Resources::IBM::AutoScaling::AutoScalingGroup");

          if (asgs.length) {
            autoscale_groups = autoscale_groups.concat(asgs);
          }
          else {
            resources.push(instance);
          }
        })

        resources = resources.concat(_.uniq(autoscale_groups));
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
        return environment.connectedTo(this, "Resources::IBM::EC2::Instance");
      };

      subnet.getDBSubnetGroups = function() {
        return environment.connectedTo(this, "Resources::IBM::RDS::DBSubnetGroup");
      };

      subnet.getClusterSubnetGroups = function() {
        return environment.connectedTo(this, "Resources::IBM::Redshift::ClusterSubnetGroup");
      };

      subnet.getCacheSubnetGroups = function() {
        return environment.connectedTo(this, "Resources::IBM::ElastiCache::CacheSubnetGroup");
      };

      subnet.getRDSInstances = function() {
        return environment.connectedTo(this, "Resources::IBM::RDS::DBInstance");
      };

      subnet.getRedshiftNodes = function() {
        return environment.connectedTo(this, "Resources::IBM::Redshift::ClusterNode");
      };

      subnet.getElasticacheNodes = function() {
        return environment.connectedTo(this, "Resources::IBM::ElastiCache::CacheNode");
      };

      subnet.getInstances = function() {
        var instances = environment.connectedTo(this, "Resources::IBM::EC2::Instance");
        var nics = environment.connectedTo(this, "Resources::IBM::EC2::NetworkInterface");

        _.each(nics,  function(nic) {
          instances = instances.concat(environment.connectedTo(nic, "Resources::IBM::EC2::Instance"))
        });

        return _.uniq(instances);
      };

      subnet.getNATGateways = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::NATGateway");
      };

      subnet.getRouteTables = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::RouteTable");
      };

      subnet.getEFSFileSystems = function() {
        return environment.connectedTo(this, "Resources::IBM::EFS::FileSystem");
      };

      subnet.getWorkSpaces = function() {
        return environment.connectedTo(this, "Resources::IBM::WorkSpaces::WorkSpace");
      };

      subnet.getDirectories = function() {
        return environment.connectedTo(this, "Resources::IBM::DirectoryService::Directory");
      };

      subnet.getLambdas = function() {
        return environment.connectedTo(this, "Resources::IBM::Lambda::Function");
      };

      subnet.isPublic = function() {
        var route_tables = this.getRouteTables();
        var pub = false;

        _.each(route_tables, function(route_table) {
          var connections = _.filter(route_table.connections, function(c) { return c.remote_resource_type === "Resources::IBM::EC2::InternetGateway" });

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
