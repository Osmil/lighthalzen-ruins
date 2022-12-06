import { Component } from "ape-ecs";

export class CreatureComponent extends Component {
  static changeEvents = true;
}
CreatureComponent.properties = { delta: 0 };
