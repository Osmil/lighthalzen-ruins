import { World } from "ape-ecs";
import { CreatureComponent } from "../components/creature";
import { DeltaComponent } from "../components/delta";
import { GraphicsComponent } from "../components/graphics";
import { HealthbarComponent } from "../components/healtbar";
import { PathComponent } from "../components/path";
import { PositionComponent } from "../components/position";
import { ProjectileComponent } from "../components/projectile";
import { SceneComponent } from "../components/scene";
import { StatsComponent } from "../components/stats";
import { TileComponent } from "../components/tile";
import { TowerComponent } from "../components/tower";
import { CreatureSystem } from "../systems/creature";
import { GraphicsSystem } from "../systems/graphics";
import { HealthSystem } from "../systems/health";
import { ProjectileSystem } from "../systems/projectile";
import { StatsSystem } from "../systems/stats";
import { TowersSystem } from "../systems/towers";
import { getPath, TILE_HEIGHT, TILE_WIDTH } from "./maze";
import Phaser from "phaser";
export class GameController extends Phaser.Events.EventEmitter {
  health = 10;
  world;

  wave = 0;
  timeSince = 0;
  spawned = 0;

  timeBetweenWaves = 10000;
  timeSinceLastWave = 0;

  isSpawning = false;

  /**
   *
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    super();
    this.scene = scene;
    this.waves = waves;
    this.world = new World();
    this.world.registerComponent(PositionComponent);
    this.world.registerComponent(GraphicsComponent);
    this.world.registerComponent(PathComponent);
    this.world.registerComponent(TowerComponent);
    this.world.registerComponent(TileComponent);
    this.world.registerComponent(StatsComponent);
    this.world.registerComponent(DeltaComponent);
    this.world.registerComponent(SceneComponent);
    this.world.registerComponent(ProjectileComponent);
    this.world.registerComponent(CreatureComponent);
    this.world.registerComponent(HealthbarComponent);

    this.world.registerSystem("all", TowersSystem);
    this.world.registerSystem("all", ProjectileSystem);
    this.world.registerSystem("all", CreatureSystem);
    this.world.registerSystem("all", GraphicsSystem);
    this.world.registerSystem("all", StatsSystem);
    this.world.registerSystem("all", HealthSystem);
    this.entityQuery = this.world
      .createQuery()
      .fromAny(CreatureComponent, TowerComponent);
    this.frameEntity = this.world.createEntity({
      id: "delta",
      components: [{ type: "DeltaComponent" }],
    });
  }

  update(delta) {
    this.frameEntity.getOne(DeltaComponent).delta = delta;
    this.world.runSystems("all");

    if (this.isSpawning && !this.gameOver) {
      this.timeSince += delta;
      this.timeSinceLastWave += delta;

      if (this.timeSinceLastWave > this.timeBetweenWaves) {
        // start next wave already
        this.timeSinceLastWave = 0;
        this.wave += 1;
        this.emit(GameEvents.SPAWN_WAVE, this.wave);
        this.spawned = 0;
        if (!this.waves[this.wave]) {
          this.isSpawning = false;
          return;
        }
      }

      if (
        this.timeSince >= waves[this.wave].wait &&
        this.spawned < waves[this.wave].amount
      ) {
        this.addCreature();
        this.spawned += 1;
        this.timeSince = 0;
      }
    }
  }

  start() {
    if (this.gameOver) {
      this.entityQuery
        .refresh()
        .execute()
        .forEach((e) => e.destroy());
      this.gameOver = false;
      this.text.destroy();
    }

    if (!this.isSpawning) {
      this.health = 10;
      this.entityQuery
        .refresh()
        .execute()
        .forEach((e) => e.destroy());
      this.waves = waves;
      this.wave = 0;
      this.timeSince = 0;
      this.timeSinceLastWave = 0;
      this.emit(GameEvents.START);
      this.spawnWave(this.wave);
    }
  }

  spawnWave(number) {
    this.isSpawning = true;
    this.wave = number;
    this.spawned = 0;
    this.emit(GameEvents.SPAWN_WAVE, this.wave);
  }

  addCreature() {
    const startPoint = getPath()[0];
    const x = startPoint[0] * TILE_WIDTH;
    const y = startPoint[1] * TILE_HEIGHT;

    this.world.createEntity({
      components: [
        { type: "PositionComponent", x, y },
        { type: "CreatureComponent" },
        { type: "StatsComponent" },
        { type: "PathComponent", path: getPath() },
      ],
    });
  }

  createTower(x, y) {
    if (this.health >= 5) {
      const tower = this.world.createEntity({
        c: [{ type: "PositionComponent", x, y }, { type: "TowerComponent" }],
      });
      this.reduceHealthBy(5);
      return tower;
    }
  }

  reduceHealthBy(amount, isDamage) {
    this.health -= amount;
    this.emit(GameEvents.HEALTH_CHANGE);
    if (this.health < 0) {
      this.emit(GameEvents.GAME_OVER);
      this.gameOver = true;
      this.text = this.scene.add.text(
        this.scene.game.renderer.width / 2,
        this.scene.game.renderer.height / 2,
        "GAME OVER",
        { fontSize: 128 }
      );

      this.text.x -= this.text.width / 2;
      this.text.y -= this.text.height;
    }
    if (isDamage) this.emit(GameEvents.TAKE_DAMAGE);
  }

  increaseHealthBy(amount) {
    this.health += amount;
    this.emit(GameEvents.HEALTH_CHANGE);
  }
}

export const GameEvents = {
  HEALTH_CHANGE: 0,
  TAKE_DAMAGE: 1,
  GAME_OVER: 2,
  SPAWN_WAVE: 3,
  START: 4,
};

const waves = [
  { amount: 10, wait: 250 },
  { amount: 3, wait: 250 },
  { amount: 20, wait: 250 },
  { amount: 100, wait: 50 },
  { amount: 1000, wait: 50 },
];
