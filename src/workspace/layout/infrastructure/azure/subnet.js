angular.module('designer.workspace.layout.infrastructure.azure.subnet', [])
.factory('InfrastructureLayoutAzureSubnet',
  [function() {
    return {
      load: function(subnet, environment) {

        subnet.getData = function() {
          var resources = [];
          resources = resources.concat(this.getVirtualMachines());
          resources = resources.concat(this.getBatchPools());
          resources = resources.concat(this.getPrivateEndpoints());

          return {
            id: this.id,
            name: this.name,
            resources: _.map(resources, function(r) { return r.id }),
            load_balancers: _.map(this.getLoadBalancers(), function(r) { return r.id }),
            custom_class: "subnet-azure"
          }
        };

        return subnet;
      }
    }
  }]);
