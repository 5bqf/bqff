/* ================================================================
   AR盲盒褶 — 礼盒 + AR相机 + 未来信 + 画廊 v3
   ================================================================ */

let arInit = false;
let arStream = null;
let arPS = null;
let stickerIdx = 0;
const stickers = ['hearts', 'frame', 'sparkles', 'badge', 'vintage', 'constellation'];
const stickerNames = {
  hearts: '爱心粒子雨',
  frame: '合照相框',
  sparkles: '星光闪烁',
  badge: '时光标签',
  vintage: '复古胶片',
  constellation: '星空星座',
};

function initARFold() {
  if (arInit) return;
  arInit = true;

  const video = document.getElementById('ar-video');
  const overlay = document.getElementById('ar-overlay');
  const captureBtn = document.getElementById('ar-capture-btn');
  const stickerBtn = document.getElementById('ar-sticker-btn');
  const stickerLabel = document.getElementById('ar-sticker-label');
  const gallery = document.getElementById('ar-gallery');
  const viewfinder = document.getElementById('ar-viewfinder');
  const mysteryBox = document.getElementById('mystery-box');

  let oCtx = null, ow = 0, oh = 0, camReady = false;

  // 盲盒点击：触发粒子爆发 + 展开
  if (mysteryBox) {
    mysteryBox.addEventListener('click', () => {
      // 礼盒爆发粒子
      const confettiCanvas = document.getElementById('confetti-canvas');
      if (confettiCanvas) {
        confettiCanvas.classList.remove('hidden');
        const cf = new ConfettiSystem(confettiCanvas);
        cf.burst(30);
        setTimeout(() => { cf.destroy(); confettiCanvas.classList.add('hidden'); }, 2500);
      }
    });
  }

  // AR Tab 切换
  document.querySelectorAll('#ar-tabs .ar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#ar-tabs .ar-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.dataset.ar;
      document.getElementById('ar-camera-panel').classList.toggle('hidden', panel !== 'camera');
      document.getElementById('ar-letter-panel').classList.toggle('hidden', panel !== 'letter');
      if (panel === 'camera' && !camReady) startCamera();
    });
  });

  // 未来信
  document.getElementById('letter-save').addEventListener('click', () => {
    const txt = document.getElementById('letter-text').value.trim();
    if (!txt) { showToast('请写下想说的话'); return; }
    const date = document.getElementById('letter-date').value || '未设定日期';
    AppActions.addFutureLetter(txt, date);
    document.getElementById('letter-text').value = '';
    document.getElementById('letter-date').value = '';
    renderLetters();
    showToast('💌 未来信已封存');
  });

  function renderLetters() {
    const list = document.getElementById('letter-list');
    if (!list) return;
    const ls = AppState.futureLetters;
    if (!ls.length) { list.innerHTML = '<p style="text-align:center;color:var(--text3);font-size:13px;padding:14px;">还没有封存的信</p>'; return; }
    list.innerHTML = ls.map(l => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin:6px 0;border-radius:var(--radius-md);background:rgba(255,255,255,0.6);border:1px solid rgba(232,160,180,0.12);">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(l.content.substring(0, 35))}...</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px;">📅 ${escapeHtml(l.openDate)}</div>
        </div>
        <button style="font-size:16px;opacity:0.5;padding:4px 6px;" data-df="${l.id}">🗑️</button>
      </div>
    `).join('');
    list.querySelectorAll('[data-df]').forEach(b => b.addEventListener('click', () => { AppActions.removeFutureLetter(b.dataset.df); renderLetters(); }));
  }

  function renderGallery() {
    if (!gallery) return;
    const ps = AppState.arPhotos;
    if (!ps.length) { gallery.innerHTML = '<p style="text-align:center;color:var(--text3);font-size:12px;padding:12px;">拍照后显示在这里</p>'; return; }
    gallery.innerHTML = ps.map(p => `<div class="ar-gallery-item"><img src="${p.dataUrl}" alt="AR"></div>`).join('');
    gallery.querySelectorAll('.ar-gallery-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        const a = document.createElement('a'); a.href = ps[i].dataUrl; a.download = `ar-${ps[i].id}.jpg`; a.click();
      });
    });
  }

  // 相机
  async function startCamera() {
    try {
      arStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 853 } }, audio: false });
      video.srcObject = arStream; await video.play();
      camReady = true; initOverlay(); arLoop();
    } catch (e) { showToast('无法访问摄像头'); }
  }

  function stopCamera() {
    if (arStream) { arStream.getTracks().forEach(t => t.stop()); arStream = null; }
    if (arPS) { arPS.destroy(); arPS = null; }
    camReady = false;
  }

  function initOverlay() {
    const r = viewfinder.getBoundingClientRect();
    ow = r.width; oh = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    overlay.width = ow * dpr; overlay.height = oh * dpr;
    overlay.style.width = ow + 'px'; overlay.style.height = oh + 'px';
    oCtx = overlay.getContext('2d'); oCtx.scale(dpr, dpr);
    arPS = new ParticleSystem(overlay, { count: 70, fpsCap: 30, connectionDistance: 45, width: ow, height: oh });
  }

  function arLoop() {
    if (!camReady || AppState.activeFold !== 3) { requestAnimationFrame(arLoop); return; }
    clearCanvas(oCtx, ow, oh);
    const st = stickers[stickerIdx];
    if (st === 'hearts') drawHearts();
    else if (st === 'frame') drawFrame();
    else if (st === 'sparkles') drawSparkles();
    else if (st === 'badge') drawBadge();
    else if (st === 'vintage') drawVintage();
    else if (st === 'constellation') drawConstellation();
    requestAnimationFrame(arLoop);
  }

  function drawHearts() {
    const hc = generateHeartCurve(80);
    const cx = ow / 2, cy = oh * 0.28, r = Math.min(ow, oh) * 0.2;
    oCtx.save();
    oCtx.strokeStyle = 'rgba(255,160,190,0.5)'; oCtx.lineWidth = 2.5;
    oCtx.setLineDash([8, 5]); oCtx.shadowColor = 'rgba(255,180,200,0.4)'; oCtx.shadowBlur = 10;
    const sc = scaleHeartToFit(hc, cx, cy, r, r * 0.95);
    oCtx.beginPath(); sc.forEach((p, i) => i === 0 ? oCtx.moveTo(p.x, p.y) : oCtx.lineTo(p.x, p.y)); oCtx.closePath(); oCtx.stroke();
    oCtx.setLineDash([]); oCtx.shadowBlur = 0;
    const t = Date.now() / 1100;
    for (let i = 0; i < 10; i++) {
      const hx = ow * (0.12 + 0.76 * ((Math.sin(t * 0.7 + i) + 1) / 2));
      const hy = oh * ((t * 0.25 + i * 0.35) % 1) * 0.8 + oh * 0.04;
      oCtx.fillStyle = 'rgba(255,180,200,0.35)'; oCtx.font = `${5 + Math.abs(Math.sin(t + i)) * 8}px serif`;
      oCtx.fillText('♥', hx, hy);
    }
    oCtx.restore();
  }

  function drawFrame() {
    const fw = ow * 0.76, fh = oh * 0.66, fx = (ow - fw) / 2, fy = (oh - fh) / 2;
    oCtx.save();
    oCtx.fillStyle = 'rgba(255,255,255,0.08)'; oCtx.fillRect(fx, fy, fw, fh);
    oCtx.strokeStyle = 'rgba(255,255,255,0.6)'; oCtx.lineWidth = 4.5;
    drawRoundRect(oCtx, fx, fy, fw, fh, 16); oCtx.stroke();
    oCtx.strokeStyle = 'rgba(232,160,180,0.4)'; oCtx.lineWidth = 1.5;
    drawRoundRect(oCtx, fx + 12, fy + 12, fw - 24, fh - 24, 10); oCtx.stroke();
    const nn = new Date();
    oCtx.fillStyle = 'rgba(255,255,255,0.65)'; oCtx.font = 'bold 12px system-ui'; oCtx.textAlign = 'center';
    oCtx.fillText(`${nn.getFullYear()}.${String(nn.getMonth()+1).padStart(2,'0')}.${String(nn.getDate()).padStart(2,'0')}`, ow / 2, fy + fh + 28);
    oCtx.restore();
  }

  function drawSparkles() {
    oCtx.save();
    const t = Date.now() / 900;
    for (let i = 0; i < 30; i++) {
      const sx = ow * (0.08 + 0.84 * ((Math.sin(t * 0.65 + i * 1.2) + 1) / 2));
      const sy = oh * (0.08 + 0.84 * ((Math.cos(t * 0.5 + i * 1.6) + 1) / 2));
      const sr = 2 + Math.abs(Math.sin(t * 1.5 + i)) * 4;
      oCtx.fillStyle = `rgba(255,220,100,${0.3 + Math.abs(Math.sin(t + i)) * 0.45})`;
      oCtx.shadowColor = 'rgba(255,200,50,0.5)'; oCtx.shadowBlur = sr * 3;
      oCtx.beginPath(); oCtx.arc(sx, sy, sr, 0, Math.PI * 2); oCtx.fill();
    }
    oCtx.restore();
  }

  function drawBadge() {
    oCtx.save();
    const bw = ow * 0.55, bh = 34, bx = (ow - bw) / 2, by = oh * 0.07;
    oCtx.fillStyle = 'rgba(0,0,0,0.3)'; drawRoundRect(oCtx, bx, by, bw, bh, 18); oCtx.fill();
    oCtx.fillStyle = '#fff'; oCtx.font = 'bold 13px system-ui'; oCtx.textAlign = 'center'; oCtx.textBaseline = 'middle';
    oCtx.fillText('💫 我们的美好时光 💫', ow / 2, by + bh / 2);
    oCtx.restore();
  }

  function drawVintage() {
    oCtx.save();
    // 胶片边框
    const margin = 20;
    oCtx.strokeStyle = 'rgba(50,30,20,0.5)';
    oCtx.lineWidth = 3;
    drawRoundRect(oCtx, margin, margin, ow - margin * 2, oh - margin * 2, 8);
    oCtx.stroke();
    oCtx.strokeStyle = 'rgba(50,30,20,0.25)';
    oCtx.lineWidth = 1;
    drawRoundRect(oCtx, margin + 8, margin + 8, ow - (margin + 8) * 2, oh - (margin + 8) * 2, 4);
    oCtx.stroke();
    // 胶片孔
    const t = Date.now() / 2000;
    for (let i = 0; i < 20; i++) {
      const hx = margin + (i / 19) * (ow - margin * 2);
      oCtx.fillStyle = 'rgba(40,20,10,0.3)';
      oCtx.fillRect(hx - 3, margin - 6, 6, 8);
      oCtx.fillRect(hx - 3, oh - margin - 2, 6, 8);
    }
    // 日期水印
    oCtx.fillStyle = 'rgba(255,200,150,0.35)';
    oCtx.font = 'italic 14px Georgia, serif';
    oCtx.textAlign = 'right';
    const d = new Date();
    oCtx.fillText(`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`, ow - margin - 12, oh - margin - 12);
    oCtx.restore();
  }

  function drawConstellation() {
    oCtx.save();
    const t = Date.now() / 2500;
    // 星星
    const stars = [];
    for (let i = 0; i < 22; i++) {
      const sx = ow * (0.08 + 0.84 * ((Math.sin(i * 2.7 + t * 0.3) + 1) / 2));
      const sy = oh * (0.06 + 0.88 * ((Math.cos(i * 3.1 + t * 0.25) + 1) / 2));
      stars.push({ x: sx, y: sy });
      const sr = 1.5 + Math.abs(Math.sin(t * 1.2 + i)) * 3;
      oCtx.fillStyle = `rgba(255,255,220,${0.4 + Math.abs(Math.sin(t + i)) * 0.4})`;
      oCtx.shadowColor = 'rgba(255,240,180,0.6)';
      oCtx.shadowBlur = sr * 4;
      oCtx.beginPath(); oCtx.arc(sx, sy, sr, 0, Math.PI * 2); oCtx.fill();
      // 十字星芒
      oCtx.strokeStyle = `rgba(255,255,220,${0.15 + Math.abs(Math.sin(t + i)) * 0.15})`;
      oCtx.lineWidth = 0.5;
      oCtx.beginPath(); oCtx.moveTo(sx - sr * 2, sy); oCtx.lineTo(sx + sr * 2, sy);
      oCtx.moveTo(sx, sy - sr * 2); oCtx.lineTo(sx, sy + sr * 2); oCtx.stroke();
    }
    // 星座连线
    oCtx.strokeStyle = 'rgba(255,240,200,0.12)';
    oCtx.lineWidth = 0.5;
    oCtx.setLineDash([3, 8]);
    oCtx.beginPath();
    for (let i = 0; i < stars.length - 1; i++) {
      oCtx.moveTo(stars[i].x, stars[i].y);
      oCtx.lineTo(stars[i + 1].x, stars[i + 1].y);
    }
    oCtx.stroke();
    oCtx.setLineDash([]);
    oCtx.restore();
  }

  captureBtn.addEventListener('click', () => {
    if (!camReady) return;
    const cc = document.createElement('canvas'); cc.width = ow * 2; cc.height = oh * 2;
    const cctx = cc.getContext('2d');
    cctx.save(); cctx.scale(-1, 1); cctx.drawImage(video, -ow * 2, 0, ow * 2, oh * 2); cctx.restore();
    cctx.drawImage(overlay, 0, 0, ow * 2, oh * 2);
    const du = cc.toDataURL('image/jpeg', 0.9);
    AppActions.addARPhoto(du);
    renderGallery();
    const a = document.createElement('a'); a.download = `ar-photo-${Date.now()}.jpg`; a.href = du; a.click();
    showToast('📸 AR合影已保存！', 2000);
    // 闪光
    oCtx.save(); oCtx.fillStyle = 'rgba(255,255,255,0.6)'; oCtx.fillRect(0, 0, ow, oh);
    setTimeout(() => { oCtx.clearRect(0, 0, ow, oh); oCtx.restore(); }, 120);
  });

  stickerBtn.addEventListener('click', () => {
    stickerIdx = (stickerIdx + 1) % stickers.length;
    stickerLabel.textContent = stickerNames[stickers[stickerIdx]];
  });

  EventBus.on('fold:activeChanged', idx => {
    if (idx === 3 && !camReady) startCamera();
    else if (idx !== 3 && camReady) stopCamera();
  });

  EventBus.on('ar:changed', renderGallery);
  EventBus.on('future:changed', renderLetters);
  renderGallery(); renderLetters();
  if (AppState.activeFold === 3) startCamera();
}

window.initARFold = initARFold;
