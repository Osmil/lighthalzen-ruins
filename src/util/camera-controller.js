export class CameraController {
  #isScrollingAroundPoint = false;

  delta = 70;
  scrollSpeed = 5;
  #activeScroll = false;
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

    this.scene.input.on("gameout", () => (this.#activeScroll = false));
    this.scene.input.on("gameover", () => (this.#activeScroll = true));
  }

  update() {
    if (!this.#activeScroll) return;
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
      camera.scrollX += this.scrollSpeed;
    }
    if (this.scene.input.activePointer.y > this.bottomSide) {
      camera.scrollY += this.scrollSpeed;
    }
    if (this.scene.input.activePointer.x < this.delta) {
      camera.scrollX -= this.scrollSpeed;
    }
    if (this.scene.input.activePointer.y < this.delta) {
      camera.scrollY -= this.scrollSpeed;
    }
  }
}
