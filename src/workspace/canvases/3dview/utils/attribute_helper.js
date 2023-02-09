angular
  .module("designer.workspace.canvases.jointjs.3dview.utils.attribute_helper", [
    "designer.workspace.canvases.jointjs.3dview.infoservice",
  ])
  .service("AttributeHelper", [
    "InfoService",
    function (infoService) {
      class AttributeHelper {
        getZPoint = function (shape) {
          switch (shape) {
            case "aws.subnet":
            case "gcp.subnetwork":
            case "azure.subnet":
              return 5;
            case "aws.availability-zone":
            case "gcp.zone":
            case "azure.virtual-network":
              return 3;
            case "aws.vpc":
            case "gcp.network":
            case "azure.resource-group":
              return 1;
            default:
              return 0;
          }
        };

        getColor = function (shape) {

          // Get colors from global scene config
          const {
            CUBE_COLOR,
            SUBNET_COLOR,
            AZ_COLOR,
            VPC_COLOR,
          } = SCENE_CONFIG.ENVIRONMENT;

          switch (shape) {
            case "aws.subnet":
            case "gcp.subnetwork":
            case "azure.subnet":
              return SUBNET_COLOR;
            case "aws.availability-zone":
            case "gcp.zone":
            case "azure.virtual-network":
              return AZ_COLOR;
            case "aws.vpc":
            case "gcp.network":
            case "azure.resource-group":
              return VPC_COLOR;
            default:
              return CUBE_COLOR;
          }
        };
        getBreadth = function (type) {
          switch (type) {
            case "resource":
              return 40;
            case "container":
              return 2;
            default:
              return 40;
          }
        };
        processAttributes = function (model) {
          // Get 3D font config from global scene config
          const { FONT } = SCENE_CONFIG;

          const { shape, type, position, size } = model.attributes;
          const pos3d = { z: this.getZPoint(shape) };
          const size3d = { breadth: this.getBreadth(type) };
          Object.assign(pos3d, position);
          Object.assign(size3d, size);
          model.set("pos3d", pos3d);
          model.set("size3d", size3d);
          model.set("color", this.getColor(shape));
          model.set("fontSize", FONT.SIZE);
          model.set("fontColor", FONT.COLOR);
          model.resource = model.get("resource");
          model.extendedInfo = infoService.getExtendedInformation(model);
          model.labelInfo = infoService.getLabel(model);
        };
      }
      const helper = new AttributeHelper();
      return helper;
    },
  ]);
