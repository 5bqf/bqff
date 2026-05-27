/* ================================================================
   Math Utils — 插值、钳制、弹簧物理、爱心曲线
   ================================================================ */

// --- 基础数学 ---
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

// --- 弹簧物理 ---
class Spring {
  constructor(config = {}) {
    this.tension = config.tension || 170;
    this.friction = config.friction || 26;
    this.precision = config.precision || 0.01;
    this.position = config.from || 0;
    this.target = config.to !== undefined ? config.to : this.position;
    this.velocity = 0;
  }

  setTarget(target) {
    this.target = target;
  }

  update(dt) {
    const force = (this.target - this.position) * this.tension;
    const damping = -this.velocity * this.friction;
    this.velocity += (force + damping) * dt;
    this.position += this.velocity * dt;

    if (Math.abs(this.target - this.position) < this.precision
        && Math.abs(this.velocity) < this.precision) {
      this.position = this.target;
      this.velocity = 0;
      return true; // at rest
    }
    return false;
  }

  snap() {
    this.position = this.target;
    this.velocity = 0;
  }
}

// --- 爱心曲线生成 ---
function generateHeartCurve(numPoints = 200) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x, y });
  }
  // 归一化到 [-1, 1]
  const maxDim = Math.max(
    ...points.map(p => Math.max(Math.abs(p.x), Math.abs(p.y)))
  );
  return points.map(p => ({ x: p.x / maxDim, y: p.y / maxDim }));
}

// 缩放爱心到指定尺寸并居中
function scaleHeartToFit(heartPoints, cx, cy, radiusX, radiusY) {
  return heartPoints.map(p => ({
    x: cx + p.x * radiusX,
    y: cy + p.y * (radiusY || radiusX),
  }));
}

// --- 缓动函数 ---
const Easing = {
  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
};
