export class Creature {
  /**
   *
   * @param {Phaser.GameObjects.Arc} graphics
   * @param {Array} path
   */
  constructor(graphics, path) {
    this.graphics = graphics;
    this.path = path;
  }

  update() {
    if (!this.path.length) {
      this.destroyed = true;
      return this.graphics.destroy();
    }
    const position = this.path[0];
    const whereWeWantToGo = {
      x: position[0] * 32,
      y: position[1] * 32,
    };
    const distance = Phaser.Math.Distance.BetweenPoints(
      this.graphics,
      whereWeWantToGo
    );

    //calc direction vector btween current and position
    const vector = new Phaser.Math.Vector2(
      whereWeWantToGo.x - this.graphics.x,
      whereWeWantToGo.y - this.graphics.y
    );

    vector.normalize();

    if (distance > 0) {
      this.graphics.x += vector.x;
      this.graphics.y += vector.y;
    } else {
      this.path.splice(0, 1);
    }
  }

  get x() {
    return this.graphics.x;
  }

  get y() {
    return this.graphics.y;
  }
}
