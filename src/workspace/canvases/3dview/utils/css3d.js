angular
  .module("designer.workspace.canvases.jointjs.3dview.css3d", [])
  .service("CSS3D", [
    function () {
      class CSS3DModifier {
        modifyPosition(style, args) {
          const { tMesh, mesh, i, attributes } = args;
          const { position } = tMesh;
          const bbox = this.getBBoxWorldPosition(mesh);
          const { min, max } = bbox;

          const textWidth = this.getWidth(tMesh);
          const boxWidth = Math.abs(max.x - min.x);

          const { fontSize } = attributes;
          let { x, y, z } = position;
          const padding = fontSize / 3;
          const depthOffset = 3;
          switch (style) {
            case "inside":
              x = min.x - padding + (boxWidth - textWidth);
              y = min.y + i * (fontSize + padding) + padding;
              z = max.z + depthOffset;
              break;
            case "bottom":
              x = min.x;
              y = min.y - fontSize - (i + 1) * (fontSize + padding);
              z = min.z + depthOffset;
              break;
            case "right":
              x = max.x + padding;
              y = max.y - fontSize - i * (fontSize + padding);
              z = min.z + depthOffset;
              break;
          }
          position.set(x, y, z);
        }

        /*
        Get bounding box values in the world position
        */
        getBBoxWorldPosition(mesh) {
          const size = new THREE.Vector3();
          const bbox = new THREE.Box3();
          const { position } = mesh;
          mesh.geometry.computeBoundingBox();
          const { boundingBox } = mesh.geometry;
          boundingBox.getSize(size);

          // Get world co-ordinates
          bbox.max.x = position.x + size.x / 2;
          bbox.max.y = position.y + size.y / 2;
          bbox.max.z = position.z + size.z / 2;

          bbox.min.x = position.x - size.x / 2;
          bbox.min.y = position.y - size.y / 2;
          bbox.min.z = position.z - size.z / 2;

          return bbox;
        }

        getWidth(tMesh) {
          var bbox = new THREE.Box3().setFromObject(tMesh);
          var center = new THREE.Vector3();
          bbox.getCenter(center);

          const { min, max } = bbox;
          const textWidth = Math.abs(max.x - min.x);

          return textWidth;
        }
      }

      const css3d = new CSS3DModifier();
      return css3d;
    },
  ]);
