// /**********  Class Object For Player **********/

class Player {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = 0.5;
    this.s = 25;
    this.isGrounded = false;
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

        // Check if the arrow key being held and match the direction with the tile's position
        if (
          keyIsDown(37) &&
          distanceX <= maxDistance &&
          distanceY <= maxDistance * 0.5 &&
          playerCenterX > tileCenterX &&
          (tileToDestroy === null || tileCenterX > tileToDestroy.pos.x)
        ) {
          // Set the tile to the left as the tile to be destroyed if it's the closest one in that direction
          tileToDestroy = tile;
        } else if (
          keyIsDown(39) &&
          distanceX <= maxDistance &&
          distanceY <= maxDistance * 0.5 &&
          playerCenterX < tileCenterX &&
          (tileToDestroy === null || tileCenterX < tileToDestroy.pos.x)
        ) {
          // Set the tile to the right as the tile to be destroyed if it's the closest one in that direction
          tileToDestroy = tile;
        } else if (
          keyIsDown(38) &&
          distanceX <= maxDistance * 0.5 &&
          distanceY <= maxDistance * 1.5 &&
          playerCenterY > tileCenterY &&
          (tileToDestroy === null || tileCenterY > tileToDestroy.pos.y)
        ) {
          // Set the tile above as the tile to be destroyed if it's the closest one in that direction
          tileToDestroy = tile;
        } else if (
          keyIsDown(40) &&
          distanceX <= maxDistance - 10 &&
          distanceY <= maxDistance &&
          playerCenterY < tileCenterY &&
          (tileToDestroy === null || tileCenterY < tileToDestroy.pos.y)
        ) {
          // Set the tile below as the tile to be destroyed if it's the closest one in that direction
          tileToDestroy = tile;
        }
      }
    }

    if (tileToDestroy) {
      const y = tiles.findIndex((row) => row.includes(tileToDestroy));
      const x = tiles[y].indexOf(tileToDestroy);
      tiles[y].splice(x, 1);
    }
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

  jump() {
    // Only allow the player to jump if they are on the ground
    if (this.isGrounded) {
      this.vel.y = -8; // Adjust the jump velocity to control jump height
      this.isGrounded = false; // Set isGrounded to false after jumping
    }
  }

  move() {
    if (keyIsDown(65)) {
      this.pos.x -= 4;
    }

    if (keyIsDown(68)) {
      this.pos.x += 4;
    }

    if (keyIsDown(32)) {
      this.jump();
    }
  }

  update() {
    this.vel.y += this.gravity;
    this.pos.add(this.vel);

    if (this.pos.y === height - this.s) {
      this.isGrounded = true; // Check if the player is on the ground
    }
  }

  animate() {
    push();
    translate(this.pos.x - 25, this.pos.y - 25);
    noStroke();
    fill("yellow");
    /****** HitBox ************/
    rect(this.s, this.s, this.s, this.s);
    pop();
  }
}

function keyPressed() {
  // Check if the "E" key is pressed
  if (keyCode === 69) {
    // Loop through all available tiles
    for (let y = 0; y < tiles.length; y++) {
      if (!tiles[y]) continue;
      for (let x = 0; x < tiles[y].length; x++) {
        const currentTile = tiles[y][x];

        // Check if the current tile is not null or undefined and is being collided with by the player and if the tiles' hitcount is lower than its max hitcount.
        if (
          currentTile &&
          player.hits(currentTile) &&
          currentTile.hits < currentTile.maxHits
        ) {
          // Check if the arrow key is being held and match the direction with the tile's position before incrementing hitcount.
          if (
            (keyIsDown(37) &&
              player.pos.x > currentTile.pos.x &&
              player.pos.y > currentTile.pos.y) ||
            (keyIsDown(39) && player.pos.x < currentTile.pos.x) ||
            (keyIsDown(38) && player.pos.y > currentTile.pos.y) ||
            (keyIsDown(40) && player.pos.y < currentTile.pos.y)
          ) {
            currentTile.hits += 1;
          }
        }

        // Check if the current tiles' hitcount is equal to its max hitcount, destroy it if it returns true and reset the hitcount back to zero.
        if (currentTile && currentTile.hits === currentTile.maxHits) {
          player.destroyTile(tiles);
          currentTile.hits = 0;
        }

        /*  i have experienced a bug where the tiles' hitcount may continue to increment beyond a tiles' max hitcount despite being destroyed. This is 
        likely because the player is colliding with several hitboxes at once, for instance from both the bottom of the player and the right or left. 
        The line of code below checks if the the currentTiles hitcount is equal to or greater than its' maxcount and if it returns true it sets the hitcount 
        back to zero again. */

        if (currentTile && currentTile.hits >= currentTile.maxHits) {
          currentTile.hits = 0;
        }
      }
    }
  }
}
