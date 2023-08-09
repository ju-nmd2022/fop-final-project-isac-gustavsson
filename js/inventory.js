class Inventory {
  constructor() {
    this.capacity = 72;
    this.isOpen = false;
    this.resources = [];

    this.infoHelper = infoHelper;
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
    image(this.infoHelper, canvasWidth / 2 - 350, canvasHeight / 2 - 400, 700);
    pop();
  }

  Closed() {
    push();
    translate(canvasWidth / 2, canvasHeight / 2);
    noStroke();
    fill("#eb5e55");
    textSize(20);
    textFont("Bungee");
    text("Press 'P' for information", 375, -415);
    pop();
  }
}
