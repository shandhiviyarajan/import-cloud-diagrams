angular
  .module("designer.workspace.canvases.jointjs.3dview.views.elementview3d", [])
  .service("ElementView3D", [
    function () {
      const ElementView3D = joint.dia.ElementView.extend({
        initialize: function () {
          joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        },
        getNodeBBox: function (magnet) {
          const { attributes, mesh } = this.model;
          let { x, y } = attributes.position;
          let sizeVector = new THREE.Vector3();
          if (!mesh) return new joint.g.Rect();
          mesh.geometry.computeBoundingBox();
          const { boundingBox } = mesh.geometry;
          boundingBox.getSize(sizeVector);
          const width = sizeVector.x;
          const height = sizeVector.y;
          x += width / 2;
          y += height / 2;
          return new joint.g.Rect(x, y, sizeVector.x, sizeVector.y);
        },
        unhighlight: function (outlinePass) {
          if (this.mesh && outlinePass.clicked !== this.mesh) {
            const index = outlinePass.selectedObjects.findIndex(
              (object) => object.id === this.mesh.id
            );
            outlinePass.selectedObjects.splice(index, 1);
          }
        },
        unhighlightClicks: function (outlinePass) {
          if (this.mesh) {
            const index = outlinePass.selectedObjects.findIndex(
              (object) => object.id === this.mesh.id
            );
            outlinePass.selectedObjects.splice(index, 1);
          }
        },
        highlight: function (outlinePass, clicked=false) {
          if (this.mesh) {
            outlinePass.selectedObjects.push(this.mesh);
          }

          if (clicked) {
            outlinePass.clicked = this.mesh;
          }
        },
      });
      return ElementView3D;
    },
  ]);
