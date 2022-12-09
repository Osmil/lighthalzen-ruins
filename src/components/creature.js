import { Component } from "ape-ecs";

export class CreatureComponent extends Component {
  static changeEvents = true;
  species = 0;
}
CreatureComponent.properties = { species: 0 };
