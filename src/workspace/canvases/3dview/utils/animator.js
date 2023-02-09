angular
  .module("designer.workspace.canvases.jointjs.3dview.scene.animator", [])
  .service("Animator", [
    function () {
      class Animator {
        constructor(fps, seconds) {
          this.fps = fps;
          this.seconds = seconds;
          this.frames = this.fps * this.seconds;
          this.rotation = Math.PI / 3;
          this.isTopDown = false;
          this.currentRotation = 0;
        }

        // Rotate along X axis by a fraction everytime this method is called.
        polarRotate = (angle, controls) => {
          controls.maxPolarAngle = angle;
          controls.minPolarAngle = angle;
        };

        // Rotate along Z axis by a fraction everytime this method is called.
        azimuthalRotate = (rotation, controls) => {
          this.currentRotation += (rotation / this.frames)
          this.currentRotation = parseFloat(this.currentRotation.toFixed(5));
          controls.minAzimuthAngle = this.currentRotation;
          controls.maxAzimuthAngle = this.currentRotation;
        };

        // Release the max/min settings for free rotation on right click
        releaseAzimuthalLock = (controls) => {
          controls.minAzimuthAngle = -Infinity;
          controls.maxAzimuthAngle = Infinity;
        };

        // Rotate the scene for different perspectives
        // Simply set max/min angle on orbit controls
        rotateScene = (controls) => {

          var counter = 0;
          var rotation = Math.PI / 4;
          this.currentRotation = controls.getAzimuthalAngle();
          const loop = () => {
            counter += 1;
            if (counter <= this.frames) {
              this.azimuthalRotate(rotation, controls);
              requestAnimationFrame(loop);
            } else {
              this.releaseAzimuthalLock(controls);
            }
          };
          loop();
        };

        // Toggle top down views.
        // Simply set max/min angle on orbit controls
        toggleTopDown = (controls) => {
          var counter = 0;
          if (!this.isTopDown) {
            const loop = () => {
              counter += 1;
              const angle =
                (this.rotation * (this.frames - counter)) / this.frames;
              this.polarRotate(angle, controls);
              if (counter < this.frames) {
                requestAnimationFrame(loop);
              }
            };
            loop();
          } else {
            const loop = () => {
              counter += 1;
              const angle = (this.rotation * counter) / this.frames;
              this.polarRotate(angle, controls);
              if (counter < this.frames) {
                requestAnimationFrame(loop);
              }
            };
            loop();
          }
          this.isTopDown = !this.isTopDown;
        };
      }

      const animator = new Animator(120, 0.2);
      return animator;
    },
  ]);
