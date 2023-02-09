angular.module('designer.model.resources.aws.elasticache.subnet_group', ['designer.model.resource'])
  .factory('AWS_ElastiCacheSubnetGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELASTICACHE SUBNET GROUP';

        resource.info = function() {
          var info = {};

          info.cache_clusters = this.getCacheClusters();
          info.subnets = this.getSubnets();

          return info;
        };

        resource.getCacheClusters = function() {
          return environment.connectedTo(this, "Resources::AWS::ElastiCache::CacheCluster");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
        };

        return resource;
      }
    }
  }]);
