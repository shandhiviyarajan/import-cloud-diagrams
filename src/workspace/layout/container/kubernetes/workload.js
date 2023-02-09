angular.module('designer.workspace.layout.container.kubernetes.workload', [])
.factory('ContainerLayoutKubernetesWorkload', [function() {
  return {
    load: function(workload, environment) {
      workload.getData = function() {
        var pods = this.getPods();

        return {
          id: this.id,
          tasks: pods,
          max_tasks: Math.max((this.desired_count || 0), pods.length),
          load_balancers: [],
          volumes: this.getVolumes(),
          type: "workload",
          container: true,
          x: 0,
          y: 0,
          w: 0,
          h: 0
        }
      };

      workload.getPods = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Pod");
      };

      workload.getVolumes = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::PersistentVolume");
      };

      return workload;
    }
  }
}]);
