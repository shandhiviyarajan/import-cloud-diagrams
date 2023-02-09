angular.module('designer.model.resources.kubernetes.cluster.service', ['designer.model.resource'])
.factory('Kubernetes_Service', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SERVICE';

      resource.info = function() {
        var info = {};

        info.cluster = this.getCluster();
        info.namespace = this.getNamespace();
        info.pods = this.getPods();
        info.load_balancer_status_ips = _.map((this.load_balancer_status || []), (s) => s.ip);

        // Map pod details to endpoints
        var endpoint = this.getEndpoint();
        if(endpoint) {
          _.each(endpoint["subsets"] || [], function(subset) {
            _.each(subset["addresses"] || [], function(address) {
              var pod = _.find(info.pods, (p) => p.name === address.targetRef.name);
              if(pod)
                pod.endpoint_ip = address.ip;
            });
          });
        }

        return info;
      };

      resource.getCluster = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Cluster")[0];
      };

      resource.getNamespace = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Namespace")[0];
      };

      resource.getPods = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Pod");
      };

      resource.getEndpoint = function() {
        return environment.connectedTo(this, "Resources::Kubernetes::Cluster::Endpoint")[0];
      };

      resource.highlightableConnections = function() {
        return this.getPods();
      };

      resource.getConnectables = function() {
        return this.getPods();
      };

      return resource;
    }
  }
}]);
