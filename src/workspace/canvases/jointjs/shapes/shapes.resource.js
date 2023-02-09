angular.module('designer.workspace.canvases.jointjs.shapes.resource', [
  'designer.model.resource.images',
  'designer.model.resource.images',
  'designer.workspace.canvases.jointjs.views.resource',
  "designer.state",
  "designer.state"
])
  .service('ResourceElement', ["ResourceView", "DesignerState", "DesignerConfig", "ResourceImages", function(ResourceView, DesignerState, DesignerConfig, ResourceImages) {
    var prebuilt_markup = V('<g>' +
      '<circle class="connectionPoint" />' +
      '<use></use>' +
      '<text class="iconInfo"/>' +
      '<circle class="badge" />' +
      '<text class="badgeText"/>' +
      '<text class="title"/>' +
      '<foreignObject class="nameContainer">' +
        '<div xmlns="http://www.w3.org/1999/xhtml">' +
        '<p class="name" style="line-height:1; text-align: center; overflow: hidden; word-break: break-all;"></p>' +
        '</div>' +
      '</foreignObject>' +
      '</g>');

    return joint.shapes.basic.Image.extend({
      view: ResourceView,
      prebuilt_markup: prebuilt_markup,
      markup: " ",
      defaults: joint.util.defaultsDeep({
        type: 'resource',
        size: { width: 70, height: 70 },
        z: 40,
        attrs: {
          'g': {
            'ref-width': '100%',
            'ref-height': '100%',
            opacity: 1
          },
          'use': { 'width': 70, 'height': 70, 'x':0, 'y':0 },
          '.connectionPoint': { cx: 35, cy: 35, magnet: true, r: 30, fill: "#FFFFFF", opacity: 0 },
          '.badge': { r: 10, 'fill': '#DDDDDD', cx: 60, cy: 60, opacity: 0, "stroke-width": 1, stroke: "#FFFFFF" },
          '.badgeText': { 'font-size': 12, x: 60, y: 65, ref: 'use', text: '', fill: '#000000', 'text-anchor': 'middle' },
          '.nameContainer': { 'font-size': 10, x: -16, y: 76, width: 102, height: 48, color: '#111111' }
        }
      }, joint.shapes.basic.Generic.prototype.defaults),

      images_key: "vendor",

      initialize: function() {
        joint.shapes.basic.Image.prototype.initialize.apply(this, arguments);
      },

      showIconInformation: function(view) {
        var resource = this.get("resource");

        if (typeof resource.getIconInformation === 'function') {
          var info = resource.getIconInformation() || {}; 
          var txt = info.txt; 
          var words = txt.split(/\s+/);

          var line1 = V('<tspan class="info-on-icon">' + words[0] + '</tspan>');
          line1.attr(info);
          
          V(view.el).find(".iconInfo")[0].append(line1);

          if (words.length > 1) { 
            var line2 = V('<tspan class="info-on-icon" >' + words[1] + '</tspan>');
            var attrs = info;
            attrs.dx = info.dx2;
            attrs.dy = info.dy2;

            line2.attr(attrs);
            V(view.el).find(".iconInfo")[0].append(line2);
          } 
        }
      },

      hideIconInformation: function(view) {
        $(view.el).find('.iconInfo').text("");
      },

      showName: function(view) {
        var name = this.get("resource").name || "";

        // If name is over a certain length then make sure it doesn't break over too many lines
        if(name.length > 25) {
          name = name.replace(/-/g, String.fromCharCode(8209));
        }

        $(view.el).find('.name').text(name);
      },

      hideName: function(view) {
        $(view.el).find('.name').text("");
      },

      updateTheme: function(view) {
        var resource = this.get("resource");
        resource.setImageUrl();
        ResourceImages.icons_sets[resource.provider_type][DesignerState.get("selectedIconSet")]["icon_overlay"] ?  this.showIconInformation(view) :  this.hideIconInformation(view);
       
        this.attr("use/href", resource.image);
      },

      updateContainerText: function(paper) {
        // Skip rendering them on thumbnails, as they just slow things down
        if(!DesignerConfig.get("loadBadges"))
          return;

        var resource = this.get("resource");

        if(!resource.has_badge) return;

        // Need to get the position, then see if it's in a subnet
        // FIXME (AN): we do this for asg, which needs a subnet. It's a bit too specific :P Also veeeery slow as it calls bbox
        var parents = paper.model.findModelsFromPoint(this.get("position"));
        var subnet = _.find(parents, function(p) {
          var r = p.get("resource");
          return r && r.type === "Resources::AWS::EC2::Subnet";
        });

        // Display the badge if we have any content
        var t = resource.badgeContent(subnet);
        if(t) {
          //console.debug(t, this.id, this.resource_id);
          this.attr(".badgeText/text", t);
          this.attr(".badge/opacity", 1);
        }
      },

      geometrychange: function() {
        var width = DesignerState.get("layout")["Views::Infrastructure"].resource_width;
        var height = DesignerState.get("layout")["Views::Infrastructure"].resource_height;
        this.attr(".nameContainer/x", (0 - width));
        this.attr(".nameContainer/height", (16 + height));
        this.attr(".nameContainer/width", (60 + (width * 2)));
      }
    });
  }]);
