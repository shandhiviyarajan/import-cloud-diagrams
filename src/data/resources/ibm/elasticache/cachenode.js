angular.module('designer.model.resources.ibm.elasticache.cache_node', ['designer.model.resource'])
  .factory('IBM_ElastiCacheCacheNode', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CACHE NODE';
        resource.status = resource.cache_node_status;
        
        resource.info = function() {
          var info = {};

          info.cache_cluster = this.getCacheCluster();

          return info;
        };

        resource.getExtendedInformation = function() {
          var cluster = this.getCacheCluster();

          return {
            info1: this.provider_id,
            info2: cluster.name,
            info3: null
          }
        };

        resource.getIconInformation = function() {
          return {
            txt: this.getCacheCluster().engine[0].toUpperCase(),
            fill: "#3b48cc",
            'font-size': 18,
            dx: 29, 
            dy: 50
          }
        };

        resource.getCacheCluster = function() {
          return environment.connectedTo(this, "Resources::IBM::ElastiCache::CacheCluster")[0];
        };

        return resource;
      }
    }
  }]);
