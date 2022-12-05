import { Creature } from "./creature";
import { Projectile } from "./projectile";

export class Tower {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Rectangle} graphics
   */
  constructor(scene, graphics) {
    this.graphics = graphics;
    this.scene = scene;
    this.timeSinceLastShot = 0;
    this.shotCooldown = 750;
    /**
     * @type Array<Projectile>
     */
    this.projectileList = [];
    this.range = 150;

    this.scene.add.circle(
      this.graphics.x + this.graphics.width,
      this.graphics.y + this.graphics.height,
      this.range,
      0xff00ff,
      0.2
    );
  }

  /**
   *
   * @param {Array<Creature>} creatureList
   */
  update(creatureList, delta) {
    this.projectileList.forEach((projectile) => {
      projectile.chase();
    });
    this.projectileList = this.projectileList.filter(
      (projectile) => !projectile.destroyed
    );

    this.timeSinceLastShot += delta;
    if (this.timeSinceLastShot < this.shotCooldown) return;
    const creaturesInRange = creatureList.filter((creature) => {
      return (
        Phaser.Math.Distance.BetweenPoints(creature, this.graphics) < this.range
      );
    });

    if (!creaturesInRange.length) return;

    this.projectileList.push(
      new Projectile(
        creaturesInRange[0],
        this.scene.add.circle(this.graphics.x, this.graphics.y, 5, 0x9943cc)
      )
    );

    this.timeSinceLastShot = 0;
  }
}
