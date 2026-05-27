/* ================================================================
   风琴容器 — 3D折叠展开 + 懒加载 v4
   ================================================================ */

let accInit = false;

function initAccordion() {
  if (accInit) return;
  const scroller = document.getElementById('acc-scroller');
  if (!scroller) return;
  accInit = true;

  const folds = Array.from(scroller.querySelectorAll('.acc-fold'));
  const dots = Array.from(document.querySelectorAll('.acc-dot'));
  const backBtn = document.getElementById('acc-back');
  const musicBtn = document.getElementById('acc-music');
  const accordion = document.getElementById('accordion');

  let current = -1;
  let busy = false;
  const loaded = [false, false, false, false];

  const initMap = {
    0: 'initPhotoFold',
    1: 'initAudioFold',
    2: 'initGameFold',
    3: 'initARFold',
  };

  function loadFold(i) {
    if (loaded[i]) return;
    loaded[i] = true;
    const fn = initMap[i];
    if (fn && typeof window[fn] === 'function') setTimeout(() => window[fn](), 150);
  }

  function expand(i) {
    if (busy || current === i) return;
    busy = true;

    // 折叠上一个
    if (current >= 0) {
      folds[current].classList.remove('expanded');
    }

    // 展开新的
    folds[i].classList.add('expanded');
    current = i;
    AppState.activeFold = i;
    loadFold(i);
    updateDots(i);

    // 通知AR fold
    EventBus.emit('fold:activeChanged', i);

    // 滚动到视图
    const foldTop = folds[i].offsetTop;
    scroller.scrollTo({ top: foldTop - 10, behavior: 'smooth' });

    setTimeout(() => { busy = false; }, 550);
  }

  function collapse() {
    if (busy || current < 0) return;
    busy = true;
    folds[current].classList.remove('expanded');
    current = -1;
    updateDots(-1);
    EventBus.emit('fold:activeChanged', -1);
    setTimeout(() => { busy = false; }, 400);
  }

  // Tab点击：toggle展开/折叠
  folds.forEach((f, i) => {
    const tab = f.querySelector('.fold-tab');
    if (!tab) return;
    tab.addEventListener('click', () => {
      if (f.classList.contains('expanded')) collapse();
      else expand(i);
    });
  });

  // 滚动自动展开
  let st;
  scroller.addEventListener('scroll', () => {
    if (busy) return;
    clearTimeout(st);
    st = setTimeout(() => {
      const stp = scroller.scrollTop;
      const vh = scroller.clientHeight;
      let best = -1, bestDist = Infinity;
      folds.forEach((f, i) => {
        const mid = f.offsetTop + f.offsetHeight * 0.35;
        const d = Math.abs(stp + vh * 0.35 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best >= 0 && best !== current) {
        if (current >= 0) folds[current].classList.remove('expanded');
        folds[best].classList.add('expanded');
        current = best;
        loadFold(best);
        updateDots(best);
        EventBus.emit('fold:activeChanged', best);
      }
    }, 250);
  }, { passive: true });

  // 侧边导航点
  dots.forEach(d => {
    d.addEventListener('click', () => {
      const i = parseInt(d.dataset.dot);
      if (i >= 0 && i < folds.length) expand(i);
    });
  });

  function updateDots(idx) {
    dots.forEach(d => d.classList.toggle('active', parseInt(d.dataset.dot) === idx));
  }

  // ===== 返回封面 =====
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      accordion.classList.add('hidden');
      accInit = false;
      loaded.fill(false);
      if (current >= 0) {
        folds[current].classList.remove('expanded');
        current = -1;
      }
      updateDots(-1);
      AppState.isUnlocked = false;
      Storage.remove('ac_isUnlocked');
      // 通知重新打开封面
      EventBus.emit('cover:reopen');
    });
  }

  // ===== 背景音乐 =====
  if (musicBtn) {
    musicBtn.textContent = AppState.bgMusicOn ? '🔊' : '🎵';
    musicBtn.addEventListener('click', () => {
      const on = AppActions.toggleMusic();
      musicBtn.textContent = on ? '🔊' : '🎵';
      if (on) {
        showToast('背景音乐已开启 🎵');
      } else {
        showToast('背景音乐已关闭');
      }
    });
  }

  // 键盘快捷键
  document.addEventListener('keydown', e => {
    if (accordion.classList.contains('hidden')) return;
    if ((e.key === 'ArrowDown' || e.key === 'j') && current < folds.length - 1) {
      e.preventDefault(); expand(current + 1);
    } else if ((e.key === 'ArrowUp' || e.key === 'k') && current > 0) {
      e.preventDefault(); expand(current - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault(); collapse();
    }
  });

  // 默认自动展开第一个褶
  if (folds.length > 0) expand(0);
}

window.initAccordion = initAccordion;
