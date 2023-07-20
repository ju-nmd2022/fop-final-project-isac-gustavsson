class Tile {
  constructor(x, y, maxHits, resources) {
    this.pos = createVector(x, y);
    this.s = 50;
    this.hits = 0;
    this.maxHits = maxHits;
    this.resources = resources;
    this.isDestroyed = false;
    this.grass = grass;
  }
}

// gt0 = grass tile.

class gt0 extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 1;
  }

  animate(inventory) {
    push();
    translate(this.pos.x - 14, this.pos.y - 13);
    stroke("#2E4057");
    image(this.grass, 0, 0, this.s, this.s, 0, 0, this.s * 1.5, this.s * 2);
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
    translate(this.pos.x - 12.5, this.pos.y - 12.5);
    stroke("#2E4057");
    fill("#977B5E");
    rect(0, 0, this.s, this.s);
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
    translate(this.pos.x - 12.5, this.pos.y - 12.5);
    stroke("#2E4057");
    fill("#B3B9BD");
    rect(0, 0, this.s, this.s);
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
    translate(this.pos.x - 12.5, this.pos.y - 12.5);
    stroke("#2E4057");
    fill("#FAC05E");
    rect(0, 0, this.s, this.s);
    pop();
  }
}
