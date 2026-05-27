/* ================================================================
   音频褶 — 唱片机 + 波形 + 播放列表 + 文件上传 v3
   ================================================================ */

let audioInit = false;
let am = null;

function initAudioFold() {
  if (audioInit) return;
  audioInit = true;
  am = new AudioManager();

  const miniCanvas = document.getElementById('waveform-mini');
  const miniTitle = document.getElementById('audio-mini-title');
  const miniDur = document.getElementById('audio-mini-dur');
  const vinyl = document.getElementById('vinyl-platter');
  const tonearm = document.getElementById('tonearm');
  const btnRec = document.getElementById('btn-record');
  const btnPlay = document.getElementById('btn-play');
  const btnStop = document.getElementById('btn-stop');
  const fill = document.getElementById('timeline-fill');
  const curEl = document.getElementById('time-current');
  const totEl = document.getElementById('time-total');
  const bar = document.getElementById('timeline-bar');
  const recInd = document.getElementById('recording-indicator');
  const recTimer = document.getElementById('rec-timer');
  const playlist = document.getElementById('audio-playlist');
  const upBtn = document.getElementById('audio-upload-btn');
  const upInp = document.getElementById('audio-file-input');

  let curId = AppState.currentAudioId;
  let miniCtx = null;
  let recStart = 0, recInt = null;

  // 折叠态波形
  function startMiniWave() {
    if (!miniCanvas) return;
    const { ctx, width, height } = initHiDPICanvas(miniCanvas, miniCanvas.clientWidth || 340, 60);
    miniCtx = ctx;
    const bars = 50, bw = width / bars - 2;
    const vals = new Float32Array(bars).fill(0.08);
    const fd = new Uint8Array(128);
    (function loop() {
      if (!miniCanvas || AppState.activeFold !== 1) { requestAnimationFrame(loop); return; }
      clearCanvas(miniCtx, width, height);
      for (let i = 0; i < bars; i++) {
        let v;
        if (am.state === 'playing' && am.analyser) {
          am.analyser.getByteFrequencyData(fd);
          v = fd[Math.floor(i / bars * 128)] / 255;
        } else {
          v = Math.abs(Math.sin(Date.now() / 400 + i * 0.35)) * 0.35 + 0.08;
        }
        vals[i] = lerp(vals[i], v, 0.12);
        const bh = Math.max(2, vals[i] * height * 0.9);
        const x = i * (bw + 2), y = height - bh;
        miniCtx.fillStyle = am.state === 'playing' ? '#D4788E' : '#E8A0B4';
        drawRoundRect(miniCtx, x, y, bw, bh, bw / 2);
        miniCtx.fill();
      }
      requestAnimationFrame(loop);
    })();
  }

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '00:00';
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderPlaylist() {
    if (!playlist) return;
    const items = AppState.audioLetters;
    if (!items.length) {
      playlist.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3);font-size:13px;">录制或上传音频</div>';
      if (miniTitle) miniTitle.textContent = '录制一段声音';
      if (miniDur) miniDur.textContent = '00:00';
      return;
    }
    playlist.innerHTML = items.map(a => `
      <div class="playlist-item ${a.id === curId ? 'active' : ''}" data-aid="${a.id}">
        <span class="playlist-item-icon">${a.id === curId && am.state === 'playing' ? '🔊' : '🎵'}</span>
        <div class="playlist-item-info">
          <div class="playlist-item-name">${escapeHtml(a.title)}</div>
          <div class="playlist-item-dur">${fmt(a.duration)}</div>
        </div>
        <span class="playlist-item-del" data-del="${a.id}">🗑️</span>
      </div>
    `).join('');

    playlist.querySelectorAll('.playlist-item').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('.playlist-item-del')) return;
        playId(el.dataset.aid);
      });
    });
    playlist.querySelectorAll('.playlist-item-del').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const id = el.dataset.del;
        if (id === curId) { am.stop(); updatePlayUI(false); }
        AppActions.removeAudio(id);
        if (curId === id) curId = null;
        renderPlaylist();
        updateTimeline();
      });
    });

    if (miniTitle && items.length) miniTitle.textContent = items[items.length - 1].title;
    if (miniDur && items.length) miniDur.textContent = fmt(items[items.length - 1].duration);
  }

  function playId(id) {
    const a = AppState.audioLetters.find(x => x.id === id);
    if (!a) return;
    curId = id; AppActions.setCurrentAudio(id);
    am.stop();
    am.playFromDataUrl(a.dataUrl).then(() => {
      updatePlayUI(true); updateTimeline(); renderPlaylist();
    }).catch(() => showToast('播放失败'));
  }

  function updatePlayUI(playing) {
    btnPlay.textContent = playing ? '⏸️' : '▶️';
    vinyl.classList.toggle('spinning', playing);
    tonearm.classList.toggle('playing', playing);
  }

  function updateTimeline() {
    const cur = am.getCurrentTime();
    const dur = am.duration;
    fill.style.width = dur > 0 ? (cur / dur * 100) + '%' : '0%';
    curEl.textContent = fmt(cur);
    totEl.textContent = fmt(dur);
  }

  am.onUpdate = updateTimeline;

  // 录音
  async function startRec() {
    try {
      await am.startRecording();
      am.state = 'recording';
      recStart = Date.now();
      recInd.classList.remove('hidden');
      btnRec.classList.add('recording');
      btnRec.textContent = '⏹️';
      recInt = setInterval(() => {
        const el = Math.floor((Date.now() - recStart) / 1000);
        recTimer.textContent = fmt(el);
        if (el >= 45) stopRec();
      }, 200);
    } catch (e) { showToast('请在设置中允许麦克风权限'); }
  }

  async function stopRec() {
    if (am.state !== 'recording') return;
    const res = await am.stopRecording();
    btnRec.classList.remove('recording');
    btnRec.textContent = '🎙️';
    recInd.classList.add('hidden');
    clearInterval(recInt);
    if (res && res.dataUrl) {
      const a = AppActions.addAudio(res.dataUrl, res.duration, `录音 ${AppState.audioLetters.length + 1}`, res.waveform);
      curId = a.id; AppActions.setCurrentAudio(a.id);
      renderPlaylist(); updateTimeline();
      showToast('录音已保存');
    }
  }

  function togglePlay() {
    if (am.state === 'playing') { am.pause(); updatePlayUI(false); renderPlaylist(); return; }
    if (am.state === 'paused') { am.resume(); updatePlayUI(true); renderPlaylist(); return; }
    const items = AppState.audioLetters;
    if (!items.length) { showToast('请先录制或上传音频'); return; }
    const tgt = curId ? items.find(a => a.id === curId) : items[items.length - 1];
    if (tgt) playId(tgt.id);
  }

  btnRec.addEventListener('click', () => { am.state === 'recording' ? stopRec() : startRec(); });
  btnPlay.addEventListener('click', togglePlay);
  btnStop.addEventListener('click', () => { am.stop(); updatePlayUI(false); updateTimeline(); renderPlaylist(); });

  // 时间线拖拽
  let seeking = false;
  bar.addEventListener('pointerdown', e => { seeking = true; seek(e); });
  bar.addEventListener('pointermove', e => { if (seeking) seek(e); });
  bar.addEventListener('pointerup', () => { seeking = false; });
  function seek(e) {
    if (am.duration <= 0) return;
    const r = bar.getBoundingClientRect();
    am.seek(clamp((e.clientX - r.left) / r.width, 0, 1) * am.duration);
    updateTimeline();
  }

  // 上传音频
  if (upBtn) upBtn.addEventListener('click', () => upInp.click());
  if (upInp) upInp.addEventListener('change', async () => {
    const f = upInp.files[0];
    if (!f) return;
    try {
      const du = await fileToDataUrl(f);
      const ab = await f.arrayBuffer();
      const ctx = am._ensureContext();
      const buf = await ctx.decodeAudioData(ab);
      const wf = am._extractWaveform(buf);
      const a = AppActions.addAudio(du, buf.duration, f.name.replace(/\.[^.]+$/, ''), wf);
      curId = a.id;
      renderPlaylist(); updateTimeline();
      showToast('音频已添加');
    } catch (e) { showToast('音频上传失败'); }
    upInp.value = '';
  });

  EventBus.on('audio:changed', () => { renderPlaylist(); updateTimeline(); });
  startMiniWave();
  renderPlaylist();
  updateTimeline();
}

window.initAudioFold = initAudioFold;
