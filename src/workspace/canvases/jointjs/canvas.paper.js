angular.module('designer.workspace.canvases.jointjs.paper', [])
.service('Paper', [function() {
  return joint.dia.Paper.extend({
    locked: true,
    display_connections: false,
    isometric: false,

    addFilter: function(filterID, filter) {
      var filterSVGString = joint.util.filter[filter.name] && joint.util.filter[filter.name](filter.args || {});
      var filterElement = V(filterSVGString);
      // Set the filter area to be 3x the bounding box of the cell
      // and center the filter around the cell.
      filterElement.attr({
        filterUnits: 'objectBoundingBox',
        x: -1, y: -1, width: 3, height: 3
      });
      if (filter.attrs) filterElement.attr(filter.attrs);
      filterElement.node.id = filterID;
      V(this.defs).append(filterElement);
    },

    lock: function(locked) {
      this.locked = locked;
    },

    requestConnectedLinksUpdate: function(view, opt) {
      // Ignore connected link updates - they only ever move if we change the layout, so we trigger that manually below
    },

    updateLinks: function() {
      _.each(this.model.getLinks(), function(link) {
        var linkView = this.findViewByModel(link);
        if (!linkView) return;
        var flagLabels = ['UPDATE', 'TARGET', 'SOURCE'];
        this.scheduleViewUpdate(linkView, linkView.getFlag(flagLabels), linkView.UPDATE_PRIORITY, {});
      }.bind(this));
    },

    toggleAllConnections: function(toggle) {
      this.display_connections = toggle;

      _.each(this.model.getLinks(), function(link) {
        var model = this.findViewByModel(link);

        if(model) {
          this.display_connections ? model.$el.show() : model.$el.hide();
        }
      }.bind(this));
    },

    showLinks: function(resource) {
      if(this.display_connections) return;

      _.each(this.model.getLinks(), function(link) {
        if(resource.id === link.attributes.source.id || resource.id === link.attributes.target.id) {
          this.findViewByModel(link).$el.show();
        }
      }.bind(this));
    },

    hideLinks: function(resource) {
      if(this.display_connections) return;

      _.each(this.model.getLinks(), function(link) {
        if(resource.id === link.attributes.source.id || resource.id === link.attributes.target.id) {
          this.findViewByModel(link).$el.hide();
        }
      }.bind(this));
    },

    updateContainerText: function() {
      _.each(this.model.getElements(), function(r) {
        r.updateContainerText(this);
      }.bind(this));
    },

    skewIsometric: function(showIsometric) {
      this.isometric = showIsometric;

      if (showIsometric) {
        V(this.svg).addClass("skew");
        V(this.svg).addClass("rotate");
      }
      else {
        V(this.svg).removeClass("skew");
      }
    },

    highlightEnvResources: function(environment, highlightAdded, highlightDeleted) {
      if(environment.facet.resources.length) {
        if(highlightDeleted.length) {
          this.highlightResources(highlightDeleted, true);
        }
        if(highlightAdded.length){
          this.highlightResources(highlightAdded, false);
        }
      }
    },

    highlightResources: function(resources, state) {
      _.each(this.model.getElements(), function(r) {
        var view = this.findViewByModel(r);
        var s = r.get('resource');
        if(s && _.includes(resources, s.id)){
          view.highlight(state)
        }
      }.bind(this));
    },

    fadeResources: function() {
      _.each(this.model.getElements(), function(r) {
        var view = this.findViewByModel(r);
        var resource = r.get('resource');

        if(!view || !resource) return;

        resource.display_faded ? view.fade() : view.unfade();
      }.bind(this));
    },

    iconSwitch: function() {
      _.each(this.model.getElements(), function(r) {
        var view = this.findViewByModel(r);
        var resource = r.get('resource');
        view.updateTheme(resource);
      }.bind(this));
    },

    // If the content is too small, add a lot of padding. Otherwise extend the canvas to fit it all with a little padding
    fitToEnvironment: function(environment) {
      var min         = 4000;
      var padding     = 1500; // Give it some room to zoom, boom
      // TODO: we only need to check views that are on the jointjs canvas
      var maxWidth    = _.maxBy(environment.views, function(view) { return view.width }).width * 2;
      var maxHeight   = _.maxBy(environment.views, function(view) { return view.height }).height * 2;
      var widthDiff   = min - maxWidth;
      var heightDiff  = min - maxHeight;
      var biggestDiff = widthDiff > heightDiff ? widthDiff : heightDiff;

      // If we are smaller than the minimum then add it to padding
      if(biggestDiff > 0) {
        padding = biggestDiff / 2;
      }

      this.fitToContent({ minWidth: maxWidth, minHeight: maxHeight, padding: padding })
    }
  });
}]);
