const canvasWidth = 1800;
const canvasHeight = 950;

const centerX = canvasWidth / 2;
const centerY = -50;

let menuButtonIsClicked = false;

let tiles = [];

let enemies = []; // Array to store enemy objects.
let spawnedEnemies = []; // Array to store enemy spawn positions.
let maxEnemies = 20;
let player;

let inventory;

// variables for image-handling

let PlayerIdle;
let playerSpriteUp;
let playerSpriteDown;
let playerSpriteRight;
let playerSpriteLeft;
let hitDownSprite;
let hitRightSprite;
let hitLeftSprite;

let batIdle;
let batSheet;
let batSheetAlert;

let SpiderSheet;

let currentFrame;
const frameDelay = 8;

let grass;
let gravel;
let stone;
let gold;

let zoomFactor = 2.5;

// main menu and loading screen //

let menuButton = document.getElementById("start-button");
document.getElementById("main-menu").style.display = "none";
document.getElementById("loading-screen").style.display = "none";

menuButton.addEventListener("click", () => {
  menuButtonIsClicked = true;
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("loading-screen").style.display = "block";
});

function preload() {
  grass = loadImage("assets/grass.png");
  gravel = loadImage("assets/gravel.png");
  stone = loadImage("assets/stonetile.png");
  gold = loadImage("assets/goldtile.png");

  PlayerIdle = loadImage("assets/PlayerIdle.png");
  playerSpriteRight = loadImage("assets/playerRight.png");
  playerSpriteLeft = loadImage("assets/playerLeft.png");
  playerSpriteUp = loadImage("assets/playerUp.png");
  playerSpriteDown = loadImage("assets/playerDown.png");
  hitDownSprite = loadImage("assets/hitDown.png");
  hitRightSprite = loadImage("assets/hitRight.png");
  hitLeftSprite = loadImage("assets/hitLeft.png");

  batSheet = loadImage("assets/batSheet.png");
  batSheetAlert = loadImage("assets/batSheetAlert.png");

  SpiderSheet = loadImage("assets/SpiderSheet.png");
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);

  player = new Player(centerX, centerY);
  inventory = new Inventory();

  tileCols = Math.ceil(centerX * 20);
  tileRows = Math.ceil(centerY * 100);

  tiles = Array.from({ length: tileRows }, () =>
    Array.from({ length: tileCols })
  );
}

function loadRadius(centerX, centerY, radius) {
  const startRow = Math.floor((0, centerY - radius / 3) / 50);
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
    removeEndCol = Math.max(-1, Math.floor((centerX - radius) / 50) - 1);

    for (let i = startRow; i <= endRow; i++) {
      for (let j = removeStartCol; j <= removeEndCol; j++) {
        tiles[i][j] = null;
      }
    }
  } else if (player.isMovingLeft) {
    // Add tiles when the player is moving to the left (x--)
    startCol = Math.max(0, Math.floor((centerX - radius) / 50));
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

  if (player.vel.y > 0) {
    // Remove tiles above the radius when the player is moving downwards (y++)
    const removeStartRow = Math.max(1, Math.floor((centerY - radius) / 50));
    const removeEndRow = Math.max(
      0,
      Math.floor((centerY - radius / 4) / 50) - 1
    );

    for (let i = removeStartRow; i <= removeEndRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        tiles[i][j] = null;
      }
    }
  } else if (player.vel.y < 0) {
    // Remove tiles below the radius when the player is moving upwards (y--)
    removeStartRow = Math.min(
      tiles.length - 1,
      Math.ceil((centerY + radius) / 50) + 1
    );
    removeEndRow = tiles.length - 1;

    for (let i = removeStartRow; i <= removeEndRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        tiles[i][j] = null;
      }
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

        let tileType = Emptile;

        if (i === 0) {
          tileType = gt0;
        } else if (noiseValue < 0.9 && noiseValue > 0.45) {
          tileType = ct;
        } else if (noiseValue < 0.5 && noiseValue > 0.4) {
          tileType = st;
        } else if (noiseValue < 0.4 && noiseValue > 0.39) {
          tileType = gt1;
        }

        if (i >= 0 && tileType !== "" && !tileType.isDestroyed) {
          tiles[i][j] = new tileType(x, y);
        }

        if (
          i > 0 &&
          tileType === Emptile &&
          spawnedEnemies.length < maxEnemies &&
          noiseValue < 0.4 &&
          !tileType.isDestroyed
        ) {
          spawnedEnemies.push({ x, y });
          enemies.push(new Spider(x, y));
        }
      }
    }
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
              player.pos.y > currentTile.pos.y &&
              !player.hitsTop) ||
            (keyIsDown(38) &&
              player.hitsTop &&
              player.hits(currentTile) &&
              !currentTile.isDestroyed &&
              !currentTile.isNotATile) ||
            (keyIsDown(39) &&
              player.pos.x < currentTile.pos.x &&
              player.pos.y > currentTile.pos.y &&
              !player.hitsTop) ||
            (keyIsDown(40) &&
              player.pos.y < currentTile.pos.y &&
              player.pos.x > currentTile.pos.x &&
              player.pos.x + player.s < currentTile.pos.x + currentTile.s)
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

function draw() {
  clear();
  background("#222E4F");

  if (player.pos.y >= 100) {
    background(0, 0, 0, 150);
  }

  push();

  translate(
    canvasWidth / 2 - player.pos.x * zoomFactor,
    canvasHeight / 2.5 - player.pos.y * zoomFactor
  );

  scale(zoomFactor);

  for (const row of tiles) {
    for (const tile of row) {
      if (tile && !(tile instanceof Emptile)) {
        for (const enemy of enemies) {
          //  Update enemy / tile object relations.

          if (enemy.hits(tile)) {
            enemy.isGrounded = true;
          }
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

  loadRadius(player.pos.x, player.pos.y, 500);

  // Update the enemy functions

  pop();

  if (inventory.isOpen === false) {
    inventory.Closed();
  }

  if (inventory.isOpen === true) {
    inventory.Open();
  }
}
