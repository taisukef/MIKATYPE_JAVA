import { Dimension, Insets } from "./likeJ.js";

export class Graphics {
  constructor(ctx) {
    this.ctx = ctx;
  }
  fillRect(x, y, w, h) {
    //this.ctx.fillRect(x, y, w, h);
  }
  drawString(s, x, y) {
    console.log(s);
  }
  setColor(color) {

  }
  setFont(font) {

  }
  dispose() {

  }
}

// JFrame like
export function getGraphics() {
  return new Graphics();
}
const size = new Dimension();
export function setSize(w, h) {
  size.width = w;
  size.height = h;
}
export function getSize() {
  return size;
}
export function getInsets() {
  return new Insets(10, 10, 10, 10);
}
