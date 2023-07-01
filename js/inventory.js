class Inventory {
  constructor() {
    this.items = [];
    this.capacity = 5;
    this.isOpen = false;
  }

  toggleShow() {
    if (this.isOpen === false) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  Open() {
    push();
    noStroke();
    fill("#4B3B40");
    rect(canvasWidth / 2 - 300, canvasHeight / 2 - 300, 600);
    pop();
  }

  Closed() {
    push();
    noStroke();
    fill("#4B3B40");
    rect(canvasWidth / 2 + 800, canvasHeight / 2 - 350, 50);
    pop();
  }
}

function keyPressed() {
  if (keyCode === 80) {
    inventory.toggleShow();
  }
}
