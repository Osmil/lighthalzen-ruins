import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import { CameraController } from "./util/camera-controller";
import { GameController } from "./util/game-controller";
import { Maze } from "./util/maze";

export class MyGame extends Phaser.Scene {
  constructor() {
    super();
    this.gameController = new GameController();
    this.gameController.world.createEntity({
      id: "scene",
      c: [{ type: "SceneComponent", scene: this }],
    });
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
    this.cameraController.update(delta);
    this.maze.update(delta);
    this.gameController.update(delta);
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
