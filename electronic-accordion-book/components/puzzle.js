/* ================================================================
   记忆拼图 — 惯性拖拽 + 干扰碎片 + 5x5 + 庆祝 v3
   ================================================================ */

function initPuzzle(container) {
  container.innerHTML = `
    <div id="pz-setup" class="puzzle-setup">
      <p style="color:var(--text2);font-size:14px;margin-bottom:12px;">选择照片制作拼图</p>
      <button class="acc-btn acc-btn-primary" id="pz-upload">📷 选择照片</button>
      <button class="acc-btn acc-btn-outline" id="pz-album" style="margin-top:8px;">🖼️ 从相册选</button>
      <div class="puzzle-diff">
        <button class="puzzle-diff-btn active" data-g="3">3×3</button>
        <button class="puzzle-diff-btn" data-g="4">4×4</button>
        <button class="puzzle-diff-btn" data-g="5">5×5</button>
      </div>
      <input type="file" id="pz-file" accept="image/*" class="hidden-input">
    </div>
    <canvas id="pz-canvas" class="puzzle-canvas hidden"></canvas>
    <div id="pz-status" class="puzzle-status hidden">
      拖动碎片 · <span id="pz-count">0</span>/<span id="pz-total">9</span>
    </div>
  `;

  let gs = 3, img = null, pieces = [], slots = [];
  let drag = null, dox = 0, doy = 0, solved = false;
  let ctx = null, cw = 0, ch = 0, cw2 = 0, ch2 = 0;
  let vx = 0, vy = 0, lastT = 0, lastP = null;

  const setup = container.querySelector('#pz-setup');
  const canvas = container.querySelector('#pz-canvas');
  const status = container.querySelector('#pz-status');
  const cntEl = container.querySelector('#pz-count');
  const totEl = container.querySelector('#pz-total');

  // 自动检测：如果有相册照片，直接使用第一张
  setTimeout(() => {
    if (!img && AppState.photos.length > 0) {
      loadImage(AppState.photos[0].dataUrl).then(im => { img = im; start(); });
    }
  }, 300);

  container.querySelector('#pz-upload').addEventListener('click', () => container.querySelector('#pz-file').click());
  container.querySelector('#pz-album').addEventListener('click', () => {
    const ps = AppState.photos;
    if (!ps.length) { showToast('请先在照片褶上传照片'); return; }
    const n = prompt(`选择照片 1-${ps.length}:`, '1');
    const i = parseInt(n) - 1;
    if (i >= 0 && i < ps.length) { loadImage(ps[i].dataUrl).then(im => { img = im; start(); }); }
  });
  container.querySelector('#pz-file').addEventListener('change', async () => {
    const f = container.querySelector('#pz-file').files[0];
    if (!f) return;
    const du = await fileToDataUrl(f);
    img = await loadImage(await compressImage(du, 600, 0.85));
    start();
  });

  container.querySelectorAll('.puzzle-diff-btn').forEach(b => {
    b.addEventListener('click', () => {
      gs = parseInt(b.dataset.g);
      container.querySelectorAll('.puzzle-diff-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      if (img) start();
    });
  });

  function start() {
    setup.classList.add('hidden');
    canvas.classList.remove('hidden');
    status.classList.remove('hidden');
    solved = false;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    const dw = Math.min(container.clientWidth - 32, 370);
    canvas.style.width = dw + 'px'; canvas.style.height = dw + 'px';
    cw2 = dw; ch2 = dw;
    cw = dw * dpr; ch = dw * dpr;
    canvas.width = cw; canvas.height = ch;
    ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);

    const cw1 = dw / gs, ch1 = dw / gs;
    pieces = []; slots = [];

    for (let r = 0; r < gs; r++) for (let c = 0; c < gs; c++) {
      const id = r * gs + c;
      slots.push({ id, r, c, x: c * cw1, y: r * ch1, w: cw1, h: ch1 });
      pieces.push({ id, hr: r, hc: c, x: 8 + Math.random() * (dw - cw1 - 16), y: dw + 12 + Math.random() * 60, w: cw1, h: ch1, placed: false });
    }

    // 干扰碎片
    const ap = AppState.photos;
    const dId = gs * gs;
    const dSrc = ap.length > 1 ? ap[Math.floor(Math.random() * ap.length)].thumb : null;
    pieces.push({
      id: dId, hr: -1, hc: -1, x: 8 + Math.random() * (dw - cw1 - 16),
      y: dw + 12 + Math.random() * 60, w: cw1, h: ch1, placed: false,
      isDist: true, dSrc, dColor: `hsl(${Math.random()*50+340},60%,${70+Math.random()*20}%)`,
    });

    totEl.textContent = gs * gs;
    cntEl.textContent = '0';
    draw();
  }

  function draw() {
    clearCanvas(ctx, cw2, ch2);
    ctx.save(); ctx.globalAlpha = 0.1; ctx.strokeStyle = '#D4788E';
    ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
    slots.forEach(s => ctx.strokeRect(s.x + 1, s.y + 1, s.w - 2, s.h - 2));
    ctx.setLineDash([]); ctx.restore();

    pieces.forEach(p => {
      if (p === drag) return;
      drawPiece(p);
    });
    if (drag) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 3; drawPiece(drag); ctx.restore(); }
  }

  function drawPiece(p) {
    ctx.save();
    if (p.isDist) {
      if (p.dSrc && p._di) ctx.drawImage(p._di, p.x, p.y, p.w, p.h);
      else if (p.dSrc) { const im = new Image(); im.src = p.dSrc; p._di = im; im.onload = draw; ctx.fillStyle = p.dColor; ctx.fillRect(p.x, p.y, p.w, p.h); }
      else { ctx.fillStyle = p.dColor; ctx.fillRect(p.x, p.y, p.w, p.h); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = `${p.h*0.35}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('?', p.x + p.w/2, p.y + p.h/2 + p.h*0.12); }
    } else {
      const sx = p.hc * (img.width / gs), sy = p.hr * (img.height / gs);
      ctx.drawImage(img, sx, sy, img.width/gs, img.height/gs, p.x + 1, p.y + 1, p.w - 2, p.h - 2);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 1.2;
    ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1);
    ctx.restore();
  }

  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left, y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top }; }
  function find(px, py) { for (let i = pieces.length - 1; i >= 0; i--) { const p = pieces[i]; if (px >= p.x && px <= p.x + p.w && py >= p.y && py <= p.y + p.h) return p; } return null; }

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (solved) return;
    const p = pos(e), pc = find(p.x, p.y);
    if (pc && !pc.isDist) { drag = pc; dox = p.x - pc.x; doy = p.y - pc.y; lastP = p; lastT = performance.now(); vx = vy = 0; }
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drag) return;
    const p = pos(e), now = performance.now(), dt = Math.max(now - lastT, 1);
    vx = (p.x - (lastP ? lastP.x : p.x)) / dt * 16;
    vy = (p.y - (lastP ? lastP.y : p.y)) / dt * 16;
    drag.x = p.x - dox; drag.y = p.y - doy;
    lastP = p; lastT = now; draw();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { if (!drag) return; applyInertia(); });

  canvas.addEventListener('mousedown', e => {
    if (solved) return;
    const p = pos(e), pc = find(p.x, p.y);
    if (pc && !pc.isDist) { drag = pc; dox = p.x - pc.x; doy = p.y - pc.y; lastP = p; lastT = performance.now(); vx = vy = 0; }
  });
  canvas.addEventListener('mousemove', e => {
    if (!drag) return;
    const p = pos(e), now = performance.now(), dt = Math.max(now - lastT, 1);
    vx = (p.x - (lastP ? lastP.x : p.x)) / dt * 16;
    vy = (p.y - (lastP ? lastP.y : p.y)) / dt * 16;
    drag.x = p.x - dox; drag.y = p.y - doy;
    lastP = p; lastT = now; draw();
  });
  canvas.addEventListener('mouseup', () => { if (!drag) return; applyInertia(); });

  function applyInertia() {
    const pc = drag; drag = null;
    function step() {
      pc.x += vx; pc.y += vy;
      vx *= 0.88; vy *= 0.88;
      pc.x = clamp(pc.x, -pc.w * 0.3, cw2 - pc.w * 0.7);
      pc.y = clamp(pc.y, -pc.h * 0.3, cw2 + 60);
      draw();
      if (Math.abs(vx) > 0.15 || Math.abs(vy) > 0.15) requestAnimationFrame(step);
      else { trySnap(pc); draw(); checkDone(); }
    }
    if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) requestAnimationFrame(step);
    else { trySnap(pc); draw(); checkDone(); }
  }

  function trySnap(pc) {
    let best = null, bd = Infinity;
    for (const s of slots) {
      const d = dist(pc.x + pc.w / 2, pc.y + pc.h / 2, s.x + s.w / 2, s.y + s.h / 2);
      if (d < 22 && d < bd) {
        const occ = pieces.some(x => x !== pc && x.id === s.id && x.placed);
        if (!occ || pc.id === s.id) { bd = d; best = s; }
      }
    }
    if (best && pc.id === best.id) {
      const sx = pc.x, sy = pc.y;
      const t0 = performance.now();
      function anim(ts) {
        const t = Math.min(1, (ts - t0) / 180);
        pc.x = lerp(sx, best.x, Easing.easeOutBack(t));
        pc.y = lerp(sy, best.y, Easing.easeOutBack(t));
        draw();
        if (t < 1) requestAnimationFrame(anim);
        else { pc.placed = true; draw(); updateCnt(); }
      }
      requestAnimationFrame(anim);
    } else { pc.placed = false; }
    updateCnt();
  }

  function updateCnt() { cntEl.textContent = pieces.filter(p => !p.isDist && p.placed).length; }

  function checkDone() {
    if (pieces.filter(p => !p.isDist).every(p => p.placed) && !solved) {
      solved = true;
      setTimeout(() => {
        const cc = document.getElementById('confetti-canvas');
        if (cc) { cc.classList.remove('hidden'); const cf = new ConfettiSystem(cc); cf.burst(50); setTimeout(() => { cf.destroy(); cc.classList.add('hidden'); }, 3000); }
        AppActions.setPuzzleDone();
        showToast('🎉 拼图完成！', 3000);
        const al = AppState.audioLetters;
        if (al.length > 0 && AppState.gameData.easterEggFound) { const am2 = new AudioManager(); am2.playFromDataUrl(al[al.length - 1].dataUrl).catch(() => {}); }
      }, 350);
    }
  }
}

window.initPuzzle = initPuzzle;
