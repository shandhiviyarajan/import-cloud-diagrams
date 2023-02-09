angular.module('designer.workspace.views.infrastructure-info.shapes.elb', ['designer.workspace.views.infrastructure-info.shapes.resource'])
  .service('InfrastructureInfoELBElement', ['InfrastructureInfoResourceElement', 'DesignerState', function(InfrastructureInfoResourceElement, DesignerState) {
    var prebuilt_markup = V('<g>' +
      '<circle class="selected" />' +
      '<circle class="border" />' +
      '<circle class="connectionPoint" />' +
      '<use></use>' +
      '<circle class="badge" />' +
      '<text class="badgeText"/>' +
      '<text class="title"/>' +
      '<rect class="infoContainer"></rect>' +
      '<foreignObject class="infoDisplay">' +
      '<div xmlns="http://www.w3.org/1999/xhtml">' +
      '<p class="info" style="line-height:1; text-align: center; overflow: hidden; font-size: 15px; word-break: break-all"></p>' +
      '</div>' +
      '</foreignObject>' +
      '</g>');

    return InfrastructureInfoResourceElement.extend({
      markup: " ",
      prebuilt_markup: prebuilt_markup,

      defaults: joint.util.defaultsDeep({
        attrs: {
          '.infoContainer': { x: -94, y: 75, width: 260, height: 50, "fill-opacity": 0 },
          '.infoDisplay': { x: -86, y: 78, width: 244, height: 66, color: '#111111' }
        }
      }, InfrastructureInfoResourceElement.prototype.defaults),

      updateContainerText: function(paper) {
        InfrastructureInfoResourceElement.prototype.updateContainerText.apply(this, arguments);

        var el       = paper.findViewByModel(this).el;
        var resource = this.get("resource");

        $(el).find('.info').text(resource.dns_name || resource.name || "");
      },

      geometrychange: function() {
        var width = DesignerState.get("layout")["Views::Infrastructure::Extended"].resource_width;
        var height = DesignerState.get("layout")["Views::Infrastructure::Extended"].resource_height;
        this.attr(".infoContainer/x", (-78 - width));
        this.attr(".infoContainer/height", (-14 + height));
        this.attr(".infoContainer/width", (244 + (width*2)));

        this.attr(".infoDisplay/x", (-70 - width));
        this.attr(".infoDisplay/height", (2 + height));
        this.attr(".infoDisplay/width", (228 + (width*2)));
      }
    });
  }]);
