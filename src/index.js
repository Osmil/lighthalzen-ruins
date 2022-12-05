import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import { CameraController } from "./util/camera-controller";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    this.cameraController = new CameraController(this);
    this.initInput();
    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });
    this.cameras;
  }

  initInput() {
    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spaceKey.on(
      "down",
      this.cameraController.reset.bind(this.cameraController)
    );
  }

  update() {
    this.cameraController.update();
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: MyGame,
};

const game = new Phaser.Game(config);
