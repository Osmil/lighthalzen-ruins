import { Creature } from "./creature";
import { Tower } from "./tower";
import { MyGame } from "../index";

export class Maze {
  tileWidth = 32;
  tileHeight = 32;

  offset = 16;
  mazeWidth = 10;
  mazeHeight = 10;
  /**
   * @type Array<Creature>
   */
  creatureList = [];
  /**
   * @type Array<Tower>
   */
  towerList = [];
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
   * @param { MyGame } scene
   */
  constructor(scene) {
    this.scene = scene;
    this.#init();

    this.#addCreature();
  }

  #addCreature() {
    const startPoint = getPath()[0];
    const x = startPoint[0] * this.tileWidth;
    const y = startPoint[1] * this.tileHeight;
    const creatureGraphics = this.scene.add.circle(x, y, 5, 0xff00ff);

    const world = this.scene.gameController.world;
    world.createEntity({
      components: [
        { type: "PositionComponent", x, y },
        { type: "GraphicsComponent", graphics: creatureGraphics },
      ],
    });
    const creature = new Creature(creatureGraphics, getPath());

    this.creatureList.push(creature);
  }

  update(delta) {
    this.creatureList.forEach((creature) => {
      creature.update(delta);
    });

    this.creatureList
      .filter((creature) => creature.destroyed)
      .forEach(() => this.#addCreature());

    this.creatureList = this.creatureList.filter(
      (creature) => !creature.destroyed
    );

    this.towerList.forEach((tower) => {
      tower.update(this.creatureList, delta);
    });

    this.creatureList = this.creatureList.filter(
      (creature) => !creature.destroyed
    );
  }

  #init() {
    for (let x = 0; x <= this.mazeHeight; x++) {
      for (let y = 0; y <= this.mazeWidth; y++) {
        const type = this.maze[y * 10 + x];
        const tile = this.scene.add.rectangle(
          x * this.tileWidth,
          y * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          getFillColor(type)
        );

        tile.setInteractive(undefined, Phaser.Geom.Rectangle.Contains);

        if (type == 0) {
          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, () => {
            tile.setAlpha(0.5);
          });

          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            tile.setAlpha(1);
          });

          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            const rect = this.scene.add.rectangle(
              x * this.tileWidth,
              y * this.tileHeight,
              this.tileWidth / 2,
              this.tileHeight / 2,
              0x335832
            );

            const tower = new Tower(this.scene, rect);
            this.towerList.push(tower);
          });
        }
      }
    }

    /**
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
    } */
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
