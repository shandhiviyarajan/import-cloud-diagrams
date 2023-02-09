angular.module('designer.model.resources.kubernetes.cluster.service_account', ['designer.model.resource'])
.factory('Kubernetes_ServiceAccount', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SERVICE ACCOUNT';

      resource.info = function() {
        var info = {};

        info.cluster = this.getCluster();
        info.namespace = this.getNamespace();
        info.pods = this.getPods();

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

      resource.highlightableConnections = function() {
        return this.getPods();
      };

      return resource;
    }
  }
}]);
