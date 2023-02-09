angular.module("designer.data.resources.ibm.factory", [
  'designer.model.resource',

  "designer.model.resources.ibm.ec2.address",
  "designer.model.resources.ibm.ec2.customer_gateway",
  "designer.model.resources.ibm.ec2.dhcp_options",
  "designer.model.resources.ibm.ec2.egress_only_internet_gateway",
  "designer.model.resources.ibm.ec2.instance",
  "designer.model.resources.ibm.ec2.internet_gateway",
  "designer.model.resources.ibm.ec2.nat_gateway",
  "designer.model.resources.ibm.ec2.network_acl",
  "designer.model.resources.ibm.ec2.network_interface",
  "designer.model.resources.ibm.ec2.placement_group",
  "designer.model.resources.ibm.ec2.route_table",
  "designer.model.resources.ibm.ec2.security_group",
  "designer.model.resources.ibm.ec2.security_group_permission",
  "designer.model.resources.ibm.ec2.subnet",
  "designer.model.resources.ibm.ec2.transitgateway",
  "designer.model.resources.ibm.ec2.transitgatewayattachment",
  "designer.model.resources.ibm.ec2.transitgatewayroutetable",
  "designer.model.resources.ibm.ec2.transitgatewayvpcattachment",
  "designer.model.resources.ibm.ec2.volume",
  "designer.model.resources.ibm.ec2.vpc",
  "designer.model.resources.ibm.ec2.vpc_endpoint",
  "designer.model.resources.ibm.ec2.vpc_peering_connection",
  "designer.model.resources.ibm.ec2.vpn_connection",
  "designer.model.resources.ibm.ec2.vpn_gateway",

  "designer.model.resources.ibm.elastic_load_balancing.load_balancer",
  "designer.model.resources.ibm.elastic_load_balancing_v2.application_load_balancer",
  "designer.model.resources.ibm.elastic_load_balancing_v2.network_load_balancer",
  "designer.model.resources.ibm.elastic_load_balancing_v2.listener",
  "designer.model.resources.ibm.elastic_load_balancing_v2.rule",
  "designer.model.resources.ibm.elastic_load_balancing_v2.target_group",
  "designer.model.resources.ibm.elasticache.cache_cluster",
  "designer.model.resources.ibm.elasticache.cache_node",
  "designer.model.resources.ibm.elasticache.parameter_group",
  "designer.model.resources.ibm.elasticache.subnet_group",
  "designer.model.resources.ibm.rds.db_instance",
  "designer.model.resources.ibm.rds.db_security_group",
  "designer.model.resources.ibm.rds.db_subnet_group",
  "designer.model.resources.ibm.route53.hosted_zone",
  "designer.model.resources.ibm.route53.resource_record_set",
  "designer.model.resources.ibm.s3.bucket",
])
  .service("IBMResourcesFactory",
    [
      "Resource",

      "IBM_Address",
      "IBM_CustomerGateway",
      "IBM_DHCPOptions",
      "IBM_EgressOnlyInternetGateway",
      "IBM_Instance",
      "IBM_InternetGateway",
      "IBM_NATGateway",
      "IBM_NetworkACL",
      "IBM_NetworkInterface",
      "IBM_PlacementGroup",
      "IBM_RouteTable",
      "IBM_SecurityGroup",
      "IBM_SecurityGroupPermission",
      "IBM_Subnet",
      "IBM_TransitGateway",
      "IBM_TransitGatewayAttachment",
      "IBM_TransitGatewayRouteTable",
      "IBM_TransitGatewayVPCAttachment",
      "IBM_Volume",
      "IBM_VPC",
      "IBM_VPCEndpoint",
      "IBM_VpcPeeringConnection",
      "IBM_VpnConnection",
      "IBM_VpnGateway",

      "IBM_LoadBalancer",

      "IBM_ApplicationLoadBalancer",
      "IBM_NetworkLoadBalancer",
      "IBM_ALBListener",
      "IBM_ALBRule",
      "IBM_ALBTargetGroup",

      "IBM_ElastiCacheCacheCluster",
      "IBM_ElastiCacheCacheNode",
      "IBM_ElastiCacheParameterGroup",
      "IBM_ElastiCacheSubnetGroup",

      "IBM_DBInstance",
      "IBM_DBSecurityGroup",
      "IBM_DBSubnetGroup",

      "IBM_Route53HostedZone",
      "IBM_Route53ResourceRecordSet",

      "IBM_S3Bucket",

      function(
        Resource,

        IBM_Address,
        IBM_CustomerGateway,
        IBM_DHCPOptions,
        IBM_EgressOnlyInternetGateway,
        IBM_Instance,
        IBM_InternetGateway,
        IBM_NATGateway,
        IBM_NetworkACL,
        IBM_NetworkInterface,
        IBM_PlacementGroup,
        IBM_RouteTable,
        IBM_SecurityGroup,
        IBM_SecurityGroupPermission,
        IBM_Subnet,
        IBM_TransitGateway,
        IBM_TransitGatewayAttachment,
        IBM_TransitGatewayRouteTable,
        IBM_TransitGatewayVPCAttachment,
        IBM_Volume,
        IBM_VPC,
        IBM_VPCEndpoint,
        IBM_VpcPeeringConnection,
        IBM_VpnConnection,
        IBM_VpnGateway,

        IBM_LoadBalancer,

        IBM_ApplicationLoadBalancer,
        IBM_NetworkLoadBalancer,
        IBM_ALBListener,
        IBM_ALBRule,
        IBM_ALBTargetGroup,

        IBM_ElastiCacheCacheCluster,
        IBM_ElastiCacheCacheNode,
        IBM_ElastiCacheParameterGroup,
        IBM_ElastiCacheSubnetGroup,

        IBM_DBInstance,
        IBM_DBSecurityGroup,
        IBM_DBSubnetGroup,

        IBM_Route53HostedZone,
        IBM_Route53ResourceRecordSet,

        IBM_S3Bucket
  )
      {
        return function fromResourceObject(resource, environment) {
          var constructors = {
            "Resources::IBM::EC2::Address": IBM_Address,
            "Resources::IBM::EC2::CustomerGateway": IBM_CustomerGateway,
            "Resources::IBM::EC2::DHCPOptions": IBM_DHCPOptions,
            "Resources::IBM::EC2::EgressOnlyInternetGateway": IBM_EgressOnlyInternetGateway,
            "Resources::IBM::EC2::Instance": IBM_Instance,
            "Resources::IBM::EC2::InternetGateway": IBM_InternetGateway,
            "Resources::IBM::EC2::NATGateway": IBM_NATGateway,
            "Resources::IBM::EC2::NetworkACL": IBM_NetworkACL,
            "Resources::IBM::EC2::NetworkInterface": IBM_NetworkInterface,
            "Resources::IBM::EC2::PlacementGroup": IBM_PlacementGroup,
            "Resources::IBM::EC2::RouteTable": IBM_RouteTable,
            "Resources::IBM::EC2::SecurityGroup": IBM_SecurityGroup,
            "Resources::IBM::EC2::SecurityGroupPermission": IBM_SecurityGroupPermission,
            "Resources::IBM::EC2::Subnet": IBM_Subnet,
            "Resources::IBM::EC2::TransitGateway": IBM_TransitGateway,
            "Resources::IBM::EC2::TransitGatewayAttachment": IBM_TransitGatewayAttachment,
            "Resources::IBM::EC2::TransitGatewayRouteTable": IBM_TransitGatewayRouteTable,
            "Resources::IBM::EC2::TransitGatewayVPCAttachment": IBM_TransitGatewayVPCAttachment,
            "Resources::IBM::EC2::Volume": IBM_Volume,
            "Resources::IBM::EC2::VPC": IBM_VPC,
            "Resources::IBM::EC2::VPCEndpoint": IBM_VPCEndpoint,
            "Resources::IBM::EC2::VPCPeeringConnection": IBM_VpcPeeringConnection,
            "Resources::IBM::EC2::VPNConnection": IBM_VpnConnection,
            "Resources::IBM::EC2::VPNGateway": IBM_VpnGateway,

            "Resources::IBM::ElasticLoadBalancing::LoadBalancer": IBM_LoadBalancer,

            "Resources::IBM::ElasticLoadBalancingV2::ApplicationLoadBalancer": IBM_ApplicationLoadBalancer,
            "Resources::IBM::ElasticLoadBalancingV2::NetworkLoadBalancer": IBM_NetworkLoadBalancer,
            "Resources::IBM::ElasticLoadBalancingV2::Listener": IBM_ALBListener,
            "Resources::IBM::ElasticLoadBalancingV2::Rule": IBM_ALBRule,
            "Resources::IBM::ElasticLoadBalancingV2::TargetGroup": IBM_ALBTargetGroup,

            "Resources::IBM::ElastiCache::CacheCluster": IBM_ElastiCacheCacheCluster,
            "Resources::IBM::ElastiCache::CacheNode": IBM_ElastiCacheCacheNode,
            "Resources::IBM::ElastiCache::ParameterGroup": IBM_ElastiCacheParameterGroup,
            "Resources::IBM::ElastiCache::CacheSubnetGroup": IBM_ElastiCacheSubnetGroup,
            
            "Resources::IBM::RDS::DBInstance": IBM_DBInstance,
            "Resources::IBM::RDS::DBSecurityGroup": IBM_DBSecurityGroup,
            "Resources::IBM::RDS::DBSubnetGroup": IBM_DBSubnetGroup,

            "Resources::IBM::Route53::HostedZone": IBM_Route53HostedZone,
            "Resources::IBM::Route53::ResourceRecordSet": IBM_Route53ResourceRecordSet,

            "Resources::IBM::S3::Bucket": IBM_S3Bucket

          };

          var c = constructors[resource.type];

          return c ? c.load(resource, environment) : Resource.load(resource, environment);
        };
      }]);
