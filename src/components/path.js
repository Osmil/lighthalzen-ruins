import { Component } from "ape-ecs";

export class PathComponent extends Component {
  path = [];
  currentGoal = undefined;
}
PathComponent.properties = { path: [], currentGoal: { x: 0, y: 0 } };
