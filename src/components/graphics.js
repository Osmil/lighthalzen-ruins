import { Component } from "ape-ecs";
import Phaser from "phaser";

export class GraphicsComponent extends Component {
  /**
   * @type Phaser.GameObjects.Graphics
   */
  graphics = undefined;
  delete = false;
  static changeEvents = true;

  preDestroy() {
    if (this.graphics) this.graphics.destroy();
  }
}
GraphicsComponent.properties = { graphics: undefined };
