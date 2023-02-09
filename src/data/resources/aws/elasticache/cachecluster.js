angular.module('designer.model.resources.aws.elasticache.cache_cluster', ['designer.model.resource'])
  .factory('AWS_ElastiCacheCacheCluster', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELASTICACHE CLUSTER';
        resource.status = resource.cache_cluster_status;
        resource.status_list = {
          "available": "good",
          "creating": "warn",
          "deleted": "stopped",
          "deleting": "warn",
          "incompatible-network": "bad",
          "modifying": "warn",
          "rebooting cluster nodes": "warn",
          "restore-failed": "bad",
          "snapshotting": "warn"
        };

        resource.info = function() {
          var info = {};

          info.nodes = this.getNodes();

          return info;
        };

        resource.getNodes = function() {
          return environment.connectedTo(this, "Resources::AWS::ElastiCache::CacheNode");
        };

        resource.highlightableConnections = function() {
          return this.getNodes();
        };

        return resource;
      }
    }
  }]);
