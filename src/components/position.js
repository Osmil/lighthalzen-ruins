import { Component } from "ape-ecs";

export class PositionComponent extends Component {
  x = 0;
  y = 0;
  static changeEvents = true;
}
PositionComponent.properties = { x: 0, y: 0 };
