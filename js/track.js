import { createCube } from './helpers.js';

export class Track {
  constructor(scene, startPosition, endPosition) {
    this.scene = scene;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
  }

  create() {
    createCube(this.scene, { w: this.startPosition * 2 + .2, h: 1.5, d: 1 }, 0, 0, 0xe5a716).position.z = -1;
    createCube(this.scene,{ w: .2, h: 1.5, d: 1 }, this.startPosition, -.35);
    createCube(this.scene,{ w: .2, h: 1.5, d: 1 }, this.endPosition, .35);
  }
}
