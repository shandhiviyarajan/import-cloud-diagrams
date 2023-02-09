angular.module('designer.workspace.canvases.jointjs.scroller', [])
.service('CanvasScroller', [function() {
  return Backbone.View.extend({
    className:"designer-scroller",
    events: {
      mousemove: "pan",
      touchmove: "pan"
    },
    panThreshold: 10, // How many pixels we have to pan before it considers it 'panned'

    initialize: function(options) {
      this.options = options;

      $(this.el).append(this.options.paper.el);

      _.bindAll(this,"startPanning","stopPanning");
    },

    render: function() {
      this.listenTo(this.options.paper,"scale resize",this.onScale);

      return this;
    },

    onScale: function(a, b, ox, oy) {
      var cx = this.options.paper.options.width / 2,
          cy = this.options.paper.options.height / 2;

      V(this.options.paper.viewport).translateCenterToPoint({ x: cx, y: cy });
    },

    center: function(ox,oy) {
      if (_.isUndefined(ox) || _.isUndefined(oy)) {
        ox = this.options.paper.options.width / 2;
        oy = this.options.paper.options.height / 2
      }

      var diagram = angular.element(".designer-workspace");

      var sx = 1,
          sy = 1,
          cx = diagram.width() / sx / 2,
          cy = diagram.height() / sy / 2;

      this.el.scrollLeft = (ox - cx) * sx;
      this.el.scrollTop = (oy - cy) * sy;
    },

    startPanning: function(evt) {
      evt=joint.util.normalizeEvent(evt);
      this._panning=true;
      this._clientX=evt.clientX;
      this._clientY=evt.clientY;

      this._movedX = 0;
      this._movedY = 0;
    },

    pan: function(evt) {
      if(!this._panning)
        return;

      evt=joint.util.normalizeEvent(evt);

      var dx=evt.clientX-this._clientX;
      var dy=evt.clientY-this._clientY;
      this._movedX += dx;
      this._movedY += dy;
      this.el.scrollTop-=dy;
      this.el.scrollLeft-=dx;
      this._clientX=evt.clientX;
      this._clientY=evt.clientY;

      this.options.paper.model.trigger("pan");
    },

    stopPanning: function() {
      delete this._panning;
      this._movedX = 0;
      this._movedY = 0;
    },

    hasPanned: function() {
      return Math.abs(this._movedX) > this.panThreshold || Math.abs(this._movedY) > this.panThreshold;
    },

    isPanning: function() {
      return this._panning;
    }
  });
}]);
