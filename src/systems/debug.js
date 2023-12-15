import { System } from "ape-ecs";
import { DebugComponent, DebugKeys } from "../components/debug";
import { HealthbarComponent } from "../components/healtbar";
import { PositionComponent } from "../components/position";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { TowerComponent } from "../components/tower";
import { MyGame } from "../index";
import * as Phaser from 'phaser'

export class DebugSystem extends System {
  init() {
    this.subscribe("TowerComponent");
    this.mainQuery = this.createQuery().fromAll(TowerComponent);
  }

  update(tick) {
    this.updateHealth();
  }

  updateTowerTarget() {
    this.changes.forEach((change) => {
      const entity = this.world.getEntity(change.entity);
      const scene = this.world.getEntity("scene").getOne(SceneComponent).scene;
      if (change.op == "change" && entity) {
      }

      if (change.op == "add") {
        const positionComponent = entity.getOne(PositionComponent);
        const background = scene.add.line(0, 0, 0, 0, 0xff0000);
        /**
        * @type DebugComponent
        */
        const debugComponent = entity.addComponent({ type: "DebugComponent" });
        debugComponent.addDebugGraphics(DebugKeys.TARGET, background);

        this.mainQuery.refresh();
      }

      
      const towerEntities = this.mainQuery.execute();
      towerEntities.forEach(e => {
        const target = e.getOne(TowerComponent).nearestCreature;

        if(nearestCreature) {
          /**
           * @type Phaser.GameObjects.Line
           */
          const debugGraphics = e.getOne(DebugComponent).graphicsMap.get(DebugKeys.TARGET);

          const targetPosition =
          debugGraphics.setW();
        }
      
      })
    });

    
  }
}
