import { Component, Entity } from "ape-ecs";
export class ProjectileComponent extends Component {
  /**
   * @type Entity
   */
  target = undefined;
  static changeEvents = true;
}
ProjectileComponent.properties = { target: undefined };
