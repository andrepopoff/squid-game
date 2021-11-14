export class Listener {
  constructor(camera, renderer, player) {
    this.camera = camera;
    this.renderer = renderer;
    this.player = player;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  resize() {
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false);
    return this;
  }

  keyDown() {
    window.addEventListener('keydown', (event) => {
      if (this.player.gameState !== 'started') return;
      if (event.key === 'ArrowUp') {
        this.player.run();
      }
    });
    return this;
  }

  keyUp() {
    window.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowUp') {
        this.player.stop();
      }
    });
    return this;
  }
}
