import { createCube, delay } from './helpers.js';
import { Soldier } from './characters.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

const light = new THREE.AmbientLight( 0xffffff, 1.2 );
scene.add( light );

const START_POSITION = 3;
const END_POSITION = -START_POSITION;
const TIME_LIMIT = 10;

const text = document.querySelector('.text');

let gameState = 'loading';

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

function createTrack() {
  createCube(scene, { w: START_POSITION * 2 + .2, h: 1.5, d: 1 }, 0, 0, 0xe5a716).position.z = -1;
  createCube(scene,{ w: .2, h: 1.5, d: 1 }, START_POSITION, -.35);
  createCube(scene,{ w: .2, h: 1.5, d: 1 }, END_POSITION, .35);
}
createTrack();

class Player {
  constructor(character) {
    this.character = character;
    const geometry = new THREE.SphereGeometry( .3, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 1;
    sphere.position.x = START_POSITION;
    scene.add( sphere );

    this.player = sphere;
    this.playerInfo = {
      positionX: START_POSITION,
      velocity: 0
    }
  }

  run() {
    this.playerInfo.velocity = .03
  }

  stop() {
    gsap.to(this.playerInfo, { velocity: 0, duration: .1 })
  }

  check() {
    if (this.playerInfo.velocity > 0 && !this.character.isLookingBackward) {
      text.innerText = 'You lose!';
      gameState = 'over';
    }
    if (this.playerInfo.positionX < END_POSITION + .4) {
      text.innerText = 'You won!';
      gameState = 'over';
    }
  }

  update() {
    this.check();
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }

}

const soldier = new Soldier(loader, scene);
const player = new Player(soldier);

async function init() {
  await delay(500);
  text.innerText = 'Starting in 3';
  await delay(500);
  text.innerText = 'Starting in 2';
  await delay(500);
  text.innerText = 'Starting in 1';
  await delay(500);
  text.innerText = 'Goo!!!';
  startGame();
}

function startGame() {
  gameState = 'started';
  const progressBar = createCube(scene,{ w: 5, h: .1, d: 1 }, 0);
  progressBar.position.y = 3.35;
  gsap.to(progressBar.scale, { x: 0, duration: TIME_LIMIT, ease: 'none' });
  soldier.start();

  setTimeout(() => {
    if (gameState !== 'over') {
      text.innerText = 'You ran out of time!';
      gameState = 'over';
    }
  }, TIME_LIMIT * 1000)
}

init();

function animate() {
  if (gameState === 'over') return;
  renderer.render( scene, camera );
  requestAnimationFrame( animate );
  player.update()
}
animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('keydown', (event) => {
  if (gameState !== 'started') return;
  if (event.key === 'ArrowUp') {
    player.run();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp') {
    player.stop();
  }
});
