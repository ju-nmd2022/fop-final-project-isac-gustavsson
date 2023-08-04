class Enemy extends Player {
  constructor(x, y) {
    super(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = 0.5;
    this.s = 25;

    this.frameWidth = 160;
    this.frameHeight = 160;
    this.currentFrame = 0;

    this.isGrounded = false;
    this.isAlerted = false;
    this.isCollidingWithEnemy = false;
    this.isJumping = false;

    this.hitsRight = false;
    this.hitsLeft = false;

    this.isMovingLeft = false;
    this.isMovingRight = false;

    this.batSheet = batSheet;
    this.batSheetAlert = batSheetAlert;
    this.spiderSheet = spiderSheet;

    this.noiseValue = 0;
  }

  alertedByPlayer(player) {
    let distance = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
    let threshold = 100;

    // Check if the player is within the perimeter to alert enemy.
    if (distance < threshold) {
      this.isAlerted = true;
    } else if (distance > threshold) {
      this.isAlerted = false;
    }

    // check if player and enemy are colliding.
    if (distance < this.s / 2 + player.s / 2) {
      player.isCollidingWithEnemy = true;
    } else player.isCollidingWithEnemy = false;
  }

  jump() {
    // Checks if enemy object is grounded. If it returns true, the enemy can jump and isGrounded is set to false.

    if (this.isAlerted) {
      // Adjust the jump velocity to control jump height
      this.vel.y = -9;

      // set isJumping to true while jumping.
      this.isJumping = true;

      // Set isGrounded to false after jumping.
      this.isGrounded = false;
    }

    if (this.isGrounded) {
      this.isJumping = false;
      this.vel.y = 0;
    }

    return false;
  }

  move() {
    if (this.isAlerted && this.isGrounded) {
      if (player.pos.x > this.pos.x) {
        this.pos.x += 2;
      } else if (player.pos.x < this.pos.x) {
        this.pos.x -= 2;
      }
    }
  }

  update() {
    this.vel.y += this.gravity;
    this.pos.add(this.vel);

    this.noiseValue = noise(this.pos.x / 100, this.pos.y / 100);

    if (
      this.currentFrame < 4 &&
      (this.currentFrame * this.frameWidth) % 2 === 0 &&
      frameCount % frameDelay === 0 // Add this condition
    ) {
      this.currentFrame++;
    }

    if (this instanceof Enemy && this.currentFrame === 4) {
      this.currentFrame = 0;
    } else if (this instanceof Spider && this.currentFrame === 2) {
      this.currentFrame = 0;
    }

    return false;
  }

  hits(tile) {
    if (!tile) {
      return false;
    }

    // Calculate player and tile boundaries

    const tileCenterX = tile.pos.x + tile.s / 2;
    const tileCenterY = tile.pos.y + tile.s / 2;

    // Check for collisions from different directions

    const hitFromBot =
      this.vel.y >= 0 &&
      this.pos.y + this.s >= tile.pos.y &&
      this.pos.y < tile.pos.y &&
      this.pos.x + this.s > tile.pos.x &&
      this.pos.x < tile.pos.x + tile.s;

    const hitFromTop =
      this.vel.y <= 0 &&
      this.pos.y <= tile.pos.y + tile.s &&
      this.pos.y + this.s >= tile.pos.y + tile.s &&
      this.pos.x + this.s > tile.pos.x + 2 &&
      this.pos.x < tile.pos.x + tile.s;

    const hitFromRight =
      this.vel.x >= 0 &&
      this.pos.x <= tile.pos.x + tile.s &&
      this.pos.x + this.s > tile.pos.x + tile.s + 1 &&
      this.pos.y + this.s > tile.pos.y &&
      this.pos.y < tile.pos.y + tile.s;

    const hitFromLeft =
      this.vel.x <= 0 &&
      this.pos.x + this.s > tile.pos.x &&
      this.pos.x < tile.pos.x &&
      this.pos.y + this.s > tile.pos.y &&
      this.pos.y < tile.pos.y + tile.s;

    const threshold = 25;

    const isTileAbove =
      tile.pos.y + tile.s <= tile.pos.y &&
      tile.pos.y - tile.pos.y + tile.s <= threshold &&
      this.pos.x + this.s > tile.pos.x &&
      this.pos.x < tile.pos.x + tile.s;

    // Determine collisions based on direction

    if (hitFromBot) {
      this.pos.y = tile.pos.y - this.s;
      this.vel.y = 0;
      this.isGrounded = true;
      this.isJumping = false;

      return true;
    }

    if (hitFromTop) {
      this.pos.y = tile.pos.y + tile.s;
      this.vel.y = 0;
      this.hitsTop = false;
      return true;
    }

    if (
      hitFromRight &&
      this.isGrounded &&
      this.pos.y + this.s > tileCenterY &&
      this.pos.x + this.s > tile.pos.x + tile.s
    ) {
      this.hitsRight = true;
      this.pos.x = tile.pos.x + tile.s;
      this.vel.x = 0;
      this.jump();

      return true;
    }

    if (this.isJumping && hitFromRight && this.pos.y + this.s >= tile.pos.y) {
      this.pos.x -= 1;
      this.vel.x = 0;
      this.isJumping = false;
      console.log("hit");

      return true;
    }

    if (
      hitFromLeft &&
      this.isGrounded &&
      this.pos.y + this.s > tileCenterY &&
      this.pos.x + this.s < tile.pos.x + tile.s
    ) {
      this.hitsLeft = true;
      this.pos.x = tile.pos.x - this.frameWidth / 8;
      this.vel.x = 0;

      this.jump();

      return true;
    }

    if (hitFromLeft && this.isJumping && this.pos.y + this.s > tile.pos.y) {
      this.pos.x += 1;
      this.vel.x = 0;
      this.isJumping = false;

      return true;
    }

    if (isTileAbove) {
      this.hitsTop = true;
      return true;
    } else this.hitsTop = false;

    return false;
  }
}

// Enemy Skins

class Bat extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.s = 25;
  }

  animate() {
    push();
    translate(this.pos.x - this.s / 2, this.pos.y - this.s / 2 - 15);

    if (!this.isAlerted) {
      image(
        this.batSheet,
        0,
        0,
        this.frameWidth / 5,
        this.frameHeight / 5,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    if (this.isAlerted) {
      image(
        this.batSheetAlert,
        -4,
        0,
        this.frameWidth / 5,
        this.frameHeight / 5,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    pop();
  }
}

class Spider extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.s = 25;
  }

  animate() {
    push();
    translate(this.pos.x - this.s / 2, this.pos.y - this.s / 2 - 15);

    image(
      this.spiderSheet,
      0,
      22,
      this.frameWidth / 8,
      this.frameHeight / 8,
      this.currentFrame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight
    );

    pop();
  }
}
