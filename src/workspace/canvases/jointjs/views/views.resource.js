angular.module('designer.workspace.canvases.jointjs.views.resource', [])
  .service('ResourceView', ["$location", function($location) {
    return joint.dia.ElementView.extend({
      highlighted: false,
      faded: false,

      events: {
        'mouseout': 'unhighlight',
        'dragleave': 'unhighlight',
        'dragover':  'dragover'
      },

      initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.containerBorderColor = "#B8B8B8";
        this.listenTo(this.model, 'change:position', this.geometrychange);
        this.listenTo(this.model, 'change:size', this.geometrychange);

        // Update the resource so we have geometry even if they don't move / resize it :P
        this.geometrychange();
      },

      renderStringMarkup: function() {
        var vel = this.vel;
        vel.append(this.model.prebuilt_markup.clone());
        // Cache transformation groups
        this.rotatableNode = vel.findOne('.rotatable');
        this.scalableNode = vel.findOne('.scalable');

        var selectors = this.selectors = {};
        selectors[this.selector] = this.el;
      },

      geometrychange: function() {
        var s = this.model.get('resource');
        if(s) {
          s.geometry = _.extend(this.model.get('position'), this.model.get('size'));
        }

        this.model.geometrychange();
      },

      select: function(instant) {
        var resource = this.model.get("resource");
        var opts = instant ? { delay: 0, duration: 0 }  :
                             { delay: 0, duration: 150, timingFunction: joint.util.timing.linear };

        this.model.attr("use/filter", "url(" + $location.absUrl() + "#selectedResourceFilter)");

        this.model.transition('attrs/use/x', -5, opts);
        this.model.transition('attrs/use/y', -5, opts);
        this.model.transition('attrs/use/width', 80, opts);
        this.model.transition('attrs/use/height', 80, opts);
      },

      deselect: function() {
        var opts = {
          delay: 0,
          duration: 150,
          timingFunction: joint.util.timing.linear
        };

        this.model.attr("use/filter", "");

        this.model.transition('attrs/use/x', 0, opts);
        this.model.transition('attrs/use/y', 0, opts);
        this.model.transition('attrs/use/width', 70, opts);
        this.model.transition('attrs/use/height', 70, opts);
      },

      highlight: function(invalid) {
        if(this.highlighted) return;

        var colour = invalid ?  "#F04124" : "#077a07";

        this.model.attr("use/filter", "url(" + $location.absUrl() + "#highlightedResourceFilter)");

        this.highlighted = true;
      },

      unhighlight: function() {
        if(!this.highlighted) return;

        this.model.attr("use/filter", "");

        this.highlighted = false;
      },

      fade: function() {
        var opts = {
          delay: 0,
          duration: 150,
          timingFunction: joint.util.timing.linear
        };

        this.model.transition('attrs/g/opacity', 0.4, opts);

        this.faded = true;
      },

      unfade: function() {
        var opts = {
          delay: 0,
          duration: 150,
          timingFunction: joint.util.timing.linear
        };

        this.model.transition('attrs/g/opacity', 1, opts);

        this.faded = false;
      },

      updateTheme: function() {
        this.model.updateTheme(this);
      },

      pointermove: function(evt, x, y) {
        // If the paper is locked then do nothing
        if(this.paper.locked) return;

        joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
      }
    });
  }]);
