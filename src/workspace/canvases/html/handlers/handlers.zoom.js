angular.module('designer.workspace.canvases.html.handler.zoom', [])
  .factory('HtmlZoomHandler', [function() {
    function ZoomHandler(diagram) {
      this.diagram     = diagram;
      this.zoomLevel   = 1;
      this.minZoom     = 0.1;
      this.maxZoom     = 2;
    }

    ZoomHandler.prototype.zoom = function(newZoomLevel) {
      newZoomLevel = newZoomLevel || 1;

      // Don't go over / under
      if(newZoomLevel < this.minZoom)  newZoomLevel = this.minZoom;
      if(newZoomLevel > this.maxZoom) newZoomLevel = this.maxZoom;

      // TODO: test across browsers
      var params = {
        'transform': 'scale('+newZoomLevel+')',
        'transform-origin': '50% 50% 0'
      };
      this.diagram.el.css(params);
      this.zoomLevel = newZoomLevel;
    };

    ZoomHandler.prototype.autoZoom = function(view) {
      var viewWidth      = view.width;
      var viewHeight     = view.height;
      var viewportHeight = this.diagram.scroller.el[0].clientHeight - 50;
      var viewportWidth  = this.diagram.scroller.el[0].clientWidth - 50;
      var heightDiff     = viewHeight - viewportHeight;
      var widthDiff      = viewWidth - viewportWidth;

      var zoomLevel = (heightDiff > widthDiff) ? (viewportHeight / viewHeight) : (viewportWidth / viewWidth);

      this.zoom(Math.round(zoomLevel * 10) / 10);
    };

    ZoomHandler.prototype.zoomOut = function () {
      this.zoom((this.zoomLevel || 1) - .3);
    };

    ZoomHandler.prototype.zoomIn = function () {
      this.zoom((this.zoomLevel || 1) + .3);
    };

    return ZoomHandler;
  }]);
