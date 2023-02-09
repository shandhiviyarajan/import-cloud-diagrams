angular.module('designer.model.resources.kubernetes.cluster.namespace', ['designer.model.resource'])
.factory('Kubernetes_Namespace', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'NAMESPACE';

      resource.info = function() {
        var info = {};

        info.cluster = this.getCluster();

        return info;
      };

      resource.getCluster = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
      };

      resource.getDaemonSets = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::DaemonSet");
      };

      resource.getDeployments = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Deployment");
      };

      resource.getReplicaSets = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::ReplicaSet");
      };

      resource.getStatefulSets = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::StatefulSet");
      };

      resource.getServices = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Service");
      };

      return resource;
    }
  }
}]);
