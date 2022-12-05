import { Creature } from "./creature";

export class Maze {
  tileWidth = 32;
  tileHeight = 32;
  mazeWidth = 10;
  mazeHeight = 10;
  creatureList = [];
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

    this.#addCreature();
  }

  #addCreature() {
    const startPoint = getPath()[0];
    const creatureGraphics = this.scene.add.circle(
      startPoint[0] * this.tileWidth,
      startPoint[1] * this.tileHeight,
      5,
      0xff00ff
    );

    const creature = new Creature(creatureGraphics, getPath());

    this.creatureList.push(creature);
  }

  update() {
    this.creatureList.forEach((creature) => {
      creature.update();
    });
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

    for (let x = 0; x <= this.mazeHeight; x++) {
      for (let y = 0; y <= this.mazeWidth; y++) {
        this.scene.add.text(
          x * this.tileWidth,
          y * this.tileHeight,
          `${x}|${y}`,
          {
            fontSize: 8,
          }
        );
      }
    }
  }
}

function getPath() {
  return [
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [5, 6],
    [5, 5],
    [5, 4],
    [5, 3],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
  ];
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
