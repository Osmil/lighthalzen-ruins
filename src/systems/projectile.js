import { System, Entity } from "ape-ecs";
import { GraphicsComponent } from "../components/graphics";
import { PositionComponent } from "../components/position";
import { ProjectileComponent } from "../components/projectile";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { MyGame } from "../index";

export class ProjectileSystem extends System {
  init() {
    this.subscribe("ProjectileComponent");
    this.mainQuery = this.createQuery().fromAll("ProjectileComponent");
  }

  update(tick) {
    const sceneEntity = this.world.getEntity("scene");
    this.addGraphics(this.changes, sceneEntity.getOne(SceneComponent).scene);
    this.mainQuery.execute().forEach(this.updateProjectile.bind(this));
  }

  /**
   *
   * @param {*} changes
   * @param {MyGame} scene
   */
  addGraphics(changes, scene) {
    changes.forEach((change) => {
      const entity = this.world.getEntity(change.entity);
      if (change.op == "add") {
        const position = entity.getOne(PositionComponent);
        const graphics = scene.add.circle(position.x, position.y, 5, 0x9943cc);
        entity.addComponent({ type: "GraphicsComponent", graphics });
      } else if (change.op == "change") {
        const position = entity.getOne(PositionComponent);
        const graphics = entity.getOne(GraphicsComponent).graphics;
        graphics.setPosition(position.x, position.y);
      }
    });

    if (changes.length) this.mainQuery.refresh();
  }

  /**
   *
   * @param {Entity} entity
   */
  updateProjectile(entity) {
    const projectileComponent = entity.getOne(ProjectileComponent);
    const projectilePosition = entity.getOne(PositionComponent);

    const creaturePosition =
      projectileComponent.target.getOne(PositionComponent);
    if (
      !projectilePosition ||
      !projectileComponent ||
      !projectileComponent.target ||
      !creaturePosition
    ) {
      entity.destroy();
      this.mainQuery.refresh();
      return;
    }
    const vector = new Phaser.Math.Vector2(
      creaturePosition.x - projectilePosition.x,
      creaturePosition.y - projectilePosition.y
    );

    vector.normalize().scale(2);

    projectilePosition.x += vector.x;
    projectilePosition.y += vector.y;

    const distance = Phaser.Math.Distance.BetweenPoints(
      projectilePosition,
      creaturePosition
    );

    const targetGraphics =
      projectileComponent.target.getOne(GraphicsComponent)?.graphics;
    if (!targetGraphics) return;

    const combinedRadii =
      entity.getOne(GraphicsComponent).graphics.radius + targetGraphics.radius;
    if (distance < combinedRadii) {
      //HIT
      const stats = projectileComponent.target.getOne(StatsComponent);
      stats.hp -= 5;
      stats.update("hp");

      entity.destroy();
      this.mainQuery.refresh();
    } else {
      projectileComponent.update("position"); //MARK THAT WE CHANGED THIS SO OUR SYSTEM TO UPDATE GRAPHICS GETS IT
    }
  }
}
