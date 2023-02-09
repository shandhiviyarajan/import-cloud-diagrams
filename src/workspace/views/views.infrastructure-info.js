angular.module('designer.workspace.views.infrastructure-info', [
  'designer.workspace.views.infrastructure',
  'designer.workspace.views.infrastructure-info.shapes.resource',
  'designer.workspace.views.infrastructure-info.shapes.elb'
])
.factory('InfrastructureInfoView', ["InfrastructureView", "InfrastructureInfoResourceElement", "InfrastructureInfoELBElement",
  function(InfrastructureView, InfrastructureInfoResourceElement, InfrastructureInfoELBElement) {
  return {
    create: function(obj) {
      var view = InfrastructureView.create(obj);
      view.name = "Extended Infrastructure";

      // Deny visio export
      view.supported_exports.vsdx = false;

      // AWS shapes
      view.model.shapes.custom["Resources::AWS::EC2::Instance"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::EC2::NATGateway"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::EFS::FileSystem"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::RDS::DBInstance"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::RDS::DBCluster"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::AutoScaling::AutoScalingGroup"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::ElasticLoadBalancing::LoadBalancer"] = InfrastructureInfoELBElement;
      view.model.shapes.custom["Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer"] = InfrastructureInfoELBElement;
      view.model.shapes.custom["Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer"] = InfrastructureInfoELBElement;
      view.model.shapes.custom["Resources::AWS::ElastiCache::CacheNode"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::Redshift::ClusterNode"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::WorkSpaces::WorkSpace"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::DirectoryService::Directory"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::AWS::Lambda::Function"] = InfrastructureInfoResourceElement;

      // Azure shapes
      view.model.shapes.custom["Resources::Azure::Compute::VirtualMachine"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::Azure::Batch::Pool"] = InfrastructureInfoResourceElement;

      // GCP shapes
      // TODO: I think we need a custom GCP shape for the load balancer so we can figure out which info to show
      view.model.shapes.custom["Resources::GCP::Compute::Instance"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::GCP::SQL::Instance"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::GCP::MemoryStore::Instance"] = InfrastructureInfoResourceElement;
      view.model.shapes.custom["Resources::GCP::Compute::URLMap"] = InfrastructureInfoELBElement;
      view.model.shapes.custom["Resources::GCP::Compute::RegionURLMap"] = InfrastructureInfoELBElement;
      view.model.shapes.custom["Resources::GCP::Compute::TargetPool"] = InfrastructureInfoELBElement;
      view.model.shapes.custom["Resources::GCP::Compute::BackendService"] = InfrastructureInfoELBElement;

      return view;
    }
  }
}]);
