import { Dimension, Insets } from "./likeJ.js";

export class Graphics {
  constructor(ctx) {
    this.ctx = ctx;
  }
  fillRect(x, y, w, h) {
    this.ctx.fillRect(x, y, w, h);
  }
  drawString(s, x, y) {
    this.ctx.fillText(s, x, y);
  }
  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
  setColor(c) {
		const col = "rgba(" + c.r + "," + c.g + "," + c.b + ")";
		this.ctx.fillStyle = col;
		this.ctx.strokeStyle = col;
  }
  setFont(font) {
  }
  dispose() {

  }
}

export class KeyAdapter {
}

// JFrame like
const size = new Dimension();
let canvas;
let g;
export function setSize(w, h) {
  size.width = w;
  size.height = h;
  canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ratio = 1;
  canvas.style.width = (w * ratio) + "px";
  canvas.style.height = (h * ratio) + "px";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  g = new Graphics(ctx);
}
export function getSize() {
  return size;
}
export function getInsets() {
  return new Insets(10, 10, 10, 10);
}
export function getGraphics() {
  return g;
}
export function addKeyListener(listener) {
  document.body.onkeydown = (e) => {
    listener.keyPressed({ getKeyChar: () => e.keyCode });
  };
}
