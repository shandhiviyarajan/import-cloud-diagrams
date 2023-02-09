angular.module('designer.workspace.views.security.shapes.nsg', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('NSGElement', ["ContainerElement", function(ContainerElement) {
    var prebuilt_markup = V('<g>' +
      '<g class="scalable">' +
      '<rect class="mainRect" />' +
      '</g>' +
      '<text class="description1"/>' +
      '<foreignObject class="security-view-row">' +
      '<div xmlns="http://www.w3.org/1999/xhtml">' +
      '<div class="securityGroupTitle" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center;"></div>' +
      '</div>' +
      '</foreignObject>' +
      '</g>');

    return ContainerElement.extend({
      prebuilt_markup: prebuilt_markup,
      markup: " ",
      selectBorderColor: "#979797",
      defaults: joint.util.defaultsDeep({
        size: { width: 500, height: 500 },
        z: 5,
        attrs: {
          '.title': { 'font-size': 28, x: 20, y: -10, "text-anchor": "start", fill: '#4F4F4F', text: '', ref: '.mainRect', 'ref-x': 0, 'ref-y': 0.9999999 },
          '.description1': { 'font-size': 18, x: 45, y: -50, "text-anchor": "start", fill: '#4F4F4F', text: '', ref: '.mainRect', 'ref-x': 0, 'ref-y': 0.9999999 },
          '.mainRect': { stroke: '#00a2ed', "stroke-width": 1.5, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 },
          '.rectangle': { width:40, height:126, x:1, y:1.3},
          '.security-view-row': { 'font-size': 28, x: 45, y: -90, width: 700, height: 80, ref: '.mainRect', 'ref-y': 0.9999999}
        }
      }, ContainerElement.prototype.defaults),

      updateContainerText: function(paper) {
        var resource = this.get("resource") || {type: ''};
        var short_type = resource.type.split("::")[3];
        var color = resource.name ?  "#80da80" : "#e06262";
        this.attr(".rectangle/fill", color);

        var info = '';
        info += resource.image ? '<svg><use xlink:href="' + resource.image + '" /></svg>' : '<span class="octicon octicon-globe"></span>';
        info += `<span>${short_type} - ${resource.name || this.name}</span>`;
        var el = paper.findViewByModel(this).el;
        $(el).find('.securityGroupTitle').append($(info));

        if (resource.provider_type === 'aws') { this.attr(".description1/text", (resource.provider_id || ""))}; 
      }
    });
  }]);
