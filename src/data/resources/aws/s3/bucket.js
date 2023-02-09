angular.module('designer.model.resources.aws.s3.bucket', ['designer.model.resource'])
  .factory('AWS_S3Bucket', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'S3 BUCKET';

        resource.info = function() {
          var info = {};

          info.policy_document = JSON.stringify(JSON.parse(this.policy), null, 2);
          info.cloudfront_distributions = this.getCloudFrontDistributions();
          
          return info;
        };

        resource.getCloudFrontDistributions = function() {
          return environment.connectedTo(this, "Resources::AWS::CloudFront::Distribution").concat(
            environment.connectedTo(this, "Resources::AWS::CloudFront::StreamingDistribution")
          );
        };
        
        return resource;
      }
    }
  }]);
