angular
  .module("designer.workspace.canvases.jointjs.3dview.shapes.modelFactory", [
    "designer.workspace.canvases.jointjs.3dview.modelmap",
  ])
  .service("ModelFactory", [
    "ModelMap",
    function (modelMap) {
      class ModelFactory {
        constructor() {
          this.cacheMap = [];
          this.loader = new THREE.OBJLoader();
          this.textureLoader = new THREE.TextureLoader();
          this.loaded = false;
        }

        /**
         * load from url
         */
        async load(url, model) {
          const { attributes } = model;
          const { size3d, id } = attributes;
          const { width, height, breadth } = size3d;

          // Since 3D models are already loaded and cached, just load/clone it from cache
          const material = this.cacheMap[url].material.clone();
          const geometry = this.cacheMap[url].geometry;

          const mesh = new THREE.Mesh(geometry, material);

          // If a geometry is alrealdy scaled. Don't do it again
          // Geometries are shared for performance reason so cloing it again does not make sense
          if (!mesh.geometry.scaled) {
            mesh.geometry.scale(width / 2, height / 2, breadth);
            mesh.geometry.scaled = true;
          }

          return mesh;
        }

        /*
        Load into cache pre render
        */
        async preLoadModels() {
          this.setTextureMap();
          const { assetLocation, map } = modelMap;
          const keys = Object.keys(map);
          for (let i = 0; i < keys.length; i++) {
            await modelFactory.loadModel(`${assetLocation}${map[keys[i]]}`);
          }

          this.loaded = true;
          return this.cacheMap;
        }

        /*
        load model
        */
        async loadModel(url) {
          return await fetch(url).then(async (blob) => {
            return await blob.text().then((text) => {
              const mesh = this.loader.parse(text).children[0];
              mesh.material.map = this.texture;
              const { geometry } = mesh;
              geometry.center();
              geometry.rotateX(Math.PI / 2);
              this.cacheMap[url] = mesh;
              return this.cacheMap[url];
            });
          });
        }

        /**
         * Set texture map
         */
        setTextureMap = () => {
          this.texture = this.textureLoader.load(modelMap.texture);
        };
      }
      const modelFactory = new ModelFactory();
      return modelFactory;
    },
  ]);
