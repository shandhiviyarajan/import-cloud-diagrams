angular.module('designer.workspace.views.container.views.hex', [])
.service('HexView', ["$location", function($location) {
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
      var resource = this.model.get('resource');

      if (resource) {
        var status_color = resource.status_list[resource.status];

        if (status_color === "good") {
          this.model.attr("path/fill", "#aadebd");
        }
        else if (status_color === "warn") {
          this.model.attr("path/fill", "#fff494");
        }
        else if (status_color === "bad") {
          this.model.attr("path/fill", "#fabdb3");
        }
        else {
          this.model.attr("path/fill", "#dcdcdc");
        }
      }

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

    select: function(instant) {
      var opts = instant ? { delay: 0, duration: 0 }  :
        { delay: 0, duration: 150, timingFunction: joint.util.timing.linear };

      this.model.set("z", 50);
      this.model.attr("path/stroke-width", 3);
      this.model.translate(-5, -5, opts);
      this.model.resize(this.model.attributes.size["width"] + 10, this.model.attributes.size["height"] + 10, opts);
    },

    deselect: function() {
      var opts = {
        delay: 0,
        duration: 150,
        timingFunction: joint.util.timing.linear
      };


      this.model.set("z", 40);
      this.model.attr("path/stroke-width", 1);
      this.model.translate(5, 5, opts);
      this.model.resize(this.model.attributes.size["width"] - 10, this.model.attributes.size["height"] - 10, opts);
    },

    highlight: function(invalid) {
      if(this.highlighted) return;

      var colour = invalid ?  "#F04124" : "#077a07";

      this.model.attr("path/filter", "url(" + $location.absUrl() + "#highlightedResourceFilter)");

      this.highlighted = true;
    },

    unhighlight: function() {
      if(!this.highlighted) return;

      this.model.attr("path/filter", "");

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
