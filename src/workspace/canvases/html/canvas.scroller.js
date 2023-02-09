angular.module('designer.workspace.canvases.html.scroller', [])
  .factory('HtmlScroller', [function() {
    var Handler = function Handler() {
      this.el = angular.element("#html-scroller");
      this.panThreshold = 10;
      this._panning = false;
    };

    Handler.prototype.center = function() {
      var width = this.el.children().width();
      var height = this.el.children().height();
      var windowWidth = this.el.width();
      var windowHeight = this.el.height();

      // Get the size of the canvas and then .. center it
      this.el.scrollTop((height-windowHeight)/2);
      this.el.scrollLeft((width-windowWidth)/2);
    };

    Handler.prototype.startPanning = function(evt) {
      this._panning=true;
      this._clientX=evt.clientX;
      this._clientY=evt.clientY;

      this._movedX = 0;
      this._movedY = 0;
    };

    Handler.prototype.pan = function(evt) {
      if(!this._panning)
        return;

      var dx = evt.clientX - this._clientX;
      var dy = evt.clientY - this._clientY;
      this._movedX += dx;
      this._movedY += dy;
      this.el.scrollTop(this.el.scrollTop() - dy);
      this.el.scrollLeft(this.el.scrollLeft() - dx);
      this._clientX = evt.clientX;
      this._clientY = evt.clientY;
    };

    Handler.prototype.stopPanning = function() {
      if(!this._panning) return;

      this._panning = false;
      this._movedX = 0;
      this._movedY = 0;
    };

    Handler.prototype.hasPanned = function() {
      return Math.abs(this._movedX) > this.panThreshold || Math.abs(this._movedY) > this.panThreshold;
    };

    Handler.prototype.isPanning = function() {
      return this._panning;
    };

    return Handler;
  }]);
