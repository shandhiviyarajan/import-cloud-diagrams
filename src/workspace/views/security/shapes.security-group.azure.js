angular.module('designer.workspace.views.security.shapes.security-group.azure', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('AzureSecurityGroupElement', ["ContainerElement", function(ContainerElement) {
    var prebuilt_markup = V('<g>' +
      '<g><rect class="rectangle"></rect></g>' +
      '<g class="scalable">' +
      '<rect class="mainRect" />' +
      '</g>' +
      '<text class="description1"/>' +
      '<foreignObject class="security-view-row-azure">' +
      '<div xmlns="http://www.w3.org/1999/xhtml">' +
      '<div class="securityGroupTitle" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center;"></div>' +
      '</div>' +
      '</foreignObject>' +
      '</g>');

    return ContainerElement.extend({
      prebuilt_markup: prebuilt_markup,
      markup: " ",
      selectBorderColor: "#e3e3e3",
      defaults: joint.util.defaultsDeep({
        size: { width: 500, height: 500 },
        z: 10,
        attrs: {
          '.title': { 'font-size': 28, x: 20, y: -10, "text-anchor": "start", fill: '#4F4F4F', text: '', ref: '.mainRect', 'ref-x': 0, 'ref-y': 0.9999999 },
          '.description1': { 'font-size': 18, x: 45, y: -50, "text-anchor": "start", fill: '#4F4F4F', text: '', ref: '.mainRect', 'ref-x': 0, 'ref-y': 0.9999999 },
          '.mainRect': { stroke: '#e3e3e3', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 },
          '.rectangle': { width:40, height:126, x:1, y:1.3},
          '.security-view-row-azure': { 'font-size': 28, x: 45, y: -105, width: 600, height: 80, ref: '.mainRect', 'ref-y': 0.9999999}
        }
      }, ContainerElement.prototype.defaults),

      updateContainerText: function(paper) {
        var resource = this.get("resource");
        var short_type = resource.type.split("::")[3];
        var color;

        if (resource) {
          color = "#80da80";
        }
        
        if (short_type === "GlobalResource") {
          color = this.isIP(resource.name) ? "#80da80" : "#00a2ed";
        }

        if (resource.name.toLowerCase() == "internet") {
          color = "#e06262";
        }

        this.attr(".rectangle/fill", color);

        var info = '';

        if (short_type === "GlobalResource") {
          info += `<span>&nbsp;&nbsp;&nbsp;${resource.name || this.name}</span>`;
        } else {
          info += resource.image ? '<svg><use xlink:href="' + resource.image + '" /></svg>' : '<span class="octicon octicon-globe"></span>';
          info += `<div class='row-description'"><p>${short_type}</p><p>${resource.name || this.name}</p></div>`;
        }


        var el = paper.findViewByModel(this).el;
        $(el).find('.securityGroupTitle').append($(info));
      },

      isIP: function(endpoint) {
        const isIp = ipaddr.isValid(endpoint);
        let isCidr = false;

        try {
          ipaddr.parseCIDR(endpoint);
          isCidr = true;
        } catch (e) {
          isCidr = false;
        }

        return isIp || isCidr;
      }
    });
  }]);
