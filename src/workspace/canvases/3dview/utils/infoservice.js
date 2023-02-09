angular
  .module("designer.workspace.canvases.jointjs.3dview.infoservice", [
    "designer.workspace.canvases.jointjs.3dview.scene",
  ])
  .service("InfoService", [
    function () {
      class InfoService {
        getExtendedInformation(model) {
          var textArray = [];
          const { resource, attributes, showExtendedInfo } = model;
          const { type } = attributes;

          if (resource && showExtendedInfo) {
            var { info1, info2, info3 } = resource.getExtendedInformation();
            // Trim them to 15 chars as they look ugly any longer
            var trimLength = 15;
            if (info1 && info1.substring)
              textArray.push(info1.substring(0, trimLength));
            if (info2 && info2.substring)
              textArray.push(info2.substring(0, trimLength));
            if (info3 && info3.substring)
              textArray.push(info3.substring(0, trimLength));
          }

          switch (type) {
            case "container":
            case "link":
              return [];
            case "resource":
              return textArray;
          }
        }

        /*
        Have to improve the structuring/design here
        */
        getLabel(model) {
          const { attributes } = model;
          const { type } = attributes;

          switch (type) {
            case "container":
              return this.getContainerLabel(model);
            case "resource":
              return this.getResourceLabel(model);
            case "link":
              return [];
          }
        }

        // Container label logic
        getContainerLabel(model) {
          const { resource, attributes } = model;
          const { shape } = attributes;
          const { provider_id, cidr_block, name } = resource;
          const labels = [];

          labels.push(name);
          if (shape === "aws.vpc") {
            labels.push(cidr_block);
          }
          if (shape === "aws.subnet") {
            labels.push(`${provider_id} - ${cidr_block}`)
          }
          return labels;
        }

        // Resource label logic
        getResourceLabel(model) {
          const { resource } = model;

          var name = "";

          if (resource && resource.name) {
            name = resource.name;
          } else {
            name = model.name;
          }

          if (!name) return [];

          return name.match(/.{1,10}/g);
        }
      }
      const infoService = new InfoService();
      return infoService;
    },
  ]);
