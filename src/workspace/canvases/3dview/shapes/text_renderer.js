angular
  .module("designer.workspace.canvases.jointjs.3dview.shapes.textRenderer", [
    "designer.workspace.canvases.jointjs.3dview.css3d",
  ])
  .service("TextRenderer", [
    "CSS3D",
    function (css3d) {
      class TextRenderer {
        constructor() {
          this.fontPromise = this.loadFont();
          this.linkRGBColor = [120, 120, 120];
        }

        initialize(sceneManager, paper3d) {
          this.sm = sceneManager;
          this.paper3d = paper3d;
        }

        /*
        Create fonts
        */
        loadFont = function () {
          let fontLocation;

          // Get the font location
          if (window.icons_url) {
            fontLocation = `${window.icons_url}/proxima_nova.ttf`;
          } else {
            fontLocation = "/assets/icons/proxima_nova.ttf";
          }

          return new Promise((resolve, reject) => {
            var ttfLoader = new THREE.TTFLoader();
            ttfLoader.load(fontLocation, (data) => {
              var font = new THREE.FontLoader().parse(data);
              resolve(font);
            });
          });
        };

        /*
        Take the model and font object and render labels and extended information
        */
        render = function (model, font) {
          const { extendedInfo, labelInfo } = model;
          const { mesh, attributes } = model;
          const { type } = attributes;
          var extras = this.renderArray(extendedInfo, model, font, "right");
          var labels = this.renderArray(labelInfo, model, font, "bottom");
          mesh.extras = extras;
          mesh.labels = labels;
          this.processLabels(mesh, type);
          this.processExtras(mesh);
        };

        /*
        Display labels only for containers by default
        */
        processLabels(mesh, type) {
          mesh.labels.forEach((label) => {
            switch (type) {
              case "resource":
                label.visible = false;
            }
          });
        }

        /*
        Don't show extended information by default
        */
        processExtras(mesh) {
          mesh.extras.forEach((extra) => {
            if (!this.paper3d.isExtView()) {
              extra.visible = false;
            }
          });
        }

        /*
        Take an array, iterate, generate text mesh and position it
        */
        renderArray = function (textArray, cell, font, style) {
          const { attributes, mesh } = cell;
          const { fontColor } = attributes;
          var tmat = new THREE.MeshLambertMaterial({ color: fontColor });
          var textMeshes = [];
          textArray.forEach((text, i) => {
            const { fontSize } = attributes;
            var shapes = font.generateShapes(text, fontSize);
            var geometry = new THREE.ShapeBufferGeometry(shapes);
            var tMesh = new THREE.Mesh(geometry, tmat);

            // By default the text will be placed at the center
            // Adjust it to be at the desired position
            this.adjust(tMesh, mesh, i, attributes, style);
            this.sm.group.add(tMesh);
            tMesh.name = 'text';
            textMeshes.push(tMesh);
          });
          return textMeshes;
        };

        /*
        Update Text Position
        */
        updateTextPosition = function (model) {
          // Update extras
          const { mesh, attributes} = model;
          if (!mesh.extras || !mesh.labels) return;
          mesh.extras.forEach((extra, i) => {
            this.adjust(extra, mesh, i, attributes, "right");
          });

          // Update labels
          mesh.labels.forEach((label, i) => {
              this.adjust(label, mesh, i, attributes, "bottom");
          });
        }

        /*
        Adjust the text mesh to be near text instead of center
        */
        adjust = (tMesh, mesh, i, attributes, style) => {
          const args = { tMesh, mesh, i, attributes };
          const { type } = attributes;
          switch (type) {
            case "container":
              css3d.modifyPosition("inside", args);
              break;
            default:
              css3d.modifyPosition(style, args);
              break;
          }
        };
      }

      const textRenderer = new TextRenderer();
      return textRenderer;
    },
  ]);
