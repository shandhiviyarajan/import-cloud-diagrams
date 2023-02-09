angular.module('designer.model.resources.kubernetes.cluster.persistent_volume_claim', ['designer.model.resource'])
.factory('Kubernetes_PersistentVolumeClaim', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'PERSISTENT VOLUME CLAIM';

      resource.info = function() {
        var info = {};

        info.cluster = this.getCluster();
        info.namespace = this.getNamespace();
        info.volume = this.getPersistentVolume();
        info.pod = this.getPod();

        return info;
      };

      resource.getCluster = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
      };

      resource.getNamespace = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Namespace")[0];
      };

      resource.getPersistentVolume = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::PersistentVolume")[0];
      };

      resource.getPod = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Pod")[0];
      };

      return resource;
    }
  }
}]);
