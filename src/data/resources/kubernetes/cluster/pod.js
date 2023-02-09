angular.module('designer.model.resources.kubernetes.cluster.pod', ['designer.model.resource'])
  .factory('Kubernetes_Pod', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'POD';

        resource.status_list = {
          "pending": "warn",
          "running": "good",
          "succeeded": "good",
          "failed": "bad",
          "unknown": "stopped"
        };
        
        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.node = this.getNode();
          info.deployment = this.getDeployment();
          info.replica_set = this.getReplicaSet();
          info.stateful_set = this.getStatefulSet();
          info.service_account = this.getServiceAccount();
          info.namespace = this.getNamespace();
          info.claims = _.map(this.getPersistentVolumeClaims(), function(claim) {
            claim.volume = claim.getPersistentVolume();
            return claim;
          });

          info.containers = _.map(resource.containers, function(c) {
            var status = _.find(resource.container_statuses, (cs) => cs.name === c.name) || {};
            status.state_name = Object.keys(status.state || {})[0];
            c.container_status = status;
            return c;
          })

          return info;
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
        };

        resource.getDeployment = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Deployment")[0];
        };

        resource.getServiceAccount = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::ServiceAccount")[0];
        };

        resource.getNamespace = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Namespace")[0];
        };

        resource.getNode = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Node")[0];
        };

        resource.getReplicaSet = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::ReplicaSet")[0];
        };

        resource.getStatefulSet = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::StatefulSet")[0];
        };

        resource.getPersistentVolumeClaims = function() {
          return environment.connectedTo(this, "Resources::Kubernetes::Cluster::PersistentVolumeClaim");
        };

        return resource;
      }
    }
  }]);
