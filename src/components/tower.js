import { Component, Entity } from "ape-ecs";

export class TowerComponent extends Component {
  shootCooldown = 0;
  shootTimer = 0;
  range = 0;
  damage = 2;
  /**
   * @type Entity
   */
  nearestCreature = undefined;
}
TowerComponent.properties = {
  shootCooldown: 1000,
  shootTimer: 0,
  range: 500,
  damage: 2,
};
