export class CameraController {
  #isScrollingAroundPoint = false;

  delta = 70;
  scrollSpeed = 5;

  /**
   *
   * @param { Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.refresh();
  }

  refresh() {
    this.rightSide = this.scene.game.renderer.width - this.delta;
    this.bottomSide = this.scene.game.renderer.height - this.delta;
  }

  update() {
    if (this.#isScrollingAroundPoint) {
      this.doScrollingAroundPoint();
    } else {
      this.doScrolling();
    }
  }

  reset() {
    const camera = this.scene.cameras.main;
    camera.setPosition(0, 0);
  }

  doScrolling() {
    const camera = this.scene.cameras.main;
    if (this.scene.input.activePointer.x > this.rightSide) {
      camera.x -= this.scrollSpeed;
    }
    if (this.scene.input.activePointer.y > this.bottomSide) {
      camera.y -= this.scrollSpeed;
    }
    if (this.scene.input.activePointer.x < this.delta) {
      camera.x += this.scrollSpeed;
    }
    if (this.scene.input.activePointer.y < this.delta) {
      camera.y += this.scrollSpeed;
    }
  }
}
