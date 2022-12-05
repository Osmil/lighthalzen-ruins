import { Component } from "ape-ecs";

export class TowerComponent extends Component {}
TowerComponent.properties = { shootCooldown: 1000, shootTimer: 0 };
