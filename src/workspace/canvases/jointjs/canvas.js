angular.module('designer.workspace.canvases.jointjs.canvas', [
  'designer.workspace.canvases.jointjs.graph',
  'designer.workspace.canvases.jointjs.paper',
  'designer.workspace.canvases.jointjs.views.resource',
  'designer.workspace.canvases.jointjs.views.link',
  'designer.workspace.canvases.jointjs.link.resource',
  'designer.workspace.canvases.jointjs.scroller',
  'designer.workspace.canvases.jointjs.handler.selection',
  'designer.workspace.canvases.jointjs.handler.zoom',
  "designer.app-scope",
  "designer.configuration",
  "designer.state"
])

.directive('jointJsCanvas',
  ["$rootScope", "Graph", "Paper", "LinkView", "ResourceLink", "CanvasScroller", "SelectionHandler", "ZoomHandler", "$appScope", "$timeout", "DesignerConfig", "DesignerState",
  function($rootScope, Graph, Paper, LinkView, ResourceLink, CanvasScroller, SelectionHandler, ZoomHandler, $appScope, $timeout, DesignerConfig, DesignerState) {
  return {
    templateUrl: '/designer/workspace/canvases/jointjs/canvas.html',
    replace: true,
    controllerAs: "JointCanvas",
    controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
      this.environment = $scope.Designer.environment;
      this.view = this.environment.current_view;

      $scope.WEBGL = THREE.WEBGL.isWebGLAvailable();
      $scope.WEBGL2 = THREE.WEBGL.isWebGL2Available();
      $scope.enable3DView =  DesignerConfig.get('enable3DView');

      // Create the paper inside the scroller
      this.paper = new Paper({
        width: this.view.width || 1000,
        height: this.view.height || 1000,
        gridSize: 16,
        model: new Graph(),
        elementView: function(element) {
          return element.view;
        },
        linkView: LinkView,
        defaultLink: new ResourceLink({}),
        snapLinks: { radius: 20 },
        async: true,
        sorting: joint.dia.Paper.sorting.APPROX,
        origin: { x: 0, y: 0 },
        interactive: false
      });

      // Doing this to get a hold of reference to paper in 3d canvas
      this.environment.paper = this.paper;

      // Add filters for shapes
      this.paper.addFilter("selectedResourceFilter", { name: 'dropShadow', args: { dx: 0, dy: 0, blur: 5, color: "#9B9B9B" } });
      this.paper.addFilter("highlightedResourceFilter", { name: 'outline', args: { color: "#077a07", width: 5, opacity: 1, margin: 5 } });

      // Add scroller
      this.scroller = new CanvasScroller({ paper: this.paper });

      // Render
      angular.element('#paper').append(this.scroller.render().el);

      this.selection_handler = new SelectionHandler(this.paper);
      this.zoom_handler = new ZoomHandler(this.paper);
    }],
    link: function(scope, element, attrs, ctrl) {
      // Handlers and defaults
      scope.highlighted = [];
      scope.background_load = false;
      scope.rendering = true;

      scope._cellPointerUp = function(cellView, evt, x, y) {
        if(!ctrl.scroller.hasPanned()) {
          if (evt.target && evt.target.getAttribute('control')) {
            $rootScope.$broadcast("toggle_control", evt.target.getAttribute('control'), true);

            // If they haven't already selected the vpc, select it
            if(!_.includes(ctrl.selection_handler.selected_cells, cellView))
              ctrl.selection_handler.selectCell(cellView);
          }
          else {
            ctrl.selection_handler.selectCell(cellView);
          }

          // Select dat!
          var stored_resource = DesignerState.get("selectedResource");
          var selected_resource;
          
          if (ctrl.selection_handler.selected_cells.length) {
            selected_resource = cellView.model.get("resource") 
          } 
          else { 
            selected_resource = (ctrl.view.type === DesignerState.overrides.selectedView) ?
              null : 
              (stored_resource ? stored_resource : null)
          }

          $rootScope.$broadcast("resource:selected", selected_resource);
          scope._unhighlightAll();
        }

        scope._stopPanning();
      };

      scope._stopPanning = function() {
        if(ctrl.scroller.isPanning()) {
          ctrl.scroller.stopPanning();
        }
      };

      scope._cellPointerDown = function cellPointerDown(cellView, evt, x, y) {
        ctrl.scroller.startPanning(evt, x, y);
      };

      scope._blankPointerDown = function blankPointerDown(evt, x, y) {
        ctrl.scroller.startPanning(evt, x, y);
      };

      scope._blankPointerUp = function blankPointerUp(evt, x, y) {
        if(evt.target.localName !== "svg") return;

        if(ctrl.scroller.isPanning()) {
          ctrl.scroller.stopPanning();
        }

        ctrl.selection_handler.cancelSelection(evt, x, y);

        $rootScope.$broadcast("resource:selected", null);
      };

      // TODO: need to merge this with the actual click method. Mucho duplicato!
      scope._resourceSelect = function resourceSelect(evt, resource) {
        // If it's hidden just display it's details, otherwise simulate a click
        var models = []
        if(ctrl.view.canvas === "jointjs") {
          models = ctrl.paper.model.getCellsByResourceId(resource.id);
        }

        if(!models.length) {
          ctrl.selection_handler.deselectCells();
          $rootScope.$broadcast("resource:selected", resource);
        }
        else {
          scope._cellPointerUp(ctrl.paper.findViewByModel(models[0]), evt);
        }

        scope._unhighlightAll();
      };

      scope._renderDone = function() {
        if(!scope.rendering) {
          return;
        }

        if(!scope.background_load) {
          if(DesignerConfig.get("fitToContent")) {
            ctrl.paper.fitToContent({ padding: 50 });
          }
          else {
            ctrl.paper.fitToEnvironment(ctrl.environment);
            ctrl.scroller.center();
            ctrl.zoom_handler.auto_zoom(ctrl);
          }
        }
        else {
          scope.background_load = false;

          ctrl.selection_handler.refreshSelected();
          ctrl.zoom_handler.zoom();
        }
        ctrl.paper.updateContainerText();
        ctrl.paper.fadeResources();
        $rootScope.$broadcast("render:done", {});
        scope.refreshToggles();

        $appScope.safeApply(function() { scope.rendering = false; }, scope);
      };

      scope._autoCenterAndZoom = function() {
        // TODO: there are too many canvas type checks for events - ideally we only render one canvas at a time and send events to it
        if(ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;

        ctrl.paper.fitToEnvironment(ctrl.environment);
        ctrl.scroller.center();
        ctrl.zoom_handler.auto_zoom(ctrl);
      };

      scope._environmentLoaded = function() {
        if(ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;

        scope.rendering = true;
        // We might not have anything, we don't want the loading screen up the whole time
        // TODO: this is duplicated below. Simpliffyyyyyy.
        if(ctrl.view.isEmpty()) {
          scope.rendering = false;
        }
        else {
          ctrl.paper.model.resetCells(ctrl.view.model.allCells());
        }
        if (!ctrl.environment.facet.resources.length) { 
          scope.rendering = false;
        }
      };

      scope._environmentReloaded = function(event, environment, params) {
        params = params || {};

        ctrl.environment = environment;

        if(params.background) scope.background_load = true;

        scope._viewSelected(null, environment.current_view);
      };

      scope._viewSelected = function(event, view, force = false) {
        if (view.canvas !== "jointjs" && view.canvas !== "3d") return;
        // Don't do anything if the view didn't change
        // This will happen when switching from html canvas to jointjs canvas which was previsouly already rendered.
        if (!force && view.revision_id === ctrl.view.revision_id) return;

        scope.rendering = true;

        if(ctrl.view.canvas)
          view.canvas = ctrl.view.canvas;

        ctrl.view = view;
        // We might not have anything, we don't want the loading screen up the whole time
        if(ctrl.view.isEmpty()) {
          ctrl.paper.model.resetCells([]);
          scope.rendering = false;
        }
        else {
          ctrl.paper.model.resetCells(ctrl.view.model.allCells());
        }
        if (!ctrl.environment.facet.resources.length) {
          scope.rendering = false;
        }
      };

      scope._viewModified = function(event, view) {
        scope._viewSelected(event, view, true);
      }

      scope._viewRepositioned = function() {
        if (ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;

        ctrl.paper.updateLinks();

        if (ctrl.view.type === 'Views::Container')
          scope._viewSelected(event, ctrl.view, true);
      };

      scope._highlightConnected = function(evt, resource) {
        var resources = resource.highlightableConnections();

        _.each(resources, function(r) {
          if(!r.hidden) {
            var cells = ctrl.paper.model.getCellsByResourceId(r.id);

            _.each(cells, function(cell) {
              var view = ctrl.paper.findViewByModel(cell);

              view.highlight();
              scope.highlighted.push(view);
            });
          }
        });
      };

      scope._highlightResource = function(evt, resource) {
        if(!resource.hidden) {
          var cells = ctrl.paper.model.getCellsByResourceId(resource.id);

          _.each(cells, function(cell) {
            var view = ctrl.paper.findViewByModel(cell);

            view.highlight();
            scope.highlighted.push(view);
          });
        }
      };

      scope._unhighlightAll = function() {
        _.each(scope.highlighted, function(cellView) {
          cellView.unhighlight();
        });

        scope.highlighted = [];
      };

      scope.refreshToggles = function() {
        scope._toggleConnections();
        scope._toggleNames();
        scope._skewIsometric();
        scope._highlightChanges();
        scope._iconSwitch();
      };
      
      // TODO: we want to remember the STATE of connections ... hrmm .... otherwise we hide any that might be showing because a resource is selected
      scope._toggleConnections = function() {
        if(ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;
        ctrl.paper.toggleAllConnections(DesignerState.get("displayConnections"));
      };

      scope._toggleNames = function() {
        if(ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;

        _.each(ctrl.paper.model.getElements(), function(e) {
          var view = ctrl.paper.findViewByModel(e);

          if(view && view.model.showName) {
            DesignerState.get("displayLabels") ? view.model.showName(view) : view.model.hideName(view);
          }
        });
      };

      // TODO: this shouldn't be called directly from canvas.html - underscore functions are technically 'private'
      scope._switchSkewIsometric = function() {
        var value = DesignerState.get("displayIsometric");
        DesignerState.set("displayIsometric", !value);

        scope._skewIsometric();
      };

      scope._skewIsometric = function() {
        ctrl.paper.skewIsometric(DesignerState.get("displayIsometric"));
      };

      scope.switchToThreeJSCanvas = function () {
        var value = DesignerState.get("display3DView");
        DesignerState.set("display3DView", !value);
        $rootScope.$broadcast("viewChanged");
        ctrl.view.canvas = '3d';
      }

      scope._iconSwitch = function() {
        ctrl.paper.iconSwitch();
      };

      scope._highlightChanges = function() {
        if(ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;

        ctrl.paper.highlightEnvResources(ctrl.environment, DesignerConfig.get("highlightAdded") || [], DesignerConfig.get("highlightDeleted") || []);
      };

      scope._highlightPreselectedResource = function() {
        if(ctrl.view.canvas !== "jointjs" && ctrl.view.canvas !== "3d") return;
        var resource = DesignerState.get("selectedResource")
        if(resource) {
          $rootScope.$broadcast("resource:select", resource)
        }
      };

      // Handle paper events
      ctrl.paper.on("cell:pointerup",    scope._cellPointerUp);
      ctrl.paper.on("cell:pointerdown",  scope._cellPointerDown);
      ctrl.paper.on("blank:pointerdown", scope._blankPointerDown);
      ctrl.paper.on("blank:pointerup",   scope._blankPointerUp);
      ctrl.paper.on("render:done",       scope._renderDone);

      // Handle our events
      scope.$on("resource:select",          scope._resourceSelect);
      scope.$on("environment:reloaded",     scope._environmentReloaded);
      scope.$on("view:selected",            scope._viewSelected);
      scope.$on("view:modified",            scope._viewModified);
      scope.$on("view:repositioned",        scope._viewRepositioned);
      scope.$on("resource:highlight",       scope._highlightResource);
      scope.$on("resource:unhighlight",     scope._unhighlightAll);
      scope.$on("connected:highlight",      scope._highlightConnected);
      scope.$on("connected:unhighlight",    scope._unhighlightAll);
      scope.$on("diagram:zoomtofit",        scope._autoCenterAndZoom);
      scope.$on("icon:switch",              scope._iconSwitch);
      scope.$on("toggle:connections",       scope._toggleConnections);
      scope.$on("toggle:labels",            scope._toggleNames);

      scope.$on("view:ready", function() {
        scope._environmentLoaded();
        scope._highlightPreselectedResource();
      });

      // When the page has loaded trigger env load in a timeout to take it outside the angular digest
      if(ctrl.view.positioned) {
        element.ready(function() {
          $timeout(function() {
            scope._environmentLoaded();
          }, 1);
        });
      }

      // Make sure if we move our mouse outside the div we stop panning
      element.on('mouseleave', scope._stopPanning);
      scope.$on('$destroy', function() {
        element.off('mouseleave', scope._stopPanning);
      });
    }
  }
}]);
