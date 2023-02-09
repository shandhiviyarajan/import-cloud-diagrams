angular.module('designer.workspace.layout.infrastructure.azure.virtual_network', [
  'designer.workspace.layout.infrastructure.azure.subnet'
])
.factory('InfrastructureLayoutAzureVirtualNetwork',
  ["InfrastructureLayoutAzureSubnet", function(InfrastructureLayoutAzureSubnet) {
    return {
      load: function(virtual_network, environment) {

        virtual_network.getData = function() {
          var sortable_cidr = function(cidr) {
            var parts = cidr.replace("/", ".").split(".");

            return _.map(parts, function(p) { return p.padStart(3, "0") }).join("");
          }

          // In some very rare cases subnets can have no address prefix, which isn't allowed and causes a looooot of issues with display
          var subnet_list = _.sortBy(_.reject(this.getSubnets(), function(s) { return !s.address_prefix }), [function(s) { return sortable_cidr(s.address_prefix) }]);
          var rows = [];
          var drawn_lbs = [];
          var subnet_size = subnet_list.length;

          _.each(_.range(0, subnet_size, 2), function(subnet_row) {
            var col = [];
            var lb_row = { type: "load_balancer", resources: [] };

            _.each([0,1], function(subnet_col) {
              var index = subnet_row + subnet_col;
              if(!subnet_list[index]) return;

              var subnet_data = InfrastructureLayoutAzureSubnet.load(subnet_list[index], environment).getData();
              col.push(subnet_data);

              var lbs = _.reject(subnet_data.load_balancers, function(lb) { return _.includes(drawn_lbs, lb) });
              lb_row.resources = lb_row.resources.concat(lbs);
              drawn_lbs = drawn_lbs.concat(lbs);
            });

            if(lb_row.resources.length)
              rows.push(lb_row);
            rows.push({ type: "subnet", columns: col });
          });

          return {
            id: this.id,
            center: rows,
            top: this.getTop(),
            right: this.getRight(),
            left: [],
            bottom: []
          };
        };

        virtual_network.getTop = function() {
          var left = [];
          var right = [];
          
          left = left.concat(this.getPrivateDNSZones());

          right = right.concat(this.getVirtualNetworkGateways());
          right = right.concat(this.getLocalNetworkGateways());
          right = right.concat(this.getFirewalls());

          return {
            left: _.map(left, function(r) { return r.id }),
            right: _.map(right, function(r) { return r.id })
          }
        };

        virtual_network.getPrivateDNSZones = function() {
          return environment.connectedTo(this, "Resources::Azure::DNS::Zone").filter((z) => z.zone_type !== "Public");
        };

        virtual_network.getRight = function() {
          var resources = [];

          resources = resources.concat(this.getVirtualNetworkPeeringConnections());

          return _.map(resources, function(r) { return r.id })
        };

        return virtual_network;
      }
    }
  }]);
