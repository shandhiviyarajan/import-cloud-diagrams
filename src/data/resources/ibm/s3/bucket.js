angular.module('designer.model.resources.ibm.s3.bucket', ['designer.model.resource'])
  .factory('IBM_S3Bucket', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'OBJECT STORE';

        resource.info = function() {
          var info = {};

          info.policy_document = JSON.stringify(JSON.parse(this.policy), null, 2);
          info.cloudfront_distributions = this.getCloudFrontDistributions();
          
          return info;
        };

        resource.getCloudFrontDistributions = function() {
          return environment.connectedTo(this, "Resources::IBM::CloudFront::Distribution").concat(
            environment.connectedTo(this, "Resources::IBM::CloudFront::StreamingDistribution")
          );
        };
        
        return resource;
      }
    }
  }]);
