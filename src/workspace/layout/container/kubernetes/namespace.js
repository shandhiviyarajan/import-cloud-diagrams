angular.module('designer.workspace.layout.container.kubernetes.namespace', [
  "designer.workspace.layout.container.kubernetes.service",
  "designer.workspace.layout.container.kubernetes.workload"
])
.factory('ContainerLayoutKubernetesNamespace', [
  "ContainerLayoutKubernetesWorkload", "ContainerLayoutKubernetesService", function(ContainerLayoutKubernetesWorkload, ContainerLayoutKubernetesService) {
  return {
    load: function(namespace, environment) {
      namespace.getData = function() {
        var workloads  = _.orderBy(this.getWorkloads(), ["name"]);
        var services  = _.orderBy(this.getServices(), ["name"]);

        var cells = _.map(services, (s) => ContainerLayoutKubernetesService.load(s, environment).getData()).concat(
          _.map(workloads, (s) => ContainerLayoutKubernetesWorkload.load(s, environment).getData())
        )

        return {
          id: this.id,
          cells: _.map(workloads, (s) => ContainerLayoutKubernetesWorkload.load(s, environment).getData()),
          top: _.map(services, (s) => ContainerLayoutKubernetesService.load(s, environment).getData()),
          type: "namespace",
          container: true,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          style: { "padding-top": "25px", "margin-bottom": "25px" }
        }
      };

      namespace.getWorkloads = function() {
        var containers = [];
        var sets = this.getDaemonSets().concat(this.getReplicaSets()).concat(this.getStatefulSets());

        _.each(sets, function(set) {
          var deployments = environment.connectedTo(set, "Resources::Kubernetes::Cluster::Deployment");
          if (deployments.length === 0) {
            containers.push(set);
          }
          else {
            containers.push(...deployments);
          }
        });

        return _.uniq(containers);
      };

      return namespace;
    }
  }
}]);
