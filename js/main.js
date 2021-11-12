const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

const light = new THREE.AmbientLight( 0xffffff, 1.2 );
scene.add( light );

const startPosition = 3;
const endPosition = -startPosition;
const text = document.querySelector('.text');
const timeLimit = 10;
let gameState = 'loading';
let isLookingBackward = true;

function createCube(size, positionX, rotationY = 0, color = 0xfbc851) {
  const geometry = new THREE.BoxGeometry( size.w, size.h, size.d );
  const material = new THREE.MeshBasicMaterial( { color } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.x = positionX;
  cube.rotation.y = rotationY;
  scene.add( cube );
  return cube;
}

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Soldier {
  constructor() {
    loader.load('../models/scene.gltf', (gltf) => {
        scene.add( gltf.scene );
        gltf.scene.scale.set(20, 20, 20);
        gltf.scene.position.set(0, -2, 0);
        this.soldier = gltf.scene;
      }
    );
  }

  lookBackward() {
    gsap.to(this.soldier.rotation, { y: -3.15, duration: .45 });
    setTimeout(() => isLookingBackward = true, 150)
  }

  lookForward() {
    gsap.to(this.soldier.rotation, { y: 0, duration: .45 });
    setTimeout(() => isLookingBackward = false, 450)
  }

  async start() {
    this.lookBackward();
    await delay((Math.random() * 1000) + 1000);
    this.lookForward();
    await delay((Math.random() * 750) + 750);
    this.start();
  }
}

function createTrack() {
  createCube({ w: startPosition * 2 + .2, h: 1.5, d: 1 }, 0, 0, 0xe5a716).position.z = -1;
  createCube({ w: .2, h: 1.5, d: 1 }, startPosition, -.35);
  createCube({ w: .2, h: 1.5, d: 1 }, endPosition, .35);
}
createTrack();

class Player {
  constructor() {
    const geometry = new THREE.SphereGeometry( .3, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 1;
    sphere.position.x = startPosition;
    scene.add( sphere );

    this.player = sphere;
    this.playerInfo = {
      positionX: startPosition,
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
    if (this.playerInfo.velocity > 0 && !isLookingBackward) {
      text.innerText = 'You lose!';
      gameState = 'over';
    }
    if (this.playerInfo.positionX < endPosition + .4) {
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

const player = new Player();
const soldier = new Soldier();

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
  const progressBar = createCube({ w: 5, h: .1, d: 1 }, 0);
  progressBar.position.y = 3.35;
  gsap.to(progressBar.scale, { x: 0, duration: timeLimit, ease: 'none' });
  soldier.start();

  setTimeout(() => {
    if (gameState !== 'over') {
      text.innerText = 'You ran out of time!';
      gameState = 'over';
    }
  }, timeLimit * 1000)
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
