// ============================================================
// 言语理解陪练 · 主控制器
// 状态机 + Hash路由 + 视图渲染 + 用户交互
// ============================================================

(function() {
  'use strict';

  // ── 常量 ──
  const STEPS = [
    { key: 'clues',    label: '找逻辑',   icon: '🔍' },
    { key: 'feedback', label: '查遗漏',   icon: '📋' },
    { key: 'answer',   label: '选答案',   icon: '✍️' },
    { key: 'analysis', label: '看解析',   icon: '📖' },
    { key: 'similar',  label: '固同类',   icon: '🔄' }
  ];

  const STEP_INDEX = { clues: 0, feedback: 1, answer: 2, analysis: 3, similar: 4 };

  // ── 状态 ──
  let currentQuestion = null;
  let currentStep = 'clues';
  let userClueIds = [];
  let userAnswerLabel = null;
  let isAnswerLocked = false;
  let activeFilter = 'all';

  // ── 进度持久化 ──
  const STORAGE_KEY = 'logic_practice_progress';

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch(e) { return {}; }
  }

  function saveProgress(qid, data) {
    const p = loadProgress();
    p[qid] = Object.assign(p[qid] || {}, data, { updatedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function getQuestionProgress(qid) {
    return loadProgress()[qid] || null;
  }

  function markCompleted(qid, correct) {
    saveProgress(qid, { completed: true, correct, completedAt: Date.now() });
  }

  function getStats() {
    const p = loadProgress();
    const ids = Object.keys(p).filter(k => p[k].completed);
    const correct = ids.filter(k => p[k].correct).length;
    return { total: QUESTION_BANK.length, completed: ids.length, correct, accuracy: ids.length ? Math.round(correct / ids.length * 100) : 0 };
  }

  // ── DOM引用 ──
  const $app = document.getElementById('app');

  // ── 路由 ──
  function parseHash() {
    const hash = window.location.hash.replace('#/', '').split('/');
    return {
      questionId: hash[0] || null,
      step: hash[1] || 'clues'
    };
  }

  function updateHash(questionId, step) {
    window.location.hash = `#/${questionId}/${step}`;
  }

  function handleRoute() {
    const { questionId, step } = parseHash();
    if (!questionId) {
      renderHome();
      return;
    }
    const q = QUESTION_BANK.find(q => q.id === questionId);
    if (!q) {
      renderHome();
      return;
    }
    if (q !== currentQuestion) {
      currentQuestion = q;
      userClueIds = [];
      userAnswerLabel = null;
      isAnswerLocked = false;
    }
    currentStep = STEPS.find(s => s.key === step) ? step : 'clues';
    renderQuestion();
  }

  // ── 渲染入口 ──
  function renderHome() {
    currentQuestion = null;
    currentStep = null;
    const stats = getStats();
    const progress = loadProgress();

    const allTags = new Set(QUESTION_BANK.flatMap(q => q.logicTags));
    const tagCounts = {};
    allTags.forEach(t => { tagCounts[t] = QUESTION_BANK.filter(q => q.logicTags.includes(t)).length; });

    const filtered = activeFilter === 'all' ?
      QUESTION_BANK : QUESTION_BANK.filter(q => q.logicTags.includes(activeFilter));

    const typeIcons = {
      '转折关系': '↔️', '递进关系': '📈', '并列关系': '🔗', '因果关系': '⚡',
      '解释说明': '💬', '感情色彩': '🎨', '搭配习惯': '📎', '指代词': '🏷️',
      '语义对应': '🎯', '综合': '🧩'
    };

    const particles = ['的','一','是','不','了','人','在','有','中','大','这','和','上','国','为','以','生','时','要','就','出','会','可','也','对','能','下','过','子','说','成','都','看','那','得','着','自','之','年','而','后','去','用','道','行','所','然','家','种','事','方','多','工','法','学','如','同','本','经','中','国','人','民'];

    // 生成随机粒子
    const particleElements = particles.sort(() => Math.random() - 0.5).slice(0, 18).map((ch, i) =>
      `<span class="hero-particle" style="left:${Math.random()*90}%;animation-delay:-${Math.random()*12}s;animation-duration:${8+Math.random()*8}s;font-size:${1+Math.random()*2}rem;">${ch}</span>`
    ).join('');

    $app.innerHTML = `
      <!-- ═══ Hero Section ═══ -->
      <div class="hero fade-in">
        <div class="hero-particles">${particleElements}</div>
        <div class="hero-content">
          <h1>言语理解 · 逻辑填空陪练</h1>
          <p class="hero-sub">AI时代的行测训练系统 — 不是刷题，是训练思维方式</p>
          <div class="hero-method">🧣 基于 B站网友红领巾 解题方法论</div>
          <div class="hero-cta">
            <button class="btn-hero btn-hero-primary" id="hero-start">🚀 开始训练</button>
            <button class="btn-hero btn-hero-ghost" id="hero-random">🎲 随机一题</button>
          </div>
        </div>
      </div>

      <!-- ═══ Stats Bar ═══ -->
      <div class="stats-bar fade-in">
        <div class="stat-item">
          <div class="stat-num" id="counter-total">0</div>
          <div class="stat-label">📚 精品题目</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">${allTags.size}</div>
          <div class="stat-label">🏷️ 逻辑类型</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" id="counter-completed">0</div>
          <div class="stat-label">✅ 已完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" id="counter-accuracy">0%</div>
          <div class="stat-label">🎯 正确率</div>
        </div>
      </div>

      <!-- ═══ How It Works ═══ -->
      <div class="how-section fade-in">
        <h2>🧠 五步训练闭环</h2>
        <div class="steps-visual">
          <div class="step-visual-card">
            <div class="step-icon">🔍</div>
            <div class="step-num">STEP 1</div>
            <div class="step-name">找逻辑</div>
            <div class="step-desc">选项锁定，只读文段找对应线索</div>
          </div>
          <div class="step-visual-card">
            <div class="step-icon">📋</div>
            <div class="step-num">STEP 2</div>
            <div class="step-name">查遗漏</div>
            <div class="step-desc">系统对比，逐条提示漏了哪里</div>
          </div>
          <div class="step-visual-card">
            <div class="step-icon">✍️</div>
            <div class="step-num">STEP 3</div>
            <div class="step-name">选答案</div>
            <div class="step-desc">基于逻辑判断，键盘1-4快选</div>
          </div>
          <div class="step-visual-card">
            <div class="step-icon">📖</div>
            <div class="step-num">STEP 4</div>
            <div class="step-name">看解析</div>
            <div class="step-desc">本意·引申义·褒贬·人民日报例句</div>
          </div>
          <div class="step-visual-card">
            <div class="step-icon">🔄</div>
            <div class="step-num">STEP 5</div>
            <div class="step-name">固同类</div>
            <div class="step-desc">按逻辑标签推荐，闭环强化</div>
          </div>
        </div>
      </div>

      <!-- ═══ Type Badges ═══ -->
      <div class="type-badges-section fade-in">
        <h2>📂 按逻辑类型筛选</h2>
        <div class="type-badges-grid" id="type-badges-grid">
          <span class="type-badge ${activeFilter === 'all' ? 'active' : ''}" data-tag="all">
            📋 全部 <span class="badge-count">${QUESTION_BANK.length}</span>
          </span>
          ${[...allTags].map(t => `
            <span class="type-badge ${activeFilter === t ? 'active' : ''}" data-tag="${t}">
              ${typeIcons[t] || ''} ${t} <span class="badge-count">${tagCounts[t]}</span>
            </span>
          `).join('')}
        </div>
      </div>

      <!-- ═══ Question Grid ═══ -->
      <div class="section-divider fade-in">
        <span>📝 题目列表</span>
      </div>

      <div class="home-grid fade-in" id="home-grid">
        ${filtered.length === 0 ? `
          <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--ink-light);opacity:0.5;">
            📭 该类型暂无题目
          </div>
        ` : filtered.map(q => {
          const p = getQuestionProgress(q.id);
          const isCompleted = p && p.completed;
          const wasCorrect = p && p.correct;
          return `
            <a href="#/${q.id}/clues" class="question-card ${isCompleted ? 'completed' : ''}">
              <div class="q-num">${q.title}</div>
              <div class="q-title">${q.passage.replace(/______/g, '____').substring(0, 48)}${q.passage.length > 48 ? '…' : ''}</div>
              <div class="q-tags">${q.logicTags.map(t => `<span class="q-tag">${typeIcons[t] || ''} ${t}</span>`).join('')}</div>
              <div class="q-meta">
                <span class="q-diff">${'★'.repeat(q.difficulty)}${'☆'.repeat(4 - q.difficulty)}</span>
                ${isCompleted ? `<span style="font-size:0.75rem;color:${wasCorrect ? 'var(--success)' : 'var(--error)'};">${wasCorrect ? '✅' : '❌'}</span>` : '<span style="font-size:0.7rem;color:var(--ink-light);opacity:0.4;">待练习</span>'}
              </div>
            </a>
          `;
        }).join('')}
      </div>

      <!-- ═══ Bottom Actions ═══ -->
      <div class="text-center mt-16 fade-in" style="opacity:0.7;">
        <button class="btn btn-outline btn-sm" id="btn-random-question">🎲 随机一题</button>
        <button class="btn btn-outline btn-sm" id="btn-admin-panel">⚙️ 管理题库</button>
        <button class="btn btn-outline btn-sm" id="btn-import-doc">📥 导入PDF/Word</button>
        <button class="btn btn-outline btn-sm" id="btn-reset-progress">🔄 重置进度</button>
      </div>

      <p style="text-align:center;font-size:0.72rem;color:var(--ink-light);opacity:0.4;margin-top:18px;">
        💡 键盘快捷键：答题时 <kbd style="background:var(--paper-warm);border:1px solid var(--border);border-radius:3px;padding:1px 6px;font-family:monospace;">1-4</kbd> 选答案 ·
        <kbd style="background:var(--paper-warm);border:1px solid var(--border);border-radius:3px;padding:1px 6px;font-family:monospace;">Enter</kbd> 提交 ·
        <kbd style="background:var(--paper-warm);border:1px solid var(--border);border-radius:3px;padding:1px 6px;font-family:monospace;">←→</kbd> 切换步骤 ·
        <kbd style="background:var(--paper-warm);border:1px solid var(--border);border-radius:3px;padding:1px 6px;font-family:monospace;">Esc</kbd> 回首页
      </p>
    `;

    // ── 计数器动画 ──
    setTimeout(() => {
      animateCounter('counter-total', QUESTION_BANK.length);
      animateCounter('counter-completed', stats.completed);
      document.getElementById('counter-accuracy').textContent = stats.accuracy + '%';
    }, 300);

    // ── 筛选标签 ──
    document.getElementById('type-badges-grid').addEventListener('click', (e) => {
      const badge = e.target.closest('.type-badge');
      if (!badge) return;
      activeFilter = badge.dataset.tag;
      renderHome();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Hero 按钮 ──
    document.getElementById('hero-start')?.addEventListener('click', () => {
      document.querySelector('.home-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('hero-random')?.addEventListener('click', () => {
      const pool = filtered.length > 0 ? filtered : QUESTION_BANK;
      const random = pool[Math.floor(Math.random() * pool.length)];
      window.location.hash = `#/${random.id}/clues`;
    });

    // ── 底部按钮 ──
    document.getElementById('btn-random-question')?.addEventListener('click', () => {
      const pool = filtered.length > 0 ? filtered : QUESTION_BANK;
      const random = pool[Math.floor(Math.random() * pool.length)];
      window.location.hash = `#/${random.id}/clues`;
    });
    document.getElementById('btn-admin-panel')?.addEventListener('click', renderAdminPanel);
    document.getElementById('btn-import-doc')?.addEventListener('click', () => {
      if (typeof ImportWizard !== 'undefined') ImportWizard.open();
      else alert('导入向导加载中，请刷新页面后重试');
    });
    document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
      if (confirm('确定清除所有练习进度吗？此操作不可撤销。')) {
        localStorage.removeItem(STORAGE_KEY);
        renderHome();
      }
    });
  }

  // ── 数字滚动动画 ──
  function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(from + (target - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderQuestion() {
    if (!currentQuestion) return;
    const q = currentQuestion;
    $app.innerHTML = `
      <div class="fade-in">
        ${renderHeader(q)}
        ${renderProgressBar()}
        <div id="step-content" class="fade-in">
          ${currentStep === 'clues'    ? renderCluesStep(q) :
            currentStep === 'feedback' ? renderFeedbackStep(q) :
            currentStep === 'answer'   ? renderAnswerStep(q) :
            currentStep === 'analysis' ? renderAnalysisStep(q) :
            currentStep === 'similar'  ? renderSimilarStep(q) : ''}
        </div>
      </div>
    `;

    // 绑定事件
    if (currentStep === 'clues') bindClueEvents(q);
    if (currentStep === 'feedback') bindFeedbackEvents(q);
    if (currentStep === 'answer') bindAnswerEvents(q);
    if (currentStep === 'analysis') bindAnalysisEvents(q);
    if (currentStep === 'similar') bindSimilarEvents(q);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Header ──
  function renderHeader(q) {
    return `
      <div class="app-header">
        <h1>${q.title}</h1>
        <p class="subtitle">${q.source || ''} · 难度 ${'★'.repeat(q.difficulty)}${'☆'.repeat(4 - q.difficulty)}</p>
      </div>
    `;
  }

  // ── Progress Bar ──
  function renderProgressBar() {
    const curIdx = STEP_INDEX[currentStep];
    return `
      <div class="progress-bar-wrap">
        ${STEPS.map((s, i) => {
          let cls = '';
          if (i < curIdx) cls = 'done';
          else if (i === curIdx) cls = 'active';
          return `
            <div class="progress-step ${cls}"></div>
            <span class="progress-label ${cls}">${s.icon} ${s.label}</span>
          `;
        }).join('')}
      </div>
    `;
  }

  // ═══════════════════════════════════════════
  // STEP 1: 找逻辑线索
  // ═══════════════════════════════════════════
  function renderCluesStep(q) {
    const passageHTML = renderPassage(q, true);
    const allClues = q.logicClues;

    return `
      <div class="card">
        <div class="card-title">
          <span class="step-badge">1</span> 读文段，找逻辑对应
        </div>
        <p class="card-subtitle">
          ⚠️ 选项已隐藏。请先仔细阅读文段，在下方勾选你找到的<strong>逻辑线索</strong>（关联词、标点、语义对应等）。
        </p>

        ${passageHTML}

        <div class="options-hidden-overlay" id="options-hidden">
          <span class="lock-icon">🔒</span>
          <strong>选项区域已锁定</strong>
          <p style="margin-top:4px;font-size:0.8rem;">完成逻辑分析后，点击下方"提交"解锁选项</p>
        </div>

        <div class="card-title mt-20" style="font-size:0.95rem;">
          <span>🎯</span> 我找到了以下逻辑线索（可多选）
        </div>
        <div class="clue-tags" id="clue-tags">
          ${allClues.map(clue => `
            <span class="clue-tag" data-clue-id="${clue.id}">
              <span class="clue-type-tag" style="font-size:0.75rem;opacity:0.7;">[${clue.type}]</span>
              ${clue.keyword}
            </span>
          `).join('')}
        </div>
        <p style="font-size:0.78rem;color:var(--ink-light);opacity:0.6;margin-top:4px;">
          提示：点击标签选中/取消。不确定的也请尝试勾选，提交后查看分析。<br>
          按 <kbd class="kbd-hint">Enter</kbd> 快速提交 · 按 <kbd class="kbd-hint">→</kbd> 跳下一步
        </p>

        <div class="btn-row">
          <button class="btn btn-primary btn-lg" id="btn-submit-clues" ${userClueIds.length === 0 ? 'disabled' : ''}>
            提交线索分析 →
          </button>
          <span style="font-size:0.85rem;color:var(--ink-light);align-self:center;">
            已选 <strong id="clue-count">${userClueIds.length}</strong> / ${allClues.length}
          </span>
        </div>
      </div>
    `;
  }

  function bindClueEvents(q) {
    const $tags = document.querySelectorAll('.clue-tag');
    const $btn = document.getElementById('btn-submit-clues');
    const $count = document.getElementById('clue-count');

    // 恢复已选
    $tags.forEach($tag => {
      const cid = $tag.dataset.clueId;
      if (userClueIds.includes(cid)) $tag.classList.add('selected');
      $tag.addEventListener('click', () => {
        $tag.classList.toggle('selected');
        const idx = userClueIds.indexOf(cid);
        if (idx >= 0) userClueIds.splice(idx, 1);
        else userClueIds.push(cid);
        $count.textContent = userClueIds.length;
        $btn.disabled = userClueIds.length === 0;
      });
    });

    $btn.addEventListener('click', () => {
      if (userClueIds.length === 0) return;
      updateHash(q.id, 'feedback');
    });
  }

  // ═══════════════════════════════════════════
  // STEP 2: 遗漏反馈
  // ═══════════════════════════════════════════
  function renderFeedbackStep(q) {
    const allClues = q.logicClues;
    const foundIds = new Set(userClueIds);
    const missedIds = allClues.filter(c => !foundIds.has(c.id)).map(c => c.id);

    // 匹配遗漏提示
    const foundItems = allClues.filter(c => foundIds.has(c.id));
    const missedItems = allClues.filter(c => !foundIds.has(c.id));

    const relevantMisses = q.commonMisses.filter(m =>
      m.relatedClueIds && m.relatedClueIds.some(id => missedIds.includes(id))
    );

    const foundCount = foundItems.length;
    const totalCount = allClues.length;
    const scorePercent = Math.round((foundCount / totalCount) * 100);

    return `
      <div class="card">
        <div class="card-title">
          <span class="step-badge">2</span> 逻辑线索检查结果
        </div>

        ${scorePercent === 100 ?
          `<div class="result-banner correct">
            <div class="result-emoji">🎉</div>
            <div class="result-text">太棒了！你找到了全部 ${totalCount} 条逻辑线索！</div>
          </div>` :
          `<div class="result-banner wrong">
            <div class="result-emoji">🔍</div>
            <div class="result-text">你找到了 ${foundCount} / ${totalCount} 条线索（${scorePercent}%），还有 ${totalCount - foundCount} 条遗漏</div>
          </div>`
        }

        <div class="card-subtitle" style="margin-top:12px;">
          <strong>✅ 你找到的：</strong>
        </div>
        ${foundItems.map(c => `
          <div class="feedback-item found">
            <span class="feedback-icon">✅</span>
            <span class="feedback-title">[${c.type}] ${c.keyword}</span>
            <div class="feedback-desc">${c.description}</div>
            ${c.redScarfTip ? `<div class="red-scarf-tip" style="margin-top:8px;padding:8px 12px;font-size:0.8rem;">🧣 巾神说：${c.redScarfTip}</div>` : ''}
          </div>
        `).join('')}

        ${missedItems.length > 0 ? `
          <div class="card-subtitle" style="margin-top:16px;">
            <strong>❌ 你漏掉的：</strong>
          </div>
          ${missedItems.map(c => `
            <div class="feedback-item missed">
              <span class="feedback-icon">❌</span>
              <span class="feedback-title">[${c.type}] ${c.keyword}</span>
              <div class="feedback-desc">${c.description}</div>
              <div class="feedback-desc" style="margin-top:6px;font-weight:600;color:var(--error);">
                💡 怎么看：看到文段中"${c.keyword}"时，应该马上意识到——${c.description.substring(0, 80)}…
              </div>
              ${c.redScarfTip ? `<div class="red-scarf-tip" style="margin-top:8px;padding:8px 12px;font-size:0.8rem;">🧣 巾神说：${c.redScarfTip}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${relevantMisses.length > 0 ? `
          <div class="card-subtitle" style="margin-top:16px;">
            <strong>🧣 红领巾详细分析：</strong>
          </div>
          ${relevantMisses.map(m => `
            <div class="feedback-item missed" style="background:#fff5f5;">
              <div class="feedback-desc">${m.feedback}</div>
              ${m.redScarfTip ? `<div class="red-scarf-tip">${m.redScarfTip}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}

        <div class="btn-row">
          <button class="btn btn-outline btn-sm" id="btn-back-clues">← 返回重找</button>
          <button class="btn btn-primary btn-lg" id="btn-to-answer">看选项，开始作答 →</button>
        </div>
      </div>
    `;
  }

  function bindFeedbackEvents(q) {
    document.getElementById('btn-back-clues')?.addEventListener('click', () => {
      userClueIds = [];
      userAnswerLabel = null;
      isAnswerLocked = false;
      updateHash(q.id, 'clues');
    });
    document.getElementById('btn-to-answer')?.addEventListener('click', () => {
      updateHash(q.id, 'answer');
    });
  }

  // ═══════════════════════════════════════════
  // STEP 3: 作答
  // ═══════════════════════════════════════════
  function renderAnswerStep(q) {
    // 未作答时显示空格，作答锁定后显示正确答案
    const passageHTML = renderPassage(q, !isAnswerLocked);
    const hasMultipleBlanks = q.blanks && q.blanks.length > 1;
    const correctOption = q.options.find(opt => opt.isCorrect);
    const correctLabel = correctOption ? correctOption.label : null;

    return `
      <div class="card">
        <div class="card-title">
          <span class="step-badge">3</span> 选择答案
        </div>
        <p class="card-subtitle">
          🎯 选项已解锁！请根据刚才的逻辑分析选择正确答案。
          ${hasMultipleBlanks ? '<br><small>本题有 ' + q.blanks.length + ' 个空格，选择一个选项组即可。</small>' : ''}
        </p>

        ${passageHTML}

        ${q.blanks && q.blanks.length > 1 ? `
          <div class="options-grid">
            ${q.options.map(opt => {
              const isSelected = userAnswerLabel === opt.label;
              const isCorrectOpt = opt.isCorrect;
              let extraClass = '';
              if (isAnswerLocked && isSelected && isCorrectOpt) extraClass = 'correct';
              else if (isAnswerLocked && isSelected && !isCorrectOpt) extraClass = 'wrong';
              else if (isAnswerLocked && isCorrectOpt) extraClass = 'correct';
              else if (isSelected) extraClass = 'selected';

              return `
                <button class="option-btn ${extraClass}"
                        data-option-label="${opt.label}"
                        data-is-correct="${isCorrectOpt}"
                        ${isAnswerLocked ? 'disabled' : ''}>
                  <span class="option-label">${opt.label}</span>
                  <span class="option-word">${opt.words ? opt.words.join(' + ') : opt.word}</span>
                </button>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="options-grid">
            ${q.options.map(opt => {
              const isSelected = userAnswerLabel === opt.label;
              const isCorrectOpt = opt.isCorrect;
              let extraClass = '';
              if (isAnswerLocked && isSelected && isCorrectOpt) extraClass = 'correct';
              else if (isAnswerLocked && isSelected && !isCorrectOpt) extraClass = 'wrong';
              else if (isAnswerLocked && isCorrectOpt) extraClass = 'correct';
              else if (isSelected) extraClass = 'selected';

              return `
                <button class="option-btn ${extraClass}"
                        data-option-label="${opt.label}"
                        data-is-correct="${isCorrectOpt}"
                        ${isAnswerLocked ? 'disabled' : ''}>
                  <span class="option-label">${opt.label}</span>
                  <span class="option-word">${opt.word}</span>
                </button>
              `;
            }).join('')}
          </div>
        `}

        ${isAnswerLocked ? renderResultBanner(q) : ''}

        ${isAnswerLocked ? `
          <div class="btn-row">
            <button class="btn btn-accent btn-lg" id="btn-to-analysis">查看详细解析 →</button>
          </div>
        ` : `
          <div class="btn-row">
            <button class="btn btn-outline btn-sm" id="btn-back-feedback">← 回顾线索</button>
            <span style="font-size:0.85rem;color:var(--ink-light);align-self:center;margin-left:auto;">
              ${userAnswerLabel ? '已选择选项 ' + userAnswerLabel + '，点击可更改' : '请选择一个选项'}
            </span>
          </div>
          <p style="font-size:0.75rem;color:var(--ink-light);opacity:0.5;margin-top:8px;">
            选择后自动判定答案 · 键盘 <kbd class="kbd-hint">1</kbd><kbd class="kbd-hint">2</kbd><kbd class="kbd-hint">3</kbd><kbd class="kbd-hint">4</kbd> 快速选择
          </p>
        `}
      </div>
    `;
  }

  function bindAnswerEvents(q) {
    if (isAnswerLocked) {
      document.getElementById('btn-to-analysis')?.addEventListener('click', () => {
        updateHash(q.id, 'analysis');
      });
      document.getElementById('btn-back-feedback')?.addEventListener('click', () => {
        updateHash(q.id, 'feedback');
      });
      return;
    }

    document.querySelectorAll('.option-btn').forEach($btn => {
      $btn.addEventListener('click', () => {
        if (isAnswerLocked) return;
        userAnswerLabel = $btn.dataset.optionLabel;
        isAnswerLocked = true;
        onAnswerSubmitted(q);
        renderQuestion();
      });
    });

    document.getElementById('btn-back-feedback')?.addEventListener('click', () => {
      updateHash(q.id, 'feedback');
    });
  }

  // ── 全局键盘快捷键 ──
  function handleKeyboard(e) {
    if (!currentQuestion) return;

    // 作答步骤：1-4 选答案 (不区分大小写,不拦截输入框内按键)
    if (currentStep === 'answer' && !isAnswerLocked) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        const btns = document.querySelectorAll('.option-btn');
        if (btns[keyMap[e.key]]) {
          btns[keyMap[e.key]].click();
        }
      }
      if (e.key === 'Enter' && userAnswerLabel) {
        e.preventDefault();
        // 如果已选但未锁定（不应该发生），触发锁定
        document.querySelectorAll('.option-btn').forEach(b => {
          if (b.dataset.optionLabel === userAnswerLabel && !isAnswerLocked) {
            b.click();
          }
        });
      }
    }

    // 线索步骤：Enter 提交
    if (currentStep === 'clues' && e.key === 'Enter' && userClueIds.length > 0) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      updateHash(currentQuestion.id, 'feedback');
    }

    // 通用：→ = 下一步
    if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      const nextMap = {
        'clues': 'feedback',
        'feedback': 'answer',
        'answer': 'analysis',
        'analysis': 'similar'
      };
      if (nextMap[currentStep] && (currentStep !== 'answer' || isAnswerLocked)) {
        updateHash(currentQuestion.id, nextMap[currentStep]);
      }
    }

    // 通用：← = 上一步
    if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      const prevMap = {
        'feedback': 'clues',
        'answer': 'feedback',
        'analysis': 'answer',
        'similar': 'analysis'
      };
      if (prevMap[currentStep]) {
        updateHash(currentQuestion.id, prevMap[currentStep]);
      }
    }

    // Escape = 回首页
    if (e.key === 'Escape' && !e.ctrlKey && !e.metaKey) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      window.location.hash = '#/';
    }
  }

  // ── 标记完成 + 彩带 ──
  function onAnswerSubmitted(q) {
    const correctOption = q.options.find(opt => opt.isCorrect);
    const isCorrect = userAnswerLabel === (correctOption ? correctOption.label : null);
    markCompleted(q.id, isCorrect);
    if (isCorrect) spawnConfetti();
  }

  function spawnConfetti() {
    const colors = ['#b5343a','#c9a96e','#2d7d46','#3a6b8c','#e8d5b0','#d4644a'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.top = -(Math.random() * 60 + 20) + 'px';
      piece.style.width = (Math.random() * 8 + 5) + 'px';
      piece.style.height = (Math.random() * 8 + 5) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      piece.style.animationDelay = Math.random() * 0.6 + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }
  }

  // ── 管理面板 ──
  function renderAdminPanel() {
    // 移除已有面板
    document.querySelector('.admin-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.innerHTML = `
      <div class="admin-panel fade-in">
        <button class="close-btn" id="admin-close">✕</button>
        <h2>⚙️ 题库管理</h2>

        <div class="admin-section">
          <h3>📊 题库概况</h3>
          <p style="font-size:0.9rem;color:var(--ink-light);">
            总题数：<strong>${QUESTION_BANK.length}</strong> ·
            逻辑类型：<strong>${new Set(QUESTION_BANK.flatMap(q => q.logicTags)).size}</strong> 种 ·
            已完成：<strong>${getStats().completed}</strong> 题
          </p>
        </div>

        <div class="admin-section">
          <h3>📥 导出题库</h3>
          <p style="font-size:0.82rem;color:var(--ink-light);margin-bottom:8px;">
            将当前题库导出为 JSON 文件，可备份或与他人共享。
          </p>
          <button class="btn btn-outline btn-sm" id="btn-export-json">📦 导出 JSON</button>
          <button class="btn btn-outline btn-sm" id="btn-export-template">📋 下载题目模板</button>
        </div>

        <div class="admin-section">
          <h3>📤 导入题目</h3>
          <p style="font-size:0.82rem;color:var(--ink-light);margin-bottom:8px;">
            粘贴符合格式的 JSON 题目数据（可多条），格式参见模板。
          </p>
          <textarea id="import-textarea" rows="8" placeholder='粘贴 JSON 题目数据，例如：
[
  {
    "id": "q011",
    "title": "第11题 · xxx",
    "type": "逻辑填空",
    "passage": "文段内容...",
    ...
  }
]'></textarea>
          <div class="btn-row" style="margin-top:10px;">
            <button class="btn btn-accent btn-sm" id="btn-import-json">📥 导入并刷新</button>
            <span id="import-status" style="font-size:0.8rem;align-self:center;"></span>
          </div>
        </div>

        <div class="admin-section">
          <h3>➕ 快速添加题目</h3>
          <p style="font-size:0.82rem;color:var(--ink-light);margin-bottom:8px;">
            支持从 PDF / Word / 纯文本文件中导入题目。自动提取文字，智能映射字段。
          </p>
          <button class="btn btn-accent btn-sm" id="btn-open-import-wizard">📥 打开导入向导（支持PDF/Word/TXT）</button>
        </div>

        <div class="admin-section">
          <h3>📖 维护指南</h3>
          <ol style="font-size:0.82rem;color:var(--ink-light);line-height:1.8;padding-left:18px;">
            <li>编辑 <code>js/question-bank.js</code>，在数组末尾添加新题目对象</li>
            <li>确保 <code>id</code> 唯一、<code>logicClues</code> 至少2条、<code>commonMisses</code> 至少1条</li>
            <li>新词/成语同步补充到 <code>js/idiom-dict.js</code></li>
            <li>新指代词补充到 <code>js/metaphor-dict.js</code></li>
            <li>提交前用本面板的"校验 JSON"功能检查格式</li>
            <li>推送到 GitHub 后自动更新在线版</li>
          </ol>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 关闭
    overlay.querySelector('#admin-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // 导出题库JSON
    overlay.querySelector('#btn-export-json').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(QUESTION_BANK, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'logic-fill-question-bank.json';
      a.click();
      showAdminToast('题库已导出 ✅', 'success');
    });

    // 导出模板
    overlay.querySelector('#btn-export-template').addEventListener('click', () => {
      const template = [{
        id: "qNEW",
        title: "第X题 · 逻辑类型",
        type: "逻辑填空",
        logicTags: ["语义对应", "感情色彩"],
        difficulty: 2,
        source: "来源（如 2024国考真题改编）",
        passage: "文段中用______表示空格，如有多个空格都用______",
        blanks: [{ index: 0, marker: "______", correctWord: "正确答案" }],
        options: [
          { label: "A", word: "词A", isCorrect: true, isIdiom: false, isMetaphor: false,
            analysis: { originalMeaning: "本意", extendedMeaning: "引申义", connotation: "褒/贬/中性", commonTargets: "常用对象", rmrbExample: "人民日报例句" } },
          { label: "B", word: "词B", isCorrect: false, analysis: { differenceFromCorrect: "为什么不对" } },
          { label: "C", word: "词C", isCorrect: false },
          { label: "D", word: "词D", isCorrect: false }
        ],
        logicClues: [{ id: "clue-1", type: "关联词/标点符号/语义对应/感情色彩/搭配习惯", keyword: "关键词", description: "这条线索说明了什么", location: "在文段的位置", redScarfTip: "巾神技巧提示(可选)" }],
        commonMisses: [{ id: "miss-1", relatedClueIds: ["clue-1"], feedback: "你漏了...", redScarfTip: "巾神说：..." }],
        similarQuestions: []
      }];
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'question-template.json';
      a.click();
      showAdminToast('模板已下载 📋', 'success');
    });

    // 导入JSON
    overlay.querySelector('#btn-import-json').addEventListener('click', () => {
      const text = overlay.querySelector('#import-textarea').value.trim();
      const statusEl = overlay.querySelector('#import-status');
      if (!text) { statusEl.textContent = '请先粘贴 JSON 数据'; statusEl.style.color = 'var(--error)'; return; }
      try {
        const imported = JSON.parse(text);
        const arr = Array.isArray(imported) ? imported : [imported];
        // 基本校验
        const errors = [];
        arr.forEach((q, i) => {
          if (!q.id) errors.push(`第${i+1}条缺少 id`);
          if (!q.passage) errors.push(`第${i+1}条缺少 passage`);
          if (!q.options || q.options.length !== 4) errors.push(`第${i+1}条选项必须是4个`);
        });
        if (errors.length > 0) {
          statusEl.innerHTML = errors.join('<br>');
          statusEl.style.color = 'var(--error)';
          return;
        }
        // 检查ID冲突
        const existingIds = new Set(QUESTION_BANK.map(q => q.id));
        const conflicts = arr.filter(q => existingIds.has(q.id));
        if (conflicts.length > 0) {
          statusEl.textContent = `⚠️ ID冲突：${conflicts.map(q => q.id).join(', ')}。请修改后重试。`;
          statusEl.style.color = 'var(--error)';
          return;
        }
        // 追加到题库
        arr.forEach(q => QUESTION_BANK.push(q));
        statusEl.textContent = `✅ 成功导入 ${arr.length} 道题！刷新页面生效。`;
        statusEl.style.color = 'var(--success)';
        showAdminToast(`成功导入 ${arr.length} 道题！`, 'success');
        // 3秒后刷新
        setTimeout(() => { window.location.hash = '#/'; window.location.reload(); }, 1500);
      } catch(e) {
        statusEl.textContent = `JSON 解析错误：${e.message}`;
        statusEl.style.color = 'var(--error)';
      }
    });

    // 导入向导按钮
    overlay.querySelector('#btn-open-import-wizard')?.addEventListener('click', () => {
      overlay.remove();
      if (typeof ImportWizard !== 'undefined') ImportWizard.open();
      else alert('导入向导加载中，请刷新后重试');
    });
  }

  function showAdminToast(msg, type) {
    document.querySelector('.admin-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  function renderResultBanner(q) {
    const correctOption = q.options.find(opt => opt.isCorrect);
    const correctLabel = correctOption ? correctOption.label : '?';
    let correctWord;
    if (correctOption && correctOption.words) {
      correctWord = correctOption.words.join(' + ');
    } else if (correctOption) {
      correctWord = correctOption.word;
    } else {
      correctWord = q.blanks ? q.blanks.map(b => b.correctWord).join(' + ') : '';
    }

    const isCorrect = userAnswerLabel === correctLabel;

    if (isCorrect) {
      return `
        <div class="result-banner correct pulse mt-16">
          <div class="result-emoji">✅</div>
          <div class="result-text">回答正确！答案：<strong>${correctLabel}. ${correctWord}</strong></div>
        </div>
      `;
    } else {
      return `
        <div class="result-banner wrong pulse mt-16">
          <div class="result-emoji">❌</div>
          <div class="result-text">回答错误。正确答案：<strong>${correctLabel}. ${correctWord}</strong></div>
        </div>
      `;
    }
  }

  // ═══════════════════════════════════════════
  // STEP 4: 选项解析
  // ═══════════════════════════════════════════
  function renderAnalysisStep(q) {
    return `
      <div class="card">
        <div class="card-title">
          <span class="step-badge">4</span> 选项深度解析
        </div>
        <p class="card-subtitle">
          📖 点击每个选项展开查看：本意、引申义、褒贬、常用对象、人民日报例句
        </p>

        <div class="analysis-accordion">
          ${q.options.map((opt, idx) => {
            const isCorrect = opt.isCorrect;
            const word = opt.word || (opt.words ? opt.words.join(' + ') : '');
            const analyses = opt.analyses || (opt.analysis ? [opt.analysis] : []);
            const isIdiom = opt.isIdiom || (opt.analyses && opt.analyses.some(a => a.isIdiom));
            const isMetaphor = opt.isMetaphor || (opt.analyses && opt.analyses.some(a => a.isMetaphor));

            return `
              <div class="analysis-card ${isCorrect ? 'correct-answer' : ''}"
                   data-option-idx="${idx}">
                <div class="analysis-card-header">
                  <span class="word-title">
                    <span class="option-label" style="color:var(--accent);font-weight:700;">${opt.label}.</span>
                    ${word}
                    ${isCorrect ? '<span class="badge badge-correct">✓ 正确答案</span>' : ''}
                    ${isIdiom ? '<span class="badge badge-idiom">成语</span>' : ''}
                    ${isMetaphor ? '<span class="badge badge-metaphor">指代词</span>' : ''}
                    ${!isIdiom && !isMetaphor && word.length <= 2 ? '<span class="badge badge-hot">热点词</span>' : ''}
                  </span>
                  <span class="expand-icon">▼</span>
                </div>
                <div class="analysis-card-body">
                  <div class="analysis-card-content">
                    ${analyses.map(a => renderAnalysisFields(a, q, opt)).join('')}
                    ${word.includes('+') || (opt.words && opt.words.length > 1) ? '' : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="btn-row">
          <button class="btn btn-outline btn-sm" id="btn-back-answer">← 返回题目</button>
          <button class="btn btn-accent btn-lg" id="btn-to-similar">固同类题型 →</button>
        </div>
      </div>
    `;
  }

  function renderAnalysisFields(analysis, q, opt) {
    let html = '';

    if (analysis.originalMeaning) {
      html += `
        <div class="analysis-field">
          <div class="field-label">📖 本意</div>
          <div class="field-value">${analysis.originalMeaning}</div>
        </div>
      `;
    }

    if (analysis.extendedMeaning) {
      html += `
        <div class="analysis-field">
          <div class="field-label">💡 引申义</div>
          <div class="field-value">${analysis.extendedMeaning}</div>
        </div>
      `;
    }

    if (analysis.connotation) {
      html += `
        <div class="analysis-field">
          <div class="field-label">⚖️ 褒贬</div>
          <div class="field-value">${analysis.connotation}</div>
        </div>
      `;
    }

    if (analysis.commonTargets) {
      html += `
        <div class="analysis-field">
          <div class="field-label">🎯 常用对象</div>
          <div class="field-value">${analysis.commonTargets}</div>
        </div>
      `;
    }

    // 指代词特别字段
    if (analysis.metaphorSource) {
      html += `
        <div class="analysis-field">
          <div class="field-label">🔗 比喻来源</div>
          <div class="field-value">${analysis.metaphorSource}</div>
        </div>
      `;
    }

    if (analysis.metaphorUsage) {
      html += `
        <div class="analysis-field">
          <div class="field-label">📝 比喻用法</div>
          <div class="field-value">${analysis.metaphorUsage}</div>
        </div>
      `;
    }

    if (analysis.rmrbExample) {
      html += `
        <div class="analysis-field rmrb">
          <div class="field-label">📰 人民日报例句</div>
          <div class="field-value">${analysis.rmrbExample}</div>
        </div>
      `;
    }

    // 干扰项为什么错
    if (analysis.differenceFromCorrect) {
      html += `
        <div class="analysis-field diff">
          <div class="field-label">❌ 为什么不对</div>
          <div class="field-value">${analysis.differenceFromCorrect}</div>
        </div>
      `;
    }

    // 常见误用
    if (analysis.commonMistakes) {
      html += `
        <div class="analysis-field">
          <div class="field-label">⚠️ 常见误用</div>
          <div class="field-value">${analysis.commonMistakes}</div>
        </div>
      `;
    }

    return html;
  }

  function bindAnalysisEvents(q) {
    document.querySelectorAll('.analysis-card-header').forEach($header => {
      $header.addEventListener('click', function() {
        this.parentElement.classList.toggle('open');
      });
    });

    // 默认展开正确答案
    const $correctCard = document.querySelector('.analysis-card.correct-answer');
    if ($correctCard) {
      $correctCard.classList.add('open');
    }

    document.getElementById('btn-back-answer')?.addEventListener('click', () => {
      updateHash(q.id, 'answer');
    });
    document.getElementById('btn-to-similar')?.addEventListener('click', () => {
      updateHash(q.id, 'similar');
    });
  }

  // ═══════════════════════════════════════════
  // STEP 5: 同类题巩固
  // ═══════════════════════════════════════════
  function renderSimilarStep(q) {
    const similarIds = q.similarQuestions || [];
    const similarQuestions = similarIds
      .map(id => QUESTION_BANK.find(qq => qq.id === id))
      .filter(Boolean);

    return `
      <div class="card">
        <div class="card-title">
          <span class="step-badge">5</span> 同类型题巩固
        </div>
        <p class="card-subtitle">
          🎯 本题考察：<strong>${q.logicTags.join(' + ')}</strong>。
          以下题目与本题逻辑类型相同，推荐继续练习加深理解。
        </p>

        ${similarQuestions.length > 0 ? `
          <div class="similar-section">
            <h3>📚 推荐同类题（${similarQuestions.length}道）</h3>
            <div class="similar-list">
              ${similarQuestions.map(sq => `
                <a href="#/${sq.id}/clues" class="similar-chip">
                  ${sq.title}
                </a>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="similar-section">
            <h3>📚 暂无更多同类题</h3>
            <p style="font-size:0.9rem;color:var(--ink-light);">题库正在扩充中，敬请期待。</p>
          </div>
        `}

        <div class="btn-row" style="justify-content:center;">
          <button class="btn btn-outline" id="btn-back-analysis">← 回顾解析</button>
          <a href="#/" class="btn btn-primary">🏠 回到首页</a>
        </div>
      </div>
    `;
  }

  function bindSimilarEvents(q) {
    document.getElementById('btn-back-analysis')?.addEventListener('click', () => {
      updateHash(q.id, 'analysis');
    });
  }

  // ── 工具函数 ──
  function renderPassage(q, hideBlanks) {
    let text = q.passage;
    // 替换空格标记
    if (q.blanks && q.blanks.length > 0) {
      q.blanks.forEach((blank, i) => {
        const word = hideBlanks ? '______' : (blank.correctWord || '______');
        text = text.replace('______', `<span class="blank-marker${!hideBlanks ? ' filled' : ''}">${word}</span>`);
      });
    }
    return `<div class="passage-box">${text}</div>`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── 初始化 ──
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);
  window.addEventListener('keydown', handleKeyboard);

})();
