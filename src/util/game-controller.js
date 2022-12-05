import { World } from "ape-ecs";
import { DeltaComponent } from "../components/delta";
import { GraphicsComponent } from "../components/graphics";
import { PathComponent } from "../components/path";
import { PositionComponent } from "../components/position";
import { StatsComponent } from "../components/stats";
import { TileComponent } from "../components/tile";
import { TowerComponent } from "../components/tower";
import { TowersSystem } from "../systems/towers";

export class GameController {
  constructor() {
    this.world = new World();
    this.world.registerComponent(PositionComponent);
    this.world.registerComponent(GraphicsComponent);
    this.world.registerComponent(PathComponent);
    this.world.registerComponent(TowerComponent);
    this.world.registerComponent(TileComponent);
    this.world.registerComponent(StatsComponent);
    this.world.registerComponent(DeltaComponent);

    this.world.registerSystem(TowersSystem);

    const frameEntity = this.world.createEntity({
      components: [{ type: "DeltaComponent" }],
    });
  }

  update(delta) {
    this.frameEntity.getOne(DeltaComponent).delta = delta;
    this.world.update();
  }
}
