class Inventory {
  constructor() {
    this.capacity = 72;
    this.isOpen = false;
    this.resources = [];
  }

  addResources(resources) {
    this.resources.push(resources);
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

    const gridSize = 70;
    const startX = canvasWidth / 2 - 875;
    const startY = canvasHeight / 2 - 375;

    for (let i = 0; i < this.resources.length; i++) {
      const resource = this.resources[i];
      const row = Math.floor(i / 8);
      const col = i % 8;

      const xPos = startX + col * gridSize;
      const yPos = startY + row * gridSize;

      if (row < 8 && col < 8) {
        push();
        translate(xPos, yPos);
        resource.animate();
        pop();
      } else return false;
    }
  }

  Closed() {
    push();
    noStroke();
    fill("#4B3B40");
    rect(canvasWidth / 2 + 800, canvasHeight / 2 - 350, 50);
    pop();
  }
}
