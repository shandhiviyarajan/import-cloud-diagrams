angular.module('designer.workspace.canvases.html.canvas', [
  'designer.workspace.canvases.html.scroller',
  'designer.workspace.canvases.html.diagram',
  'designer.workspace.canvases.html.handler.selection',
  'designer.workspace.canvases.html.handler.zoom'
])
  .directive('htmlCanvas',
    ["$rootScope", "HtmlScroller", "HtmlDiagram", "HtmlSelectionHandler", "HtmlZoomHandler", "$timeout", function($rootScope, HtmlScroller, HtmlDiagram, HtmlSelectionHandler, HtmlZoomHandler, $timeout) {
        return {
          templateUrl: '/designer/workspace/canvases/html/canvas.html',
          replace: true,
          controllerAs: "HtmlCanvas",
          controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            this.environment = $scope.Designer.environment;
            this.el = angular.element("#html-canvas");
            this.view =  this.environment.current_view;
            this.scroller = new HtmlScroller();
            this.diagram = new HtmlDiagram({
              parent: this.el,
              max_size: 4000,
              scroller: this.scroller
            });
            this.selection_handler = new HtmlSelectionHandler(this.diagram);
            this.zoom_handler = new HtmlZoomHandler(this.diagram);
          }],

          link: function(scope, element, attrs, ctrl) {
            scope.rendering = true;

            scope.viewLoaded = function(event, view) {
              if(view.canvas !== "html") return;

              ctrl.view = view;
              ctrl.view.render(ctrl.diagram);

              // TODO: Ugh, not ideal - we need to position after the dom has rendered or size is 0. There will be a better way, just need to find it
              $timeout(function() {
                ctrl.view.loadDimensions();

                if(ctrl.view.scrollable) {
                  ctrl.scroller.center();
                }
                else {
                  ctrl.diagram.resetSize();
                }

                if(ctrl.view.zoomable) {
                  ctrl.zoom_handler.autoZoom(ctrl.view);
                }
              }, 0, false);
            };

            scope.environmentReloaded = function(event, environment, params) {
              ctrl.environment = environment;

              scope.viewLoaded(null, environment.current_view);
            }

            scope.autoCenterAndZoom = function() {
              if(ctrl.view.canvas !== "html") return;

              if(ctrl.view.scrollable) {
                ctrl.scroller.center();
              }

              if(ctrl.view.zoomable) {
                ctrl.zoom_handler.autoZoom(ctrl.view);
              }
            };

            scope.elementPointerUp = function(event, element) {
              if(!ctrl.scroller.hasPanned()) {
                ctrl.selection_handler.selectElement(element);
              }

              ctrl.scroller.stopPanning();

              $rootScope.$broadcast("resource:selected", ctrl.selection_handler.selected_elements.length ? element.resource : null);
            };

            scope.elementPointerDown = function(event, element) {
              ctrl.scroller.startPanning(event);
            };

            scope.blankPointerUp = function(event) {
              // TODO: comment this out because it breaks list view and it's the only html canvas
              // if(!ctrl.scroller.hasPanned()) {
              //   ctrl.selection_handler.cancelSelection();
              // }
              //
              // ctrl.scroller.stopPanning();
              //
              // $rootScope.$broadcast("resource:selected", null);
            };

            scope.blankPointerDown = function(event) {
              ctrl.scroller.startPanning(event);
            };

            scope.$on("view:selected", scope.viewLoaded);
            scope.$on("environment:reloaded", scope.environmentReloaded);
            scope.$on("diagram:zoomtofit",    scope.autoCenterAndZoom);

            // Listen to diagram events
            ctrl.diagram.on("element:pointerup", scope.elementPointerUp);
            ctrl.diagram.on("element:pointerdown", scope.elementPointerDown);
            ctrl.diagram.on("blank:pointerup", scope.blankPointerUp);
            ctrl.diagram.on("blank:pointerdown", scope.blankPointerDown);
            ctrl.diagram.on("render:done", scope.renderDone);

            // TODO: these should be handled by the scroller
            ctrl.el.on("mousemove", function mouseMove(evt) {
              ctrl.scroller.pan(evt);
            });
            ctrl.el.on("mouseout", function mouseOutOfCanvas() {
              if(ctrl.scroller.isPanning()) {
                ctrl.scroller.stopPanning();
              }
            });

            // If the default is an html view then we need to render it RIGHT NOW
            scope.viewLoaded(null, ctrl.view);
          }
        }
      }]);
