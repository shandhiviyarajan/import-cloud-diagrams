angular.module('designer.workspace.canvases.jointjs.handler.zoom', [])
.factory('ZoomHandler', [function() {
  function ZoomHandler(paper) {
    this.paper       = paper;
    this.minZoom     = 0.02;
    this.maxZoom     = 3;
    this._scale      = this.paper.scale().sx;
  }

  ZoomHandler.prototype.auto_zoom = function(canvas) {
    this.resetScale();

    var view = canvas.environment.current_view;

    var workspace  = angular.element(".designer-workspace");
    var height     = workspace.height() - 20;
    var width      = workspace.width() - 20;
    var viewWidth  = view.width;
    var viewHeight = view.height;

    // If we're isometric then modify the values to fit the new format
    if (this.paper.isometric) {
      var viewport = this.paper.viewport;
      var bounding_rect = viewport.getBBox();
      viewWidth = bounding_rect.width;
      viewHeight = bounding_rect.height;
    }

    var wDiff = 1 / (viewWidth / width);
    var hDiff = 1 / (viewHeight / height);

    this.zoom(Math.min(wDiff, hDiff));
  };

  ZoomHandler.prototype.zoom = function(scale, ox, oy) {
    scale = scale || 1;

    // Don't go over / under
    if(scale < this.minZoom)  scale = this.minZoom;
    if(scale > this.maxZoom)  scale = this.maxZoom;

    ox = ox || (this.paper.el.scrollLeft + this.paper.el.clientWidth / 2);
    oy = oy || (this.paper.el.scrollTop + this.paper.el.clientHeight / 2);

    var o_scale = scale / this._scale;

    this.paper.setOrigin(o_scale, o_scale);
    this.paper.scale(scale, scale, ox, oy);
    this._scale = scale;
  };


  ZoomHandler.prototype.zoomOut = function () {
    this.zoom((this._scale || 1) - .1);
  };

  ZoomHandler.prototype.zoomIn = function () {
    this.zoom((this._scale || 1) + .1);
  };

  ZoomHandler.prototype.resetScale = function() {
    this._scale = 1;
    this.paper.scale(1,1);
  };

  return ZoomHandler;
}]);
