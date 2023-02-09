angular
  .module("designer.workspace.canvases.jointjs.3dview.material.factory", [
    "designer.workspace.canvases.jointjs.3dview.material.map",
  ])
  .service("MaterialFactory", [
    "MaterialMap",
    function (materialMap) {
      class MaterialFactory {
        constructor() {
          this.loader = new THREE.TextureLoader();
        }

        /**
         * Get material for the mesh
         */
        getMaterial(color, image, type, resourceType) {
          var mat = new THREE.MeshLambertMaterial({
            color,
            side: THREE.DoubleSide,
            // transparent: false, opacity: 1
          });
          var mats = [];
          if (image && type === "resource") {
            // Get images from the svg icon map
            var el = document.getElementById(image.substring(1)).cloneNode(true);

            // Set height and width manually or Firefox won't render the texture
            const { width, height } = el.viewBox.baseVal;
            el.setAttribute('width', width);
            el.setAttribute('height', height);

            var svg_string = new XMLSerializer()
              .serializeToString(el)
              .replace(/symbol/g, "svg");
            var encodedData =
              "data:image/svg+xml;base64," + window.btoa(svg_string);

            const map = this.loader.load(encodedData);
            map.minFilter = THREE.LinearFilter;
            const faceMat = new THREE.MeshBasicMaterial({
              map
            });

            // Set material array based on resource geometry type
            if (["Cylinder", "Hexagon"].includes(materialMap[resourceType])) {
              mats = [mat, faceMat, mat];
            } else {
              mats = [mat, mat, mat, mat, faceMat, mat];
            }
          }
          if (mats.length !== 0) {
            return mats;
          } else {
            return mat;
          }
        }

        getGeometry(width, height, breadth, type) {
          let geometry;
          if (materialMap[type] === "Cylinder") {
            geometry = new THREE.CylinderBufferGeometry(
              width / 2.83,
              height / 2.83,
              breadth / 2,
              32
            );
            geometry.rotateX(Math.PI / 2);
            geometry.rotateZ(Math.PI / 2);
          } else if (materialMap[type] === "Hexagon") {
            geometry = new THREE.CylinderBufferGeometry(
              width / 2.83,
              height / 2.83,
              breadth / 2,
              6
            );
            geometry.rotateX(Math.PI / 2);
            geometry.rotateZ(Math.PI / 2);
          } else {
            geometry = new THREE.BoxBufferGeometry(
              width / 2,
              height / 2,
              breadth / 2
            );
          }
          return geometry;
        }

        getCylinderMaterial() {}

        getCubeMaterial() {}
      }

      const materialFactory = new MaterialFactory();
      return materialFactory;
    },
  ]);
