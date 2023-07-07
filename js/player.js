// /**********  Class Object For Player **********/

class Player {
  constructor(x, y, s) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = 0.5;
    this.s = 25;
    this.isGrounded = false;
  }

  alerted(enemy) {
    let distance = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
    let threshold = 150;

    if (distance < threshold) {
      // Player is within the proximity threshold, perform actions here
      // For example, you can change the enemy's behavior or trigger an event
      // when the player is close to the enemy
      // console.log("Player is within proximity of enemy!");
    }
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
          distanceX <= maxDistance - 10 &&
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
      this.pos.x -= 5;
    }

    if (keyIsDown(68)) {
      this.pos.x += 5;
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
    translate(this.pos.x - this.s / 2, this.pos.y - this.s / 2);
    noStroke();
    fill("yellow");
    /****** HitBox ************/
    rect(0, 0, this.s, this.s);
    pop();
  }
}
