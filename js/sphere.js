export class Sphere {
  constructor(scene, positionX) {
    const geometry = new THREE.SphereGeometry( .3, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 1;
    sphere.position.x = positionX;
    scene.add( sphere );
    this.obj = sphere;
  }
}
