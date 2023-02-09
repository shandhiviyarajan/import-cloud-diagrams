angular
  .module("designer.workspace.canvases.jointjs.3dview.views.linkview3d", [])
  .service("LinkView3D", [
    function () {
      const LinkView3D = joint.dia.LinkView.extend({
        initialize: function () {
          joint.dia.LinkView.prototype.initialize.apply(this, arguments);
          const {
            model: {
              attributes: { source, target },
            },
          } = this;

          // Get source/target
          const cells = this.model.graph.getCells();
          this.source = cells.find((c) => c.id === source.id);
          this.target = cells.find((c) => c.id === target.id);
        },
        toggleVisibility: function (visibility) {
          if (this.mesh) {
            this.mesh.visible = visibility;
          }
        },
        show: function () {
          if (this.mesh) {
            this.mesh.visible = true;
          }
        },
        hide: function () {
          if (this.mesh) {
            this.mesh.visible = false;
          }
        },
      });
      return LinkView3D;
    },
  ]);
