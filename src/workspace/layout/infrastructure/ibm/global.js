angular.module('designer.workspace.layout.infrastructure.ibm.global', [
  "designer.workspace.layout.infrastructure.ibm.vpc"
])
.factory('InfrastructureLayoutIBMGlobal', ["InfrastructureLayoutIBMVPC", function(InfrastructureLayoutIBMVPC) {
  return {
    load: function(environment) {
      var layout = {};

      layout.getData = function() {
        var center = this.getVPCs();
        var networkResourceIDs = [];

        // TODO: this is yuck, but whatevs - we need to know what's already displayed so we don't add it here
        _.each(center, function(vpc) {
          _.each(vpc.center, function(row) {
            if (row.type === "load_balancer") {
              networkResourceIDs = networkResourceIDs.concat(row.resources);
            }
            else {
              _.each(row.columns, function(col) {
                networkResourceIDs = networkResourceIDs.concat(col.resources);
              });
            }
          });

          networkResourceIDs = networkResourceIDs.concat(vpc.left).concat(vpc.right).concat(vpc.top.left).concat(vpc.top.right);
        });

        return {
          id: null,
          top: _.reject(this.getTopRow(), function (r) {
            return _.includes(networkResourceIDs, r)
          }),
          center: center,
          parent: true
        };
      };

      layout.getVPCs = function() {
        var vpcs = _.filter(environment.facet.resources, function(r) { return r.type === 'Resources::IBM::EC2::VPC' });

        return _.map(vpcs, function(vpc) { return InfrastructureLayoutIBMVPC.load(vpc, environment).getData() });
      };

      layout.getTopRow = function() {
        var values = [];
        var types = [
          "Resources::IBM::S3::Bucket",
          "Resources::IBM::SQS::Queue",
          "Resources::IBM::APIGateway::RestAPI",
          "Resources::IBM::CloudFront::Distribution",
          "Resources::IBM::CloudFront::StreamingDistribution",
          "Resources::IBM::DynamoDB::Table",
          "Resources::IBM::ElasticBeanstalk::Environment",
          "Resources::IBM::Lambda::Function",
          "Resources::IBM::DirectoryService::Directory",
          "Resources::IBM::EFS::FileSystem",
          "Resources::IBM::RDS::DBInstance",
          "Resources::IBM::WorkSpaces::WorkSpace",
          "Resources::IBM::DirectConnect::DirectConnectGateway",
          "Resources::IBM::Route53::HostedZone",
          "Resources::IBM::EC2::CustomerGateway",
          "Resources::IBM::EC2::TransitGateway",
          "Resources::IBM::WAF::WebACL"
        ];

        _.each(types, function(type) { values = values.concat(environment.getResourcesByType(type)) });

        return _.map(values, function(r) { return r.id });
      };

      return layout;
    }
  }
}]);
