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
      this.gameController.on(GameEvents.SPAWN_WAVE, (i) => {
        this.updateWaveBar(i);
      });
    }
  }

  create() {
    this.init();

    window.addEventListener("resize", this.refresh.bind(this));
    this.refresh();
    this.createWaveBars();
    this.createManaBar();
    this.menuContainer = this.add.container(50, 50 / 2);

    this.playButton = this.createButton({ x: 0, y: 0 }, "Play", () =>
      this.gameController.start()
    );
    this.menuContainer.add(this.playButton);
    this.healthText = this.add.text(
      this.renderer.width / 2,
      0,
      "Mana: " + this.gameController.health
    );
    this.healthText.y += this.healthText.height / 2;
    this.gameController.on(
      GameEvents.HEALTH_CHANGE,
      this.updateHealth.bind(this)
    );

    this.gameController.on(GameEvents.START, () => {
      this.wavebarContainer.destroy();
      this.createWaveBars();
    });
  }

  refresh() {
    if (!this.menuContainer) return;
    this.menuContainer.setX(50);
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
    this.add.container(0, 0);
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
    this.add.rectangle(25, height / 2 + 50, 50, height, 0xeeeeee);
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
