// /**********  Class Object For Player **********/

class Player {
  constructor(x, y, s) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = 0.5;
    this.s = 25;
    this.isGrounded = false;
    this.isMovingRight = false;
    this.isMovingLeft = false;
    this.hitsTop = false;
    this.isFalling = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.prevPosY = this.pos.y;

    this.frameWidth = 100;
    this.frameHeight = 100;
    this.currentFrame = 0;

    this.isAimingLeft = false;
    this.isAimingRight = false;
  }

  destroyTile(tiles) {
    // Calculate the x-coordinate and y-coordinate of the player's center

    const playerCenterX = this.pos.x + this.s / 2;
    const playerCenterY = this.pos.y + this.s / 2;

    let tileToDestroy = null; // Initialize variable to store the tile to be destroyed

    // Loop through all available tiles

    for (let y = 0; y < tiles.length; y++) {
      if (!tiles[y]) continue;
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = tiles[y][x];

        if (!tile) continue;

        // Calculate the x-coordinate and y-coordinate of the tile's center

        const tileCenterX = tile.pos.x + tile.s / 2;
        const tileCenterY = tile.pos.y + tile.s / 2;

        // Calculate the absolute distance in the x-axis and y-axis

        const distanceX = Math.abs(playerCenterX - tileCenterX);
        const distanceY = Math.abs(playerCenterY - tileCenterY);

        // Calculate the maximum allowed distance to destroy the tile

        const maxDistance = this.s / 2 + tile.s / 2;

        if (tile && tile.hits >= tile.maxHits) {
          // Replace the destroyed tile with an Emptile at the same position
          tiles[y][x] = new Emptile(tile.pos.x, tile.pos.y, tile.s);
        }

        // Below is the logic to check if the player is holding the correct keys in relation to the distance between the player and the tile (in order to destroy the tile).

        if (
          keyIsDown(37) &&
          distanceX <= maxDistance &&
          distanceY <= maxDistance * 0.5 &&
          playerCenterX > tileCenterX &&
          (tileToDestroy === null || tileCenterX > tileToDestroy.pos.x)
        ) {
          tileToDestroy = tile;
        }
        //  set the tile to the left as the tile to be destroyed if the Left Arrow Key is held and the tile is within the maximum allowed distance.
        else if (
          keyIsDown(39) &&
          distanceX <= maxDistance &&
          distanceY <= maxDistance * 0.5 &&
          playerCenterX < tileCenterX &&
          (tileToDestroy === null || tileCenterX < tileToDestroy.pos.x)
        ) {
          tileToDestroy = tile;
        }
        // set the tile to the right as the tile to be destroyed if the Right Arrow Key is held and the tile is within the maximum allowed distance.
        else if (
          keyIsDown(38) &&
          distanceX <= maxDistance * 0.8 &&
          distanceY <= maxDistance * 2 &&
          playerCenterY > tileCenterY &&
          (tileToDestroy === null || tileCenterY > tileToDestroy.pos.y)
        ) {
          tileToDestroy = tile;
        }
        // Set the tile above as the tile to be destroyed if the Up Arrow Key is held and the tile is within the maximum allowed distance.
        else if (
          keyIsDown(40) &&
          distanceX <= maxDistance &&
          distanceY <= maxDistance &&
          playerCenterY < tileCenterY &&
          (tileToDestroy === null || tileCenterY < tileToDestroy.pos.y)
        ) {
          tileToDestroy = tile;
        }
        // Set the tile below as the tile to be destroyed if the Down Arrow Key is held and the tile is within the maximum allowed distance.
      }
    }

    // Find the tile to be destroyed in the array and remove it from the array.

    if (tileToDestroy) {
      const y = tiles.findIndex((row) => row.includes(tileToDestroy));
      const x = tiles[y].indexOf(tileToDestroy);
      tiles[y].splice(x, 1);
    }
  }

  hits(tile) {
    if (!tile || tile.isNotATile === true || tile.isDestroyed) {
      return false;
    }

    // Calculate player and tile boundaries

    const playerRight = this.pos.x + this.s;
    const playerBot = this.pos.y + this.s;

    const tileTop = tile.pos.y;
    const tileBot = tile.pos.y + tile.s;
    const tileRight = tile.pos.x + tile.s;

    // Check for collisions from different directions

    const hitFromBot =
      this.vel.y >= 0 &&
      playerBot >= tileTop &&
      this.pos.y < tileTop &&
      playerRight > tile.pos.x &&
      this.pos.x < tileRight;

    const hitFromTop =
      this.vel.y <= 0 &&
      this.pos.y <= tileBot &&
      playerBot > tileBot &&
      playerRight > tile.pos.x + 4 &&
      this.pos.x < tileRight - 4;

    const hitFromRight =
      this.vel.x >= 0 &&
      this.pos.x <= tileRight &&
      playerRight >= tileRight &&
      playerBot > tileTop &&
      this.pos.y < tileBot;

    const hitFromLeft =
      this.vel.x <= 0 &&
      playerRight >= tile.pos.x &&
      this.pos.x < tile.pos.x + tile.s &&
      playerBot > tileTop &&
      this.pos.y < tileBot;

    const threshold = 25;

    const isTileAbove =
      tileBot <= this.pos.y &&
      this.pos.y - tileBot <= threshold &&
      playerRight > tile.pos.x &&
      this.pos.x < tileRight;

    // Determine collisions based on direction

    if (hitFromBot) {
      this.pos.y = tileTop - this.s;
      this.vel.y = 0;
      this.isGrounded = true;

      return true;
    }

    if (hitFromTop) {
      this.pos.y = tile.pos.y + tile.s;
      this.vel.y = 0;

      return true;
    }

    if (hitFromRight) {
      this.pos.x = tileRight;
      this.vel.x = 0;

      return true;
    }

    if (hitFromLeft) {
      this.pos.x = tile.pos.x - this.s;
      this.vel.x = 0;

      return true;
    }

    if (isTileAbove) {
      this.hitsTop = true;
      return true;
    } else this.hitsTop = false;

    return false;
  }

  jump() {
    // Checks if player object is grounded. If true it sets isGrounded to true and allows the player to jump.

    if (this.isGrounded) {
      // Adjust the jump velocity to control jump height
      this.vel.y = -8;

      // Set isGrounded to false after jumping.
      this.isGrounded = false;

      this.isMovingUp = true;
    }

    return false;
  }

  move() {
    if (keyIsDown(65)) {
      this.pos.x -= 4;
      this.isMovingLeft = true;
    } else this.isMovingLeft = false;

    if (keyIsDown(68)) {
      this.pos.x += 4;
      this.isMovingRight = true;
    } else this.isMovingRight = false;

    if (keyIsDown(32)) {
      this.jump();
    }
  }

  update() {
    // applies gravity to player object
    this.vel.y += this.gravity;
    this.pos.add(this.vel);

    if (
      !this.isMovingLeft &&
      this.isMovingRight &&
      this.currentFrame < 5 &&
      (this.currentFrame * this.frameWidth) % 2 === 0 &&
      frameCount % frameDelay === 0 // Add this condition
    ) {
      this.currentFrame++;
    }

    if (
      !this.isMovingRight &&
      this.isMovingLeft &&
      this.currentFrame <= 4 &&
      (this.currentFrame * this.frameWidth) % 2 === 0 &&
      frameCount % frameDelay === 0 // Add this condition
    ) {
      this.currentFrame++;
    }

    if (!this.isMovingLeft && !this.isMovingRight) {
      this.currentFrame = 0;
    }

    if (keyIsDown(37)) {
      this.isAimingLeft = true;
    } else {
      this.isAimingLeft = false;
    }

    if (keyIsDown(39)) {
      this.isAimingRight = true;
    } else {
      this.isAimingRight = false;
    }

    if (this.currentFrame === 4) {
      this.currentFrame = 0;
    }
  }

  animate() {
    push();

    translate(this.pos.x - 18, this.pos.y - 13);

    if (
      !this.isMovingRight &&
      !this.isMovingLeft &&
      !this.isAimingLeft &&
      !this.isAimingRight
    ) {
      image(
        playerIdle,
        0,
        -10,
        this.frameWidth / 3,
        this.frameHeight / 3,
        0,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    if (this.isMovingRight) {
      image(
        playerSpriteRight,
        0,
        -10,
        this.frameWidth / 3,
        this.frameHeight / 3,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    if (this.isMovingLeft) {
      image(
        playerSpriteLeft,
        0,
        -10,
        this.frameWidth / 3,
        this.frameHeight / 3,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    if (this.isAimingLeft && !this.isMovingRight) {
      image(
        playerSpriteLeft,
        0,
        -10,
        this.frameWidth / 3,
        this.frameHeight / 3,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    if (this.isAimingRight && !this.isMovingLeft) {
      image(
        playerSpriteRight,
        0,
        -10,
        this.frameWidth / 3,
        this.frameHeight / 3,
        this.currentFrame * this.frameWidth * 4,
        0,
        this.frameWidth,
        this.frameHeight
      );
    }

    pop();
  }
}
