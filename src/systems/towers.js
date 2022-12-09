import { System } from "ape-ecs";
import { CreatureComponent } from "../components/creature";
import { DeltaComponent } from "../components/delta";
import { GraphicsComponent } from "../components/graphics";
import { PositionComponent } from "../components/position";
import { SceneComponent } from "../components/scene";
import { TowerComponent } from "../components/tower";
import { TILE_HEIGHT, TILE_WIDTH } from "../util/maze";

export class TowersSystem extends System {
  init() {
    this.mainQuery = this.createQuery().fromAll("TowerComponent");
    this.enemyQuery = this.createQuery().fromAll(CreatureComponent);

    this.subscribe(TowerComponent);
  }

  update(tick) {
    this.mainQuery.refresh();
    const entities = this.mainQuery.execute();
    this.enemyQuery.refresh();
    const creatures = Array.from(this.enemyQuery.execute());
    const delta = this.world.getEntity("delta").getOne(DeltaComponent).delta;
    this.addGraphics();
    entities.forEach((entity) => {
      const point = entity.getOne(PositionComponent);
      const stats = entity.getOne(TowerComponent);
      const graphics = entity.getOne(GraphicsComponent);

      if (stats.nearestCreature) {
        const position = stats.nearestCreature.getOne(PositionComponent);
        if (position) {
          const angle = new Phaser.Math.Vector2(
            position.x - point.x,
            position.y - point.y
          ).angle();
          graphics.graphics.rotation = angle + Math.PI / 2;
        }
      }
      stats.shootTimer += delta;
      if (stats.shootTimer < stats.shootCooldown) return;
      stats.shootTimer = 0;
      //do custom tower scripts here, for now simply shoot at nearest creature
      const nearestCreature = creatures
        .sort(
          (a, b) =>
            Phaser.Math.Distance.BetweenPoints(
              point,
              a.getOne(PositionComponent)
            ) -
            Phaser.Math.Distance.BetweenPoints(
              point,
              b.getOne(PositionComponent)
            )
        )
        .at(0);
      if (!nearestCreature) {
        entity.getOne(GraphicsComponent).graphics.setAngle(0);
        stats.nearestCreature = undefined;
      } else {
        const position = nearestCreature.getOne(PositionComponent);
        stats.nearestCreature = nearestCreature;
        const distance = Phaser.Math.Distance.BetweenPoints(point, position);
        if (distance < stats.range) {
          this.world.createEntity({
            components: [
              { type: "PositionComponent", x: point.x, y: point.y },
              { type: "ProjectileComponent", target: nearestCreature },
            ],
          });
        } else {
          entity.getOne(GraphicsComponent).graphics.strokeColor = 0xff0000;
        }
      }
    });
  }

  addGraphics() {
    const scene = this.world.getEntity("scene").getOne(SceneComponent).scene;
    this.changes.forEach((change) => {
      if (change.op == "add") {
        this.mainQuery.refresh();
        const entity = this.world.getEntity(change.entity);
        const position = entity.getOne(PositionComponent);
        const graphics = scene.add.image(position.x, position.y, "redTower");

        //graphics.setStrokeStyle(3);

        entity.addComponent({ type: "GraphicsComponent", graphics });
      }
    });
  }
}
