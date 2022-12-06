import { MyGame } from "..";

export class UIController {
  /**
   *
   * @param {MyGame} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.gameController = scene.gameController;
  }

  init() {
    this.playButton = this.createButton({ x: 200, y: 200 }, "Play");
  }

  createButton(position, text) {
    const rectangleButtonBackground = this.scene.add.rectangle(
      0,
      0,
      100,
      50,
      0xff00ff
    );
    const rectangleText = this.scene.add.text(0, 0, text);
    rectangleText.setX(-rectangleText.width / 2);
    rectangleText.setY(-rectangleText.height / 2);

    return this.scene.add.container(position.x, position.y, [
      rectangleButtonBackground,
      rectangleText,
    ]);
  }
}
