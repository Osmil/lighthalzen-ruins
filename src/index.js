import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import topLeft from "./assets/grass/topLeft.png";
import topRight from "./assets/grass/topRight.png";
import top from "./assets/grass/top.png";
import left from "./assets/grass/left.png";
import right from "./assets/grass/right.png";
import bottom from "./assets/grass/bottom.png";
import bottomLeft from "./assets/grass/bottomLeft.png";
import bottomRight from "./assets/grass/bottomRight.png";
import dirt from "./assets/grass/fullDirt.png";
import full from "./assets/grass/full.png";
import bottomRightCorner from "./assets/grass/bottomRightCorner.png";
import bottomLeftCorner from "./assets/grass/bottomLeftCorner.png";
import topRightCorner from "./assets/grass/topRightCorner.png";
import topLeftCorner from "./assets/grass/topLeftCorner.png";
import greenCreature from "./assets/creatures/green.png";
import redCreature from "./assets/creatures/red.png";
import greyCreature from "./assets/creatures/grey.png";
import orangeCreature from "./assets/creatures/orange.png";
import redTower from "./assets/towers/red.png";
import greenTower from "./assets/towers/green.png";
import { CameraController } from "./util/camera-controller";
import { GameController } from "./util/game-controller";
import { Maze } from "./util/maze";
import { UIScene } from "./util/ui-controller";

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
    // Tiles
    this.load.image("topLeft", topLeft);
    this.load.image("topRight", topRight);
    this.load.image("top", top);
    this.load.image("left", left);
    this.load.image("right", right);
    this.load.image("bottom", bottom);
    this.load.image("bottomLeft", bottomLeft);
    this.load.image("bottomRight", bottomRight);
    this.load.image("dirt", dirt);
    this.load.image("full", full);
    this.load.image("bottomRightCorner", bottomRightCorner);
    this.load.image("bottomLeftCorner", bottomLeftCorner);
    this.load.image("topRightCorner", topRightCorner);
    this.load.image("topLeftCorner", topLeftCorner);
    // Creatures
    this.load.image("greenCreature", greenCreature);
    this.load.image("redCreature", redCreature);
    this.load.image("greyCreature", greyCreature);
    this.load.image("orangeCreature", orangeCreature);
    // Tower
    this.load.image("greenTower", greenTower);
    this.load.image("redTower", redTower);
  }

  create() {
    this.cameraController = new CameraController(this);
    this.maze = new Maze(this);
    this.initInput();
    this.scene.run("UIScene", { game: this.gameController });
    this.handleResize();
    window.addEventListener("resize", (e) => {
      this.handleResize();
      this.cameraController.refresh(
        document.body.clientWidth,
        document.body.clientHeight
      );
    });
  }

  handleResize() {
    this.scene
      .get("UIScene")
      .refresh(document.body.clientWidth, document.body.clientHeight);
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
    this.gameController.update(delta);
  }
}
/**
 * @type Phaser.
 */
const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1920,
  height: 1080,
  scene: [MyGame, UIScene],
  scale: {
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);
