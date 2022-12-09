import { Scene } from "phaser";
import { MyGame } from "..";
import { GameController, GameEvents } from "./game-controller";
import { TILE_HEIGHT, TILE_WIDTH } from "./maze";

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

  update() {
    this.wavebarContainer.getAll().forEach((e, index) => {
      const state =
        this.gameController.timeSinceLastWave /
        this.gameController.timeBetweenWaves;
      e.setPosition(e.x, e.waveIndex * 100 + 50 - 100 * state);
    });
  }

  init(data) {
    if (data) {
      this.gameController = data.game;
      this.gameController.on("spawn_wave", (i) => {
        this.updateWaveBar(i);
      });
    }
  }

  create() {
    this.init();
    this.menuContainer = this.add.container(50, 50);

    this.playButton = this.createButton({ x: 0, y: 0 }, "Play", () =>
      this.gameController.start()
    );
    this.menuContainer.add(this.playButton);

    window.addEventListener("resize", this.refresh.bind(this));
    this.refresh();
    this.createWaveBars();
    this.createManaBar();
  }

  refresh() {
    if (!this.menuContainer) return;
    this.menuContainer.getAll().forEach(console.log);
    const highestWidth = this.menuContainer
      .getAll()
      .sort((a, b) => a.width - b.width)
      .at(0).width;

    this.menuContainer.setX(this.game.renderer.width - highestWidth);

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

  createManaBar() {
    this.add.rectangle(
      (13 * TILE_WIDTH) / 2 + 50,
      0,
      13 * TILE_WIDTH,
      50,
      0x782299
    );
  }

  createWaveBars() {
    const height = 11 * TILE_HEIGHT;
    const background = this.add.rectangle(
      25,
      height / 2 + 50,
      50,
      height,
      0xeeeeee
    );
    this.wavebarContainer = this.add.container(0, 50);
    this.gameController.waves.forEach((wave, index) => {
      const container = this.add.container(25, 50 + 100 * index);
      container.waveIndex = index;
      const tile = this.add.rectangle(0, 0, 50, 100, 0xcccccc);
      tile.setStrokeStyle(5, 0xffffff);
      container.add(tile);
      const text = this.add.text(0, 0, `${wave.amount}`, {
        color: 0xffffff,
        fontSize: 40,
      });
      text.setX(0 - text.width / 2);
      container.add(text);

      this.wavebarContainer.add(container);
    });
  }

  updateWaveBar(i) {
    this.wavebarContainer.getAt(0)?.destroy();
    if (i != 0)
      this.wavebarContainer.getAll().forEach((e) => (e.waveIndex -= 1));
  }
}
