angular.module('designer.state', [])
.value('DesignerState', {
  default: {
    selectedView: null,
    displayLabels: false,
    displayConnections: false,
    displayIsometric: false,
    display3DView: false,
    hideDefaultArrows: false,
    hideNamespaces: true,
    highlightTagged: false,
    selectedIconSet: "",
    selectedResource: "",
    layout: {
      "Views::Infrastructure": {
        resource_width: 16,
        resource_height: 32,
        subnet_width: 0
      },
      "Views::Infrastructure::Extended": {
        resource_width: 16,
        resource_height: 64,
        subnet_width: 0
      }
    }
  },

  overrides: {},

  set: function(k, v) {
    this.overrides[k] = v;
  },

  get: function(k) {
    return this.overrides.hasOwnProperty(k) ? this.overrides[k] : this.default[k];
  },

  reset: function(k) {
    this.overrides[k] = angular.copy(this.default[k]);
  },

  loadFromConfig: function(config) {
    this.set("selectedView", config.get("defaultView"));
    this.set("displayLabels", config.get("showLabels"));
    this.set("displayConnections", config.get("showConnections"));
    this.set("displayIsometric", config.get("showIsometric"));
    this.set("highlightTagged", config.get("highlightTagged"));
    this.set("selectedIconSet", config.get("iconSet"));
    this.set("display3DView", config.get("show3DView"));
    this.set("hideDefaultArrows", config.get("hideDefaultArrows"));
    this.set("hideNamespaces", config.get("hideNamespaces"));
    this.set("selectedResource", config.get("selectedResource"));

    if(config.get("layout")) {
      this.set("layout", angular.copy(config.get("layout")));
    }
    else {
      this.set("layout", angular.copy(this.default["layout"]));
    }
  },

  selectDefaultView: function(views) {
    var view_types = _.map(views, function(v) { return v["type"] });

    if(_.includes(view_types, "Views::Infrastructure"))
      this.set("selectedView", "Views::Infrastructure");
    else
      this.set("selectedView", view_types[0]);
  }
});
