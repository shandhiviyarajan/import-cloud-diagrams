angular
  .module("designer.workspace.canvases.jointjs.link.resource", [])
  .service("ResourceLink", [
    function () {
      var prebuilt_markup = V('<path class="connection" />');

      return joint.dia.Link.extend({
        markup: " ",
        prebuilt_markup: prebuilt_markup,
        defaults: joint.util.defaultsDeep(
          {
            z: 30,
            attrs: {
              ".connection": { stroke: "#AAAAAA", "stroke-width": 2 },
            },
          },
          joint.dia.Link.prototype.defaults
        ),
      });
    },
  ]);
