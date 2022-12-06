import { Component } from "ape-ecs";

export class TowerComponent extends Component {
  shootCooldown = 0;
  shootTimer = 0;
  range = 0;
}
TowerComponent.properties = { shootCooldown: 1000, shootTimer: 0, range: 100 };
