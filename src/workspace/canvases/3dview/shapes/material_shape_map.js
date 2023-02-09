angular
  .module("designer.workspace.canvases.jointjs.3dview.material.map", [])
  .service("MaterialMap", [
    function () {
      return {
        "Resources::AWS::EC2::VPCEndpoint": "Cylinder",
        "Resources::AWS::EC2::VPCPeeringConnection": "Cylinder",
        "Resources::AWS::WAF::WebACL": "Cylinder",
        "Resources::AWS::Lambda::Function": "Cylinder",
        "Resources::GCP::Compute::BackendService": "Hexagon",
        "Resources::GCP::Compute::ExternalVPNGateway": "Hexagon",
        "Resources::GCP::Compute::Instance": "Hexagon",
        "Resources::GCP::Compute::Interconnect": "Hexagon",
        "Resources::GCP::Compute::NATGateway": "Hexagon",
        "Resources::GCP::Compute::NetworkEndpointGroup": "Hexagon",
        "Resources::GCP::Compute::NodeGroup": "Hexagon",
        "Resources::GCP::Compute::RegionBackendService": "Hexagon",
        "Resources::GCP::Compute::RegionURLMap": "Hexagon",
        "Resources::GCP::Compute::TargetPool": "Hexagon",
        "Resources::GCP::Compute::URLMap": "Hexagon",
        "Resources::GCP::Compute::VPNGateway": "Hexagon",
        "Resources::GCP::DNS::ManagedZone": "Hexagon",
        "Resources::GCP::MemoryStore::ManagedZone": "Hexagon",
        "Resources::GCP::MemoryStore::Instance": "Hexagon",
        "Resources::GCP::SQL::Instance": "Hexagon",
        "Resources::GCP::Storage::Bucket": "Hexagon",
        "Resources::Azure::Compute::VirtualMachine": "Cylinder",
        "Resources::Azure::Compute::VirtualMachineScaleSetVM": "Cylinder",
        "Resources::Azure::Network::ApplicationGateway": "Cylinder",
        "Resources::Azure::Network::ExpressRouteCircuit": "Cylinder",
        "Resources::Azure::Network::LoadBalancer": "Cylinder",
        "Resources::Azure::Network::LocalNetworkGateway": "Cylinder",
        "Resources::Azure::Network::VirtualNetworkGateway": "Cylinder",
        "Resources::Azure::Network::VirtualNetworkPeering": "Cylinder",
        "Resources::Azure::Storage::StorageAccount": "Cylinder",
      };
    },
  ]);
