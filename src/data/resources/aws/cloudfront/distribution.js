angular.module('designer.model.resources.aws.cloudfront.distribution', ['designer.model.resource'])
  .factory('AWS_CloudFront_Distribution', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CLOUDFRONT DISTRIBUTION';
        resource.status_list = {
          "inprogress": "warn",
          "deployed": "good"
        };

        resource.protocol_policy_map = {
          "allow-all": "Allow all",
          "https-only": "HTTPS only",
          "redirect-to-https": "Redirect HTTP to HTTPS"
        }

        resource.custom_origin_protocol_policy_map = {
          "http-only": "HTTP Only",
          "match-viewer": "Match Viewer",
          "https-only": "HTTPS Only"
        }

        resource.info = function() {
          var info = {};
          var lambdas = {};
          var load_balancers = {};
          var buckets = {};

          // Setup some lookups for linking behaviours and origins
          _.each(this.getLambdaFunctions(), function(f) { lambdas[f.provider_id] = f });
          _.each(this.getLoadBalancers(), function(lb) { load_balancers[lb.dns_name] = lb });
          _.each(this.getS3Buckets(), function(b) { buckets[b.name] = b });

          info.behaviors = this.cache_behaviors.items.concat([this.default_cache_behavior]);
          info.web_acl = this.getWebACL();

          // Link behaviours to lambda functions if possible
          _.each(info.behaviors, function(b) {
            _.each(b.lambda_function_associations.items, function(i) {
              // ARN is for a version, we need the function arn
              var parts = i.lambda_function_arn.split(":");
              parts.pop()

              i.lambda_function = lambdas[parts.join(":")];
            });
          });

          // Link origins to buckets and LB's if possible
          _.each(this.origins.items, function(origin) {
            if (origin.domain_name.indexOf("elb.amazonaws.com") !== -1) {
              origin.origin_resource = load_balancers[origin.domain_name];
            }
            else if (origin.domain_name.indexOf("s3.amazonaws.com") !== -1 || origin.domain_name.indexOf(".s3-website") !== -1) {
              var bucket_name = origin.domain_name.split(".s3")[0];
              origin.origin_resource = buckets[bucket_name];
            }
          });

          return info;
        };

        resource.getLambdaFunctions = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::Function");
        };

        resource.getLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancing::LoadBalancer").concat(
            environment.connectedTo(this, "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer")
          );
        };

        resource.getS3Buckets = function() {
          return environment.connectedTo(this, "Resources::AWS::S3::Bucket");
        };

        resource.getWebACL = function() {
          return environment.connectedTo(this, "Resources::AWS::WAF::WebACL")[0];
        };

        resource.getConnectables = function() {
          var connectables = []

          var acl = this.getWebACL()
          if(acl) {
            connectables.push(acl);
          }

          connectables = connectables.concat(this.getLambdaFunctions());
          connectables = connectables.concat(this.getLoadBalancers());
          connectables = connectables.concat(this.getS3Buckets());

          return connectables;
        };

        return resource;
      }
    }
  }]);
