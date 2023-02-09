angular.module('designer.model.resources.kubernetes.cluster.stateful_set', ['designer.model.resource'])
  .factory('Kubernetes_StatefulSet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'STATEFUL SET';

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.pods = this.getPods();

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
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
