/* ================================================================
   Main — v4 入口：完整封面 → 风琴本流程 + 环境音乐
   ================================================================ */
(function () {
  'use strict';
  initAppState();

  const cover = document.getElementById('fold-cover');
  const accordion = document.getElementById('accordion');
  const bgCanvas = document.getElementById('bg-particles');

  // 全局背景粒子（风琴本视图用）
  let bgPS = null;
  // 环境音乐
  let ambientMusic = null;
  window._ambientMusic = null;

  function startBgParticles() {
    if (bgPS) return;
    bgPS = new ParticleSystem(bgCanvas, {
      count: 120,
      fpsCap: 24,
      connectionDistance: 90,
      mouseRadius: 0,
    });
  }

  function stopBgParticles() {
    if (bgPS) { bgPS.destroy(); bgPS = null; }
  }

  function initAmbientMusic() {
    if (!ambientMusic) {
      ambientMusic = new AmbientMusic();
      window._ambientMusic = ambientMusic;
    }
    return ambientMusic;
  }

  // 音乐切换监听
  EventBus.on('music:toggle', (on) => {
    const am = initAmbientMusic();
    if (on) {
      am.start();
    } else {
      am.stop();
    }
  });

  // 如果已解锁过，跳过封面直接进风琴本
  if (AppState.isUnlocked) {
    cover.style.display = 'none';
    accordion.classList.remove('hidden');
    startBgParticles();
    initAccordion();
    // 恢复音乐状态
    if (AppState.bgMusicOn) {
      initAmbientMusic().start();
    }
  } else {
    // 显示封面，隐藏风琴本
    cover.style.display = 'flex';
    accordion.classList.add('hidden');
    initCover();
  }

  // 监听解锁事件
  EventBus.on('unlocked', () => {
    accordion.classList.remove('hidden');
    startBgParticles();
    initAccordion();
  });

  // 返回封面时重新初始化
  EventBus.on('cover:reopen', () => {
    stopBgParticles();
    if (ambientMusic) ambientMusic.stop();
    cover.style.display = 'flex';
    cover.classList.remove('transition-out');
    setTimeout(() => initCover(), 120);
  });

  // 手势事件穿透
  document.addEventListener('gesturestart', e => e.preventDefault());

  // 页面关闭前清理
  window.addEventListener('beforeunload', () => {
    if (ambientMusic) ambientMusic.destroy();
    if (bgPS) bgPS.destroy();
  });

  console.log('📖 电子风琴本 v4 — 完整版已就绪');
})();
