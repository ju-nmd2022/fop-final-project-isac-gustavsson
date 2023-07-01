const TILESIZE = 50;
const canvasWidth = 1800;
const canvasHeight = 800;

let tiles = [];
let inventory;
let menuButtonIsClicked = false;
let gravel;

let mapIndex = 0; // Player starts on map 0

function preload() {
  gravel = loadImage("img/gravel.png");
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  player = new Player(canvasWidth / 2, -TILESIZE - 150);
  inventory = new Inventory();

  const tileCols = maps[mapIndex][0].length;
  const tileRows = maps[mapIndex].length;

  tiles = Array.from({ length: tileRows }, () =>
    Array.from({ length: tileCols })
  );

  for (let i = 0; i < tileRows; i++) {
    for (let j = 0; j < tileCols; j++) {
      const tileType = maps[mapIndex][i][j];
      if (tileType && tileType !== " ") {
        // check if tileType is not null or undefined
        const x = j * TILESIZE;
        const y = i * TILESIZE;
        tiles[i][j] = new tileType(x, y, TILESIZE);
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
  // Hide the loading screen //

  // if (assetsAreLoaded() && menuButtonIsClicked) {
  //   document.getElementById("main-menu").style.display = "none";
  //   document.getElementById("loading-screen").style.display = "none";
  // }

  // Call switchToNextMap when player finishes current map

  clear();
  background("#2E4057");

  push();

  translate(canvasWidth / 2 - player.pos.x, windowHeight / 2 - player.pos.y);

  for (const row of tiles) {
    for (const tile of row) {
      if (tile) {
        tile.animate();
        if (player.hits(tile)) {
          // Handle tile collision
        }
      }
    }
  }

  player.animate();
  player.move();
  player.update();

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

  // SECTION 2 - INVENTORY //

  if (keyCode === 80) {
    inventory.toggleShow();
  }

  return false;
}

function assetsAreLoaded() {
  // Check if your game assets are loaded here
  return true;
}
