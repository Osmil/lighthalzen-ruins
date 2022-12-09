import { System, Entity } from "ape-ecs";
import { CreatureComponent } from "../components/creature";
import { GraphicsComponent } from "../components/graphics";
import { HealthbarComponent } from "../components/healtbar";
import { PathComponent } from "../components/path";
import { PositionComponent } from "../components/position";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { getPath, TILE_HEIGHT, TILE_WIDTH } from "../util/maze";
export class CreatureSystem extends System {
  init() {
    this.subscribe("CreatureComponent");
    this.creatureQuery = this.world.createQuery().fromAll("CreatureComponent");
  }

  update(tick) {
    if (
      this.world.getEntity("scene").getOne(SceneComponent).scene.gameController
        .gameOver
    ) {
      return;
    }
    this.addGraphics(this.changes);
    this.creatureQuery.execute().forEach(this.updateCreature.bind(this));
  }
  /**
   *
   * @param {Entity} entity
   */
  updateCreature(entity) {
    const pathComponent = entity.getOne(PathComponent);
    const creaturePosition = entity.getOne(PositionComponent);
    const creatureComponent = entity.getOne(CreatureComponent);
    const statsComponent = entity.getOne(StatsComponent);
    const graphicsComponent = entity.getOne(GraphicsComponent);

    if (!pathComponent.path) return;
    let path = pathComponent.path;

    if (!path.length) {
      // We're at the end of our path? set return
      if (creatureComponent.isReturning) {
        entity.destroy();
        this.world
          .getEntity("scene")
          .getOne(SceneComponent)
          .scene.gameController.reduceHealthBy(5);
        return;
      } else {
        creatureComponent.isReturning = true;
        pathComponent.path = getPath().reverse();
        path = pathComponent.path;
      }
    }

    const position = path[0];
    const whereWeWantToGo = {
      x: position[0] * TILE_WIDTH,
      y: position[1] * TILE_HEIGHT,
    };
    const distance = Phaser.Math.Distance.BetweenPoints(
      creaturePosition,
      whereWeWantToGo
    );

    //calc direction vector btween current and position
    const vector = new Phaser.Math.Vector2(
      whereWeWantToGo.x - creaturePosition.x,
      whereWeWantToGo.y - creaturePosition.y
    );

    vector.normalize();

    graphicsComponent.graphics.rotation = vector.angle();

    vector.scale(statsComponent.speed);

    if (distance > 5) {
      creaturePosition.x += vector.x;
      creaturePosition.y += vector.y;
      creatureComponent.update("x"); //MARK THAT WE CHANGED THIS SO OUR SYSTEM TO UPDATE GRAPHICS GETS IT
    } else {
      path.splice(0, 1);
    }
  }

  addGraphics() {
    const scene = this.world.getEntity("scene").getOne(SceneComponent).scene;
    this.changes.forEach((change) => {
      const entity = this.world.getEntity(change.entity);
      if (change.op == "add" && change.type == "CreatureComponent") {
        this.creatureQuery.refresh();
        const position = entity.getOne(PositionComponent);
        const graphics = scene.add.image(
          position.x,
          position.y,
          "greenCreature"
        );
        graphics.radius = 40;
        entity.addComponent({ type: "GraphicsComponent", graphics });
      } else if (change.op == "change" && entity) {
        const position = entity.getOne(PositionComponent);
        entity
          .getOne(GraphicsComponent)
          .graphics.setPosition(position.x, position.y);
        entity
          .getOne(HealthbarComponent)
          .graphics.setPosition(position.x, position.y - 40);
      } else if (change.op == "destroy") {
        this.creatureQuery.refresh();
      } // else console.log("Unhandled change:", change);
    });
  }
}
