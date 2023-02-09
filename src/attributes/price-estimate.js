angular.module('designer.attributes.price-estimate', [])
  .directive('priceEstimate', [function() {
    return {
      replace: true,
      templateUrl: "/designer/attributes/price-estimate.html",
      link: function(scope, element, attrs) {
        scope.extended = false;

        scope.loadPricing = function() {
          scope.price = 0;
          scope.extended_info = {
            "Elastic IP": 0,
            "Load Balancing": 0,
            "EFS": 0,
            "WAF": 0,
            "WorkSpaces": 0,
            "NAT Gateway": 0,
            "EC2 Instance": 0,
            "RDS Cluster": 0,
            "RDS Instance": 0,
            "Volume": 0,
            "ElastiCache": 0,
            "Route 53": 0,
            "Redshift": 0,
            "Virtual Machine": 0,
            "Application Gateway": 0,
            "Public IpAddress": 0,
            "Network Gateway": 0,
            "Peering": 0,
            "RedisCache": 0,
            "DataBase": 0,
            "DirectConnect": 0,
            "DynamoDB": 0,
            "Other": 0,

            // GCP
            "Address": 0,
            "Disk": 0,
            "Forwarding Rule": 0,
            "Instance": 0,
            "Interconnect": 0,
            "VPN": 0,
            "SQL": 0,
            "MemoryStore": 0,
            "DNS": 0
          };

          _.each(scope.Designer.environment.facet.resources, function(r) {
            scope.price += r.price;

            if(r.price) {
              switch(r.type) {
                // AWS
                case "Resources::AWS::EC2::Address":                       scope.extended_info["Elastic IP"] += r.price;   break;
                case "Resources::AWS::ElasticLoadBalancing::LoadBalancer": scope.extended_info["Load Balancing"] += r.price;          break;
                case "Resources::AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer": scope.extended_info["Load Balancing"] += r.price;          break;
                case "Resources::AWS::ElasticLoadBalancingV2::NetworkLoadBalancer": scope.extended_info["Load Balancing"] += r.price;          break;
                case "Resources::AWS::EC2::NATGateway":                    scope.extended_info["NAT Gateway"] += r.price;          break;
                case "Resources::AWS::EC2::Instance":                      scope.extended_info["EC2 Instance"] += r.price; break;
                case "Resources::AWS::RDS::DBCluster":                     scope.extended_info["RDS Cluster"] += r.price; break;
                case "Resources::AWS::RDS::DBInstance":                    scope.extended_info["RDS Instance"] += r.price; break;
                case "Resources::AWS::EC2::Volume":                        scope.extended_info["Volume"] += r.price;       break;
                case "Resources::AWS::ElastiCache::CacheCluster":          scope.extended_info["ElastiCache"] += r.price;  break;
                case "Resources::AWS::Route53::HostedZone":                scope.extended_info["Route 53"] += r.price;  break;
                case "Resources::AWS::Redshift::Cluster":                  scope.extended_info["Redshift"] += r.price;  break;
                case "Resources::AWS::EFS::FileSystem":                    scope.extended_info["EFS"] += r.price;  break;
                case "Resources::AWS::WAF::RateBasedRule":                 scope.extended_info["WAF"] += r.price;  break;
                case "Resources::AWS::WAF::Rule":                          scope.extended_info["WAF"] += r.price;  break;
                case "Resources::AWS::WAF::WebACL":                        scope.extended_info["WAF"] += r.price;  break;
                case "Resources::AWS::WAFV2::WebACL":                      scope.extended_info["WAF"] += r.price;  break;
                case "Resources::AWS::WorkSpaces::WorkSpace":              scope.extended_info["WorkSpaces"] += r.price;  break;
                case "Resources::AWS::DirectConnect::Connection":          scope.extended_info["DirectConnect"] += r.price;  break;
                case "Resources::AWS::DynamoDB::Table":                    scope.extended_info["DynamoDB"] += r.price;  break;

                // Azure
                case "Resources::Azure::Compute::VirtualMachine":          scope.extended_info["Virtual Machine"] += r.price;  break;
                case "Resources::Azure::Network::ApplicationGateway":      scope.extended_info["Application Gateway"] += r.price;  break;
                case "Resources::Azure::Network::PublicIpAddress":         scope.extended_info["Public IpAddress"] += r.price;  break;
                case "Resources::Azure::Network::VirtualNetworkGateway":   scope.extended_info["Network Gateway"] += r.price;  break;
                case "Resources::Azure::Network::VirtualNetworkPeering":   scope.extended_info["Peering"] += r.price;  break;
                case "Resources::Azure::Redis::RedisCache":                scope.extended_info["RedisCache"] += r.price;  break;
                case "Resources::Azure::SQL::DataBase":                    scope.extended_info["DataBase"] += r.price;  break;

                // GCP
                case "Resources::GCP::Compute::Address":                  scope.extended_info["Address"] += r.price;  break;
                case "Resources::GCP::Compute::Disk":                     scope.extended_info["Disk"] += r.price;  break;
                case "Resources::GCP::Compute::ForwardingRule":           scope.extended_info["Forwarding Rule"] += r.price;  break;
                case "Resources::GCP::Compute::GlobalForwardingRule":     scope.extended_info["Forwarding Rule"] += r.price;  break;
                case "Resources::GCP::Compute::GlobalAddress":            scope.extended_info["Address"] += r.price;  break;
                case "Resources::GCP::Compute::Instance":                 scope.extended_info["Instance"] += r.price;  break;
                case "Resources::GCP::Compute::InterconnectAttachment":   scope.extended_info["Interconnect"] += r.price;  break;
                case "Resources::GCP::Compute::Interconnect":             scope.extended_info["Interconnect"] += r.price;  break;
                case "Resources::GCP::Compute::RegionDisk":               scope.extended_info["Disk"] += r.price;  break;
                case "Resources::GCP::Compute::VPNTunnel":                scope.extended_info["VPN"] += r.price;  break;
                case "Resources::GCP::SQL::Instance":                     scope.extended_info["SQL"] += r.price;  break;
                case "Resources::GCP::MemoryStore::Instance":             scope.extended_info["MemoryStore"] += r.price;  break;
                case "Resources::GCP::Compute::DNS":                      scope.extended_info["DNS"] += r.price;  break;

                // Ignore these, they just wrap up other services
                case "Resources::AWS::Autoscaling::AutoScalingGroup": break;
                default:
                  scope.extended_info["Other"] += r.price; break;
              }
            }
          });
        };

        scope.loadPricing();

        scope.$on("environment:reloaded", function() {
          scope.loadPricing();
        });
      }
    }
  }]);
