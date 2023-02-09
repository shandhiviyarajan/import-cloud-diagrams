angular.module("designer.data.resources.factory", [
  "designer.data.resources.aws.factory",
  "designer.data.resources.azure.factory",
  "designer.data.resources.gcp.factory",
  "designer.data.resources.ibm.factory",
  "designer.data.resources.kubernetes.factory",
])
  .service("ResourcesFactory", ["AWSResourcesFactory", "AzureResourcesFactory", "GCPResourcesFactory", "IBMResourcesFactory", "KubernetesResourcesFactory",
    function(AWSResourcesFactory, AzureResourcesFactory, GCPResourcesFactory, IBMResourcesFactory, KubernetesResourcesFactory)
  {
    return function fromResourceObject(resource, environment) {
      if(resource.type.lastIndexOf("Resources::AWS", 0) === 0) {
        return AWSResourcesFactory(resource, environment);
      }
      else if(resource.type.lastIndexOf("Resources::Azure", 0) === 0) {
        return AzureResourcesFactory(resource, environment);
      }
      else if(resource.type.lastIndexOf("Resources::GCP", 0) === 0) {
        return GCPResourcesFactory(resource, environment);
      }
      else if(resource.type.lastIndexOf("Resources::IBM", 0) === 0) {
        return IBMResourcesFactory(resource, environment);
      }
      else if(resource.type.lastIndexOf("Resources::Kubernetes", 0) === 0) {
        return KubernetesResourcesFactory(resource, environment);
      }
    };
  }]);
