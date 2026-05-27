/* ================================================================
   封面褶 — 3D粒子爱心墙 + 手势解锁 v4
   增强：更大粒子系统、呼吸光晕、粒子汇聚标题特效
   ================================================================ */

let coverReady = false;
let coverPS = null;
let coverBreathId = null;

function initCover() {
  if (coverReady) return;
  const section = document.getElementById('fold-cover');
  if (!section || section.style.display === 'none') return;
  coverReady = true;

  const canvas = document.getElementById('cover-canvas');
  const zone = document.getElementById('cover-gesture-zone');
  const title = document.getElementById('cover-title');
  const hint = document.getElementById('cover-hint');
  const fallback = document.getElementById('cover-fallback');

  // 380粒子系统 — 更丰富的粒子墙
  coverPS = new ParticleSystem(canvas, {
    count: 380,
    fpsCap: 30,
    connectionDistance: 85,
    mouseRadius: 160,
  });

  // 爱心曲线目标点
  const hc = generateHeartCurve(260);
  let cx, cy, r, heartTargets;
  function recalc() {
    cx = coverPS.w / 2;
    cy = coverPS.h / 2 - 40;
    r = Math.min(coverPS.w, coverPS.h) * 0.38;
    heartTargets = scaleHeartToFit(hc, cx, cy, r, r * 0.95);
  }
  recalc();

  // 拖尾canvas
  const trail = document.createElement('canvas');
  trail.className = 'cover-canvas';
  trail.style.cssText = 'position:absolute;inset:0;z-index:3;pointer-events:none;';
  section.appendChild(trail);
  let tCtx = null;
  let tw = 0, th = 0;
  function initTrail() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    tw = coverPS.w; th = coverPS.h;
    trail.width = tw * dpr; trail.height = th * dpr;
    trail.style.width = tw + 'px'; trail.style.height = th + 'px';
    tCtx = trail.getContext('2d'); tCtx.scale(dpr, dpr);
  }
  initTrail();

  const collector = GestureRecognizer.createCollector();
  let trailPts = [], drawing = false, phase = 'IDLE';
  let failCount = 0;
  const rectFn = () => canvas.getBoundingClientRect();

  function pos(e) {
    const r = rectFn();
    return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top,
    };
  }

  function drawTrail() {
    if (!tCtx || trailPts.length < 2) return;
    tCtx.clearRect(0, 0, tw, th);
    for (let i = 1; i < trailPts.length; i++) {
      const a = i / trailPts.length;
      tCtx.save();
      tCtx.globalAlpha = a * 0.55;
      tCtx.strokeStyle = '#FFB3C6';
      tCtx.lineWidth = a * 14 + 2;
      tCtx.lineCap = 'round';
      tCtx.shadowColor = 'rgba(255,180,200,0.6)';
      tCtx.shadowBlur = 14;
      tCtx.beginPath();
      tCtx.moveTo(trailPts[i - 1].x, trailPts[i - 1].y);
      tCtx.lineTo(trailPts[i].x, trailPts[i].y);
      tCtx.stroke();
      tCtx.restore();
    }
  }

  // ===== Touch事件 =====
  zone.addEventListener('touchstart', e => {
    if (phase !== 'IDLE') return;
    e.preventDefault();
    collector.clear();
    const p = pos(e);
    collector.addPoint(e.touches[0].clientX, e.touches[0].clientY);
    trailPts = [p]; drawing = true;
    phase = 'DRAWING';
    hint.style.opacity = '0.35';
    hint.style.transform = 'scale(0.9)';
  }, { passive: false });

  zone.addEventListener('touchmove', e => {
    if (!drawing) return;
    e.preventDefault();
    const p = pos(e);
    collector.addPoint(e.touches[0].clientX, e.touches[0].clientY);
    trailPts.push(p);
    if (trailPts.length > 60) trailPts.shift();
    coverPS.setMouse(p.x, p.y);
    coverPS.attractToPoint(p.x, p.y, 140);
    // 粒子经过时变亮
    for (const pt of coverPS.particles) {
      if (dist(pt.x, pt.y, p.x, p.y) < 55) {
        pt.opacity = Math.min(1, pt.opacity + 0.06);
      }
    }
    drawTrail();
  }, { passive: false });

  zone.addEventListener('touchend', () => finishDraw());

  // ===== Mouse事件 =====
  zone.addEventListener('mousedown', e => {
    if (phase !== 'IDLE') return;
    collector.clear();
    const p = pos(e);
    collector.addPoint(e.clientX, e.clientY);
    trailPts = [p]; drawing = true;
    phase = 'DRAWING';
    hint.style.opacity = '0.35';
  });
  zone.addEventListener('mousemove', e => {
    if (!drawing) { coverPS.setMouse(pos(e).x, pos(e).y); return; }
    const p = pos(e);
    collector.addPoint(e.clientX, e.clientY);
    trailPts.push(p);
    if (trailPts.length > 60) trailPts.shift();
    coverPS.setMouse(p.x, p.y);
    coverPS.attractToPoint(p.x, p.y, 140);
    drawTrail();
  });
  zone.addEventListener('mouseup', () => finishDraw());
  zone.addEventListener('mouseleave', () => { coverPS.clearMouse(); });

  function finishDraw() {
    if (!drawing) return;
    drawing = false;
    coverPS.clearMouse();
    if (tCtx) tCtx.clearRect(0, 0, tw, th);

    const res = collector.evaluate();
    if (res.confidence >= GestureRecognizer.CONFIDENCE_THRESHOLD) {
      runUnlock();
    } else {
      failCount++;
      phase = 'IDLE';
      hint.style.opacity = '1';
      hint.style.transform = 'scale(1)';
      showToast(failCount >= 3
        ? '试试点击下方按钮直接进入 💗'
        : '再画一次爱心试试 💗', 1600);
      if (failCount >= 3) {
        fallback.classList.remove('hidden');
        fallback.style.animation = 'springIn 0.5s var(--ease-spring) forwards';
      }
    }
  }

  fallback.addEventListener('click', runUnlock);

  window.addEventListener('resize', () => {
    if (!coverPS) return;
    coverPS.resize(window.innerWidth, window.innerHeight);
    recalc(); initTrail();
  });

  // ===== 解锁动画序列 =====
  function runUnlock() {
    if (phase === 'UNLOCK') return;
    phase = 'UNLOCK';
    hint.style.opacity = '0';
    fallback.classList.add('hidden');
    if (tCtx) tCtx.clearRect(0, 0, tw, th);

    const t0 = performance.now();
    let burstDone = false;
    let convergeDone = false;
    let titleAnimated = false;

    function anim(ts) {
      const el = (ts - t0) / 1000;

      // 阶段1：粒子汇聚成爱心 (0-0.8s)
      if (el < 0.8) {
        coverPS.convergeToTargets(heartTargets, 0.045);
      }
      // 阶段2：爱心爆发 (0.8-1.2s)
      else if (el < 1.3 && !burstDone) {
        coverPS.burst(10);
        burstDone = true;
        // 标题闪烁
        title.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        title.style.opacity = '0.7';
        title.style.transform = 'scale(1.12)';
        setTimeout(() => {
          title.style.opacity = '0.2';
          title.style.transform = 'scale(0.88)';
        }, 280);
      }
      // 阶段3：粒子飞向标题位置拼出标题 (1.3-2.5s)
      else if (el >= 1.3 && !convergeDone) {
        convergeDone = true;
        // 计算标题文字在画布中的位置
        const tr = title.getBoundingClientRect();
        const sr = section.getBoundingClientRect();
        const tcx = tr.left + tr.width / 2 - sr.left;
        const tcy = tr.top + tr.height / 2 - sr.top;

        // 生成标题形状的粒子目标点
        const tgs = [];
        const rings = 5;
        for (let ring = 0; ring < rings; ring++) {
          const rr = 15 + ring * 18;
          const count = Math.floor(12 + ring * 8);
          for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2 + ring * 0.4;
            tgs.push({
              x: tcx + Math.cos(a) * rr,
              y: tcy - 30 + Math.sin(a) * rr * 0.35,
            });
          }
        }
        // 填充到粒子数量
        while (tgs.length < 380) {
          const a = Math.random() * Math.PI * 2;
          const rr = 10 + Math.random() * 80;
          tgs.push({
            x: tcx + Math.cos(a) * rr,
            y: tcy - 30 + Math.sin(a) * rr * 0.35,
          });
        }
        coverPS.convergeToTargets(tgs.slice(0, 380), 0.025);
      }

      // 阶段4：标题逐字动画
      if (el >= 1.5 && !titleAnimated) {
        titleAnimated = true;
        animateTitleChars();
      }

      if (el < 2.8) {
        requestAnimationFrame(anim);
      } else {
        // 最终：标题归位，转场到风琴本
        title.style.opacity = '1';
        title.style.transform = 'scale(1)';
        setTimeout(() => {
          section.classList.add('transition-out');
          setTimeout(() => {
            AppActions.unlock();
            section.style.display = 'none';
            if (trail.parentNode) trail.remove();
            coverPS.destroy();
            coverPS = null;
            coverReady = false;
            if (coverBreathId) { cancelAnimationFrame(coverBreathId); coverBreathId = null; }
          }, 650);
        }, 800);
      }
    }
    requestAnimationFrame(anim);
  }

  function animateTitleChars() {
    const h1 = title.querySelector('.cover-title-main');
    if (!h1) return;
    const t = h1.textContent || '';
    h1.innerHTML = '';
    [...t].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      s.style.animationDelay = i * 0.07 + 's';
      h1.appendChild(s);
    });
  }

  // 初始状态：标题半透明
  title.style.opacity = '0.25';
  title.style.transform = 'scale(0.9)';

  // 在粒子上绘制爱心轮廓引导线（微弱）
  const origDraw = coverPS.draw.bind(coverPS);
  coverPS.draw = function () {
    origDraw();
    // 绘制微弱的爱心引导线
    const ctx = coverPS.ctx;
    ctx.save();
    ctx.globalAlpha = 0.12 + Math.sin(Date.now() / 3000) * 0.04; // 呼吸
    ctx.strokeStyle = '#D4788E';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    const guidePts = scaleHeartToFit(
      generateHeartCurve(120),
      coverPS.w / 2,
      coverPS.h / 2 - 40,
      Math.min(coverPS.w, coverPS.h) * 0.38,
      Math.min(coverPS.w, coverPS.h) * 0.36
    );
    guidePts.forEach((p, i) => {
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  };

  // ===== 呼吸背景光效 =====
  let bp = 0;
  function breath() {
    if (phase === 'UNLOCK' || !coverReady) return;
    bp += 0.008;
    const t = Math.sin(bp) * 0.5 + 0.5; // 0-1 呼吸值
    const r1 = Math.floor(255 - t * 14);
    const g1 = Math.floor(240 - t * 22);
    const b1 = Math.floor(243 - t * 18);
    const r2 = Math.floor(255 - t * 18);
    const g2 = Math.floor(224 - t * 28);
    const b2 = Math.floor(230 - t * 22);
    section.style.background = `radial-gradient(ellipse at 50% 40%, rgb(${r1},${g1},${b1}) 0%, rgb(${r2},${g2},${b2}) 35%, #F5D5DC 100%)`;
    coverBreathId = requestAnimationFrame(breath);
  }
  coverBreathId = requestAnimationFrame(breath);
}

window.initCover = initCover;
