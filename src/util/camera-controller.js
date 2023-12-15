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
  }

  reset() {}

  refresh() {}

  update() {}
}
