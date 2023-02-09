angular.module('designer.model.resources.azure.dns.record_set', ['designer.model.resource'])
.factory('Azure_DNSRecordSet', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);

      resource.formatted_type = resource.record_set_type.replace("Microsoft.Network/dnszones/", "");

      resource.info = function() {
        var info = {};

        info.zone = this.getZone();
        info.resource_group = this.getResourceGroup();
        info.records = {
          "A Records": this.a_records,
          "AAAA Records": this.aaaa_records,
          "MX Records": this.mx_records,
          "NS Records": this.ns_records,
          "CAA Records": this.caa_records,
          "PTR Records": this.ptr_records,
          "SRV Records": this.srv_records
        }

        return info;
      };

      resource.getZone = function() {
        return environment.connectedTo(this, "Resources::Azure::DNS::Zone")[0];
      };

      resource.getResourceGroup = function() {
        return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
      };


      return resource;
    }
  }
}]);
