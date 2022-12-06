import { System } from "ape-ecs";
import { CreatureComponent } from "../components/creature";
import { DeltaComponent } from "../components/delta";
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
    for (const entity of entities) {
      const point = entity.getOne(PositionComponent);
      const stats = entity.getOne(TowerComponent);
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

      if (
        !nearestCreature ||
        Phaser.Math.Distance.BetweenPoints(
          point,
          nearestCreature.getOne(PositionComponent)
        ) > stats.range
      ) {
        continue;
      }
      //were nearby, create projectile
      //TODO create helper for this
      this.world.createEntity({
        components: [
          { type: "PositionComponent", x: point.x, y: point.y },
          { type: "ProjectileComponent", target: nearestCreature },
        ],
      });
    }
  }

  addGraphics() {
    const scene = this.world.getEntity("scene").getOne(SceneComponent).scene;
    this.changes.forEach((change) => {
      if (change.op == "add") {
        const entity = this.world.getEntity(change.entity);
        const position = entity.getOne(PositionComponent);
        const graphics = scene.add.rectangle(
          position.x,
          position.y,
          TILE_WIDTH / 2,
          TILE_HEIGHT / 2,
          0x335832
        );
        entity.addComponent({ type: "GraphicsComponent", graphics });
      }
    });
  }
}
