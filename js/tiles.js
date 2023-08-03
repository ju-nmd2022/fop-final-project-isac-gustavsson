class Tile {
  constructor(x, y, maxHits, resources) {
    this.pos = createVector(x, y);
    this.s = 50;
    this.hits = 0;
    this.maxHits = maxHits;
    this.resources = resources;
    this.isDestroyed = false;
    this.isNotATile = false;

    this.grass = loadImage("assets/grass.png");
    this.gravel = loadImage("assets/gravel.png");
    this.stone = loadImage("assets/stonetile.png");
    this.gold = loadImage("assets/goldtile.png");
  }
}

class Emptile extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = null;
    this.isNotATile = true;
  }

  animate(inventory) {
    push();
    translate(this.pos.x - 14, this.pos.y - 14);
    noStroke();
    noFill();
    rect(0.3, -0.2, this.s + 0.05, this.s + 0.06);

    pop();
  }
}

// gt0 = grass tile.

class gt0 extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 2;
  }

  animate(inventory) {
    push();
    translate(this.pos.x - 14, this.pos.y - 14);
    image(this.grass, 0, 0, this.s + 0.5, this.s);
    pop();
  }
}

// ct = clay tile.

class ct extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 2;
  }

  animate(inventory) {
    push();
    translate(this.pos.x - 14, this.pos.y - 14);
    noStroke();
    image(this.gravel, 0.1, -0.5, this.s + 0.5, this.s + 0.6);
    pop();
  }
}

// st = stone tile.

class st extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 3;
  }

  animate(inventory) {
    push();
    translate(this.pos.x - 14, this.pos.y - 14);
    noStroke();
    image(
      this.stone,
      0.1,
      -0.5,
      this.s + 0.5,
      this.s + 0.6,
      0,
      0,
      this.stone.width,
      this.stone.height
    );

    pop();
  }
}

// gt1 = gold tile.

class gt1 extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 8;
  }

  animate(inventory) {
    push();
    translate(this.pos.x - 14, this.pos.y - 14);
    noStroke();
    image(
      this.gold,
      0.1,
      -0.5,
      this.s + 0.5,
      this.s + 0.6,
      0,
      0,
      this.gold.width,
      this.gold.height
    );

    pop();
  }
}
