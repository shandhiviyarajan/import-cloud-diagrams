angular.module('designer.workspace.views.infrastructure.azure.views.subnet', ['designer.workspace.canvases.jointjs.views.container'])
  .service('AzureSubnetView', ["ContainerView", "$rootScope", function(ContainerView, $rootScope) {
    return ContainerView.extend({
      template: [
        '<div class="security-group-icon">',
        '</div>'
      ].join(''),

      initialize: function() {
        ContainerView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        this.subnet_groups = {};

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

        $(this.el).find(".securityGroupContainer").append(this.$box);

        var resource = this.model.get("resource");
        var security_groups = resource.getSecurityGroups();
        var route_tables = resource.getRouteTables();

        if(security_groups.length > 0) {
          this.addResourceIcon(security_groups[0]);
        }

        if(route_tables.length > 0) {
          this.addResourceIcon(route_tables[0]);
        }

        return this;
      },

      addResourceIcon: function(resource) {
        var el = $('<span></span>');

        // Show the image
        var svg = $('<svg><use xlink:href="' + resource.image + '" /></svg>')
        el.append(svg);

        this.$box.append(el);
      },

      removeBox: function(evt) {
        this.$box.remove();
      }
    });
  }]);
