angular.module('designer.model.resources.kubernetes.cluster.replica_set', ['designer.model.resource'])
  .factory('Kubernetes_ReplicaSet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REPLICA SET';

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.deployment = this.getDeployment();
          info.pods = this.getPods();

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
        };

        resource.getDeployment = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Deployment")[0];
        };

        resource.getPods = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Pod");
        };

        resource.highlightableConnections = function() {
          return this.getPods();
        };

        return resource;
      }
    }
  }]);
