String.valueOf = (s) => s;
String.format = (f, val) => {
  if (f.indexOf("%s") >= 0) {
    f = f.replace("%s", val);
  } else if (f.indexOf("%2.0f") >= 0) {
    f = f.replace("%2.0f", val.toFixed(2));
  } else if (f.indexOf("%6.1f") >= 0) {
    f = f.replace("%6.1f", val.toFixed(1));
  } else if (f.indexOf("%5.2f") >= 0) {
    f = f.replace("%5.2f", val.toFixed(1));
  } else if (f.indexOf("%4d") >= 0) {
    f = f.replace("%4d", val); // 4 chars
  } else if (f.indexOf("%3d") >= 0) {
    f = f.replace("%3d", val); // 4 chars
  } else if (f.indexOf("%") >= 0) {
    throw new Error(f + " " + val);
  }
  return f;
};
export class System {
  static currentTimeMillis() {
    return performance.now();
  }
}
export class Timer {
  schedule(timertask, msec) {

  }
  scheduleAtFixedRate(timertask, firstmsec, intervalmsec) {
    const f = () => {
      timertask.run();
      timertask.tid = setTimeout(f, intervalmsec);
    };
    timertask.tid = setTimeout(f, firstmsec);
  }
}
export class TimerTask {
  run() {
  }
  cancel() {
    clearTimeout(this.tid);
  }
}
export class Random {
  nextInt(n) {
    return Math.floor(Math.random() * n);
  }
}
export class Dimension {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}
export class Insets {
  constructor(left, right, top, bottom) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }
}
export class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  static white = new Color(255, 255, 255);
  static red = new Color(255, 0, 0);
  static black = new Color(0, 0, 0);
}
export class Toolkit {
  static getDefaultToolkit() {
    return new Toolkit();
  }
  getScreenSize() {
    return new Dimension(800, 600);
  }
}
export class Font {
  constructor(name, type, size) {
    this.name = name;
    this.type = type;
    this.size = size;
  }
}

// array
export function newInt(n) {
  return new Array(n);
}
export function newChar(n, m) {
  const res = new Array(n);
  if (m !== undefined) {
    for (let i = 0; i < n; i++) {
      res[i] = new Array(m);
    }
  }
  return res;
}
