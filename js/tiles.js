class Tile {
  constructor(x, y, s, maxHits) {
    this.pos = createVector(x, y);
    this.s = s;
    this.hits = 0;
    this.maxHits = maxHits;
  }
}

// gt0 = grass tile.

class gt0 extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 1;
  }

  animate = () => {
    push();
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#4A824A");
    rect(this.s - 50, this.s - 50, this.s, this.s);
    pop();
  };
}

// mt = mud tile.

class mt extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 2;
    this.img = gravel;
  }

  animate = () => {
    push();
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#965222");
    rect(this.s - 50, this.s - 50, this.s, this.s);
    pop();
  };
}

// st = stone tile.

class st extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 4;
  }

  animate = () => {
    push();
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#B3B9BD");
    rect(this.s - 50, this.s - 50, this.s, this.s);
    pop();
  };
}

// gt1 = gold tile.

class gt1 extends Tile {
  constructor(x, y, s) {
    super(x, y, s);
    this.maxHits = 8;
  }

  animate = () => {
    push();
    translate(this.pos.x, this.pos.y);
    stroke("#2E4057");
    fill("#FAC05E");
    rect(this.s - 50, this.s - 50, this.s, this.s);
    pop();
  };
}
