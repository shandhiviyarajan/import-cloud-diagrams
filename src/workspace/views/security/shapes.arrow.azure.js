angular.module('designer.workspace.views.security.shapes.arrow.azure', [
    'designer.workspace.canvases.jointjs.shapes.container',
    'designer.workspace.views.security.views.arrow'
  ])
    .service('AzureArrowElement', ["ContainerElement", "ArrowView", function(ContainerElement, ArrowView) {
      var prebuilt_markup = V('<g class="main">' +
        '<g class="triangle">' +
          '<polyline class="mainRect tri" points="15,75 0,75 50,25 100,75 85,75" stroke="#000000" id="polyline1" fill="white" transform="" stroke-width="2"></polyline>' +
        '</g>' +
  
        '<g class="triangle2" opacity="0">' +
          '<polyline class="mainRect tri" points="15,75 0,75 50,25 100,75 85,75" stroke="#000000" id="polyline2" fill="white" transform="" stroke-width="2"></polyline>' +
        '</g>' +
  
        '<g class="rectangle">' +
          '<rect class="rectangle" fill="#ffffff" x="15" y="50" width="70" height="150"></rect>' +
          '<line class="rectangle mainRect" stroke="#000000" y1="50px" id="line1" x1="15px" y2="200px" x2="15px"></line>' +
          '<line class="rectangle mainRect" stroke="#000000" y1="50px" x1="85px" id="line2" y2="200px" x2="85px"></line>' +
          '<text class="direction" font-size="20px" style="writing-mode: vertical-rl;text-orientation: mixed;" x="50" y="15" fill="black">INBOUND</text>' +
        '</g>' +
  
        '<foreignObject class="arrow-info">' +
          '<div xmlns="http://www.w3.org/1999/xhtml">' +
            '<div class="securityRowTitle"></div>' +
          '</div>' +
        '</foreignObject>' +
  
        '</g>');
  
      return ContainerElement.extend({
        view: ArrowView,
        prebuilt_markup: prebuilt_markup,
        markup: " ",
        selectBorderColor: "#FF00FF",
        defaults: joint.util.defaultsDeep({
          size: { width: 500, height: 500 },
          z: 15,
          attrs: {
            '.arrow-info': { x: 90, y: -60, width: 100, rotate: '-45deg', height: 80, ref: '.rectangle', 'ref-y': 0.9999999 }
          }
        }, ContainerElement.prototype.defaults),
  
        updateContainerText: function(paper) {
          var info = this.get("info");
          const { src_pos, dst_pos } = info;
  
          var color = "#000000"
          if (info["access"] === "allow") {
            color = "#008000";
          } else if (info["access"] === "deny"){
            color = "#ff0000";
          }
  
          const { label,label_length } = this.buildArrowLabel(info["ports"]);
          var text_height = label_length*33+33;
  
          var rect_height = info["h"]-125;
          this.attr(".rectangle/height", info["h"]-125);
          this.attr(".rectangle/y2", info["h"]-75);
          this.attr(".triangle2/opacity", 0);
          this.attr(".mainRect/stroke", color);
          this.attr(".mainRect/stroke-width", 3);
          this.attr(".arrow-info/height", text_height);
          this.attr(".arrow-info/y", -rect_height/2-text_height/2);
  
          if(dst_pos < src_pos) {
            this.attr(".rectangle/y", "75px");
            this.attr(".rectangle/y1", "75px");
            this.attr(".rectangle/y2", info["h"]-50);
          }
          else if(dst_pos > src_pos) {
            this.attr(".triangle/transform", "translate(0, "+info["h"]+") scale(1, -1)");
          }
  
          if (info["direction"]) {
            this.attr(".direction/y", info["h"]/2 - 55);
            this.attr(".direction/text", info["direction"].toUpperCase());
          }
  
          var el = paper.findViewByModel(this).el;
          $(el).find('.securityRowTitle').append($(label));
        },
  
        buildArrowLabel: function(info_ports) {
          var ports = {};
          _.each(info_ports, function(p) {
            if (p["ports"] !== "ALL") {
              if (!ports[p["protocol"]]) { ports[p["protocol"]] = [] }
              ports[p["protocol"]].push(p);
            }
          });
  
          var label = '';
          var label_length = 0
          if (Object.keys(ports).length) {
            _.each(ports, function(prts, protocol) {
              label_length += _.uniq(prts).length + 1;
  
              if(protocol.toUpperCase() !== "ALL") {
                label += '<div>'+ protocol.toUpperCase() + '</div>';
  
                _.each(prts, function(port_rule) {
                  var from = port_rule.from_port;
                  var to = port_rule.to_port;
                  label += `<div><strong>F: ${from}</strong><br />`
                  label += `<strong>T: ${to}</strong></div>`
                });
              }
              else {
                label += '<div style="text-align: center">'+ protocol.toUpperCase() + '</div>';
              }
            });
          } else {
            label = '<div style="text-align: center">All</div>'
          }
          return { label: label, label_length: label_length };
        },
      });
    }]);
  