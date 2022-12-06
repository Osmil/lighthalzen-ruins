import { System, Entity } from "ape-ecs";
import { GraphicsComponent } from "../components/graphics";
import { PositionComponent } from "../components/position";
import { ProjectileComponent } from "../components/projectile";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { MyGame } from "../index";

export class StatsSystem extends System {
  init() {
    this.subscribe("StatsComponent");
  }

  update(tick) {
    this.updateStats();
  }

  updateStats() {
    this.changes.forEach((change) => {
      const statsComponent = this.world.getComponent(change.component);
      const entity = this.world.getEntity(change.entity);
      if (change.op == "change") {
        if (statsComponent.hp <= 0) {
          entity.destroy();
        }
      }
    });
  }
}
