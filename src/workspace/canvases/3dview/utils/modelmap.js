angular
  .module("designer.workspace.canvases.jointjs.3dview.modelmap", [])
  .service("ModelMap", [
    function () {
      let assetLocation;

      // Check if the icons_url is set
      // If not available serve 3D models locally
      if (window.icons_url) {
        assetLocation = `${window.icons_url}/3dmodels/`
      } else {
        assetLocation = '/assets/icons/3dmodels/'
      }
      return {
        assetLocation,
        texture: `${assetLocation}colors.png`,
        map: {
          "Resources::AWS::EC2::CustomerGateway": "customer_gateway.obj",
          "Resources::AWS::EC2::Instance": "ec2.obj",
          "Resources::AWS::EC2::InternetGateway": "internet_gatway.obj",
          "Resources::AWS::EC2::NATGateway": "nat_gateway.obj",
          "Resources::AWS::EC2::VPNGateway": "vpn_gateway.obj",
          "Resources::AWS::ElasticLoadBalancing::LoadBalancer": "elb.obj",
          "Resources::AWS::RDS::DBInstance": "rds_primary.obj",
          "Resources::AWS::S3::Bucket": "s3.obj",
          "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer":
            "elb.obj",
          "Resources::AWS::EFS::FileSystem": "efs.obj",
        },
      };
    },
  ]);
