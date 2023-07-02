class Tile {
  constructor(x, y, s, maxHits, resources) {
    this.pos = createVector(x, y);
    this.s = s;
    this.hits = 0;
    this.maxHits = maxHits;
    this.resources = resources;
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
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#4A824A");
    rect(this.s - 50, this.s - 50, this.s, this.s);
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
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#977B5E");
    rect(this.s - 50, this.s - 50, this.s, this.s);
    pop();
  }
}

// st = stone tile.

class st extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 4;
  }

  animate(inventory) {
    push();
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#B3B9BD");
    rect(this.s - 50, this.s - 50, this.s, this.s);
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
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#FAC05E");
    rect(this.s - 50, this.s - 50, this.s, this.s);
    pop();
  }
}
