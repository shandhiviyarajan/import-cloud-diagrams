angular.module('designer.workspace.canvases.html.diagram', ['designer.workspace.canvases.html.handler.event'])
  .factory('HtmlDiagram', ['HtmlEventHandler', function(HtmlEventHandler) {
    var Diagram = function Diagram(opts) {
      this.el       = $('<div class="html-diagram"></div>');
      this.parent   = opts.parent;
      this.scroller = opts.scroller;
      this.max_size = opts.max_size;
      this.handler  = new HtmlEventHandler();

      // Draw me eh
      this.parent.append(this.el);

      // TODO: look at using _.bindAll
      // TODO: check mousemove on click handler
      var that = this;
      this.parent.on("mousedown", function(evt, x, y) { that.mouseDown(evt) });
      this.parent.on("mouseup",   function(evt, x, y) { that.mouseUp(evt) });
    };

    Diagram.prototype.mouseDown = function(evt) {
      var clicked = this.findElement(evt.target);

      if(clicked) {
        this.handler.trigger("element:pointerdown", evt, clicked);
      }
      else {
        this.handler.trigger("blank:pointerdown", evt);
      }
    };

    Diagram.prototype.mouseUp = function(evt) {
      var clicked = this.findElement(evt.target);

      if(clicked) {
        this.handler.trigger("element:pointerup", evt, clicked);
      }
      else {
        this.handler.trigger("blank:pointerup", evt);
      }
    };

    Diagram.prototype.findElement = function(el) {
      var $el = $(el);

      if ($el.length === 0 || $el[0] === this.el) {
        return undefined;
      }

      if ($el.data('view')) {
        return $el.data('view');
      }

      return this.findElement($el.parent());
    };

    Diagram.prototype.clear = function() {
      this.el.empty();
    };

    Diagram.prototype.fitToView = function(view) {
      var maxWidth  = view.width;
      var maxHeight = view.height;

      this.el.css("position", "absolute");
      this.el.css("width", maxWidth);
      this.el.css("height", maxHeight);
      this.el.css("top", (this.max_size-maxHeight)/2);
      this.el.css("left", (this.max_size-maxWidth)/2);

      this.parent.css("min-width", this.max_size);
      this.parent.css("min-height", this.max_size);
    };

    Diagram.prototype.resetSize = function() {
      this.el.attr("style", "");
      this.parent.attr("style", "");
    };

    Diagram.prototype.render = function(elements) {
      _.each(elements, function(element) {
        element.render();
        this.el.append(element.el);
      }.bind(this));
    };

    Diagram.prototype.on = function(event_name, callme) {
      this.handler.on(event_name, callme);
    };

    return Diagram;
  }]);
