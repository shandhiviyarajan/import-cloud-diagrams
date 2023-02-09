angular.module('designer.model.resources.aws.redshift.cluster_node', ['designer.model.resource'])
  .factory('AWS_RedshiftClusterNode', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REDSHIFT CLUSTER NODE';

        resource.info = function() {
          var info = {};

          info.cluster = this.getRedshiftCluster();

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.private_ip_address,
            info3: this.public_ip_address
          }
        };

        resource.getRedshiftCluster = function() {
          return environment.connectedTo(this, "Resources::AWS::Redshift::Cluster")[0];
        };

        return resource;
      }
    }
  }]);
