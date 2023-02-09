angular.module('designer.model.resources.aws.ec2.vpc', ['designer.model.resource'])
  .factory('AWS_VPC', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPC';
        resource.status_list = {
          "pending": "warn",
          "available": "good"
        };

        resource.rerender = ["cidr_block"];

        resource.info = function() {
          var info = {};

          info.security_groups = this.getSecurityGroups();
          info.route_tables    = this.getRouteTables();
          info.network_acls    = this.getNetworkACLs();
          info.dhcp_options    = this.getDhcpOptions();
          info.s3_buckets      = this.getS3Buckets();

          return info;
        };

        resource.getVpc = function() {
          return this;
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getRouteTables = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::RouteTable");
        };

        resource.getDhcpOptions = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::DHCPOptions")[0];
        };

        resource.getNetworkACLs = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::NetworkACL");
        };

        resource.getS3Buckets = function() {
          return environment.connectedTo(this, "Resources::AWS::S3::Bucket");
        };

        resource.getInternetGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::InternetGateway");
        };

        resource.getEgressOnlyInternetGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::EgressOnlyInternetGateway");
        };

        resource.getVPNGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPNGateway");
        };

        resource.getCustomerGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::CustomerGateway");
        };

        resource.getWAFWebACLs = function() {
          return environment.connectedTo(this, "Resources::AWS::WAF::WebACL").concat(
            environment.connectedTo(this, "Resources::AWS::WAFV2::WebACL")
          );
        };

        resource.getTransitGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::TransitGateway");
        };

        resource.getHostedZones = function() {
          return environment.connectedTo(this, "Resources::AWS::Route53::HostedZone");
        };

        resource.getCloudFrontDistributions = function() {
          return environment.connectedTo(this, "Resources::AWS::CloudFront::Distribution").concat(
            environment.connectedTo(this, "Resources::AWS::CloudFront::StreamingDistribution")
          );
        };

        resource.getVPCEndpoints = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPCEndpoint");
        };

        resource.getDirectConnectGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::DirectConnectGateway");
        };

        resource.getVPCPeeringConnections = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPCPeeringConnection");
        };

        resource.getAPIGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::RestAPI");
        };

        // Some workspaces aren't connected to subnets, so we return them here
        resource.getWorkSpaces = function() {
          var workspaces = environment.connectedTo(this, "Resources::AWS::WorkSpaces::WorkSpace");
          return _.reject(workspaces, function(r) { return environment.connectedTo(r, "Resources::AWS::EC2::Subnet").length > 0 })
        };

        resource.getElasticBeanstalkEnvironments = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticBeanstalk::Environment");
        };

        return resource;
      }
    }
  }]);
