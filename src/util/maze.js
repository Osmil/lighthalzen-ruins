export class Maze {
  tileWidth = 32;
  tileHeight = 32;
  mazeWidth = 10;
  mazeHeight = 10;
  /* prettier-ignore */
  maze = [0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,1,0,0,1,1,1,1,0,
          0,0,1,0,0,1,0,0,1,0,
          0,0,1,0,0,1,0,0,1,0,
          0,0,1,0,0,1,0,0,1,0,
          0,0,1,0,0,1,0,0,1,0,
          0,0,1,1,1,1,0,0,2,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,]
  /**
   *
   * @param { Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.#init();
  }

  #init() {
    for (let x = 0; x <= this.mazeHeight; x++) {
      for (let y = 0; y <= this.mazeWidth; y++) {
        this.scene.add.rectangle(
          x * this.tileWidth,
          y * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          getFillColor(this.maze[y * 10 + x])
        );
      }
    }

    /**
    for (let x = 0; x <= this.mazeHeight; x++) {
      for (let y = 0; y <= this.mazeWidth; y++) {
        this.scene.add.text(
          x * this.tileWidth,
          y * this.tileHeight,
          `${x}|${y}`
        );
      }
    } */
  }
}

function getFillColor(number) {
  switch (number) {
    case 0:
      return 0x00ff00;
    case 1:
      return 0xff0000;
    case 2:
      return 0x0000ff;
  }
}
