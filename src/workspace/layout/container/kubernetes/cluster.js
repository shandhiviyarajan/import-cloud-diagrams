angular.module('designer.workspace.layout.container.kubernetes.cluster', [
  "designer.workspace.layout.container.kubernetes.namespace",
  "designer.state"
])
.factory('ContainerLayoutKubernetesCluster', ["ContainerLayoutKubernetesNamespace", "DesignerState", function(ContainerLayoutKubernetesNamespace, DesignerState) {
  return {
    load: function(cluster, environment) {
      cluster.getData = function() {
        var namespaces  = _.orderBy(this.getNamespaces(), ["name"]);

        if (DesignerState.get("hideNamespaces")) {
          namespaces = _.reject(namespaces, (ns) => ns.name.startsWith("kube-"));
        }

        return {
          id: this.id,
          cells: _.map(namespaces, function(n) { return ContainerLayoutKubernetesNamespace.load(n, environment).getData() }),
          type: "cluster",
          container: true,
          x: 0,
          y: 0,
          w: 0,
          h: 0
        }
      };

      return cluster;
    }
  }
}]);
