import { Component } from "ape-ecs";

export class CreatureComponent extends Component {
  static changeEvents = true;
  species = 0;
  isReturning = false;
}
CreatureComponent.properties = { species: 0 };
