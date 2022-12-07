import { Scene } from "phaser";
import { MyGame } from "..";
import { GameController, GameEvents } from "./game-controller";

export class UIScene extends Scene {
  /**
   * @type GameController
   */
  gameController;
  /**
   *
   * @param {MyGame} scene
   */
  constructor() {
    super({ key: "UIScene" });
    this.menuContainer = undefined;
  }

  preload() {}

  create() {
    this.init();
  }

  update() {}

  init(data) {
    if (data) {
      this.gameController = data.game;
    }
  }

  create() {
    this.menuContainer = this.add.container(50, 50);

    this.playButton = this.createButton({ x: 0, y: 0 }, "Play", () =>
      this.gameController.start()
    );
    this.menuContainer.add(this.playButton);

    window.addEventListener("resize", this.refresh.bind(this));
    this.refresh();
  }

  refresh() {
    if (!this.menuContainer) return;
    this.menuContainer.getAll().forEach(console.log);
    const highestWidth = this.menuContainer
      .getAll()
      .sort((a, b) => a.width - b.width)
      .at(0).width;

    this.menuContainer.setX(document.body.clientWidth - highestWidth);

    this.healthText = this.add.text(
      50,
      50,
      "Mana: " + this.gameController.health
    );
    this.gameController.on(
      GameEvents.HEALTH_CHANGE,
      this.updateHealth.bind(this)
    );
  }

  updateHealth() {
    this.healthText.setText("Mana: " + this.gameController.health);
  }

  createButton(position, text, func) {
    const rectangleButtonBackground = this.add.rectangle(
      0,
      0,
      100,
      50,
      0xff00ff
    );
    const rectangleText = this.add.text(0, 0, text);
    rectangleText.setX(-rectangleText.width / 2);
    rectangleText.setY(-rectangleText.height / 2);

    const container = this.add.container(position.x, position.y, [
      rectangleButtonBackground,
      rectangleText,
    ]);
    container.width = rectangleButtonBackground.width;

    rectangleButtonBackground.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
      func
    );
    rectangleButtonBackground.setInteractive(
      undefined,
      Phaser.Geom.Rectangle.Contains
    );

    return container;
  }
}
