import { Component } from "ape-ecs";
import Phaser from "phaser";

export class GraphicsComponent extends Component {
  /**
   * @type Map<keyof DebugKeys, Graphics>
   */
  graphicsMap = new Map();
  delete = false;
  static changeEvents = true;
  /**
   * @type keyof DebugKeys
   */

  test;
  preDestroy() {
    if (this.graphics) this.graphics.destroy();
  }
  
  addDebugGraphics(key, graphics) {
    this.graphicsMap.set(key, graphics);
  }
}
GraphicsComponent.properties = { graphics: undefined };


export const DebugKeys= {
  TARGET,
  BEST
}