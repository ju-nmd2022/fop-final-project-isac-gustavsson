class Enemy extends Player {
  constructor(x, y) {
    super(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = 0.5;
    this.s = 25;
    this.isGrounded = false;
    this.isAlerted = false;
  }

  animate() {
    push();
    translate(this.pos.x - this.s / 2, this.pos.y - this.s / 2);
    noStroke();
    fill("lightcoral");
    /****** HitBox ************/
    rect(0, 0, this.s, this.s);
    pop();
  }

  update() {
    this.vel.y += this.gravity;
    this.pos.add(this.vel);

    if (this.pos.y === height - this.s) {
      this.isGrounded = true; // Check if the player is on the ground
    }
  }

  collidesWith(player) {
    if (!player) {
      return false;
    }

    const enemyCenterX = this.pos.x + this.s / 2;
    const enemyCenterY = this.pos.y + this.s / 2;

    const playerCenterX = player.pos.x + player.s / 2;
    const playerCenterY = player.pos.y + player.s / 2;

    const distanceX = Math.abs(enemyCenterX - playerCenterX);
    const distanceY = Math.abs(enemyCenterY - playerCenterY);

    if (
      distanceX <= this.s / 2 + player.s / 2 &&
      distanceY <= this.s / 2 + player.s / 2
    ) {
      console.log("hit!");
      return true;
    }

    return false;
  }

  hits(tile) {
    if (!tile) {
      return false;
    }
    // Calculate player and tile boundaries
    const playerBottom = this.pos.y + this.s;
    const tileTop = tile.pos.y,
      tileBottom = tileTop + tile.s,
      playerRight = this.pos.x + this.s,
      tileLeft = tile.pos.x,
      tileRight = tileLeft + tile.s;

    // Check for collisions from different directions
    const collidedFromBottom =
      this.vel.y >= 0 &&
      playerBottom >= tileTop &&
      this.pos.y < tileTop &&
      playerRight > tileLeft &&
      this.pos.x < tileRight;
    const collidedFromTop =
      this.vel.y <= 0 &&
      this.pos.y <= tileBottom &&
      playerBottom > tileBottom &&
      playerRight > tileLeft &&
      this.pos.x < tileRight;
    const collidedFromRight =
      this.vel.x >= 0 &&
      this.pos.x <= tileRight &&
      playerRight > tileRight &&
      playerBottom > tileTop &&
      this.pos.y < tileBottom;
    const collidedFromLeft =
      this.vel.x <= 0 &&
      playerRight >= tileLeft &&
      this.pos.x < tileLeft &&
      playerBottom > tileTop &&
      this.pos.y < tileBottom;
    const collidedFromRightTop =
      this.vel.x <= 0 &&
      playerBottom >= tileTop &&
      this.pos.y < tileTop &&
      this.pos.x > tileRight &&
      playerRight <= tileRight;

    // Resolve collisions based on direction
    if (collidedFromBottom) {
      this.pos.y = tileTop - this.s;
      this.vel.y = 0;
      this.isGrounded = true;

      return true;
    }

    if (collidedFromTop) {
      this.pos.y = tileBottom;
      this.vel.y = 0;
      return true;
    }

    if (collidedFromRight) {
      this.pos.x = tileRight;
      this.vel.x = 0;
      return true;
    }

    if (collidedFromLeft) {
      this.pos.x = tileLeft - this.s;
      this.vel.x = 0;
      return true;
    }

    if (collidedFromRightTop) {
      this.pos.x = tileRight;
      this.vel.x = 0;
      return true;
    }

    return false;
  }
}
