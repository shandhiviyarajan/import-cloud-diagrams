angular.module('designer.data.ip.matcher', [])
.service('IpMatcher', [function() {
  return {
    ip4ToInt: function(ip) {
      return ip.split('.').reduce(function(int, oct) { return (int << 8) + parseInt(oct, 10) }, 0) >>> 0;
    },

    isIp4InCidr: function(ip, cidr) {
      var parts = cidr.split("/");
      var range = parts[0];
      var bits = parts[1] || 32;

      var mask = ~(Math.pow(2, (32 - bits)) - 1);
      return (this.ip4ToInt(ip) & mask) === (this.ip4ToInt(range) & mask);
    }
  };
}]);
