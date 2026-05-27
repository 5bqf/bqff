/* ================================================================
   Particle System — 粒子类 + 粒子系统引擎
   基于 d:/出图/portfolio/script.js 的粒子网络模式改造
   ================================================================ */

// 随机颜色（暖色系）
const WARM_COLORS = [
  '#FFB3C6', '#FFD1DC', '#FFE5B4', '#FFC0CB',
  '#F8C8D8', '#FDE0E8', '#FFF0D0', '#FFDDE4',
  '#FFACC0', '#E8A0B4',
];

function randomWarmColor() {
  return WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)];
}

class Particle {
  constructor(w, h) {
    this.reset(w, h);
  }

  reset(w, h) {
    this.x = Math.random() * (w || 400);
    this.y = Math.random() * (h || 700);
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = 0.8 + Math.random() * 2.5;
    this.opacity = 0.15 + Math.random() * 0.5;
    this.color = randomWarmColor();
    this.targetX = null;
    this.targetY = null;
    this.attractStrength = 0;
  }

  update(w, h) {
    if (this.targetX !== null && this.targetY !== null) {
      // 向目标移动 (弹簧力)
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.vx += dx * this.attractStrength;
      this.vy += dy * this.attractStrength;
    }

    // 阻尼
    this.vx *= 0.94;
    this.vy *= 0.94;

    // 微小随机力 (布朗运动)
    this.vx += (Math.random() - 0.5) * 0.08;
    this.vy += (Math.random() - 0.5) * 0.08;

    this.x += this.vx;
    this.y += this.vy;

    // 环绕边界
    if (this.x < -20) this.x = w + 20;
    if (this.x > w + 20) this.x = -20;
    if (this.y < -20) this.y = h + 20;
    if (this.y > h + 20) this.y = -20;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    // 内层光晕
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.4, this._lightenColor(this.color, 0.5));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();
    // 核心亮点
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = this.opacity * 0.8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _lightenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const lr = Math.min(255, Math.floor(r + (255 - r) * factor));
    const lg = Math.min(255, Math.floor(g + (255 - g) * factor));
    const lb = Math.min(255, Math.floor(b + (255 - b) * factor));
    return `rgb(${lr},${lg},${lb})`;
  }

  // 设置目标位置（用于汇聚阶段）
  setTarget(tx, ty, strength = 0.02) {
    this.targetX = tx;
    this.targetY = ty;
    this.attractStrength = strength;
  }

  clearTarget() {
    this.targetX = null;
    this.targetY = null;
    this.attractStrength = 0;
  }
}

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    const displayW = options.width || canvas.clientWidth || window.innerWidth;
    const displayH = options.height || canvas.clientHeight || window.innerHeight;
    const { ctx, width, height } = initHiDPICanvas(canvas, displayW, displayH);
    this.ctx = ctx;
    this.w = width;
    this.h = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.count = options.count || 200;
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(new Particle(this.w, this.h));
    }

    this.connectionDistance = options.connectionDistance || 120;
    this.mouseRadius = options.mouseRadius || 180;
    this.mouseX = null;
    this.mouseY = null;

    this.running = true;
    this.lastFrame = 0;
    this.fpsCap = options.fpsCap || 60;
    this.frameInterval = 1000 / this.fpsCap;

    this._loop = this._loop.bind(this);
    this._loop();
  }

  _loop(timestamp) {
    if (!this.running) return;

    if (timestamp - this.lastFrame >= this.frameInterval) {
      this.lastFrame = timestamp;
      this.update();
      this.draw();
    }
    requestAnimationFrame(this._loop);
  }

  update() {
    for (const p of this.particles) {
      p.update(this.w, this.h);
    }
  }

  draw() {
    const { ctx, w, h, particles } = this;
    clearCanvas(ctx, w, h);

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(ctx);

      // 绘制连接线
      for (let j = i + 1; j < particles.length; j++) {
        const d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        if (d < this.connectionDistance) {
          const alpha = (1 - d / this.connectionDistance) * 0.08;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#E8A0B4';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // 鼠标交互
    if (this.mouseX !== null && this.mouseY !== null) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.mouseX, this.mouseY, this.mouseRadius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, this.mouseRadius
      );
      gradient.addColorStop(0, 'rgba(255, 180, 200, 0.08)');
      gradient.addColorStop(1, 'rgba(255, 180, 200, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
  }

  attractToPoint(x, y, radius = 160) {
    for (const p of this.particles) {
      const d = dist(p.x, p.y, x, y);
      if (d < radius) {
        const strength = (1 - d / radius) * 0.04;
        p.vx += (x - p.x) * strength;
        p.vy += (y - p.y) * strength;
      }
    }
  }

  setMouse(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }

  clearMouse() {
    this.mouseX = null;
    this.mouseY = null;
  }

  // 所有粒子汇聚到目标点数组
  convergeToTargets(targets, strength = 0.03) {
    for (let i = 0; i < this.particles.length; i++) {
      const t = targets[i % targets.length];
      this.particles[i].setTarget(t.x, t.y, strength);
    }
  }

  // 爆发：给所有粒子随机速度
  burst(force = 8) {
    for (const p of this.particles) {
      const angle = Math.random() * Math.PI * 2;
      const speed = force * (0.5 + Math.random());
      p.vx += Math.cos(angle) * speed;
      p.vy += Math.sin(angle) * speed;
      p.clearTarget();
    }
  }

  resize(displayW, displayH) {
    this.w = displayW;
    this.h = displayH;
    this.canvas.width = displayW * this.dpr;
    this.canvas.height = displayH * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  destroy() {
    this.running = false;
  }
}

// --- 五彩纸屑庆祝系统 ---
class ConfettiPiece {
  constructor(w, h) {
    this.reset(w, h);
  }
  reset(w, h) {
    this.x = w / 2 + (Math.random() - 0.5) * w * 0.3;
    this.y = -20 - Math.random() * h * 0.4;
    this.w = 6 + Math.random() * 10;
    this.h = 3 + Math.random() * 5;
    this.vy = 1.5 + Math.random() * 3;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 8;
    this.color = WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)];
    this.opacity = 0.9 + Math.random() * 0.1;
    this.alive = true;
  }
  update(w, h) {
    this.vy += 0.02; // gravity
    this.y += this.vy;
    this.x += this.vx;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.003;
    if (this.y > h + 50 || this.opacity <= 0) this.alive = false;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
}

class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    this.ctx = canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
    this.w = w;
    this.h = h;
    this.pieces = [];
    this.running = true;
    this.lastSpawn = 0;
    this._loop = this._loop.bind(this);
    this._loop(0);
  }
  _loop(timestamp) {
    if (!this.running) return;
    if (timestamp - this.lastSpawn > 40 && this.pieces.length < 80) {
      this.pieces.push(new ConfettiPiece(this.w, this.h));
      this.lastSpawn = timestamp;
    }
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (const p of this.pieces) {
      p.update(this.w, this.h);
      p.draw(this.ctx);
    }
    this.pieces = this.pieces.filter(p => p.alive);
    requestAnimationFrame(this._loop);
  }
  burst(count = 40) {
    for (let i = 0; i < count; i++) {
      const p = new ConfettiPiece(this.w, this.h);
      p.y = this.h / 2 + (Math.random() - 0.5) * 100;
      p.vy = -4 - Math.random() * 6;
      p.vx = (Math.random() - 0.5) * 5;
      this.pieces.push(p);
    }
  }
  destroy() {
    this.running = false;
  }
}
