angular.module('designer.model.resources.aws.ec2.security_group_permission', ['designer.model.resource'])
  .factory('AWS_SecurityGroupPermission', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        // Get the source group for this rule, not it's other attachments
        resource.getSecurityGroup = function() {
          var parent = null;

          _.each(this.connections, function(connection) {
            if (connection.remote_resource_type === "Resources::AWS::EC2::SecurityGroupPermission" &&
                connection.remote_resource_id === this.id) {
              parent = environment.getResource(connection.resource_id);
            }
          }.bind(this));

          return parent;
        };

        resource.getSourceGroups = function() {
          var groups = [];

          _.each(this.connections, function(connection) {
            if (connection.remote_resource_type === "Resources::AWS::EC2::SecurityGroup" &&
                connection.resource_id === this.id) {
              groups.push(environment.getResource(connection.remote_resource_id));
            }
          }.bind(this));

          return _.compact(groups);
        };

        return resource;
      }
    }
  }]);
