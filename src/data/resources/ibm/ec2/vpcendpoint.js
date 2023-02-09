angular.module('designer.model.resources.ibm.ec2.vpc_endpoint', ['designer.model.resource'])
  .factory('IBM_VPCEndpoint', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DIRECT LINK';

        resource.info = function() {
          var info = {};

          info.policy_document = JSON.stringify(JSON.parse(this.policy_document), null, 2);
          info.s3_buckets      = this.getS3Buckets();

          return info;
        };

        resource.getS3Buckets = function() {
          return environment.connectedTo(this, "Resources::IBM::S3::Bucket");
        };

        return resource;
      }
    }
  }]);
