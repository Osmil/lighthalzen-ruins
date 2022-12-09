import { MyGame } from "../index";
export const TILE_WIDTH = 64 + 32;
export const TILE_HEIGHT = 64 + 32;
export const homePosition = { x: TILE_WIDTH * 10, y: TILE_HEIGHT * 7 };
export const goalPosition = { x: TILE_WIDTH * 10, y: TILE_HEIGHT * 7 };
export class Maze {
  tileWidth = TILE_WIDTH;
  tileHeight = TILE_HEIGHT;

  offset = 16;
  mazeWidth = 12;
  mazeHeight = 10;

  /* prettier-ignore */
  maze = [0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,1,0,0,0,1,1,1,1,1,0,
          0,0,1,0,0,0,1,0,0,0,1,0,
          0,0,1,0,0,0,1,0,0,0,1,0,
          0,0,1,0,0,0,1,0,0,0,1,0,
          0,0,1,0,0,0,1,0,0,0,1,0,
          0,0,1,1,1,1,1,0,0,0,2,0,
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,]
  /**
   *
   * @param { MyGame } scene
   */
  constructor(scene) {
    this.scene = scene;
    this.#init();
  }

  #init() {
    this.scene.cameras.main.setSize(13 * TILE_WIDTH, 11 * TILE_HEIGHT);
    this.scene.cameras.main.setBackgroundColor(0xeeffee);
    this.scene.cameras.main.transparent = false;
    this.scene.cameras.main.setPosition(50, 50);
    for (let x = 0; x <= this.mazeWidth; x++) {
      for (let y = 0; y <= this.mazeHeight; y++) {
        const posX = x * this.tileWidth;
        const posY = y * this.tileHeight;
        const type = this.maze[y * this.mazeWidth + x];
        /**
         */

        if (x == 6 && y == 5) {
          this.scene.cameras.main.centerOn(posX, posY);
        }
        const tile = this.scene.add.image(posX, posY, this.getImage(x, y));

        const tileType = this.getType(x, y);
        tile.setScale(0.75);

        tile.setInteractive(undefined, Phaser.Geom.Rectangle.Contains);

        /**
          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (e) => {
            if (e.event.ctrlKey) {
              this.getType(x, y, true);
            } else {
              console.log("No ctrl", e);
            }
          }); */

        if (tileType == 0 && type === 0) {
          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, () => {
            tile.setTint(0xff00ff);
          });

          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            tile.clearTint();
          });

          tile.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (e) => {
            if (!tile.activeTower)
              tile.activeTower = this.scene.gameController.createTower(
                posX,
                posY
              );
          });
        }
        if (x == 10 && y == 6) {
          const tile = this.scene.add.image(posX, posY, "goal");
        }

        if (x == 2 && y == 2) {
          const tile = this.scene.add.image(posX, posY, "base");
        }
      }
    }

    /**
    for (let x = 0; x <= this.mazeWidth; x++) {
      for (let y = 0; y <= this.mazeHeight; y++) {
        const posX = x * this.tileWidth;
        const posY = y * this.tileHeight;
        const tileType = this.getType(x, y);
        /**
        this.scene.add.text(posX, posY, `${tileType}`, {
          fontSize: 8,
        });
        this.scene.add.text(posX, posY, `${x}|${y}`, {
          fontSize: 8,
        });
      }
    }
 */
  }

  isBuildAble(type) {
    return type % 6 === 0;
  }

  getType(x, y, debug) {
    const self = this.maze[y * this.mazeWidth + x];

    const top = this.maze[(y - 1) * this.mazeWidth + x] === 1 ? 1 : 0;
    const left = this.maze[y * this.mazeWidth + x - 1] === 1 ? 1 : 0;
    const right = this.maze[y * this.mazeWidth + x + 1] === 1 ? 1 : 0;
    const bottom = this.maze[(y + 1) * this.mazeWidth + x] === 1 ? 1 : 0;
    const topLeft = this.maze[(y - 1) * this.mazeWidth + x - 1] === 1 ? 1 : 0;
    const topRight = this.maze[(y - 1) * this.mazeWidth + x + 1] === 1 ? 1 : 0;
    const bottomLeft =
      this.maze[(y + 1) * this.mazeWidth + x - 1] === 1 ? 1 : 0;
    const bottomRight =
      this.maze[(y + 1) * this.mazeWidth + x + 1] === 1 ? 1 : 0;
    if (debug) {
      console.log(`${topLeft}|${top}|${topRight}`);
      console.log(`${left}|${self}|${right}`);
      console.log(`${bottomLeft}|${bottom}|${bottomRight}`);
    }
    const xtop = (top === self ? 0 : top) * 1;
    const xleft = (left === self ? 0 : left) * 2;
    const xright = (right === self ? 0 : right) * 4;
    const xbottom = (bottom === self ? 0 : bottom) * 8;
    const xtopLeft = (topLeft === self ? 0 : topLeft) * 16;
    const xtopRight = (topRight === self ? 0 : topRight) * 32;
    const xbottomLeft = (bottomLeft === self ? 0 : bottomLeft) * 64;
    const xbottomRight = (bottomRight === self ? 0 : bottomRight) * 128;

    const tileType =
      xtop |
      xleft |
      xright |
      xbottom |
      xtopLeft |
      xtopRight |
      xbottomLeft |
      xbottomRight;
    //console.log(tileType);
    //console.log("---");
    return tileType;
  }

  getImage(x, y) {
    const prefix = getPrefix(0, 0);
    const type = this.getType(x, y);
    switch (type) {
      case 0:
        return this.maze[y * this.mazeWidth + x] === 1 ? "dirt" : "full";
      case 64:
        return "topRight";
      case 236:
        return "topLeftCorner";
      case 218:
        return "topRightCorner";
      case 181:
        return "bottomLeftCorner";
      case 115:
        return "bottomRightCorner";
      case 16:
        return "bottomRight";
      case 128:
        return "topLeft";
      case 32:
        return "bottomLeft";
      case 33:
      case 49:
      case 17:
      case 1:
        return "bottom";
      case 36:
      case 132:
      case 164:
        return "left";
      case 136:
      case 200:
      case 72:
      case 8:
        return "top";
      case 18:
      case 82:
      case 66:
        return "right";
      default:
        return "full";
    }
  }
}

function getPrefix(x, y) {
  return "";
}

export function getPath() {
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
    [6, 7],
    [6, 6],
    [6, 5],
    [6, 4],
    [6, 3],
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2],
    [10, 2],
    [10, 3],
    [10, 4],
    [10, 5],
    [10, 6],
  ];
}
