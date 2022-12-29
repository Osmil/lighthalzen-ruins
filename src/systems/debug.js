import { System } from "ape-ecs";
import { HealthbarComponent } from "../components/healtbar";
import { PositionComponent } from "../components/position";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { MyGame } from "../index";

export class DebugSystem extends System {
  init() {
    this.subscribe("StatsComponent");
  }

  update(tick) {
    this.updateHealth();
  }

  updateTowerTarget() {
    this.changes.forEach((change) => {
      const entity = this.world.getEntity(change.entity);
      const scene = this.world.getEntity("scene").getOne(SceneComponent).scene;
      if (change.op == "change" && entity) {
        const stats = entity.getOne(StatsComponent);
        const healthbarComponent = entity.getOne(HealthbarComponent);
        const value = stats.hp / stats.maxHP;
        if (healthbarComponent) {
          healthbarComponent.graphics.getByName("foreground").width =
            50 * value;
        }
      }

      if (change.op == "add") {
        const positionComponent = entity.getOne(PositionComponent);
        const background = scene.add.rectangle(0, 0, 50, 12, 0xff0000);
        background.setName("background");
        const foreground = scene.add.rectangle(0, 0, 50, 12, 0x00ff00);
        foreground.setName("foreground");
        const group = scene.add.container(
          positionComponent.x,
          positionComponent.y - 40,
          [background, foreground]
        );
        entity.addComponent({ type: "HealthbarComponent", graphics: group });
      }
    });
  }
}
