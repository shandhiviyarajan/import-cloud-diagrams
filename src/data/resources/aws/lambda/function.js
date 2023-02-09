angular.module('designer.model.resources.aws.lambda.function', ['designer.model.resource'])
  .factory('AWS_LambdaFunction', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LAMBDA FUNCTION';

        resource.info = function() {
          var info = {};

          info.function_versions = this.getFunctionVersion();
          info.event_source_mappings = this.getEventSourceMappings();
          info.aliases = this.getAliases();
          info.layer_versions = this.getLayerVersions();
          info.api_gateways = this.getAPIGateways();
          info.security_group = this.getSecurityGroup();
          info.cloudfront_distributions = this.getCloudFrontDistributions();

          return info;
        };

        resource.getExtendedInformation = function() {
          return {
            info1: this.provider_id,
            info2: this.runtime,
            info3: this.version
          }
        };

        resource.getFunctionVersion = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::FunctionVersion");
        };

        resource.getEventSourceMappings = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::EventSourceMapping");
        };

        resource.getAliases = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::LambdaAlias");
        };

        resource.getLayerVersions = function() {
          return environment.connectedTo(this, "Resources::AWS::Lambda::LayerVersion");
        };

        resource.getAPIGateways = function() {
          return environment.connectedTo(this, "Resources::AWS::APIGateway::Resource");
        };

        resource.getSecurityGroup = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup")[0];
        };

        resource.getCloudFrontDistributions = function() {
          return environment.connectedTo(this, "Resources::AWS::CloudFront::Distribution");
        };

        return resource;
      }
    }
  }]);
