angular.module('designer.model.resources.kubernetes.cluster.persistent_volume', ['designer.model.resource'])
  .factory('Kubernetes_PersistentVolume', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'PERSISTENT VOLUME';

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.claim = this.getPersistentVolumeClaim();
          info.claim.pod = info.claim.getPod();

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
        };

        resource.getPersistentVolumeClaim = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::PersistentVolumeClaim")[0];
        };

        return resource;
      }
    }
  }]);
