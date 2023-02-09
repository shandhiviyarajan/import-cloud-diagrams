angular.module('designer.configuration', [])
.value('DesignerConfig', {
  default: {
    showControls:     true,  // Show canvas controls and view options
    showExport:       true,  // Show sharing and export buttons
    showAttributes:   true,  // Show the attributes bar
    fitToContent:     false, // Calls the jointjs fitToContent on load (TODO: tbh I can't remember what this does right now)
    showLabels:       false, // Show the labels on load
    showConnections:  false, // Show the connections on load
    showRevisions:    true,  // Show the revision list
    loadConnections:  true,  // Whether to load connections at all, used to improve the speed of renders of we don't need connections
    loadBadges:       true,  // Whether to load badges on resources, to improve the speed of thumbnail renders that don't require them
    showIsometric:    false, // Load the isometric diagram on load
    highlightDeleted: null,  // A comma separated list of deleted resources to be highlighted
    highlightAdded:   null,  // A comma separated list of added resources to be highlighted
    autohide:         false, // Automatically hides the attribute bar if nothing is selected
    defaultView:      null,  // The default view to load in the viewer, otherwise it selects the first it finds
    exportFormats:    [],    // List of formats allowed in the export panel
    watermark:        false, // Display watermark on the workspace
    allowableViews:   [],    // TODO: a temp value that let's us define allowable views in the dropdown. This should be handled by the API ideally
    allowEmbed:       false, // Allow the users to embed their environments in external pages
    showIcons:        true,  // Show the icon select options
    iconsPath:        "",    // Location of the icons (can be local or remote)
    imagesPath:       "",    // Location of the images (can be local or remote)
    iconSet:          null,  // The default icon to load in the viewer, otherwise it selects the first it finds
    show3DView:       false, // Boolean flag for toggling the 3D view on and off
    enable3DView:     false, // This flag is used to enabled/disable 3D view feature
    enableShare:      false, // Temporary feature flag to enable sharing
    embeddableHost:   "",    // The host where the embeddable viewer is found
    hideDefaultArrows: false,// Hide default arrows on AWS security views
    hideNamespaces:   true,  // Hide default namespaces in kubernetes

    // Override defaults for the layout
    layout: null,

    // The function to call when retrieving search results. By default returns an empty result set.
    searchMethod:     function () {
      return { "recordsTotal": 0, "recordsFiltered": 0, "data": [] }
    }
  },

  overrides: {},

  set: function(k, v) {
    this.overrides[k] = v;
  },

  get: function(k) {
    if (this.overrides.hasOwnProperty(k)) {
      return this.overrides[k];
    }

    return this.default[k];
  },

  full: function() {
    return Object.assign(this.default, this.overrides);
  },

  reset: function() {
    this.overrides = {};
  }
});
