import { Creature } from "./creature";

export class Projectile {
  /**
   * @param {Creature} creature
   * @param {Phaser.GameObjects.Arc} circle
   */

  speed = 5;
  constructor(creature, circle) {
    this.creature = creature;
    this.circle = circle;
  }

  chase() {
    if (Phaser.Math.Distance.BetweenPoints(this.circle, this.creature) < 3) {
      this.circle.destroy();
      this.destroyed = true;
      return;
    }

    //calc direction vector btween current and position
    const vector = new Phaser.Math.Vector2(
      this.creature.x - this.circle.x,
      this.creature.y - this.circle.y
    );

    vector.normalize();

    this.circle.x += vector.x * this.speed;
    this.circle.y += vector.y * this.speed;
  }
}
