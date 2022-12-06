import { World } from "ape-ecs";
import { CreatureComponent } from "../components/creature";
import { DeltaComponent } from "../components/delta";
import { GraphicsComponent } from "../components/graphics";
import { HealthbarComponent } from "../components/healtbar";
import { PathComponent } from "../components/path";
import { PositionComponent } from "../components/position";
import { ProjectileComponent } from "../components/projectile";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { TileComponent } from "../components/tile";
import { TowerComponent } from "../components/tower";
import { CreatureSystem } from "../systems/creature";
import { GraphicsSystem } from "../systems/graphics";
import { HealthSystem } from "../systems/health";
import { ProjectileSystem } from "../systems/projectile";
import { StatsSystem } from "../systems/stats";
import { TowersSystem } from "../systems/towers";
import { Projectile } from "./projectile";

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
    this.world.registerComponent(SceneComponent);
    this.world.registerComponent(ProjectileComponent);
    this.world.registerComponent(CreatureComponent);
    this.world.registerComponent(HealthbarComponent);

    this.world.registerSystem("all", TowersSystem);
    this.world.registerSystem("all", ProjectileSystem);
    this.world.registerSystem("all", CreatureSystem);
    this.world.registerSystem("all", GraphicsSystem);
    this.world.registerSystem("all", StatsSystem);
    this.world.registerSystem("all", HealthSystem);

    this.frameEntity = this.world.createEntity({
      id: "delta",
      components: [{ type: "DeltaComponent" }],
    });
  }

  update(delta) {
    this.frameEntity.getOne(DeltaComponent).delta = delta;
    this.world.runSystems("all");
  }
}
