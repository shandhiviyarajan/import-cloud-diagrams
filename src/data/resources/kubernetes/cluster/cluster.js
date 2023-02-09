angular.module('designer.model.resources.kubernetes.cluster.cluster', ['designer.model.resource'])
  .factory('Kubernetes_Cluster', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CLUSTER';
        resource.launch_type = resource.namespace;
        
        resource.info = function() {
          var info = {};

          // TODO: need to sort all this out - don't need the length values, guess I need to review allthe attributes
          var deployments = this.getDeployments()
          info.deployments_length = deployments.length;
          info.deployments = this.groupNamespace(deployments)

          var daemon_sets = this.getDaemonSets()
          info.daemon_sets_length = daemon_sets.length;
          info.daemon_sets = this.groupNamespace(daemon_sets);

          var replica_sets = this.getReplicaSets()
          info.replica_sets_length = replica_sets.length;
          info.replica_sets = this.groupNamespace(replica_sets);

          var stateful_sets = this.getStatefulSets()
          info.stateful_sets_length = stateful_sets.length;
          info.stateful_sets = this.groupNamespace(stateful_sets);

          var pods = this.getPods()
          info.pods_length = pods.length;
          info.pods = this.groupNamespace(pods);

          info.persistent_volumes = this.getPersistentVolumes();
          info.nodes = this.getNodes();

          return info;
        };

        resource.groupNamespace = function(items) {
          var group = {};
          _.each(items, function(item) {
            if (!group[item.namespace]) { group[item.namespace] = [] }
            group[item.namespace].push(item);
          });
          return group;
        };

        resource.getDaemonSets = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::DaemonSet");
        };

        resource.getDeployments = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Deployment");
        };

        resource.getReplicaSets = function() {
          var sets = environment.connectedTo(this, "Resources::Kubernetes::Cluster::ReplicaSet");
          return _.filter(sets, (s) => !s.getDeployment());
        };

        resource.getStatefulSets = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::StatefulSet");
        };

        resource.getPods = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Pod");
        };

        resource.getNamespaces = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Namespace");
        };

        resource.getPersistentVolumes = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::PersistentVolume");
        };

        resource.getNodes = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Node");
        };

        return resource;
      }
    }
  }]);
