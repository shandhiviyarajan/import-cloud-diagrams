angular.module('designer.workspace.views.security.shapes.arrow.horizontal', [
    'designer.workspace.canvases.jointjs.shapes.container',
    'designer.workspace.views.security.views.arrow'
  ])
    .service('HorizontalArrowElement', ["ContainerElement", "ArrowView", function(ContainerElement, ArrowView) {
      var prebuilt_markup = V('<g class="main" transform="translate(-20, 0)">' +
        '<g class="triangle">' +
        '<polyline class="mainRect tri" points="75,10 75,-5 25,45 75,95 75,80" stroke="#000000" id="polyline1" fill="white" transform="" stroke-width="2"></polyline>' +
        '</g>' +
  
        '<g class="triangle2" opacity="0">' +
        '<polyline class="mainRect tri" points="75,10 75,-5 25,45 75,95 75,80" stroke="#000000" id="polyline2" fill="white" transform="" stroke-width="2"></polyline>' +
        '</g>' +
  
        '<g class="rectangle">' +
        '<rect class="rectangle" fill="#ffffff" x="15" y="10" width="70" height="70"></rect>' +
        '<line class="rectangle mainRect" stroke="#000000" x1="50px" id="line1" y1="10px" x2="200px" y2="10px"></line>' +
        '<line class="rectangle mainRect" stroke="#000000" x1="50px" id="line2" y1="80px" x2="200px" y2="80px"></line>' +
        '<text class="direction" font-size="20px" x="47" y="52" fill="black">INBOUND</text>' +
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
            '.arrow-info': { x: 17, y: -60, width: 66, rotate: '-45deg', height: 80, ref: '.rectangle', 'ref-y': 0.9999999 }
          }
        }, ContainerElement.prototype.defaults),
  
        updateContainerText: function(paper) {
          var info = this.get("info");
          info["h"] = 200; 
  
          var color = "#000000"
          if (info["access"] === "allow") {
            color = "#008000";
          } else if (info["access"] === "deny"){
            color = "#ff0000";
          }

          if (info["access"] === "allow") {
            this.attr(".rectangle/fill", "#b5ebc7");
            this.attr(".tri/fill", "#b5ebc7");
            this.attr(".arrow-info/y", -info["h"]/2+text_height/2+25);
          } else {
            this.attr(".rectangle/fill", "#ffa2a2");
            this.attr(".tri/fill", "#ffa2a2");
            this.attr(".arrow-info/y", -info["h"]/2+text_height/2+25);
          }
  
          const { label,label_length } = this.buildArrowLabel(info["ports"]);
          var text_height = label_length*33+33;
  
          var rect_height = info["h"]-125;
          this.attr(".rectangle/width", info["h"]-125);
          this.attr(".rectangle/x2", info["h"]-75);
          this.attr(".triangle2/opacity", 0);
          this.attr(".mainRect/stroke", color);
          this.attr(".mainRect/stroke-width", 3);
          this.attr(".arrow-info/height", text_height);
          this.attr(".arrow-info/y", -rect_height/2-text_height/2);
  
          this.attr(".rectangle/x", "75px");
          this.attr(".rectangle/x1", "75px");
          this.attr(".rectangle/width", info["h"]-150);
          this.attr(".triangle2/transform", "translate("+info["h"]+",0) scale(-1, 1)");
          this.attr(".triangle2/opacity", 1);
          this.attr(".arrow-info/x", -info["h"]/2+text_height/2);

          this.attr(".direction/text", info["direction"].toUpperCase());
  
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
  