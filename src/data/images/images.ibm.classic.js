angular.module('designer.model.images.ibm_classic', [])
.service('IBM_ClassicImages', [function() {
  return {
    "list" : [
      "resources.ibm.ec2.networkinterface",
      "resources.ibm.ec2.vpc",
      "resources.ibm.ec2.subnet",
      "resources.ibm.ec2.instance",
      "resources.ibm.ec2.routetable",
      "resources.ibm.ec2.internetgateway",
      "resources.ibm.ec2.egressonlyinternetgateway",
      "resources.ibm.ec2.address",
      "resources.ibm.ec2.customergateway",
      "resources.ibm.ec2.vpcendpoint",
      "resources.ibm.ec2.vpcpeeringconnection",
      "resources.ibm.ec2.vpnconnection",
      "resources.ibm.ec2.vpngateway",
      "resources.ibm.ec2.natgateway",
      "resources.ibm.ec2.volume",
      "resources.ibm.ec2.transitgateway",
      "resources.ibm.ec2.transitgatewayattachment",
      "resources.ibm.ec2.transitgatewayroutetable",
      "resources.ibm.ec2.transitgatewayvpcattachment",

      // "resources.ibm.cloudfront.distribution",
      // "resources.ibm.cloudfront.streamingdistribution",

      // "resources.ibm.ecs.cluster",
      // "resources.ibm.ecs.container",
      // "resources.ibm.ecs.containerinstance",
      // "resources.ibm.ecs.deployment",
      // "resources.ibm.ecs.service",
      // "resources.ibm.ecs.task",
      // "resources.ibm.ecs.taskdefinition",

      "resources.ibm.directconnect.connection",
      "resources.ibm.directconnect.directconnectgateway",
      "resources.ibm.directconnect.directconnectgatewayassociation",
      "resources.ibm.directconnect.lag",
      "resources.ibm.directconnect.virtualinterface",

      // "resources.ibm.directoryservice.directory",
      // "resources.ibm.directoryservice.domaincontroller",
      // "resources.ibm.directoryservice.trust",

      // TODO: possibly?
      // "resources.ibm.efs.filesystem",
      // "resources.ibm.efs.mounttarget",

      // "resources.ibm.elasticbeanstalk.application",
      // "resources.ibm.elasticbeanstalk.applicationversion",
      // "resources.ibm.elasticbeanstalk.environment",

      "resources.ibm.s3.bucket",

      // "resources.ibm.sqs.queue",

      // "resources.ibm.dynamodb.table",

      // TODO: ??
      // "resources.ibm.route53.hostedzone",

      // "resources.ibm.redshift.cluster",
      // "resources.ibm.redshift.clusternode",
      // "resources.ibm.redshift.clustersubnetgroup",

      // "resources.ibm.rds.dbsubnetgroup",
      "resources.ibm.rds.dbinstance",

      "resources.ibm.elasticloadbalancing.loadbalancer",
      // "resources.ibm.elasticloadbalancingv2.applicationloadbalancer",
      // "resources.ibm.elasticloadbalancingv2.networkloadbalancer",
      // "resources.ibm.elasticloadbalancingv2.targetgroup",

      // "resources.ibm.apigateway.apikey",
      // "resources.ibm.apigateway.authorizer",
      // "resources.ibm.apigateway.deployment",
      // "resources.ibm.apigateway.domain",
      // "resources.ibm.apigateway.method",
      // "resources.ibm.apigateway.model",
      // "resources.ibm.apigateway.resource",
      // "resources.ibm.apigateway.restapi",
      // "resources.ibm.apigateway.stage",
      // "resources.ibm.apigateway.usageplan",
      // "resources.ibm.apigateway.vpclink",

      // "resources.ibm.lambda.function",
      // "resources.ibm.lambda.functionversion",
      // "resources.ibm.lambda.layerversion",
      // "resources.ibm.lambda.eventsourcemapping",
      // "resources.ibm.lambda.function",
      // "resources.ibm.lambda.layer",
      // "resources.ibm.lambda.lambdaalias",

      // "resources.ibm.elasticache.cachesubnetgroup",
      "resources.ibm.elasticache.cachenode",
      "resources.ibm.elasticache.cachecluster",

      // "resources.ibm.autoscaling.autoscalinggroup",
      // "resources.ibm.autoscaling.launchconfiguration",

      // TODO: ???
      "resources.ibm.waf.ratebasedrule",
      "resources.ibm.waf.rule",
      "resources.ibm.waf.webacl",

      // "resources.ibm.workspaces.directory",
      // "resources.ibm.workspaces.ipgroup",
      // "resources.ibm.workspaces.workspace"
    ]
  };
}]);
