angular.module('designer.workspace.canvases.jointjs.views.container', [])
  .service('ContainerView', [function() {
    return joint.dia.ElementView.extend({
      highlighted: false,
      containerBorderColor: "#FAFAFA",
      faded: false,
      selected: false,

      events: {
        'mouseout': 'unhighlight',
        'dragleave': 'unhighlight'
      },

      initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.containerFillColor = this.model.attr(".mainRect/fill");
        this.containerBorderColor = "#B8B8B8";
        this.highlighted = false;
        this.selected = false;

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
      },

      // TODO: do we use instant anymore? If not we can remove opts
      select: function(instant) {
        var resource = this.model.get("resource");
        var opts = instant ? { delay: 0, duration: 0 }  :
          { delay: 0, duration: 150 };

        opts.valueFunction = joint.util.interpolate.hexColor;
        this.containerBorderColor = this.model.attr(".mainRect/stroke");
        this.model.transition('attrs/.mainRect/stroke-width', 3, { delay: 0, duration: 150 });

        this.selected = true;
      },

      deselect: function() {
        var opts = {
          delay: 0,
          duration: 150,
          timingFunction: joint.util.timing.linear
        };

        var resource = this.model.get("resource");
        opts.valueFunction = joint.util.interpolate.hexColor;
        this.model.transition('attrs/.mainRect/stroke-width', 1, { delay: 0, duration: 150 });

        this.selected = false;
      },

      highlight: function(invalid) {
        if(this.highlighted) return;

        var colour = invalid ?  "#F04124" : "#ABD1AB";
        this.containerFillColor = this.model.attr(".mainRect/fill");

        this.model.attr(".mainRect/fill", colour);
        this.model.attr(".mainRect/fill-opacity", 0.3);

        this.highlighted = true;
      },

      unhighlight: function() {
        if(!this.highlighted) return;

        this.model.attr(".mainRect/fill", this.containerFillColor);
        this.model.attr(".mainRect/fill-opacity", 1);

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
        this.model.updateTheme();
      },

      pointermove: function(evt, x, y) {
        // If the paper is locked then do nothing
        if(this.paper.locked) return;

        joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
      }
    });
  }]);
