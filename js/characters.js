import { delay } from './helpers.js';

export class Soldier {
  constructor(loader, scene) {
    loader.load('../models/scene.gltf', (gltf) => {
        scene.add( gltf.scene );
        gltf.scene.scale.set(20, 20, 20);
        gltf.scene.position.set(0, -2, 0);
        this.soldier = gltf.scene;
      }
    );
    this.isLookingBackward = true;
  }

  lookBackward() {
    gsap.to(this.soldier.rotation, { y: -3.15, duration: .45 });
    setTimeout(() => this.isLookingBackward = true, 150)
  }

  lookForward() {
    gsap.to(this.soldier.rotation, { y: 0, duration: .45 });
    setTimeout(() => this.isLookingBackward = false, 450)
  }

  async start() {
    this.lookBackward();
    await delay((Math.random() * 1000) + 1000);
    this.lookForward();
    await delay((Math.random() * 750) + 750);
    this.start();
  }
}
