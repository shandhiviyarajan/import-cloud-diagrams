angular.module('designer.model.resource', ['designer.model.resource.images', 'designer.data.ip.matcher'])
.factory('Resource', ["ResourceImages", "IpMatcher", function(ResourceImages, IpMatcher) {
    return {
      load: function(obj, environment) {
        var resource = angular.copy(obj);

        resource.summary_line   = "<span></span>";
        resource.provider_id    = resource.provider_id || "";
        resource.simple_name    = resource.type.toLowerCase().replace(/::/g, ".");
        resource.provider_type  = resource.simple_name.split(".")[1];
        resource.display_type   = resource.type.split("::").slice(-1)[0];
        resource.image          = ResourceImages.getUrl(resource);
        resource.connections    = resource.connections || [];
        resource.displayable    = null;
        resource.matched_search = null;
        resource.display_faded  = false;
        resource.has_badge      = false;

        // Map data fields back to the main resource, if we have any
        if(resource.data)
          _.assign(resource, resource.data);

        // To be overriden in child classes to show info specific to the resource
        resource.info = function() { };

        resource.highlightableConnections = function() { return [] };

        resource.getConnectables = function() { return []; };

        resource.getDisplayableConnections = function() {
          if(!this.displayable) {
            this.displayable = this.getConnectables();
          }

          return this.displayable;
        };
        
        // If it is a generic resource show the abbreviation of the type
        // to help the engineer understand what resource is being displaued
        var resource_type = resource.terraform_type;
        if (resource_type && resource.type.includes("Generic::GlobalResource")) {
          resource.getIconInformation = function() {
            var tokens = resource_type.split("_");
            var txt = "G"; // G for Generic or Global

            if (tokens.length > 1) {
              txt = tokens[1][0].toUpperCase()
            }
    
            return {
              txt: txt,
              fill: "#000000",
              'font-size': 30,
              dx: 25,
              dy: 45
            }
          };
        }

        resource.drawable = function() {
          return !this.hidden;
        };

        // Does it have anything to display in a 'BADGE'?
        resource.badgeContent = function() {
          return null;
        };

        resource.setImageUrl = function() {
           this.image = ResourceImages.getUrl(this);
        };

        resource.hasIPMatch = function(ip) {
          var ip_fields = [
            "ip_address", "public_ip", "private_ip_address", "public_ip_address", "cidr_block",
            "private_ipaddress", "ip_address", "gateway_ip_address", "address_space_prefix", "local_network_address_space",
            "backend_addresses", "source_address_prefix", "destination_address_prefix", "address_prefix"
          ];
          var matched = false;

          _.each(ip_fields, function(field) {
            if(!this[field]) return;

            // If ip has a / compare range, otherwise compare string
            if (ip.indexOf("/", 0) !== -1) {
              if(IpMatcher.isIp4InCidr(this[field], ip)) {
                matched = true;
              }
            }
            else {
              if (this[field].lastIndexOf(ip, 0) === 0) {
                matched = true;
              }
            }
          }.bind(this));

          return matched;
        };

        resource.hasTagMatch = function(key, value) {
          var matched = false;

          // Handle quoted strings
          key = key.replace(/"/, "");
          value = value.replace(/"/, "");

          // AWS is an array, Azure is an object
          if(Array.isArray(this.tags)) {
            _.each(this.tags, function(tag_pair) {
              if(key === tag_pair["key"] && value === tag_pair["value"])
                matched = true;
            }.bind(this));
          }
          else {
            if(this.tags && this.tags[key] === value) {
              matched = true;
            }
          }

          return matched;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: null,
            info3: null
          }
        };

        // Check if whether a resource is imported from Terraform state
        // If it is, then we might need to add resources using different routes
        resource.terraformMode = function() {
          if (resource && resource.importMode === 'Terraform') {
            return true;
          }
          return false;
        }

        // We need this for resources which are geenric
        // Meaning we don't have a model/resource created for them yet
        resource.empty = function() {
          return _.isEmpty(this.only_properties);
        }

        return resource;
      }
    }
  }]);
