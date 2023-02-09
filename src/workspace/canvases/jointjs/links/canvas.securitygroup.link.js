angular.module('designer.workspace.canvases.jointjs.link.securitygroup', [])
  .service('SecurityGroupLink', [function() {
    return joint.dia.Link.extend({
      markup: [
        '<path class="selected"/>',
        '<path class="connection" />',
        '<path class="marker-source" />',
        '<path class="marker-target" />',
        '<path class="connection-wrap"/>',
        '<g class="labels"/>',
        '<g class="marker-vertices"/>',
        '<g class="marker-arrowheads"/>',
        '<g class="link-tools"/>'
      ].join(''),

      defaults: joint.util.defaultsDeep({
        z: 30,
        // router: {
        //   name: 'manhattan',
        //   args: { excludeTypes: ['container'], step: 10, maximumLoops: 1000 }
        // },
        //connector: { name: 'rounded' },
        attrs: {
          '.link-tools': { display: 'none' },
          '.connection': { stroke: '#FF00FF', 'stroke-width': 3 },
          '.selected': { stroke: '#ABD1AB', 'stroke-width': 3, fill: 'none' }
        }
      }, joint.dia.Link.prototype.defaults)
    });
  }]);
