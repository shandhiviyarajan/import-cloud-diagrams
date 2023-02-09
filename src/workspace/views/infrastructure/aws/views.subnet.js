angular.module('designer.workspace.views.infrastructure.aws.views.subnet', ['designer.workspace.canvases.jointjs.views.container'])
  .service('AwsSubnetView', ["ContainerView", "$rootScope", function(ContainerView, $rootScope) {
    return ContainerView.extend({
      subnet_row_height: 29,
      template: [
        '<div class="subnet-group-row">',
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

        $(this.el).find(".subnetGroupContainer").append(this.$box);

        var resource = this.model.get("resource");

        var y_pos = 55;
        var height = 0;
        this.$box.empty();
        
        _.each(resource.getSubnetGroups(), function(group) {
          var el = this.buildSubnetGroupRow(group);

          this.$box.append(el);
          this.subnet_groups[group.id] = el;

          y_pos += this.subnet_row_height;
          height += this.subnet_row_height;
        }.bind(this));

        this.model.attr(".subnetGroupDisplay/y", -y_pos);
        this.model.attr(".subnetGroupDisplay/height", height);

        return this;
      },

      buildSubnetGroupRow: function(group) {
        var name = group.name;
        if(name.length > 45) {
          name = name.substr(0, 40) + ' ...';
        }

        var el = $('<span></span>');
        el.text(name);
        el.addClass(group.simple_name.replace(/\./g, "-"));
        el.on("click", function() { $rootScope.$broadcast("group:unhighlight"); $rootScope.$broadcast("resource:select", group); });
        el.on("mouseover", function() { $rootScope.$broadcast("group:highlight", group) });
        el.on("mouseout", function() { $rootScope.$broadcast("group:unhighlight") });

        // Show the image
        var svg = $('<svg><use xlink:href="' + group.image + '" /></svg>')
        el.append(svg);

        return el;
      },

      highlightSubnetGroup: function(evt, group) {
        _.each(this.subnet_groups, function(el, group_id) {
          if(group.id === group_id) {
            el.addClass("group-highlight");

            // Highlight the subnet too eh
            this.highlight();
          }
        }.bind(this));
      },

      unhighlightSubnetGroups: function(evt) {
        _.each(this.subnet_groups, function(el, group_id) {
          el.removeClass("group-highlight");
        }.bind(this));

        this.unhighlight();
      },

      updateTheme: function() {
        this.model.updateTheme();
        this.render();
      },

      removeBox: function(evt) {
        this.$box.remove();
      }
    });
  }]);
