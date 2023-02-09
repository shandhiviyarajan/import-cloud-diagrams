angular
  .module("designer.workspace.canvases.jointjs.3dview.scene.intiializer", [
    "designer.workspace.canvases.jointjs.3dview.event3d",
  ])
  .service("SceneInitializer", [
    "EventHandler3D",
    function (eventHandler3D) {
      class SceneInitializer {
        initialize(paper3d) {
          this.paper3d = paper3d;
          this.setupScene();
          this.setupCamera();
          this.setupRenderer();
          this.addShadows();
          this.setupEventHandling();
          this.addPlane();
          this.setupControls();
          this.addLight();
          this.addDirectionalLight();
          this.addStats();
          this.startRenderLoop();
        }

        /*
        Setup scene
        */
        setupScene = () => {
          this.scene = new THREE.Scene();
          this.cssScene = new THREE.Scene();
          this.group = new THREE.Group();
          this.scene.add(this.group);
          this.scene.background = new THREE.Color(
            SCENE_CONFIG.SCENE.BACKGROUND_COLOR
          );

          this.el = $(".designer-workspace");
          this.width = this.el.width();
          this.height = this.el.height();
          this.aspect = this.width / this.height;
        };

        /*
        Setup camera
        */
        setupCamera = () => {
          this.camera = new THREE.PerspectiveCamera(45, this.aspect, 1, 20000);
          this.camera.position.set(0, 0, 0);
          this.camera.up.set(0, 0, 1);
        };

        /*
        Setup webGL renderer
        */
        setupRenderer = () => {
          this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            canvas: $("#pape3dcanvas")[0],
          });
          this.renderer.setSize(this.width, this.height);
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.domElement = $(this.renderer.domElement);
          this.currentRenderer = this.renderer;

          $(window).resize(() => {
            this.resizeHandler();
          });
        };

        /*
        Setup post processing. Mainly outline pass.
        */
        setupPostProcessing = () => {

          // Add effect composer
          this.composer = new THREE.EffectComposer(this.renderer);

          // Add render pass, fxaa pass and outline pass
          this.renderPass = new THREE.RenderPass(this.scene, this.camera);
          this.composer.addPass(this.renderPass);

          this.outlinePass = new THREE.OutlinePass(
            new THREE.Vector2(this.width, this.height),
            this.scene,
            this.camera
          );

          // Global scene configs
          const {
            edgeStrength,
            edgeGlow,
            edgeThickness,
            visibleEdgeColor,
          } = SCENE_CONFIG.HIGHLIGHTING;

          this.outlinePass.edgeStrength = edgeStrength;
          this.outlinePass.edgeGlow = edgeGlow;
          this.outlinePass.edgeThickness = edgeThickness;
          this.outlinePass.visibleEdgeColor.set(visibleEdgeColor);
          this.composer.addPass(this.outlinePass);

          this.currentRenderer = this.composer;
          const { sceneManager } = this.paper3d;
          sceneManager.setupOutlinePass();
          // End
        };

        /*
        Add stats for debugging and monitoring purpose
        */
        addStats = () => {
          this.stats = new Stats();
          this.stats.showPanel(0);
          $("#paper3d").append(this.stats.domElement);
          // Remove inline styles
          $(this.stats.domElement).removeAttr("style");
          $(this.stats.domElement).attr("id", "stats");
          $(this.stats.dom).toggle();

          $(this.el).keyup((e) => {
            if (e.shiftKey && e.keyCode === 69) {
              this.toggleStatsVisibility();
            }
          })
        };

        /*
        Toggle stats visibility
        */
        toggleStatsVisibility = () => {
          $(this.stats.dom).toggle();
        }

        /*
        Loop every frame
        */
        startRenderLoop = () => {
          const renderLoop = () => {
            setTimeout(() => {
              requestAnimationFrame(renderLoop);
            }, 1000 / 120);
            this.stats.begin();
            this.controls.update();
            this.setVisibility();
            this.currentRenderer.render(this.scene, this.camera);
            this.stats.end();
          };
          renderLoop();
          this.sceneCreated = true;
        };

        /*
        Add properties to the renderer object that will get the shadows working
        */
        addShadows = () => {
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          this.renderer.outputEncoding = THREE.sRGBEncoding;
          this.renderer.shadowMapSoft = true;
        };


        /*
        Set explicit visibility in render loop
        This is probably a 'stop gap' fix for disappearing meshes due to highlighting logic
        */
       setVisibility = () => {
         this.group.children.forEach((child) => {
           if (child.type === 'mesh') {
             child.visible = true;
           }
         })
       }

        /*
        Set the renderer properties once the scene resizes
        */
        resizeHandler = () => {
          this.width = this.el.width();
          this.height = this.el.height();
          this.renderer.setSize(this.width, this.height);
          this.camera.aspect = this.width / this.height;
          this.camera.updateProjectionMatrix();
        };

        /*
        Add the plane geometry to the scene.
        */

        addPlane = () => {
          var geometry = new THREE.PlaneBufferGeometry(1, 1);
          var material = new THREE.MeshBasicMaterial({
            color: SCENE_CONFIG.SCENE.PLANE_COLOR
          });
          var plane = new THREE.Mesh(geometry, material);
          plane.position.z = -1;
          plane.receiveShadow = true;
          this.plane = plane;
          this.scene.add(plane);
        };

        /*
        Add a grid to debug positions from to time to time.
        */
        addGrid = function () {
          // Get grid colors from scene config
          const {
            GRID,
            GRID_CENTER_LINE_COLOR,
            GRID_LINE_COLOR,
            GRID_UNIT_SIZE
          } = SCENE_CONFIG.SCENE;

          const { x, y } = this.plane.scale;
          const scaleMax = x > y ? x : y;

          var size = scaleMax;
          var divisions = scaleMax / GRID_UNIT_SIZE; // One grid size length
          var gridHelper = new THREE.GridHelper(
            size,
            divisions,
            GRID_CENTER_LINE_COLOR,
            GRID_LINE_COLOR
          );
          gridHelper.position.z = 0;
          gridHelper.rotateX(Math.PI / 2);
          this.gridHelper = gridHelper;
          this.gridHelper.visible = GRID;
          this.scene.add(gridHelper);
        };

        /*
        Add the ambient and directional lighting to the scene
        */
        addLight = () => {
          // Get lighting configs from global scene configs
          const { AMBIENT } = SCENE_CONFIG.LIGHTING;
          const { INTENSITY } = AMBIENT;

          var ambientLight = new THREE.AmbientLight(0x404040);
          ambientLight.intensity = INTENSITY;

          this.scene.add(ambientLight);
          this.ambientLight = ambientLight;
        };

        /*
        Add the ambient and directional lighting to the scene
        */
        addDirectionalLight = () => {
          // Get lighting configs from global scene configs
          const { DIRECTIONAL } = SCENE_CONFIG.LIGHTING;
          const { INTENSITY, SHADOWS, COLOR, POSITION, VISIBLE } = DIRECTIONAL;
          const { x, y, z } = POSITION;

          var dirLight = new THREE.DirectionalLight(COLOR, INTENSITY);
          dirLight.castShadow = SHADOWS;
          dirLight.visible = VISIBLE;
          dirLight.position.set(x, y, z);
          this.scene.add(dirLight);

          this.dirLight = dirLight;
        };

        setupDirectionalLightShadows = () => {
          let wh = 512 * 2;
          this.dirLight.shadow.mapSize.width = wh; // default
          this.dirLight.shadow.mapSize.height = wh; // default
          this.dirLight.shadow.camera.near = 100; // default
          this.dirLight.shadow.camera.far = 2500;

          let cameraFrustrumEdgeSize = 2500;

          this.dirLight.shadow.camera.left = -cameraFrustrumEdgeSize;
          this.dirLight.shadow.camera.right = cameraFrustrumEdgeSize;
          this.dirLight.shadow.camera.top = cameraFrustrumEdgeSize;
          this.dirLight.shadow.camera.bottom = -cameraFrustrumEdgeSize;
        };

        toggleDirectionalLightShadows = () => {
          this.dirLight.castShadow = !this.dirLight.castShadow;
        };

        /*
        Setup controls
        */
        setupControls = () => {
          // Pull controls from scene config

          const { CONTROLS } = SCENE_CONFIG;

          const { camera, renderer } = this;
          this.controls = new THREE.OrbitControls(camera, renderer.domElement);
          this.controls.keyPanSpeed = CONTROLS.keyPanSpeed;
          this.controls.enableDamping = CONTROLS.enableDamping;
          this.controls.dampingFactor = CONTROLS.dampingFactor;
          this.controls.minPolarAngle = CONTROLS.minPolarAngle;
          this.controls.maxPolarAngle = CONTROLS.maxPolarAngle;
          this.controls.maxAzimuthAngle = CONTROLS.maxAzimuthAngle;
          this.controls.minAzimuthAngle = CONTROLS.minAzimuthAngle;
          this.controls.maxDistance = CONTROLS.maxDistance;
          this.controls.minDistance = CONTROLS.minDistance;

          // Change mous bindings => left click to pan and right click to rotate
          this.controls.mouseButtons.LEFT = 2;
          this.controls.mouseButtons.RIGHT = 0;
        };

        /*
        Setup event handling!
        */
        setupEventHandling = () => {
          const onMouseMove = (event) => {
            eventHandler3D.moveHandler(this, this.paper3d, event);
          };
          const onMouseClick = (event) => {
            eventHandler3D.clickHandler(this, this.paper3d, event);
          };
          $(this.domElement).click(onMouseClick);
          $(this.domElement).mousemove(onMouseMove);
        };

      }

      const initializer = new SceneInitializer();
      return initializer;
    },
  ]);
