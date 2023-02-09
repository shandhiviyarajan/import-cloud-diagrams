angular.module('designer.model.images.kubernetes_classic', [])
.service('Kubernetes_ClassicImages', [function() {
  return {
    "list" : [
      "resources.kubernetes.cluster.cluster",
      "resources.kubernetes.cluster.daemonset",
      "resources.kubernetes.cluster.deployment",
      "resources.kubernetes.cluster.namespace",
      "resources.kubernetes.cluster.node",
      "resources.kubernetes.cluster.persistentvolume",
      "resources.kubernetes.cluster.persistentvolumeclaim",
      "resources.kubernetes.cluster.pod",
      "resources.kubernetes.cluster.replicaset",
      "resources.kubernetes.cluster.service",
      "resources.kubernetes.cluster.statefulset"
    ]
  };
}]);
