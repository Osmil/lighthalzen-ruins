import { Component } from "ape-ecs";
import { MyGame } from "../index";
export class SceneComponent extends Component {
  /**
   * @type MyGame
   */
  scene = undefined;
}
SceneComponent.properties = { scene: undefined };
