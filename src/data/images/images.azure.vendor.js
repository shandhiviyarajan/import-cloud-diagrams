angular.module('designer.model.images.azure_vendor', [])
  .service('Azure_VendorImages', [function() {
    return {
      "list" : [
        "resources.azure.compute.availabilityset",
        "resources.azure.compute.virtualmachinescaleset",
        "resources.azure.compute.virtualmachine",
        "resources.azure.compute.virtualmachineextension",

        "resources.azure.batch.application",
        "resources.azure.batch.applicationpackage",
        "resources.azure.batch.batchaccount",
        "resources.azure.batch.pool",

        "resources.azure.dns.recordset",
        "resources.azure.dns.zone",

        "resources.azure.eventhub.eventhub",
        "resources.azure.eventhub.namespace",
  
        "resources.azure.mariadb.server",
  
        "resources.azure.mysql.server",

        "resources.azure.network.applicationgateway",
        "resources.azure.network.applicationsecuritygroup",
        "resources.azure.network.expressroutecircuit",
        "resources.azure.network.expressroutecircuit.peering",
        "resources.azure.network.firewall",
        "resources.azure.network.loadbalancer",
        "resources.azure.network.networkinterface",
        "resources.azure.network.localnetworkgateway",
        "resources.azure.network.networksecuritygroup",
        "resources.azure.network.privateendpoint",
        "resources.azure.network.privatelinkservice",
        "resources.azure.network.publicipaddress",
        "resources.azure.network.route",
        "resources.azure.network.routetable",
        "resources.azure.network.securityrule",
        "resources.azure.network.subnet",
        "resources.azure.network.virtualnetwork",
        "resources.azure.network.virtualnetworkpeering",
        "resources.azure.network.virtualnetworkgateway",
        "resources.azure.network.virtualnetworkgatewayconnection",
        "resources.azure.network.webapplicationfirewallpolicy",
        
        "resources.azure.postgresql.server",
       
        "resources.azure.redis.rediscache",
      
        "resources.azure.resources.resource",
        "resources.azure.resources.resourcegroup",

        "resources.azure.servicebus.namespace",
        "resources.azure.servicebus.queue",
        "resources.azure.servicebus.subscription",
        "resources.azure.servicebus.topic",

        "resources.azure.storage.storageaccount",
      
        "resources.azure.generic.globalresource",
        
        "resources.azure.sql.server",
        "resources.azure.sql.database"
      ]
    };
  }]);
