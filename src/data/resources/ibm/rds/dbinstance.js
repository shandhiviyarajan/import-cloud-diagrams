angular.module('designer.model.resources.ibm.rds.db_instance', ['designer.model.resource'])
  .factory('IBM_DBInstance', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        var ENGINE_FORMAT = {
          "mariadb": { txt: "MariaDB", 'font-size': 15, dy: 21 },
          "mysql": { txt: "MySQL", 'font-size': 15, dy: 21 },
          "oracle": { txt: "Oracle", 'font-size': 19, dy: 21 },
          "postgres": { txt: "PostgreSQL", 'font-size': 12, dy: 21, textLength: "60", lengthAdjust: "spacingAndGlyphs" },
          "aurora": { txt: "Amazon Aurora", 'font-size': 12, dy: 15, dx2: -46  },
          "rds": { txt: "Amazon RDS", 'font-size': 12, dy: 15, dx2: -46 },
          "proxy": { txt: "RDS Proxy", 'font-size': 12, dy: 15, dx2: -24 },
          "sqlserver": { txt: "SQL Server", 'font-size': 12, dy: 15, dx2: -24 },
        };
        
        resource = Resource.load(resource, environment);
        resource.type_name = 'DATA STORE';

        resource.summary_line =
          '<span class="resource-summary">' +
          resource.engine + " (" + resource.engine_version + ")" + "&nbsp;&nbsp;&nbsp;" +
          resource.instance_class +
          '</span>';

        resource.info = function() {
          var info = {};

          info.security_groups = this.getSecurityGroups();

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.engine,
            info3: this.allocated_storage + " GB"
          }
        };

        resource.getIconInformation = function() {
          var base_engine_type = this.engine.split("-")[0] || this.engine;
          var attrs = {
            txt: "",
            fill: "#3b48cc",
            dx: 6, 
            dy2: 14
          }
          return _.assign(attrs, ENGINE_FORMAT[base_engine_type]);
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::SecurityGroup");
        };

        // TODO: do we have this connection? Do we need it anywhere?
        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
        };

        return resource;
      }
    }
  }]);
