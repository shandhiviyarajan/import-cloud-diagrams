angular
  .module("designer.workspace.canvases.jointjs.3dview.paper", [
    "designer.workspace.canvases.jointjs.3dview.scene",
  ])
  .service("Paper3D", [
    "$rootScope",
    "Scene",
    "DesignerState",
    function ($rootScope, sceneManager, DesignerState) {
      const onCellAdded = function (cell) {
        switch (cell.attributes.type) {
          case "resource":
          case "container":
            this.sceneManager.createShape(cell);
            break;
          case "link":
            this.sceneManager.createLink(cell);
            break;
        }
        joint.dia.Paper.prototype.onCellAdded.apply(this, arguments);
      };

      /*
      Get the group, find the to be removed meshes and texts by cid and then remove them
      */
      const removeView = function (cell) {
        const { group } = this.sceneManager;
        const meshes = group.children.filter((c) => c.name === cell.cid);
        meshes.forEach((mesh) => {
          group.remove(mesh);
        });
        this.sceneManager.meshCount = 0;
        joint.dia.Paper.prototype.removeView.apply(this, arguments);
      };

      const resetViews = function (paper, previousData) {
        joint.dia.Paper.prototype.resetViews.apply(this, arguments);
        if (!this.sceneManager) return;
        const { group } = this.sceneManager;
        for (var i = group.children.length - 1; i >= 0; i--) {
          group.remove(group.children[i]);
        }
      };

      /*
      Set the model to be used on the paper
      */
      const setEventHandlers = function () {
        // Reset listeners
        this.model.off();
        if (!this.is3DViewSupported()) return;
        this.model.on("add", this.onCellAdded, this);
        this.model.on("updated", this.updateView, this);
        this.model.on("remove", this.removeView, this);
        this.model.on("reset", this.resetViews, this);
        this.model.on("sort", this._onSort, this);
        this.model.on("batch:stop", this._onBatchStop, this);
      };

      /*
      Update mesh position, link routing when model changes
      */
      const updateView = function (view, flag, opt) {
        switch (view.model.attributes.type) {
          case "resource":
          case "container":
            this.sceneManager.updateShape(view);
            break;
          case "link":
            this.sceneManager.updateLink(view);
            break;
        }
      };

      /*
      Create an empty scene with a plane, grid and lighting
      */
      const initialize = function () {
        joint.dia.Paper.prototype.initialize.apply(this, arguments);
        this.highlighted = [];
        this.display_connections = false;
        if (!this.sceneCreated) {
          this.sceneManager = sceneManager;
          this.sceneManager.createScene(this);
        }
      };

      /*
      Paper3D Events
      */
      const toggleLinks = function () {
        this.model.getLinks().forEach((link) => {
          var view = this.findViewByModel(link);
          var visibility = DesignerState.get("displayConnections");
          this.display_connections = visibility;
          if (view) {
            view.toggleVisibility(visibility);
          }
        });
      };

      const toggleNames = function () {
        const value = DesignerState.get("displayLabels");
        this.model.getElements().forEach((model) => {
          const { type } = model.attributes;
          switch (type) {
            case "resource":
              if (model.mesh && model.mesh.labels) {
                model.mesh.labels.forEach((label) => {
                  label.visible = value;
                });
              }
          }
        });
      };

      const destroyScene = function () {
        this.sceneManager.destroyScene();
      }

      const highlightConnected = function (resource) {
        var resources = resource.highlightableConnections();

        resources.forEach((r) => {
          if (!r.hidden) {
            var cells = this.model.getCellsByResourceId(r.id);

            cells.forEach((cell) => {
              var view = this.findViewByModel(cell);
              view.highlight(this.sceneManager.outlinePass);
              this.highlighted.push(view);
            });
          }
        });
      };

      const showLinks = function (resource) {
        const { outlinePass } = this.sceneManager;

        var view = this.findViewByModel(resource);
        if (view) {
          outlinePass.selectedObjects = [];
          outlinePass.clicked = undefined;
          view.highlight(outlinePass, true);
        }

        if (this.display_connections) return;
        this.hideAllLinks();

        this.model.getLinks().forEach((link) => {
          const { source, target } = link.attributes;
          if (resource.id === source.id || resource.id === target.id) {
            this.findViewByModel(link).show();
          }
        });
      };

      // Hide links
      const hideLinks = function (resource) {
        if (this.display_connections) return;
        this.hideAllLinks();
      };

      const unhighlightAll = function () {
        const { outlinePass } = this.sceneManager;
        this.highlighted.forEach((view) => {
          view.unhighlight(outlinePass);
          // Do this to prevent the bug that hides the meshes when outline passs is applied
          view.mesh.visible = true;
        });
        this.highlighted = [];
      };

      const unhighlightClicks = function () {
        // Unhighlight all meshes
        const { outlinePass } = this.sceneManager;
        outlinePass.clicked = undefined;
        this.model.getElements().forEach((model) => {
          const meshView = this.findViewByModel(model);
          if (meshView) {
            meshView.unhighlight(outlinePass);
            // Do this to prevent the bug that hides the meshes when outline passs is applied
            meshView.mesh.visible = true;
          }
        });
      }

      const hideAllLinks = function () {
        if (this.display_connections) return;
        this.model.getLinks().forEach((link) => {
          const linkView = this.findViewByModel(link);
          if (linkView) {
            linkView.hide();
          }
        });
      };

      const isExtView = function () {
        const viewName = "Extended Infrastructure";
        return this.options.viewName === viewName;
      };

      const is3DViewSupported = function () {
        const notSupportedViews = ["Security Group", "List", "Container"];
        return !notSupportedViews.includes(this.options.viewName);
      };

      const snapToCenter = function() {
        this.sceneManager.resetCameraPosition();
      }

      const toggleShadows = function () {
        this.sceneManager.toggleDirectionalLightShadows();
      }

      const showCSSBox = function (resource) {
        this.sceneManager.showCSSBox(resource);
      }

      const Paper3D = joint.dia.Paper.extend({
        initialize,
        onCellAdded,
        updateView,
        toggleLinks,
        highlightConnected,
        unhighlightAll,
        showLinks,
        hideLinks,
        hideAllLinks,
        removeView,
        destroyScene,
        resetViews,
        setEventHandlers,
        toggleNames,
        isExtView,
        is3DViewSupported,
        snapToCenter,
        toggleShadows,
        showCSSBox,
        unhighlightClicks
      });

      return Paper3D;
    },
  ]);
