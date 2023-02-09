angular.module('designer.model.resources.aws.cloudfront.streamingdistribution', ['designer.model.resource'])
  .factory('AWS_CloudFront_StreamingDistribution', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CLOUDFRONT STREAMING DISTRIBUTION';
        resource.status_list = {
          "deployed": "good"
        };

        resource.info = function() {
          var info = {};

          info.bucket = this.getS3Bucket();

          return info;
        };

        resource.getS3Bucket = function() {
          return environment.connectedTo(this, "Resources::AWS::S3::Bucket")[0];
        };

        resource.getConnectables = function() {
          return _.compact([this.getS3Bucket()]);
        };

        return resource;
      }
    }
  }]);
