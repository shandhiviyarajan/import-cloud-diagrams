angular
  .module("designer.workspace.canvases.jointjs.3dview.scene", [
    "designer.workspace.canvases.jointjs.3dview.shapes.meshfactory",
    "designer.workspace.canvases.jointjs.3dview.modelmap",
    "designer.workspace.canvases.jointjs.3dview.scene.intiializer",
    "designer.workspace.canvases.jointjs.3dview.utils.attribute_helper",
    "designer.workspace.canvases.jointjs.3dview.scene.animator",
    "designer.workspace.canvases.jointjs.3dview.shapes.textRenderer",
  ])
  .service("Scene", [
    "MeshFactory",
    "ModelMap",
    "AttributeHelper",
    "SceneInitializer",
    "Animator",
    "TextRenderer",
    "$rootScope",
    function (
      meshFactory,
      modelMap,
      helper,
      initializer,
      animator,
      textRenderer,
      $rootScope
    ) {
      class Scene {
        constructor() {
          this.modelMap = modelMap;
          this.linkRGBColor = [0, 0, 1];
          this.meshCount = 0;
          this.link3dCount = 0;
        }

        createScene = async (paper3d) => {
          initializer.initialize(paper3d);
          Object.assign(this, initializer);
          textRenderer.initialize(this, this.paper3d);
        };

        /*
        Create a box shape with a texture on it
        */

        createShape = function (model) {
          helper.processAttributes(model);
          meshFactory.createMesh(model, this.paper3d).then((mesh) => {
            // Mesh is produced, add to the scene now
            this.group.add(mesh);
            this.meshCount++;

            // Adjust Z-Coordinate as 3D models come in different size and shape
            if (model.attributes.type === "resource") {
              this.AdjustZCoOrdinates(mesh);
            }

            // Adjust camera as the scene gets bigger and complex
            this.adjustCamera(true);
            this.checkAndPerformFinalSteps();
            mesh.type = "mesh";
            textRenderer.fontPromise.then((font) => {
              textRenderer.render(model, font);
            });
          });
        };

        /*
        Update text position
        */
        updateText = function (model) {
          textRenderer.updateTextPosition(model);
        };

        /*
        Create a line shape
        */
        createLink = function (model) {
          meshFactory.createMesh(model, this.paper3d).then((line) => {
            this.group.add(line);
            this.link3dCount++;

            this.adjustCamera(true);

            line.type = "line";
            line.castShadow = false;
            model.mesh = line;
          });
        };

        /*
        Update shape
        */
        updateShape = function (view) {
          const { mesh, attributes } = view.model;
          const { position, size, type } = attributes;
          const { width, height } = size;
          var { x, y } = position;
          if (!mesh) return;
          view.mesh = mesh;
          mesh.position.x = x;
          mesh.position.y = y;
          mesh.translateX(width / 2);
          mesh.translateY(height / 2);
          mesh.position.y *= -1;

          // Check and update geometry (client side layout)
          if (type === "container") {
            this.updateGeometry(mesh, size);
          }

          // Update text
          this.updateText(view.model);
        };

        /*
        Update geometry scale
        Do this for client side layout changes
        */
        updateGeometry = function (mesh, size) {
          const { width, height } = size;
          const sizeVector = new THREE.Vector3();
          mesh.geometry.computeBoundingBox();
          mesh.geometry.boundingBox.getSize(sizeVector);
          const { x, y } = sizeVector;
          mesh.geometry.scale(width / x, height / y, 1);
          this.adjustCamera();
        };

        /*
        Update link
        */
        updateLink = function (view) {
          const { model } = view;

          const {
            source: {
              attributes: { position: source, size },
            },
            target: {
              attributes: { position: target },
            },
          } = view;

          let { width, height } = size;

          const route = [];
          const origin = [source.x + width / 2, source.y + height / 2, 10];
          const destination = [target.x + width / 2, target.y + height / 2, 10];

          var path = [];
          var colors = [...this.linkRGBColor, ...this.linkRGBColor];

          // If there are any points other than starting/ending which make up the route
          // get those points and set the path
          route.forEach((point) => {
            const { x, y } = point;
            const position = [x, y, 10];
            path = path.concat(position);
            colors = colors.concat(this.linkRGBColor);
          });

          // Use the points that make up the route and create a 3D line
          const points = [...origin, ...path, ...destination];
          const { mesh } = model;
          if (!mesh) return;
          view.mesh = mesh;
          mesh.geometry.setPositions(points);
          mesh.geometry.setColors(colors);
          mesh.geometry.scale(1, -1, 1);
        };

        /*
        Keep updating camera position as meshes keep adding to the scene
        */
        adjustCamera = function (updateCamera = false) {
          var { camera, light, group, plane } = this;

          var bbox = new THREE.Box3().setFromObject(group);
          var boxSize = new THREE.Vector3();
          var center = new THREE.Vector3();

          // Get the center and calculate the size
          bbox.getCenter(center);
          bbox.getSize(boxSize);

          group.translateX(-center.x);
          group.translateY(-center.y);

          // Calculate the bounding box position
          // to scale the underlying plane
          // Scaling 2x as we are only taking one direction positive x||y
          // Scaling 2x more to make it look bigger than environment itself
          let scaleX = bbox.max.x * 4;
          let scaleY = bbox.max.y * 4;

          // Keep the minimum to 10000
          scaleX = scaleX > 10000 ? scaleX : 10000;
          scaleY = scaleY > 10000 ? scaleY : 10000;

          plane.scale.set(scaleX, scaleY, 1);

          // TODO:  Position camera
          if (updateCamera) {
            this.setCameraHeight(camera, boxSize);
          }

          // Save camera state so you can use it to reset to later
          this.controls.saveState();

          return bbox;
        };

        /*
        Set camera height by calculating it based on FOV and BBox length
        */
        setCameraHeight = function (camera, boxSize) {
          const maxSideLength = Math.max(boxSize.x, boxSize.y);
          const fov = (camera.fov / 2) * (Math.PI / 180);
          const cornerAngle = Math.PI / 2 - fov;
          const requiredHeight = (Math.tan(cornerAngle) * maxSideLength) / 2;

          // Set it a little lower than the required to hightlight center of environment
          // while displaying most of the resources
          camera.position.z = requiredHeight * 0.6;
        };

        /*
        Set Camera position to (0,0) on (x,y) 
        */
        resetCameraPosition = function () {
          var { controls } = this;
          controls.reset();
          this.adjustCamera(true);
        };

        /*
        Check if all resources are rendered and then add grid
        */
        checkAndPerformFinalSteps = function () {
          if (this.meshCount === this.elementCount) {
            this.addGrid();
            this.setupPostProcessing();
            this.adjustCamera(true);

            $rootScope.$broadcast("reset:layout");
          }
        };

        /*
        Toggle 3D view
        */
        enable3DControls = () => {
          var toggleButton = $("#htoggle");
          var rotateButton = $("#hrotate");

          toggleButton.unbind("click");
          toggleButton.click(() => {
            animator.toggleTopDown(this.controls);
          });

          rotateButton.unbind("click");
          rotateButton.click(() => {
            animator.rotateScene(this.controls);
          });

          animator.releaseAzimuthalLock(this.controls);
        };

        /*
        Empty outlinepass
        */
        removeVPCHighlighting = () => {
          const vpcMesh = this.outlinePass.selectedObjects.filter((mesh) => {
            const { shape } = mesh.model.attributes;
            if (
              shape == "aws.vpc" ||
              shape == "gcp.network" ||
              shape == "azure.resource-group"
            ) {
              return mesh;
            }
          })[0];

          if (!vpcMesh) return;

          const index = this.outlinePass.selectedObjects.findIndex(
            (object) => object.id === vpcMesh.id
          );
          this.outlinePass.selectedObjects.splice(index, 1);
        };

        /*
        Adjust Z location
        */
        AdjustZCoOrdinates = (mesh) => {
          mesh.geometry.computeBoundingBox();
          mesh.position.z = mesh.geometry.boundingBox.max.z + 5;
        };

        setupOutlinePass = () => {
          Object.assign(this, initializer);
          $(this.domElement).hover(angular.noop, (e) => {
            this.removeVPCHighlighting();
          });
        };

        registerToWindow = () => {
          Object.assign(window, this);
        };

        /*
        Destroy scene
        */
        destroyScene = () => {
          // Remove everything from group i.e
          // links, text, default geometries, meshes etc
          while (this.group.children[0]) {
            const child = this.group.children[0];
            const { geometry, material } = child;

            // Recommended by Three.js team to call the following
            if (geometry) geometry.dispose();
            if (material.dispose) material.dispose();

            this.group.remove(child);
          }

          // Remove lighting, grid, plane and etc..,
          while (this.scene.children[0]) {
            this.scene.remove(this.scene.children[0]);
          }

          // Not sure
          let { renderer, scene, camera } = this;
          let { outlinePass, renderPass, composer } = this;
          renderer = scene = camera = composer = null;
          outlinePass = renderPass = composer = null;
        };

        /*
        Add empty css box which can be used once the mesh is clicked
        */
        addEmptyCSSObject = () => {
          var element = $(document.createElement("div"));
          element.attr("id", "css3dObject");

          this.css3DObject = new THREE.CSS3DObject(element[0]);
          this.css3DObject.position.set(0, 0, 150);
          this.css3DObject.rotateX(Math.PI / 2);

          this.cssScene.add(this.css3DObject);
        };

        /*
        Show information about the resource
        */
        showCSSBox = (mesh) => {
          const pos = mesh.position;
          const offset = this.group.position;

          const { model } = mesh;
          const { resource } = model;

          // Set the position to where the mesh is placed
          let x = pos.x + offset.x;
          let y = pos.y + offset.y;
          this.css3DObject.position.x = x;
          this.css3DObject.position.y = y;

          // Set the content
          let { innerHTML } = this.css3DObject.element;

          innerHTML = "";
          innerHTML += `<p> id: ${resource.provider_id}</p>`;
          innerHTML += `<p> name: ${resource.name}</p>`;
          innerHTML += `<p> type: ${resource.type_name}</p>`;

          this.css3DObject.element.innerHTML = innerHTML;
        };
      }

      const scene = new Scene();

      return scene;
    },
  ]);
