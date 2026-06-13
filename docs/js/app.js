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
  let userAnswerLabel = null;   // 存储用户选择的选项标签(A/B/C/D)，兼容单空和多空题
  let isAnswerLocked = false;

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
    $app.innerHTML = `
      <div class="app-header fade-in">
        <h1>言语理解 · 逻辑填空陪练</h1>
        <p class="subtitle">基于网友红领巾解题方法论 · 先找逻辑，再看选项</p>
      </div>
      <div class="card fade-in">
        <div class="card-title"><span class="step-badge">📚</span> 选择题库</div>
        <p class="card-subtitle">共 ${QUESTION_BANK.length} 道真题改编，覆盖全部逻辑类型。点击开始练习。</p>
        <div class="home-grid">
          ${QUESTION_BANK.map(q => `
            <a href="#/${q.id}/clues" class="question-card">
              <div class="q-num">${q.title}</div>
              <div class="q-title">${q.passage.substring(0, 40)}…</div>
              <div class="q-tags">${q.logicTags.map(t => `<span class="q-tag">${t}</span>`).join('')}</div>
              <div class="q-diff">难度：${'★'.repeat(q.difficulty)}${'☆'.repeat(4 - q.difficulty)}</div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
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
          提示：点击标签选中/取消。不确定的也请尝试勾选，提交后查看分析。
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
            选择后自动判定答案
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
        renderQuestion();
      });
    });

    document.getElementById('btn-back-feedback')?.addEventListener('click', () => {
      updateHash(q.id, 'feedback');
    });
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

})();
