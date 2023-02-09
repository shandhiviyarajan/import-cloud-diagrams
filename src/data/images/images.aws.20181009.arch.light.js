angular.module('designer.model.images.aws_20181009_arch_light', [])
  .service('AWS_20181009ArchLightImages', [function() {
    return {
      "list" : [ 
        "resources.aws.ec2.networkinterface",
        "resources.aws.ec2.vpc",
        "resources.aws.ec2.subnet",
        "resources.aws.ec2.securitygroup",
        "resources.aws.ec2.instance",
        "resources.aws.ec2.routetable",
        "resources.aws.ec2.internetgateway",
        "resources.aws.ec2.egressonlyinternetgateway",
        "resources.aws.ec2.address",
        "resources.aws.ec2.customergateway",
        "resources.aws.ec2.vpcendpoint",
        "resources.aws.ec2.vpcpeeringconnection",
        "resources.aws.ec2.vpnconnection",
        "resources.aws.ec2.vpngateway",
        "resources.aws.ec2.natgateway",
        "resources.aws.ec2.volume",
        "resources.aws.ec2.transitgateway",
        "resources.aws.ec2.transitgatewayattachment",
        "resources.aws.ec2.transitgatewayroutetable",
        "resources.aws.ec2.transitgatewayvpcattachment",
        "resources.aws.ec2.networkacl",

        "resources.aws.cloudfront.distribution",
        "resources.aws.cloudfront.streamingdistribution",

        "resources.aws.ecs.cluster",
        "resources.aws.ecs.container",
        "resources.aws.ecs.containerinstance",
        "resources.aws.ecs.deployment",
        "resources.aws.ecs.service",
        "resources.aws.ecs.task",
        "resources.aws.ecs.taskdefinition",

        "resources.aws.directconnect.connection",
        "resources.aws.directconnect.directconnectgateway",
        "resources.aws.directconnect.directconnectgatewayassociation",
        "resources.aws.directconnect.lag",
        "resources.aws.directconnect.virtualinterface",

        "resources.aws.directoryservice.directory",
        "resources.aws.directoryservice.domaincontroller",
        "resources.aws.directoryservice.trust",

        "resources.aws.efs.filesystem",
        "resources.aws.efs.mounttarget",

        "resources.aws.elasticbeanstalk.application",
        "resources.aws.elasticbeanstalk.applicationversion",
        "resources.aws.elasticbeanstalk.environment",

        "resources.aws.s3.bucket",

        "resources.aws.sqs.queue",

        "resources.aws.dynamodb.table",

        "resources.aws.route53.hostedzone",

        "resources.aws.redshift.cluster",
        "resources.aws.redshift.clusternode",
        "resources.aws.redshift.clustersubnetgroup",

        "resources.aws.rds.dbsubnetgroup",
        "resources.aws.rds.dbcluster",
        "resources.aws.rds.dbinstance",

        "resources.aws.elasticloadbalancing.loadbalancer",
        "resources.aws.elasticloadbalancingv2.applicationloadbalancer",
        "resources.aws.elasticloadbalancingv2.networkloadbalancer",
        "resources.aws.elasticloadbalancingv2.targetgroup",

        "resources.aws.apigateway.apikey",
        "resources.aws.apigateway.authorizer",
        "resources.aws.apigateway.deployment",
        "resources.aws.apigateway.domain",
        "resources.aws.apigateway.method",
        "resources.aws.apigateway.model",
        "resources.aws.apigateway.resource",
        "resources.aws.apigateway.restapi",
        "resources.aws.apigateway.stage",
        "resources.aws.apigateway.usageplan",
        "resources.aws.apigateway.vpclink",

        "resources.aws.lambda.function",
        "resources.aws.lambda.functionversion",
        "resources.aws.lambda.layerversion",
        "resources.aws.lambda.eventsourcemapping",
        "resources.aws.lambda.function",
        "resources.aws.lambda.layer",
        "resources.aws.lambda.lambdaalias",

        "resources.aws.elasticache.cachesubnetgroup",
        "resources.aws.elasticache.cachenode",
        "resources.aws.elasticache.cachecluster",

        "resources.aws.autoscaling.autoscalinggroup",
        "resources.aws.autoscaling.launchconfiguration",

        "resources.aws.waf.ratebasedrule",
        "resources.aws.waf.rule",
        "resources.aws.waf.webacl",

        "resources.aws.wafv2.webacl",

        "resources.aws.workspaces.directory",
        "resources.aws.workspaces.ipgroup",
        "resources.aws.workspaces.workspace",

        "resources.aws.generic.subnetresource",
        "resources.aws.generic.vpcresource",
        "resources.aws.generic.globalresource"
      ]
    };
  }]);
