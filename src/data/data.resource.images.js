angular.module('designer.model.resource.images', [
  "designer.model.images.aws_20180222_simple",
  "designer.model.images.aws_20181009_arch_light",
  "designer.model.images.azure_vendor",
  "designer.model.images.gcp_classic",
  "designer.model.images.ibm_classic",
  "designer.model.images.kubernetes_classic",
  "designer.configuration",
  "designer.state"
])
  .service('ResourceImages', ["AWS_20180222SimpleImages", "AWS_20181009ArchLightImages", "Azure_VendorImages", "GCP_ClassicImages", "IBM_ClassicImages", "Kubernetes_ClassicImages",
    "DesignerConfig", "DesignerState",
    function(AWS_20180222SimpleImages, AWS_20181009ArchLightImages, Azure_VendorImages, GCP_ClassicImages, IBM_ClassicImages, Kubernetes_ClassicImages,
             DesignerConfig, DesignerState) {
    return {
      icons_sets: {
        azure: {
          classic: {
            provider: "azure",
            images:  Azure_VendorImages,
            main_icon: "resources.azure.network.loadbalancer",
            icon_overlay: true,
            styles: {
              "azure.virtual-network": { 
                stroke: '#B8B8B8',
                "stroke-width": 1, 
                'fill-opacity': 0, 
                rx: 5, ry: 5 
              },
              "azure.subnet": {
                stroke: "#B8B8B8",
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 5, ry: 5, 
                fill: "#FFFFFF"
              },
              "azure.resource-group": {
                stroke: '#B8B8B8', 
                "stroke-width": 1, 
                'fill-opacity': 1, 
                rx: 5, ry: 5, 
                fill: "#FFFFFF",
                "stroke-dasharray": 0 
              }
            }
          }
        },
        aws: {
          "20181009-arch-light": {
            provider: "aws",
            images: AWS_20181009ArchLightImages,
            main_icon: "resources.aws.ec2.natgateway",
            icon_overlay: true,
            styles: {
              "aws.vpc": { 
                stroke: '#077a07',
                "stroke-width": 1, 
                'fill-opacity': 0, 
                rx: 0, ry: 0 
              },
              "aws.subnet": {
                stroke: '#0e7fba',
                "stroke-width": 1, 
                'fill-opacity': 1,
                rx: 0, ry: 0, 
                fill: "#FFFFFF"
              },
              "aws.availability-zone": {
                stroke: '#0e7fba', 
                "stroke-width": 1, 
                'fill-opacity': 1, 
                rx: 0, ry: 0, 
                fill: "#FFFFFF",
                "stroke-dasharray": 2 
              }
            }
          },
          "20180222-simple" : {
            provider: "aws",
            images: AWS_20180222SimpleImages,
            main_icon: "resources.aws.ec2.natgateway",
            styles: {
              "aws.vpc": {
                stroke: '#B8B8B8',
                "stroke-width": 1,
                'fill-opacity': 0,
                rx: 5, ry: 5
              },
              "aws.subnet": {
                stroke: "#B8B8B8",
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 5, ry: 5,
                fill: "#FFFFFF"
              },
              "aws.availability-zone": {
                stroke: '#FFAD32',
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 5, ry: 5,
                fill: "#F4F8FA",
                "stroke-dasharray": 0
              }
            }
          }
        },
        gcp: {
          classic: {
            provider: "gcp",
            images:  GCP_ClassicImages,
            main_icon: "resources.gcp.compute.instance",
            icon_overlay: true,
            styles: {
              "gcp.network": { 
                stroke: '#B8B8B8',
                "stroke-width": 1, 
                'fill-opacity': 0, 
                rx: 5, ry: 5 
              },
              "gcp.subnetwork": {
                stroke: "#B8B8B8",
                "stroke-width": 1,
                'fill-opacity': 0.5,
                rx: 5, ry: 5, 
                fill: "#FFFFFF"
              },
              "gcp.zone": {
                stroke: '#B8B8B8',
                "stroke-width": 1, 
                'fill-opacity': 1, 
                rx: 5, ry: 5, 
                fill: "#fffaed",
                "stroke-dasharray": 0 
              }
            }
          }
        },
        ibm: {
          classic: {
            provider: "ibm",
            images:  IBM_ClassicImages,
            main_icon: "resources.ibm.ec2.instance",
            styles: {
              "ibm.vpc": {
                stroke: '#4376BB',
                "stroke-width": 1,
                'fill-opacity': 0,
                rx: 0, ry: 0
              },
              "ibm.subnet": {
                stroke: "#00882B",
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 0, ry: 0,
                fill: "#E6F0E2"
              },
              "ibm.availability-zone": {
                stroke: '#919191',
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 0, ry: 0,
                fill: "#E0E0E0",
                "stroke-dasharray": 0
              }
            }
          }
        },
        kubernetes: {
          classic: {
            provider: "kubernetes",
            images:  Kubernetes_ClassicImages,
            main_icon: "resources.kubernetes.cluster.cluster",
            styles: {
              "kubernetes.cluster": {
                stroke: '#4376BB',
                "stroke-width": 1,
                'fill-opacity': 0,
                rx: 0, ry: 0
              },
              "kubernetes.deployment": {
                stroke: "#00882B",
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 0, ry: 0,
                fill: "#E6F0E2"
              },
              "kubernetes.pod": {
                stroke: '#919191',
                "stroke-width": 1,
                'fill-opacity': 1,
                rx: 0, ry: 0,
                fill: "#E0E0E0",
                "stroke-dasharray": 0
              }
            }
          }
        }
      },

      default_set: {
        azure: "classic",
        aws: "20181009-arch-light",
        gcp: "classic",
        ibm: "classic",
        kubernetes: "classic"
      },

      getSet: function(provider_type) {
        var icon_set = DesignerState.get("selectedIconSet");

        // If the set doesn't exist or isn't configured then use a default
        if (!this.icons_sets[provider_type][icon_set]) {
          icon_set = this.default_set[provider_type];
          DesignerState.set("selectedIconSet", icon_set);
        }
        return icon_set;
      },

      getUrl: function(resource) {
        if (!_.keys(this.icons_sets).includes(resource.provider_type)) { return "#" + "default-blank" };

        var icon_set = this.getSet(resource.provider_type);
        
        if (resource.type.includes("Generic::GlobalResource")) {
          return "#generic-circle"
        } else if (_.includes(this.icons_sets[resource.provider_type][icon_set]["images"].list, resource.simple_name)) {
          return "#" + resource.provider_type + "-" + icon_set + "-" + resource.simple_name;
        } else {
          return "#" + "default-blank";
        }
      },

      getIconList: function(environment) {
        var types = _.uniq(_.map(environment.facet.resources, function (s) { return s.provider_type }));

        if (_.includes(types, "aws")) {
          return this.icons_sets["aws"];
        } else if (_.includes(types, "azure")) {
          return this.icons_sets["azure"];
        } else if (_.includes(types, "gcp")) {
          return this.icons_sets["gcp"];
        } else if (_.includes(types, "ibm")) {
          return this.icons_sets["ibm"];
        } else if (_.includes(types, "kubernetes")) {
          return this.icons_sets["kubernetes"];
        }
      },

      getStyle: function(provider_type, shape) {
        var icon_set = this.getSet(provider_type);
        return this.icons_sets[provider_type][icon_set]["styles"][shape];
      }
    }
  }]);
