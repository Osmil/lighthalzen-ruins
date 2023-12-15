import { System, Entity } from "ape-ecs";
import { GraphicsComponent } from "../components/graphics";
export class GraphicsSystem extends System {
  init() {
    this.subscribe("GraphicsComponent");
  }
}
