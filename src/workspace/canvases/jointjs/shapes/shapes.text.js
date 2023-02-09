angular.module('designer.workspace.canvases.jointjs.shapes.text', ['designer.workspace.canvases.jointjs.views.text'])
.service('TextElement', ["TextView", function(TextView) {
  return joint.shapes.standard.Rectangle.extend({
    view: TextView,
    defaults: joint.util.defaultsDeep({
      attrs: {
        body: {
          fill: "#000000",
          stroke: '#000000',
          strokeWidth: 0,
          opacity: 0
        },
        label: {
          text: ' ',
          textAnchor: 'left',
          fontSize: 40,
          refX: '0%',
          refY: '0%',
          fill: '#333333',
          fontWeight: "bold"
        }
      }
    }, joint.shapes.standard.Rectangle.prototype.defaults),

    updateTheme: function() {},

    updateContainerText: function(paper) {}
  });
}]);

//     attrs: {
//         rect: {
//             fill: '#ffffff',
//             stroke: '#000000',
//             width: 80,
//             height: 100
//         },
//         text: {
//             fill: '#000000',
//             'font-size': 14,
//             'font-family': 'Arial, helvetica, sans-serif'
//         },
//         '.content': {
//             text: '',
//             'ref-x': .5,
//             'ref-y': .5,
//             'y-alignment': 'middle',
//             'x-alignment': 'middle'
//         }
//     },
