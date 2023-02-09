angular.module('designer.workspace.views.infrastructure.gcp.views.subnetwork', ['designer.workspace.canvases.jointjs.views.container'])
  .service('GCPSubnetworkView', ["ContainerView", "$rootScope", function(ContainerView, $rootScope) {
    return ContainerView.extend({
      template: [
        '<div class="security-group-icon">',
        '</div>'
      ].join(''),

      initialize: function() {
        ContainerView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        this.subnetwork_groups = {};

        // Prevent paper from handling pointerdown.
        this.$box.find('.html-element').on('mousedown click', function(evt) {
          evt.stopPropagation();
        });

        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        // Listen for our angular events
        $rootScope.$on("group:highlight", angular.bind(this, this.highlightSubnetGroup));
        $rootScope.$on("group:unhighlight", angular.bind(this, this.unhighlightSubnetGroups));
      },

      render: function() {
        ContainerView.prototype.render.apply(this, arguments);

        return this;
      },

      addResourceIcon: function(resource) {
        var el = $('<span></span>');

        // Show the image
        var img = $('<img src="' + resource.image + '" />');
        el.append(img);

        this.$box.append(el);
      },

      removeBox: function(evt) {
        this.$box.remove();
      }
    });
  }]);
