angular
  .module("designer.workspace.canvases.jointjs.3dview.shapes.meshfactory", [
    "designer.workspace.canvases.jointjs.3dview.modelmap",
    "designer.workspace.canvases.jointjs.3dview.shapes.line",
    "designer.workspace.canvases.jointjs.3dview.shapes.boxmesh",
  ])
  .service("MeshFactory", [
    "ModelMap",
    "Line3D",
    "ResourceMeshFactory",
    function (modelMap, lineFactory, resourceMeshFactory) {
      class MeshFactory {
        constructor() {
          this.modelMap = modelMap;
        }

        createMesh(model, paper3d) {
          var { attributes, resource } = model;
          const { type } = attributes;
          switch (type) {
            case "container":
              resourceMeshFactory.initialize(paper3d, modelMap);
              return resourceMeshFactory.create(model, false);
            case "resource":
              if (resource) {
                const { type } = resource;
                const modelFlag = this.is3DModelAvailable(type);
                resourceMeshFactory.initialize(paper3d, modelMap);
                return resourceMeshFactory.create(model, modelFlag)
              } else {
                resourceMeshFactory.initialize(paper3d, modelMap);
                return resourceMeshFactory.create(model, false);
              }
            case "link":
              lineFactory.initialize(model, paper3d);
              return lineFactory.createThickLine(model);
          }
        }

        is3DModelAvailable(type) {
          return this.modelMap.map[type];
        }
      }
      const meshFactory = new MeshFactory();
      return meshFactory;
    },
  ]);
