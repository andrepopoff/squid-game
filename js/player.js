export class Player {
  constructor(character, playerObj) {
    this.character = character;
    this.gameState = 'loading';
    this.playerObj = playerObj;
    this.playerInfo = {
      positionX: 0,
      velocity: 0
    }
  }

  run() {
    this.playerInfo.velocity = .03
  }

  stop() {
    gsap.to(this.playerInfo, { velocity: 0, duration: .1 })
  }

  check(endPosition) {
    const text = document.querySelector('.text');
    if (this.playerInfo.velocity > 0 && !this.character.isLookingBackward) {
      text.innerText = 'You lose!';
      this.gameState = 'over';
    }
    if (this.playerInfo.positionX < endPosition + .4) {
      text.innerText = 'You won!';
      this.gameState = 'over';
    }
  }

  update(endPosition) {
    this.check(endPosition);
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.playerObj.position.x = this.playerInfo.positionX;
  }

}
