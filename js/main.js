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

function assetsAreLoaded() {
  // Check if your game assets are loaded here
  return true;
}
