/* ================================================================
   游戏褶 — Tab切换拼图+刮刮乐 v4
   增强：自动感知相册，流畅切换动画
   ================================================================ */

let gameInit = false;

function initGameFold() {
  if (gameInit) return;
  gameInit = true;

  const stage = document.getElementById('game-stage');
  const tabs = document.querySelectorAll('#game-tabs .game-tab');

  let cur = 'puzzle';

  function switchGame(g) {
    if (cur === g) return;
    cur = g;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.game === g));

    // 退出动画
    stage.style.opacity = '0';
    stage.style.transform = g === 'puzzle'
      ? 'translateX(-20px) rotateY(5deg)'
      : 'translateX(20px) rotateY(-5deg)';
    stage.style.transition = 'opacity 0.2s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';

    setTimeout(() => {
      stage.innerHTML = '';
      if (g === 'puzzle' && typeof initPuzzle === 'function') initPuzzle(stage);
      else if (g === 'scratch' && typeof initScratch === 'function') initScratch(stage);

      // 进入动画
      stage.style.opacity = '1';
      stage.style.transform = '';
    }, 280);
  }

  tabs.forEach(t => t.addEventListener('click', () => switchGame(t.dataset.game)));

  // 默认加载拼图
  stage.style.opacity = '0';
  initPuzzle(stage);
  setTimeout(() => { stage.style.opacity = '1'; stage.style.transform = ''; }, 120);
}

window.initGameFold = initGameFold;
