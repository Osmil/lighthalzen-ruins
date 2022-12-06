import { System, Entity } from "ape-ecs";
import { GraphicsComponent } from "../components/graphics";
import { HealthbarComponent } from "../components/healtbar";
import { PositionComponent } from "../components/position";
import { ProjectileComponent } from "../components/projectile";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { MyGame } from "../index";

export class HealthSystem extends System {
  init() {
    this.subscribe("StatsComponent");
  }

  update(tick) {
    this.updateHealth();
  }

  updateHealth() {
    this.changes.forEach((change) => {
      const entity = this.world.getEntity(change.entity);
      const scene = this.world.getEntity("scene").getOne(SceneComponent).scene;
      if (change.op == "change" && entity) {
        const stats = entity.getOne(StatsComponent);
        const healthbarComponent = entity.getOne(HealthbarComponent);
        const value = stats.hp / stats.maxHP;
        if (healthbarComponent) {
          healthbarComponent.graphics.getByName("foreground").width =
            10 * value;
        }
      }

      if (change.op == "add") {
        const background = scene.add.rectangle(0, 0, 10, 4, 0xff0000);
        background.setName("background");
        const foreground = scene.add.rectangle(0, 0, 10, 4, 0x00ff00);
        foreground.setName("foreground");
        const group = scene.add.container(0, 0, [background, foreground]);
        entity.addComponent({ type: "HealthbarComponent", graphics: group });
      }
    });
  }
}
