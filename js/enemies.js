class Enemy extends Player {
  constructor(x, y) {
    super(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = 0.5;
    this.s = 25;
    this.color = "#00CECB";

    this.isGrounded = false;
    this.isAlerted = false;
    this.isColliding = false;
    this.isJumping = false;
  }

  animate() {
    push();
    translate(this.pos.x - this.s / 2, this.pos.y - this.s / 2);
    noStroke();
    fill(this.color);
    /****** HitBox ************/
    rect(0, 0, this.s, this.s);
    pop();
  }

  alertedByPlayer(player) {
    let distance = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
    let threshold = 150;

    // Check if the player is within the perimeter to alert enemy.
    if (distance < threshold) {
      this.isAlerted = true;
      this.color = "yellow";
    } else if (distance > threshold) {
      this.isAlerted = false;
      this.color = "#12F8E8";
    }

    // check if player and enemy are colliding.
    if (distance < this.s / 2 + player.s / 2) {
      this.isColliding = true;
      console.log("collided");
      this.color = "#EA3546";
    } else this.isColliding = false;
  }

  jump() {
    // Checks if enemy object is grounded. If it returns true, the enemy can jump and isGrounded is set to false.

    if (this.isAlerted) {
      // Adjust the jump velocity to control jump height
      this.vel.y = -8;

      // set isJumping to true while jumping.
      this.isJumping = true;

      // Set isGrounded to false after jumping.
      this.isGrounded = false;
    }

    return false;
  }

  update(tile) {
    this.vel.y += this.gravity;
    this.pos.add(this.vel);

    if (this.isAlerted && this.isGrounded) {
      if (player.pos.x > this.pos.x) {
        this.pos.x += 1;
      } else if (player.pos.x < this.pos.x) {
        this.pos.x -= 1;
      }
    }

    return false;
  }

  hits(tile) {
    if (!tile) {
      return false;
    }

    // Calculate player and tile boundaries

    const enemyBot = this.pos.y + this.s;
    const enemyRight = this.pos.x + this.s;

    const tileTop = tile.pos.y;
    const tileBot = tile.pos.y + tile.s;
    const tileLeft = tile.pos.x;
    const tileRight = tile.pos.x + tile.s;

    const tileCenterX = tile.pos.x + tile.s / 2;
    const tileCenterY = tile.pos.y + tile.s / 2;

    // Check for collisions from different directions

    const hitFromBot =
      this.vel.y >= 0 &&
      enemyBot >= tileTop &&
      this.pos.y < tileTop &&
      enemyRight > tileLeft &&
      this.pos.x < tileRight;

    const hitFromTop =
      this.vel.y <= 0 &&
      this.pos.y <= tileBot &&
      enemyBot > tileBot &&
      enemyRight > tileLeft &&
      this.pos.x < tileRight;

    const hitFromRight =
      this.vel.x >= 0 &&
      this.pos.x <= tileRight &&
      enemyRight > tileRight &&
      enemyBot > tileTop &&
      this.pos.y < tileBot;

    const hitFromLeft =
      this.vel.x <= 0 &&
      enemyRight >= tileLeft &&
      this.pos.x < tileLeft &&
      enemyBot > tileTop &&
      this.pos.y < tileBot;

    // Determine collisions based on direction

    if (hitFromBot) {
      this.pos.y = tileTop - this.s;
      this.vel.y = 0;
      this.isGrounded = true;
      this.isJumping = false;

      return true;
    }

    if (hitFromTop) {
      this.pos.y = tileBot;
      this.vel.y = 0;
      this.hitsTop = false;
      return true;
    }

    if (
      hitFromRight &&
      this.isGrounded &&
      this.isAlerted &&
      enemyBot > tileCenterY &&
      this.pos.x + this.s > player.pos.x + player.s
    ) {
      this.pos.x = tileRight;
      this.vel.x = 0;
      this.jump();
      return true;
    }

    if (this.isJumping && hitFromRight && enemyBot > tileTop) {
      this.pos.x -= 1;
      this.vel.x = 0;

      this.isJumping = false;
      return true;
    }

    if (
      hitFromLeft &&
      this.isGrounded &&
      this.isAlerted &&
      enemyBot > tileCenterY &&
      this.pos.x + this.s < player.pos.x + player.s
    ) {
      this.pos.x = tileLeft - this.s;
      this.vel.x = 0;
      this.jump();
      return true;
    }

    if (this.isJumping && hitFromLeft && enemyBot > tileTop) {
      this.pos.x += 1;
      this.vel.x = 0;

      this.isJumping = false;
      return true;
    }

    return false;
  }
}
