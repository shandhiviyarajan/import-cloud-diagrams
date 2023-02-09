angular.module('designer.model.resources.kubernetes.cluster.deployment', ['designer.model.resource'])
.factory('Kubernetes_Deployment', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'DEPLOYMENT';

      resource.info = function() {
        var info = {};

        info.replica_sets = this.getReplicaSets();
        info.replica_set_pods = {};

        _.each(info.replica_sets, function(replica_set) {
          info.replica_set_pods[replica_set.name] = replica_set.getPods();
        });

        info.primary_replica_set = _.sortBy(info.replica_sets, ["start_time"])[info.replica_sets.length-1];

        return info;
      };

      resource.getReplicaSets = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::ReplicaSet");
      };

      return resource;
    }
  }
}]);
