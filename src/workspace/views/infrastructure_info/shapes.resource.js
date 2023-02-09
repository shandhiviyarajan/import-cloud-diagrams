angular.module('designer.workspace.views.infrastructure-info.shapes.resource', ['designer.workspace.canvases.jointjs.shapes.resource'])
  .service('InfrastructureInfoResourceElement', ['ResourceElement', 'DesignerState', function(ResourceElement, DesignerState) {
    var prebuilt_markup = V('<g>' +
      '<circle class="selected" />' +
      '<circle class="border" />' +
      '<circle class="connectionPoint" />' +
      '<use></use>' +
      '<text class="iconInfo"/>' +
      '<circle class="badge" />' +
      '<text class="badgeText"/>' +
      '<text class="title"/>' +
      '<foreignObject class="nameContainer">' +
      '<div xmlns="http://www.w3.org/1999/xhtml">' +
      '<p class="name" style="line-height:1; text-align: center; overflow: hidden; word-wrap: break-word;"></p>' +
      '</div>' +
      '</foreignObject>' +
      '<rect class="infoContainer"></rect>' +
      '<foreignObject class="infoDisplay">' +
      '<div xmlns="http://www.w3.org/1999/xhtml">' +
      '<div class="info1" style="height:20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>' +
      '<div class="info2" style="height:20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>' +
      '<div class="info3" style="height:20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>' +
      '</div>' +
      '</foreignObject>' +
      '</g>');

    return ResourceElement.extend({
      showExtendedInfo: true,
      markup: " ",
      prebuilt_markup: prebuilt_markup,

      defaults: joint.util.defaultsDeep({
        attrs: {
          '.infoContainer': { x: 75, y: 0, width: 125, height: 70, "fill-opacity": 0 },
          '.infoDisplay': { 'font-size': 14, x: 76, y: 4, width: 129, height: 66, color: '#111111' },
          '.nameContainer': { width: 200 }
        }
      }, ResourceElement.prototype.defaults),

      updateContainerText: function(paper) {
        ResourceElement.prototype.updateContainerText.apply(this, arguments);

        var el       = paper.findViewByModel(this).el;
        var resource = this.get("resource");
        var info     = resource.getExtendedInformation();

        $(el).find('.info1').text(info.info1 || "");
        $(el).find('.info2').text(info.info2 || "");
        $(el).find('.info3').text(info.info3 || "");

        // If the provider ID is super long then make it display right to left so we can see the end
        if (info.info1 && info.info1.length > 30) {
          $(el).find('.info1').css("direction", "rtl");
        }
      },

      geometrychange: function() {
        var width = DesignerState.get("layout")["Views::Infrastructure::Extended"].resource_width;
        var height = DesignerState.get("layout")["Views::Infrastructure::Extended"].resource_height;
        this.attr(".nameContainer/height", (16 + height));
        this.attr(".nameContainer/width", (184 + width));

        this.attr(".infoDisplay/width", (113 + width));
        this.attr(".infoContainer/width", (109 + width));
      }
    });
  }]);
