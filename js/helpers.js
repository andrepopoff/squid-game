export function createCube(scene, size, positionX, rotationY = 0, color = 0xfbc851) {
  const geometry = new THREE.BoxGeometry( size.w, size.h, size.d );
  const material = new THREE.MeshBasicMaterial( { color } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.x = positionX;
  cube.rotation.y = rotationY;
  scene.add( cube );
  return cube;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
