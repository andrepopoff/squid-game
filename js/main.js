const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

const light = new THREE.AmbientLight( 0xffffff, 1.2 );
scene.add( light );

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

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
  }

  lookForward() {
    gsap.to(this.soldier.rotation, { y: 0, duration: .45 });
  }
}

const soldier = new Soldier();
setTimeout(() => {
  soldier.lookBackward();
}, 1000);

function animate() {
  renderer.render( scene, camera );
  requestAnimationFrame( animate );
}
animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
