angular
  .module("designer.workspace.canvases.jointjs.3dview.event3d", [])
  .service("EventHandler3D", [
    "$rootScope",
    function ($rootScope) {
      class EventHandler3D {
        constructor() {
          this.raycaster = new THREE.Raycaster();
          this.mouse = new THREE.Vector2();
          this.activeMeshes = [];
          this.previouslyActiveMeshes = []; // For firing hover off events
        }

        moveHandler = (sm, paper3d, event) => {
          const relativeX = event.clientX - sm.el.offset().left;
          const relativeY = event.clientY - sm.el.offset().top;
          this.mouse.x = (relativeX / sm.width) * 2 - 1;
          this.mouse.y = -(relativeY / sm.height) * 2 + 1;
          this.raycaster.setFromCamera(this.mouse, sm.camera);
          var intersects = this.raycaster
            .intersectObjects(sm.group.children)
            .slice(0, 1);

          this.findPreviousMeshes(paper3d, sm, intersects);
          this.activeMeshes = intersects.map((intersect) => intersect.object);
          this.activeMeshes.forEach((mesh) => {
            if (mesh.state !== "hoveron") {
              mesh.dispatchEvent({ type: "hoveron", paper3d, sm });
              mesh.state = "hoveron";
            }
          });
        };

        findPreviousMeshes(paper3d, sm, newIntersects) {
          var newMeshes = newIntersects.map((intersect) => intersect.object);
          this.previousMeshes = _.difference(this.activeMeshes, newMeshes);
          this.previousMeshes.forEach((mesh) => {
            if (mesh.state === "hoveron") {
              mesh.dispatchEvent({ type: "hoveroff", paper3d, sm });
              mesh.state = "hoveroff";
            }
          });
        }

        clickHandler = (sm, paper3d, event) => {
          const relativeX = event.clientX - sm.el.offset().left;
          const relativeY = event.clientY - sm.el.offset().top;
          this.mouse.x = (relativeX / sm.width) * 2 - 1;
          this.mouse.y = -(relativeY / sm.height) * 2 + 1;

          this.raycaster.setFromCamera(this.mouse, sm.camera);
          var intersects = this.raycaster
            .intersectObjects(sm.group.children)
            .slice(0, 1);

          intersects.forEach((intersect) => {
            intersect.object.dispatchEvent({ type: "click", paper3d });
          });

          if (intersects.length === 0) {
            paper3d.hideAllLinks();
            paper3d.unhighlightClicks();
          }
        };

        /**
         * Add event listeners on each box
         */
        addEventListeners(box) {

          // Hover handler
          box.addEventListener("hoveron", (event) => {
            const mesh = event.target;
            const { shape } = mesh.model.attributes;
            if (!shape) {
              var view = event.paper3d.findViewByModel(mesh.model);
              view.highlight(event.sm.outlinePass);
            }
            $("#paper3d").css("cursor", "pointer");
          });

          // Hover out handler
          box.addEventListener("hoveroff", (event) => {
            const mesh = event.target;
            const { shape } = mesh.model.attributes;
            if (!shape) {
              var view = event.paper3d.findViewByModel(mesh.model);
              if (view) {
                view.unhighlight(event.sm.outlinePass);
              }
            }
            $("#paper3d").css("cursor", "default");
          });

          // Click handler
          box.addEventListener("click", (event) => {
            const { resource } = event.target.model;
            $rootScope.$broadcast("resource:selected", resource);
            $rootScope.$broadcast("resource:selected:3d", event.target);
            event.paper3d.showLinks(event.target.model);
          });
        }
      }
      const eventHandler3D = new EventHandler3D();
      return eventHandler3D;
    },
  ]);
