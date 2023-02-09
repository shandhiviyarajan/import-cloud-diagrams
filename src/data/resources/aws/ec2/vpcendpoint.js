angular.module('designer.model.resources.aws.ec2.vpc_endpoint', ['designer.model.resource'])
  .factory('AWS_VPCEndpoint', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPC ENDPOINT';
        resource.status_list = {
          "pendingAcceptance": "warn",
          "pending": "warn",
          "available": "good",
          "deleting": "warn",
          "deleted": "stopped",
          "rejecting": "warn",
          "rejected": "bad",
          "failed": "bad",
          "failing": "warn"
        };

        resource.info = function() {
          var info = {};

          info.policy_document = JSON.stringify(JSON.parse(this.policy_document), null, 2);
          info.s3_buckets      = this.getS3Buckets();

          return info;
        };

        resource.getS3Buckets = function() {
          return environment.connectedTo(this, "Resources::AWS::S3::Bucket");
        };

        return resource;
      }
    }
  }]);
