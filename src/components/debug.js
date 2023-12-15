import { Component } from "ape-ecs";
import Phaser from "phaser";

export class DebugComponent extends Component {
  /**
   * @type Map<keyof DebugKeys, Graphics>
   */
  graphicsMap = new Map();
  static changeEvents = true;
  preDestroy() {
    if (this.graphics) this.graphics.destroy();
  }
  /**
   * 
   * @param {keyof DebugKeys} key 
   * @param {Graphics} graphics 
   */
  addDebugGraphics(key, graphics) {
    this.graphicsMap.set(key, graphics);
  }
}
DebugComponent.properties = { graphics: undefined };


export const DebugKeys= {
  TARGET,
  BEST
}