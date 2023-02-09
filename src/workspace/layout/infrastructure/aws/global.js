angular.module('designer.workspace.layout.infrastructure.aws.global', [
  "designer.workspace.layout.infrastructure.aws.vpc"
])
.factory('InfrastructureLayoutAWSGlobal', ["InfrastructureLayoutAWSVPC", function(InfrastructureLayoutAWSVPC) {
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
          bottom: _.reject(this.getBottomRow(), function (r) {
            return _.includes(networkResourceIDs, r)
          }),
          center: center,
          parent: true
        };
      };

      layout.getVPCs = function() {
        var vpcs = _.filter(environment.facet.resources, function(r) { return r.type === 'Resources::AWS::EC2::VPC' });
        return _.map(vpcs, function(vpc) { return InfrastructureLayoutAWSVPC.load(vpc, environment).getData() });
      };

      layout.getTopRow = function() {
        var values = [];
        var types = [
          "Resources::AWS::S3::Bucket",
          "Resources::AWS::SQS::Queue",
          "Resources::AWS::APIGateway::RestAPI",
          "Resources::AWS::CloudFront::Distribution",
          "Resources::AWS::CloudFront::StreamingDistribution",
          "Resources::AWS::DynamoDB::Table",
          "Resources::AWS::ElasticBeanstalk::Environment",
          "Resources::AWS::Lambda::Function",
          "Resources::AWS::DirectoryService::Directory",
          "Resources::AWS::EFS::FileSystem",
          "Resources::AWS::RDS::DBInstance",
          "Resources::AWS::WorkSpaces::WorkSpace",
          "Resources::AWS::DirectConnect::DirectConnectGateway",
          "Resources::AWS::Route53::HostedZone",
          "Resources::AWS::EC2::CustomerGateway",
          "Resources::AWS::EC2::TransitGateway",
          "Resources::AWS::WAF::WebACL",
          "Resources::AWS::WAFV2::WebACL"
        ];

        _.each(types, function(type) { values = values.concat(environment.getResourcesByType(type)) });

        return _.map(values, function(r) { return r.id });
      };

      layout.getBottomRow = function() {
        var values = [];
        var types = [
          "Resources::AWS::Generic::GlobalResource",
        ];

        _.each(types, function(type) { values = values.concat(environment.getResourcesByType(type)) });
        return _.uniq(_.map(values, function(r) { return r.id }));
      };

      return layout;
    }
  }
}]);
