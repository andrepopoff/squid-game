import { createCube, delay } from './helpers.js';
import { Soldier } from './characters.js';
import { Player } from './player.js';
import { Sphere } from './sphere.js';
import { Track } from './track.js';
import { Listener } from './listener.js';

const START_POSITION = 3;
const END_POSITION = -START_POSITION;
const TIME_LIMIT = 10;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const light = new THREE.AmbientLight( 0xffffff, 1.2 );
const loader = new THREE.GLTFLoader();
const text = document.querySelector('.text');

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

scene.add( light );

camera.position.z = 5;

new Track(scene, START_POSITION, END_POSITION).create();
const soldier = new Soldier(loader, scene);
const sphere = new Sphere(scene, START_POSITION).obj;
const player = new Player(soldier, sphere);
player.playerInfo.positionX = START_POSITION;

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
  player.gameState = 'started';
  const progressBar = createCube(scene,{ w: 5, h: .1, d: 1 }, 0);
  progressBar.position.y = 3.35;
  gsap.to(progressBar.scale, { x: 0, duration: TIME_LIMIT, ease: 'none' });
  soldier.start();

  setTimeout(() => {
    if (player.gameState !== 'over') {
      text.innerText = 'You ran out of time!';
      player.gameState = 'over';
    }
  }, TIME_LIMIT * 1000)
}

init();

function animate() {
  if (player.gameState === 'over') return;
  renderer.render( scene, camera );
  requestAnimationFrame( animate );
  player.update(END_POSITION);
}
animate();

const listener = new Listener(camera, renderer, player);
listener.keyDown().keyUp().resize();
