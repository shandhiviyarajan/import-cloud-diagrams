angular.module('designer.model.resources.kubernetes.cluster.node', ['designer.model.resource'])
  .factory('Kubernetes_Node', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NODE';
        
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
          var highlightable = [];

          highlightable = highlightable.concat(this.getPods());

          return highlightable;
        };

        return resource;
      }
    }
  }]);
