
class Target {
  constructor() {    
    this.pos = createVector(30,30);
  }

  // Draw the pipe
  show() {
    stroke(255);
    fill(200);
    circle(this.pos.x, this.pos.y, 10);
  }

}