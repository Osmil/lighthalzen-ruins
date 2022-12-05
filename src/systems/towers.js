import { System } from "ape-ecs";
import { PositionComponent } from "../components/position";

export class TowersSystem extends System {
  init() {
    this.mainQuery = this.createQuery().fromAll(
      "Tower",
      "Stats",
      "Position",
      "Graphics"
    );
  }

  update(tick) {
    const entities = this.mainQuery.execute();
    for (const entity of entities) {
      const point = entity.getOne(PositionComponent);
      if (!entity.has("Vector")) {
        entity.addComponent({
          type: "Vector",
          mx: 0,
          my: 0,
        });
      }
      const vector = entity.getOne("Vector");
      vector.my += 9.807 * frame.time.deltaTime * 0.01;
      vector.update();
    }
  }
}
