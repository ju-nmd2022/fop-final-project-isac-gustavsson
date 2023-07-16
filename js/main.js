const canvasWidth = 1800;
const canvasHeight = 950;

const centerX = canvasWidth / 2;
const centerY = -50;

let menuButtonIsClicked = false;

let tiles = [];

let enemies = [];
let gravel;
let player;

let inventory;

// main menu and loading screen //

let menuButton = document.getElementById("start-button");
document.getElementById("main-menu").style.display = "none";
document.getElementById("loading-screen").style.display = "none";

menuButton.addEventListener("click", () => {
  menuButtonIsClicked = true;
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("loading-screen").style.display = "block";
});

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);

  player = new Player(centerX, centerY);
  inventory = new Inventory();

  tileCols = Math.ceil(centerX * 50);
  tileRows = Math.ceil(centerY * 50);

  tiles = Array.from({ length: tileRows }, () =>
    Array.from({ length: tileCols })
  );
}

function loadRadius(centerX, centerY, radius) {
  const startRow = Math.ceil((centerY - radius / 2) / 50) + 1;
  const endRow = Math.ceil((centerY + radius) / 50);

  let startCol, endCol;
  let removeStartCol, removeEndCol;
  let removeStartRow, removeEndRow;

  for (let i = startRow; i <= endRow; i++) {
    // Check if the row exists, otherwise create a new row
    if (!tiles[i]) {
      tiles[i] = Array.from({ length: tileCols });
    }
  }

  if (player.isMovingRight) {
    // Add tiles when the player is moving to the right (x++)
    startCol = Math.max(0, Math.floor((centerX - radius) / 50));
    endCol = Math.min(
      tiles[0].length - 1,
      Math.ceil((centerX + radius - player.vel.x) / 50)
    );

    // Remove tiles outside the radius in the opposite direction (to the left)
    removeStartCol = 0;
    removeEndCol = Math.max(0, Math.floor((centerX - radius) / 50) - 1);
    for (let i = startRow; i <= endRow; i++) {
      for (let j = removeStartCol; j <= removeEndCol; j++) {
        tiles[i][j] = null;
      }
    }

    // Handle tile generation when player is moving to the left.
  } else if (player.isMovingLeft) {
    // Add tiles when the player is moving to the left (x--)
    startCol = Math.max(0, Math.floor((centerX - radius - player.vel.x) / 50));
    endCol = Math.min(tiles[0].length - 1, Math.ceil((centerX + radius) / 50));

    // Remove tiles outside the radius in the opposite direction (to the right)
    removeStartCol = Math.min(
      tiles[0].length - 1,
      Math.ceil((centerX + radius) / 50) + 1
    );
    removeEndCol = tiles[0].length - 1;

    for (let i = startRow; i <= endRow; i++) {
      for (let j = removeStartCol; j <= removeEndCol; j++) {
        tiles[i][j] = null;
      }
    }
  } else {
    // Not moving horizontally
    startCol = Math.max(0, Math.floor((centerX - radius) / 50));
    endCol = Math.min(tiles[0].length - 1, Math.ceil((centerX + radius) / 50));
  }

  if (player.pos.y > player.lastPositionY) {
    // Player is moving down
    removeStartRow = Math.ceil((centerY - radius - player.vel.y) / 50) + 1;
    removeEndRow = Math.ceil((centerY + radius) / 50) - 1;
  } else if (player.pos.y <= player.lastPositionY) {
    removeStartRow = Math.ceil((centerY + radius) / 50);
    removeEndRow = Math.floor((centerY - radius) / 50);
  }

  for (let i = startRow; i <= endRow; i++) {
    for (let j = removeStartCol; j <= removeEndCol; j++) {
      tiles[i][j] = null;
    }
  }

  for (let i = removeStartRow; i <= removeEndRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      tiles[i][j] = null;
    }
  }

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      const tile = tiles[i][j];

      if (tile) {
        tile.animate(inventory);
        player.hits(tile);
      } else {
        const x = j * 50;
        const y = i * 50;
        const noiseValue = noise(x / 100, y / 100);

        let tileType = "";

        if (i === 0) {
          tileType = gt0;
        } else if (noiseValue < 0.9 && noiseValue > 0.7) {
          tileType = gt0;
        } else if (noiseValue < 0.7 && noiseValue > 0.5) {
          tileType = ct;
        } else if (noiseValue < 0.5 && noiseValue > 0.4) {
          tileType = st;
        } else if (noiseValue < 0.4 && noiseValue > 0.39) {
          tileType = gt1;
        }

        if (i >= 0 && tileType !== "") {
          tiles[i][j] = new tileType(x, y);
        } else if (tileType === "" && noiseValue < 0.01) {
          enemies.push(new Enemy(x, y));
        }
      }
    }
  }
}

function draw() {
  clear();
  background("#2E4057");

  push();

  translate(canvasWidth / 2 - player.pos.x, canvasHeight / 6 - player.pos.y);

  for (const row of tiles) {
    for (const tile of row) {
      if (tile) {
        for (const enemy of enemies) {
          //  Update enemy / tile object relations.
          enemy.hits(tile);
        }
      }
    }
  }

  // Update the player functions
  player.animate();
  player.move();
  player.update();

  for (const enemy of enemies) {
    enemy.animate();
    enemy.update();
    enemy.alertedByPlayer(player);
  }

  loadRadius(player.pos.x, player.pos.y, 400);

  // Update the enemy functions

  pop();

  if (inventory.isOpen === false) {
    inventory.Closed();
  }

  if (inventory.isOpen === true) {
    inventory.Open();
  }
}

function keyPressed() {
  // SECTION 1 - PLAYER HIT DETECTION AND DESTRUCTION //

  // Check if the "E" key is pressed
  if (keyIsDown(69)) {
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
            (keyIsDown(38) && player.hitsTop && player.hits(currentTile)) ||
            (keyIsDown(39) && player.pos.x < currentTile.pos.x) ||
            (keyIsDown(40) && player.pos.y < currentTile.pos.y)
          ) {
            currentTile.hits += 1;
          }
        }

        // Check if the current tiles' hitcount is equal to its max hitcount, destroy it if it returns true and reset the hitcount back to zero.

        if (currentTile && currentTile.hits === currentTile.maxHits) {
          player.destroyTile(tiles);
          currentTile.hits = 0;
          currentTile.isDestroyed = true;

          if (inventory.resources.length < inventory.capacity) {
            if (currentTile instanceof gt0) {
              inventory.addResources(new Grass());
            } else if (currentTile instanceof ct) {
              inventory.addResources(new Clay());
            } else if (currentTile instanceof st) {
              inventory.addResources(new Stone());
            } else if (currentTile instanceof gt1) {
              inventory.addResources(new Gold());
            }
          }
        }
      }
    }
  }

  // SECTION 2 - INVENTORY //

  if (keyCode === 80) {
    inventory.toggleShow();
  }

  // SECTION 3 - RESOURCES //

  return false;
}

function assetsAreLoaded() {
  // Check if your game assets are loaded here
  // For example, you could check if a specific image or audio file has been loaded
  // You can use preloading techniques or check the status of individual assets
  // Return true if all assets are loaded, otherwise return false
  // Example implementation:
  // if (gameImage.isLoaded && gameAudio.isLoaded) {
  //   return true;
  // } else {
  //   return false;
  // }
}
