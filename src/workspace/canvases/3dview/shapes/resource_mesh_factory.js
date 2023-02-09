angular
  .module("designer.workspace.canvases.jointjs.3dview.shapes.boxmesh", [
    "designer.workspace.canvases.jointjs.3dview.shapes.modelFactory",
    "designer.workspace.canvases.jointjs.3dview.material.factory",
    "designer.workspace.canvases.jointjs.3dview.event3d"
  ])
  .service("ResourceMeshFactory", [
    "$rootScope",
    "ModelFactory",
    "MaterialFactory",
    "EventHandler3D",
    function ($rootScope, modelFactory, materialFactory, eventHandler) {
      class ResourceMeshFactory {
        /**
         * Initialize with required dependenices
         */
        initialize(paper3d, modelMap) {
          this.paper3d = paper3d;
          this.sm = paper3d.sceneManager;
          this.outlinePass = this.sm.outlinePass;
          this.modelMap = modelMap;
        }

        /**
         * Create the mesh with passed attributes
         */
        async create(model, modelFlag) {
          // Parse attributes
          const { attributes, resource } = model;
          const { size3d, type } = attributes;
          const { width, height, breadth } = size3d;

          var display_faded = false;
          var { color } = attributes;
          var image;

          if (resource) {
            display_faded = resource.display_faded;
            color = display_faded ? "#2f3640" : color;
            image = resource.image;
          }

          // Get material from factory based on type
          const material = materialFactory.getMaterial(color, image, type, resource.type);

          // Create geometry based on it's type and custom model availability
          let geometry;
          if (type === "resource") {
            geometry = materialFactory.getGeometry(width, height, breadth, resource.type);
          } else if (type === "container") {
            geometry = new THREE.PlaneBufferGeometry(width, height);
          }
          
          // Create mesh and setup event handling on it
          const mesh = new THREE.Mesh(geometry, material);
          if (modelFlag) {
            return await this.loadModelAndProcess(model, display_faded, color);
          } else {
            return this.process(model, mesh);
          }
        }

        /**
         * Take the mesh generated and setup event handling,
         * scale geometry and setup required references
         */
        process = (model, box) => {
          // Parse attributes
          const { attributes } = model;
          const { size3d, type, pos3d } = attributes;
          const { x, y, z } = pos3d;
          const { width, height } = size3d;

          // Setup references for later use
          box.castShadow = type === "container" ? false : true;
          box.receiveShadow = true;
          box.model = model;
          model.mesh = box;

          // Translate to match SVG co-ordinate system
          box.position.set(x, y, z);
          box.translateX(width / 2);
          box.translateY(height / 2);
          box.position.y *= -1;

          // Setup event listening and update model
          eventHandler.addEventListeners(box, this.paper3d);
          model.position(x, y);
          return box;
        };

        /**
         * Load 3D model and then once loaded process it like normal mesh
         */
        async loadModelAndProcess(model, display_faded, color) {
          // Parse attributes
          const { attributes, resource } = model;
          const { size3d } = attributes;
          const { width, height, breadth } = size3d;

          // Load 3D models
          const objectURL = this.modelMap.map[resource.type];
          var loader = new THREE.OBJLoader();
          const url = this.modelMap.assetLocation + objectURL;
          return await modelFactory.load(url, model).then((m) => {
            const mesh = m;
            if (display_faded) {
              mesh.material.color.set(color);
            }
            return this.process(model, mesh);
          });
        }
      }
      const resourceMeshFactory = new ResourceMeshFactory();
      return resourceMeshFactory;
    },
  ]);
