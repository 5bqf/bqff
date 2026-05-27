/* ================================================================
   刮刮乐 — 金属涂层 + 进度 + 语音彩蛋 v3
   ================================================================ */

function initScratch(container) {
  container.innerHTML = `
    <div id="sc-setup" class="scratch-setup">
      <p style="color:var(--text2);font-size:14px;margin-bottom:12px;">选择照片和留言</p>
      <button class="acc-btn acc-btn-primary" id="sc-upload">📷 选择照片</button>
      <button class="acc-btn acc-btn-outline" id="sc-album" style="margin-top:8px;">🖼️ 从相册选</button>
      <textarea id="sc-msg" placeholder="写下想说的话..." rows="3" style="width:100%;max-width:280px;margin-top:10px;border-radius:var(--radius-md);border:1px solid rgba(232,160,180,0.2);padding:12px;font-family:var(--font-serif);font-size:14px;resize:none;background:rgba(255,255,255,0.6);line-height:1.6;"></textarea>
      <input type="file" id="sc-file" accept="image/*" class="hidden-input">
    </div>
    <div id="sc-game" class="hidden">
      <div class="scratch-wrapper" id="sc-wrapper">
        <div class="scratch-reveal" id="sc-reveal">
          <img id="sc-img" src="" alt="">
          <p class="scratch-reveal-text" id="sc-text"></p>
        </div>
        <canvas class="scratch-canvas" id="sc-canvas"></canvas>
      </div>
      <div class="scratch-progress"><div class="scratch-progress-fill" id="sc-fill" style="width:0"></div></div>
      <p class="scratch-info">刮开涂层 · <span id="sc-pct">0%</span></p>
    </div>
  `;

  const setup = container.querySelector('#sc-setup');
  const game = container.querySelector('#sc-game');
  const wrapper = container.querySelector('#sc-wrapper');
  const scImg = container.querySelector('#sc-img');
  const scTxt = container.querySelector('#sc-text');
  const scCanvas = container.querySelector('#sc-canvas');
  const scFill = container.querySelector('#sc-fill');
  const scPct = container.querySelector('#sc-pct');

  let ctx = null, cw = 0, ch = 0, scratching = false, last = null;
  let eggCnt = 0, eggDone = false;
  const R = 22;

  // 自动从相册加载
  setTimeout(() => {
    if (AppState.photos.length > 0 && setup && !setup.classList.contains('hidden')) {
      scImg.src = AppState.photos[0].dataUrl;
      scTxt.textContent = container.querySelector('#sc-msg').value || '💗 回忆在这里';
      setup.classList.add('hidden'); game.classList.remove('hidden');
      scImg.onload = initCanvas; if (scImg.complete) initCanvas();
    }
  }, 400);

  container.querySelector('#sc-upload').addEventListener('click', () => container.querySelector('#sc-file').click());
  container.querySelector('#sc-album').addEventListener('click', () => {
    const ps = AppState.photos;
    if (!ps.length) { showToast('请先在照片褶上传照片'); return; }
    const n = prompt(`选择照片 1-${ps.length}:`, '1');
    const i = parseInt(n) - 1;
    if (i >= 0 && i < ps.length) {
      scImg.src = ps[i].dataUrl;
      scTxt.textContent = container.querySelector('#sc-msg').value || '💗 回忆在这里';
      setup.classList.add('hidden'); game.classList.remove('hidden');
      scImg.onload = initCanvas; if (scImg.complete) initCanvas();
    }
  });
  container.querySelector('#sc-file').addEventListener('change', async () => {
    const f = container.querySelector('#sc-file').files[0];
    if (!f) return;
    const du = await fileToDataUrl(f);
    scImg.src = await compressImage(du, 500, 0.8);
    scTxt.textContent = container.querySelector('#sc-msg').value || '💗 回忆在这里';
    setup.classList.add('hidden'); game.classList.remove('hidden');
    scImg.onload = initCanvas; if (scImg.complete) initCanvas();
  });

  function initCanvas() {
    const r = wrapper.getBoundingClientRect();
    cw = r.width; ch = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    scCanvas.width = cw * dpr; scCanvas.height = ch * dpr;
    scCanvas.style.width = cw + 'px'; scCanvas.style.height = ch + 'px';
    scCanvas.style.opacity = '1'; scCanvas.style.display = 'block';
    ctx = scCanvas.getContext('2d'); ctx.scale(dpr, dpr);
    eggDone = false; eggCnt = 0;
    scFill.style.width = '0'; scPct.textContent = '0%';
    drawMetal();
  }

  function drawMetal() {
    ctx.fillStyle = '#BABABA'; ctx.fillRect(0, 0, cw, ch);
    const g = ctx.createLinearGradient(0, 0, cw, ch);
    g.addColorStop(0, '#D8D8D8'); g.addColorStop(0.25, '#EBEBEB'); g.addColorStop(0.5, '#B2B2B2');
    g.addColorStop(0.7, '#CCCCCC'); g.addColorStop(1, '#A8A8A8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    for (let i = 0; i < cw * ch / 180; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.07})`;
      ctx.fillRect(Math.random() * cw, Math.random() * ch, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✨ 刮开此处 ✨', cw / 2, ch / 2);
  }

  function getPos(e) {
    const r = scCanvas.getBoundingClientRect();
    return { x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left, y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top };
  }

  function scratchAt(p) {
    ctx.save(); ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    checkEgg(p);
  }

  function scratchLine(f, t) {
    const d = dist(f.x, f.y, t.x, t.y);
    const steps = Math.max(1, Math.ceil(d / (R * 0.4)));
    for (let i = 0; i <= steps; i++) scratchAt({ x: lerp(f.x, t.x, i / steps), y: lerp(f.y, t.y, i / steps) });
  }

  const EZ = [{ x: 0.04, y: 0.68, w: 0.22, h: 0.2 }, { x: 0.72, y: 0.06, w: 0.22, h: 0.2 }];
  function checkEgg(p) {
    if (eggDone || !cw) return;
    const rx = p.x / cw, ry = p.y / ch;
    for (const z of EZ) {
      if (rx >= z.x && rx <= z.x + z.w && ry >= z.y && ry <= z.y + z.h) {
        eggCnt++;
        if (eggCnt >= 10) {
          eggDone = true; AppActions.setEasterEgg();
          showToast('🎵 发现语音彩蛋！', 2500);
          const al = AppState.audioLetters;
          if (al.length) { const am2 = new AudioManager(); am2.playFromDataUrl(al[al.length - 1].dataUrl).catch(() => {}); }
        }
      }
    }
  }

  function checkProgress() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const id = ctx.getImageData(0, 0, cw * dpr, ch * dpr); ctx.restore();
    let tr = 0, tot = 0;
    for (let y = 0; y < id.height; y += 4) for (let x = 0; x < id.width; x += 4) {
      if (id.data[(y * id.width + x) * 4 + 3] < 128) tr++; tot++;
    }
    const ratio = tot > 0 ? tr / tot : 0;
    scFill.style.width = Math.round(ratio * 100) + '%';
    scPct.textContent = Math.round(ratio * 100) + '%';
    if (ratio > 0.55) {
      scCanvas.style.transition = 'opacity 0.6s ease'; scCanvas.style.opacity = '0';
      setTimeout(() => {
        scCanvas.style.display = 'none'; scFill.style.width = '100%'; scPct.textContent = '100%';
        if (!AppState.gameData.scratchCompleted) { AppActions.setScratchDone(); showToast('✨ 回忆已揭晓！', 2000); }
      }, 600);
    }
  }

  scCanvas.addEventListener('touchstart', e => { e.preventDefault(); scratching = true; const p = getPos(e); scratchAt(p); last = p; }, { passive: false });
  scCanvas.addEventListener('touchmove', e => { e.preventDefault(); if (!scratching) return; const p = getPos(e); scratchLine(last, p); last = p; }, { passive: false });
  scCanvas.addEventListener('touchend', () => { scratching = false; checkProgress(); });
  scCanvas.addEventListener('mousedown', e => { scratching = true; const p = getPos(e); scratchAt(p); last = p; });
  scCanvas.addEventListener('mousemove', e => { if (!scratching) return; const p = getPos(e); scratchLine(last, p); last = p; });
  scCanvas.addEventListener('mouseup', () => { scratching = false; checkProgress(); });
}

window.initScratch = initScratch;
