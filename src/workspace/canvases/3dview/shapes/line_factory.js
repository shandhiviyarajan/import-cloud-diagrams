angular
  .module("designer.workspace.canvases.jointjs.3dview.shapes.line", [])
  .service("Line3D", [
    function () {
      class Line {
        initialize(model, paper3d) {
          this.model = model;
          this.paper3d = paper3d;
        }

        async create() {
          var material = new THREE.LineBasicMaterial({ color: "black" });
          var points = [];
          var geometry = new THREE.BufferGeometry().setFromPoints(points);
          var line = new THREE.Line(geometry, material);
          line.castShadow = true;
          line.receiveShadow = true;
          line.model = this.model;
          line.visible = false;
          return line;
        }

        async createThickLine() {

          const color = new THREE.Color(
            SCENE_CONFIG.SCENE.LINK_COLOR
          );

          var material = new THREE.LineMaterial({
            color,
            linewidth: 1,
            dashed: true,
          });
          material.resolution.set(window.innerWidth, window.innerHeight);
          var points = [0, 0, 0, 0, 0, 0];
          var geometry = new THREE.LineGeometry();
          geometry.setPositions(points);
          var line = new THREE.Line2(geometry, material);
          line.computeLineDistances();
          line.castShadow = true;
          line.receiveShadow = true;
          line.model = this.model;
          line.visible = false;
          return line;
        }
      }
      const line = new Line()
      return line;
    },
  ]);
