/* ================================================================
   电子风琴本 — 全局状态管理 v3
   ================================================================ */

const AppState = {
  isUnlocked: false,
  activeFold: 0,
  photos: [],
  audioLetters: [],
  arPhotos: [],
  futureLetters: [],
  gameData: {
    puzzleCompleted: false,
    scratchCompleted: false,
    easterEggFound: false,
    puzzleGridSize: 3,
  },
  currentAudioId: null,
  bgMusicOn: false,
};

const AppActions = {
  unlock() {
    AppState.isUnlocked = true;
    Storage.set('ac_isUnlocked', true);
    EventBus.emit('unlocked');
  },

  addPhoto(dataUrl, thumb, note) {
    const p = {
      id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      dataUrl, thumb: thumb || dataUrl, note: note || '',
      time: Date.now(),
    };
    AppState.photos.push(p);
    Storage.set('ac_photos', AppState.photos);
    EventBus.emit('photos:changed', AppState.photos);
    return p;
  },

  removePhoto(id) {
    AppState.photos = AppState.photos.filter(p => p.id !== id);
    Storage.set('ac_photos', AppState.photos);
    EventBus.emit('photos:changed', AppState.photos);
  },

  addAudio(dataUrl, duration, title, waveform) {
    const a = {
      id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      dataUrl, duration: duration || 0, title: title || '未命名',
      waveform: waveform || [], time: Date.now(),
    };
    AppState.audioLetters.push(a);
    Storage.set('ac_audio', AppState.audioLetters);
    EventBus.emit('audio:changed', AppState.audioLetters);
    return a;
  },

  removeAudio(id) {
    AppState.audioLetters = AppState.audioLetters.filter(a => a.id !== id);
    if (AppState.currentAudioId === id) AppState.currentAudioId = null;
    Storage.set('ac_audio', AppState.audioLetters);
    EventBus.emit('audio:changed', AppState.audioLetters);
  },

  setCurrentAudio(id) {
    AppState.currentAudioId = id;
  },

  addARPhoto(dataUrl) {
    const p = {
      id: 'ar' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      dataUrl, time: Date.now(),
    };
    AppState.arPhotos.push(p);
    Storage.set('ac_arPhotos', AppState.arPhotos);
    EventBus.emit('ar:changed', AppState.arPhotos);
    return p;
  },

  addFutureLetter(content, openDate) {
    const l = {
      id: 'fl' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      content, openDate: openDate || '未设定',
      createdAt: Date.now(),
    };
    AppState.futureLetters.push(l);
    Storage.set('ac_future', AppState.futureLetters);
    EventBus.emit('future:changed', AppState.futureLetters);
    return l;
  },

  removeFutureLetter(id) {
    AppState.futureLetters = AppState.futureLetters.filter(l => l.id !== id);
    Storage.set('ac_future', AppState.futureLetters);
    EventBus.emit('future:changed', AppState.futureLetters);
  },

  setPuzzleDone() {
    AppState.gameData.puzzleCompleted = true;
    Storage.set('ac_game', AppState.gameData);
  },

  setScratchDone() {
    AppState.gameData.scratchCompleted = true;
    Storage.set('ac_game', AppState.gameData);
  },

  setEasterEgg() {
    AppState.gameData.easterEggFound = true;
    Storage.set('ac_game', AppState.gameData);
  },

  toggleMusic() {
    AppState.bgMusicOn = !AppState.bgMusicOn;
    Storage.set('ac_music', AppState.bgMusicOn);
    EventBus.emit('music:toggle', AppState.bgMusicOn);
    return AppState.bgMusicOn;
  },
};

function initAppState() {
  AppState.isUnlocked = Storage.get('ac_isUnlocked', false);
  AppState.photos = Storage.get('ac_photos', []);
  AppState.audioLetters = Storage.get('ac_audio', []);
  AppState.arPhotos = Storage.get('ac_arPhotos', []);
  AppState.futureLetters = Storage.get('ac_future', []);
  AppState.gameData = Storage.get('ac_game', { puzzleCompleted: false, scratchCompleted: false, easterEggFound: false, puzzleGridSize: 3 });
  AppState.bgMusicOn = Storage.get('ac_music', false);
}

// --- Toast ---
function showToast(msg, dur = 2000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(el._tid);
  el._tid = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(-10px)';
  }, dur);
}

// --- 工具 ---
function compressImage(dataUrl, maxW = 800, q = 0.8) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxW) { h = h * maxW / w; w = maxW; }
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', q));
    };
    img.src = dataUrl;
  });
}

function fileToDataUrl(file) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// 暴露
window.AppState = AppState;
window.AppActions = AppActions;
window.showToast = showToast;
window.compressImage = compressImage;
window.fileToDataUrl = fileToDataUrl;
window.escapeHtml = escapeHtml;
