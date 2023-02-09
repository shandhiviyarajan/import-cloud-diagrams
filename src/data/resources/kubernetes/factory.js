angular.module("designer.data.resources.kubernetes.factory", [
  'designer.model.resource',

  "designer.model.resources.kubernetes.cluster.cluster",
  "designer.model.resources.kubernetes.cluster.daemon_set",
  "designer.model.resources.kubernetes.cluster.deployment",
  "designer.model.resources.kubernetes.cluster.namespace",
  "designer.model.resources.kubernetes.cluster.node",
  "designer.model.resources.kubernetes.cluster.persistent_volume",
  "designer.model.resources.kubernetes.cluster.persistent_volume_claim",
  "designer.model.resources.kubernetes.cluster.pod",
  "designer.model.resources.kubernetes.cluster.replica_set",
  "designer.model.resources.kubernetes.cluster.service",
  "designer.model.resources.kubernetes.cluster.service_account",
  "designer.model.resources.kubernetes.cluster.stateful_set",

])
  .service("KubernetesResourcesFactory",
    [
      "Resource",

      "Kubernetes_Cluster",
      "Kubernetes_DaemonSet",
      "Kubernetes_Deployment",
      "Kubernetes_Namespace",
      "Kubernetes_Node",
      "Kubernetes_PersistentVolume",
      "Kubernetes_PersistentVolumeClaim",
      "Kubernetes_Pod",
      "Kubernetes_ReplicaSet",
      "Kubernetes_Service",
      "Kubernetes_ServiceAccount",
      "Kubernetes_StatefulSet",

      function(
        Resource,

        Kubernetes_Cluster,
        Kubernetes_DaemonSet,
        Kubernetes_Deployment,
        Kubernetes_Namespace,
        Kubernetes_Node,
        Kubernetes_PersistentVolume,
        Kubernetes_PersistentVolumeClaim,
        Kubernetes_Pod,
        Kubernetes_ReplicaSet,
        Kubernetes_Service,
        Kubernetes_ServiceAccount,
        Kubernetes_StatefulSet
  )
      {
        return function fromResourceObject(resource, environment) {
          var constructors = {
            "Resources::Kubernetes::Cluster::Cluster": Kubernetes_Cluster,
            "Resources::Kubernetes::Cluster::DaemonSet": Kubernetes_DaemonSet,
            "Resources::Kubernetes::Cluster::Deployment": Kubernetes_Deployment,
            "Resources::Kubernetes::Cluster::Namespace": Kubernetes_Namespace,
            "Resources::Kubernetes::Cluster::Node": Kubernetes_Node,
            "Resources::Kubernetes::Cluster::PersistentVolume": Kubernetes_PersistentVolume,
            "Resources::Kubernetes::Cluster::PersistentVolumeClaim": Kubernetes_PersistentVolumeClaim,
            "Resources::Kubernetes::Cluster::Pod": Kubernetes_Pod,
            "Resources::Kubernetes::Cluster::ReplicaSet": Kubernetes_ReplicaSet,
            "Resources::Kubernetes::Cluster::Service": Kubernetes_Service,
            "Resources::Kubernetes::Cluster::ServiceAccount": Kubernetes_ServiceAccount,
            "Resources::Kubernetes::Cluster::StatefulSet": Kubernetes_StatefulSet
          };

          var c = constructors[resource.type];

          return c ? c.load(resource, environment) : Resource.load(resource, environment);
        };
      }]);
