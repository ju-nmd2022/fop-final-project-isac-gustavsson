const canvasWidth = 1800;
const canvasHeight = 950;

let menuButtonIsClicked = false;

let mapIndex = 0; // Player starts on map 0

let tiles = [];
let tileCols = 0;
let tileRows = 0;

let enemies = [];
let gravel;
let player;

let inventory;

function preload() {
  gravel = loadImage("img/gravel.png");
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);

  player = new Player(canvasWidth / 2, -50);
  inventory = new Inventory();

  const centerX = canvasWidth / 2;
  const centerY = -50;

  tileCols = Math.ceil((canvasWidth / 2) * 50);
  tileRows = Math.ceil(canvasHeight / 150);

  tiles = Array.from({ length: tileRows }, () =>
    Array.from({ length: tileCols })
  );
}

function loadRadius(centerX, centerY, radius) {
  const startRow = Math.ceil(0, Math.floor(centerY - radius) / 50);
  const endRow = Math.max(tiles.length - 1, Math.ceil((centerY + radius) / 50));

  let startCol, endCol;

  for (let i = startRow; i <= endRow; i++) {
    // Check if the row exists, otherwise create a new row
    if (!tiles[i]) {
      tiles[i] = Array.from({ length: tileCols });
    }
  }

  if (player.vel.x > 0) {
    // Moving to the right (x++)
    startCol = Math.max(0, Math.floor((centerX - radius) / 50));
    endCol = Math.min(
      tiles[0].length - 1,
      Math.ceil((centerX + radius - player.vel.x) / 50)
    );
  } else if (player.vel.x < 0) {
    // Moving to the left (x--)
    startCol = Math.max(0, Math.floor((centerX - radius - player.vel.x) / 50));
    endCol = Math.min(tiles[0].length - 1, Math.ceil((centerX + radius) / 50));
  } else {
    // Not moving horizontally
    startCol = Math.max(0, Math.floor((centerX - radius) / 50));
    endCol = Math.min(tiles[0].length - 1, Math.ceil((centerX + radius) / 50));
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
        if (tileType !== "") {
          tiles[i][j] = new tileType(x, y);
        }

        if (enemies.length < 1 && tileType === "") {
          enemies.push(new Enemy(x, y));
        }
      }
    }
  }
}

// Hide the main menu and show the loading screen //

let menuButton = document.getElementById("start-button");
document.getElementById("main-menu").style.display = "none";
document.getElementById("loading-screen").style.display = "none";

menuButton.addEventListener("click", () => {
  menuButtonIsClicked = true;
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("loading-screen").style.display = "block";
});

function draw() {
  clear();
  background("#2E4057");

  push();

  translate(canvasWidth / 2 - player.pos.x, canvasHeight / 4 - player.pos.y);

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

  // Update the enemy functions

  for (const enemy of enemies) {
    enemy.animate();
    enemy.update();
    enemy.alertedByPlayer(player);
    // player.hits(enemy);
    // enemy.hits(player);
  }

  loadRadius(player.pos.x, player.pos.y, 300);

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
            (keyIsDown(39) && player.pos.x < currentTile.pos.x) ||
            (keyIsDown(38) && player.pos.y - player.s > currentTile.pos.y) ||
            (keyIsDown(40) && player.pos.y < currentTile.pos.y)
          ) {
            currentTile.hits += 1;
          }
        }

        // Check if the current tiles' hitcount is equal to its max hitcount, destroy it if it returns true and reset the hitcount back to zero.
        if (currentTile && currentTile.hits === currentTile.maxHits) {
          player.destroyTile(tiles);
          currentTile.hits = 0;

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

  // SECTION 2 - INVENTORY //

  if (keyCode === 80) {
    inventory.toggleShow();
  }

  // SECTION 3 - RESOURCES //

  return false;
}

function assetsAreLoaded() {
  // Check if your game assets are loaded here
  return true;
}
