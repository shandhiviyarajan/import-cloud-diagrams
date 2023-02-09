angular
  .module("designer.workspace.canvases.3dview", [
    "designer.workspace.canvases.jointjs.3dview.paper",
    "designer.workspace.canvases.jointjs.3dview.views.linkview3d",
    "designer.workspace.canvases.jointjs.3dview.views.elementview3d",
    "designer.configuration",
    "designer.workspace.canvases.jointjs.3dview.shapes.modelFactory",
  ])
  .directive("threeJsCanvas", ["$rootScope", "Graph", "Paper3D", "LinkView3D", "ElementView3D", "DesignerState", "DesignerConfig", "ModelFactory",
    function ($rootScope, Graph, Paper3D, LinkView3D, ElementView3D, DesignerState, DesignerConfig, modelFactory) {
      return {
        templateUrl: "/designer/workspace/canvases/3dview/canvas.html",
        replace: true,
        controllerAs: "ThreeCanvas",
        controller: ["$scope", "$element", "$attrs",
          function ($scope, $element, $attrs) {
            this.environment = $scope.Designer.environment;
            this.view = this.environment.current_view;
            this.initialized = false;

            // WEBGL and feature flags
            $scope.WEBGL = THREE.WEBGL.isWebGLAvailable();
            $scope.WEBGL2 = THREE.WEBGL.isWebGL2Available();
            $scope.enable3DView = DesignerConfig.get("enable3DView");

            // Check for WEBGL/WEBGL2 support before instantiating Paper3D.
            if (!$scope.WEBGL || !$scope.enable3DView) {
              return;
            }

            if (!this.view.model) return;

            this.paper3d = new Paper3D({
              elementView: ElementView3D,
              linkView: LinkView3D,
              viewName: this.view.name,
              model: new Graph(),
            });

            this.paper3d.setEventHandlers();
          },
        ],
        link: function (scope, element, attrs, ctrl) {
          /**
           * Switch to JointJs Canvas
           */
          scope.switchToJointJsCanvas = function () {
            var value = DesignerState.get("display3DView");
            DesignerState.set("display3DView", !value);
            $rootScope.$broadcast("viewChanged");
            ctrl.view.canvas = "jointjs";
          };

          // Only initialize the scene when user chooses to do so
          // Don't do it otherwise as we will be unnecessarily consuming resources
          scope.initialize = function () {
            if (!ctrl.initialized) {
              ctrl.paper3d = new Paper3D({
                elementView: ElementView3D,
                linkView: LinkView3D,
                viewName: ctrl.view.name,
                model: new Graph(),
                paper2d: ctrl.environment.paper,
              });
  
              ctrl.paper3d.setEventHandlers();
              ctrl.paper3d.paper2d = ctrl.environment.paper;

              scope._render();
              ctrl.initialized = true;
            }
          }

          /**
           * Snap to center
           */
          scope.snapToCenter = function () {
            ctrl.paper3d.snapToCenter();
          };

          scope.toggleShadows = function () {
            ctrl.paper3d.toggleShadows();
          };

          // Check WEBGL/WEBGL2 support before listening to events
          if (!scope.WEBGL || !scope.enable3DView) {
            return;
          }

          if (!ctrl.view.model) return;

          /**
           * When a different view is selected set the new model on paper
           */
          scope._viewSelected3D = function (event, view) {
            if (view.canvas !== "jointjs" && view.canvas !== "3d") return;

            // Don't switch the canvas type
            view.canvas = ctrl.view.canvas;
            ctrl.view = view;

            ctrl.paper3d.options.viewName = ctrl.view.name;
            ctrl.paper3d.setEventHandlers();
            ctrl.paper3d.model.resetCells([]);

            scope._render()
          };

          /**
           * When the render is done, resize the canvas and enable the 3D view oction controls
           */
          scope._render = async function () {
            if (!ctrl.paper3d) return;

            // First load all the models
            if (!modelFactory.loaded) {
              await modelFactory.preLoadModels();
            }

            const { paper3d } = ctrl;
            const { model, sceneManager } = paper3d;
            model.resetCells([]);
            model.addCells(ctrl.view.model.allCells());

            sceneManager.elementCount = model.getElements().length;
            sceneManager.linkCount = model.getLinks().length;
            sceneManager.meshCount = 0;
            sceneManager.link3dCount = 0;

            sceneManager.resizeHandler();
            sceneManager.enable3DControls();
          };

          /**
           * Event handlers
           */
          scope._toggleLinks = function () {
            if (!ctrl.paper3d) return;
            ctrl.paper3d.toggleLinks();
          };

          scope._highlightConnected = function (event, resource) {
            ctrl.paper3d.highlightConnected(resource);
          };

          scope._unhighlightAll = function () {
            ctrl.paper3d.unhighlightAll();
          };

          scope._toggleNames = function () {
            if (!ctrl.paper3d) return;
            ctrl.paper3d.toggleNames();
          };

          scope.resourceSelected = function (event, resource) {
            ctrl.paper3d.showCSSBox(resource);
          }

          scope.resizeHandler = function (event) {
            const { sceneManager } = ctrl.paper3d;
            sceneManager.resizeHandler();
          }

          scope.$on('$destroy', function() {
            ctrl.paper3d.destroyScene();
          });

          /**
           * Listent to events
           */
          scope.$on("toggle:connections", scope._toggleLinks);
          scope.$on("connected:highlight", scope._highlightConnected);
          scope.$on("connected:unhighlight", scope._unhighlightAll);
          scope.$on("resource:unhighlight", scope._unhighlightAll);
          scope.$on("toggle:labels", scope._toggleNames);
          scope.$on("canvas:resize", scope.resizeHandler);

          scope.$on("view:selected", scope._viewSelected3D);
          scope.$on("viewChanged", scope.initialize);
          scope.$on("view:ready", scope._render);
        },
      };
    },
  ]);
