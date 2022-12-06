import { Component } from "ape-ecs";

export class StatsComponent extends Component {
  maxHP = 10;
  hp = 10;
  speed = 10;
  static changeEvents = true;
}
StatsComponent.properties = { speed: 10, hp: 10, maxHP: 10 };
