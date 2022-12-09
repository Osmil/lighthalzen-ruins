import { Component, Entity } from "ape-ecs";
export class ProjectileComponent extends Component {
  /**
   * @type Entity
   */
  target = undefined;
  speed = 15;
  damage = 2;
  static changeEvents = true;
}
ProjectileComponent.properties = { target: undefined, damage: 2 };
