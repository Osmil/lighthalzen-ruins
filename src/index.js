import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import { CameraController } from "./util/camera-controller";
import { Maze } from "./util/maze";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    this.cameraController = new CameraController(this);
    this.maze = new Maze(this);
    this.initInput();
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

  update(time, delta) {
    this.cameraController.update();
    this.maze.update(delta);
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
