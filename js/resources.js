class Resource {
  constructor(type, quantity) {
    this.type = type;
    this.quantity = quantity;
  }
}

class Grass extends Resource {
  constructor() {
    super("grass", 1);
  }

  animate() {
    push();
    noStroke();
    fill("green");
    rect(canvasWidth / 2 - 300, canvasHeight / 2 - 300, 50);
    pop();
  }
}

class Clay extends Resource {
  constructor() {
    super("clay", 1);
  }

  animate() {
    push();
    noStroke();
    fill("#977B5E");
    rect(canvasWidth / 2 - 300, canvasHeight / 2 - 300, 50);
    pop();
  }
}

class Stone extends Resource {
  constructor() {
    super("stone", 1);
  }

  animate() {
    push();
    noStroke();
    fill("gray");
    rect(canvasWidth / 2 - 300, canvasHeight / 2 - 300, 50);
    pop();
  }
}

class Gold extends Resource {
  constructor() {
    super("gold", 1);
  }

  animate() {
    push();
    noStroke();
    fill("#FAC05E");
    rect(canvasWidth / 2 - 300, canvasHeight / 2 - 300, 50);
    pop();
  }
}
