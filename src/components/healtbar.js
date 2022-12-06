import { Component } from "ape-ecs";
import Phaser from "phaser";

export class HealthbarComponent extends Component {
  /**
   * @type Phaser.GameObjects.Container
   */
  graphics = undefined;
  static changeEvents = true;
  preDestroy() {
    if (this.graphics) this.graphics.destroy();
  }
}
HealthbarComponent.properties = { graphics: undefined };
