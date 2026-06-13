// ============================================================
// 文档导入向导 — PDF/Word → 结构化题目
// 依赖: PDF.js CDN + Mammoth.js CDN
// ============================================================

(function() {
  'use strict';

  // ── 导出到全局 ──
  window.ImportWizard = { open, close, openGenerate };

  // 状态
  let extractedText = '';
  let fileName = '';
  let wizardMode = 'import'; // 'import' | 'generate'

  // 智能出题状态
  let genRefQuestion = null;
  let genNewsText = '';
  let genResult = null;
  const FIELD_DEFS = [
    { key: 'passage', label: '📝 文段（含______空格）', required: true, hint: '包含空格的完整文段' },
    { key: 'correctAnswer', label: '✅ 正确答案', required: true, hint: '填入空格的词' },
    { key: 'optionB', label: '🅱️ 干扰项B', required: true, hint: '错误选项' },
    { key: 'optionC', label: '🅲 干扰项C', required: true, hint: '错误选项' },
    { key: 'optionD', label: '🅳 干扰项D', required: true, hint: '错误选项' },
    { key: 'logicType', label: '🏷️ 逻辑类型', required: true, hint: '如：转折关系、语义对应等' },
    { key: 'clueDesc', label: '🔍 逻辑线索说明', required: false, hint: '文段中的关键逻辑点' },
    { key: 'originalMeaning', label: '📖 正确答案本意', required: false, hint: '词语的字面意思' },
    { key: 'extendedMeaning', label: '💡 正确答案引申义', required: false, hint: '比喻/引申含义' },
    { key: 'rmrbExample', label: '📰 人民日报例句', required: false, hint: '该词在人民日报中的用法' },
    { key: 'source', label: '📎 题目来源', required: false, hint: '如：2024国考真题' }
  ];

  // 已映射值
  let fieldValues = {};

  function reset() {
    extractedText = '';
    fileName = '';
    fieldValues = {};
  }

  // ── 打开向导 ──
  function open() {
    reset();
    document.querySelector('.admin-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.id = 'import-wizard-overlay';
    overlay.innerHTML = renderWizard();
    document.body.appendChild(overlay);
    bindWizardEvents(overlay);

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && !extractedText) close();
    });
  }

  function close() {
    document.getElementById('import-wizard-overlay')?.remove();
  }

  function openGenerate(refQuestion, newsText) {
    wizardMode = 'generate';
    genRefQuestion = refQuestion;
    genNewsText = newsText || '';
    genResult = null;
    document.querySelector('.admin-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.id = 'import-wizard-overlay';
    overlay.innerHTML = renderGenerateWizard();
    document.body.appendChild(overlay);
    bindGenerateEvents(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  // ── 渲染向导 ──
  function renderWizard() {
    return `
    <div class="admin-panel wizard-panel fade-in" style="max-width: 780px;">
      <button class="close-btn" id="wiz-close">✕</button>
      <h2>📥 文档导入向导</h2>
      <p style="font-size:0.85rem;color:var(--ink-light);margin-bottom:16px;">
        支持 PDF (.pdf) / Word (.docx) / 纯文本 (.txt)。上传后自动提取文字，您将文字映射到题目字段即可生成结构化题目。
      </p>

      <!-- 步骤1: 上传文件 -->
      <div class="wiz-step" id="wiz-step-upload">
        <div class="wiz-step-num">1</div>
        <div class="wiz-step-body">
          <h3>📤 上传文件</h3>
          <div class="upload-zone" id="upload-zone">
            <div class="upload-icon">📂</div>
            <p><strong>拖拽文件到此处</strong> 或点击选择</p>
            <p style="font-size:0.78rem;color:var(--ink-light);opacity:0.7;">支持 .pdf · .docx · .txt</p>
            <input type="file" id="file-input" accept=".pdf,.docx,.txt" hidden>
          </div>
          <div id="upload-status" style="margin-top:8px;font-size:0.82rem;"></div>
        </div>
      </div>

      <!-- 步骤2: 预览提取文本 -->
      <div class="wiz-step ${extractedText ? '' : 'wiz-disabled'}" id="wiz-step-preview">
        <div class="wiz-step-num">2</div>
        <div class="wiz-step-body">
          <h3>📋 提取的文字 <span style="font-size:0.75rem;font-weight:400;color:var(--ink-light);">${fileName ? '— ' + fileName : ''}</span></h3>
          <div class="extracted-text-box" id="extracted-text-box">
            ${extractedText ?
              extractedText.split('\n').map(line =>
                `<span class="text-line" data-line>${escapeHTML(line) || '&nbsp;'}</span>`
              ).join('') :
              '<p style="color:var(--ink-light);opacity:0.5;text-align:center;padding:40px;">上传文件后文字将显示在此处</p>'
            }
          </div>
          <p style="font-size:0.75rem;color:var(--ink-light);opacity:0.6;margin-top:4px;">
            💡 点击文字行可选中，然后映射到下方字段
          </p>
        </div>
      </div>

      <!-- 步骤3: 字段映射 -->
      <div class="wiz-step ${extractedText ? '' : 'wiz-disabled'}" id="wiz-step-fields">
        <div class="wiz-step-num">3</div>
        <div class="wiz-step-body">
          <h3>🔗 字段映射</h3>
          <p style="font-size:0.78rem;color:var(--ink-light);margin-bottom:10px;">
            在步骤2中选择文字行，然后点击下方按钮填入对应字段。
          </p>
          <div class="field-mapping-grid" id="field-mapping-grid">
            ${FIELD_DEFS.map(f => `
              <div class="field-map-row" data-field="${f.key}">
                <div class="field-map-label">
                  ${f.label} ${f.required ? '<span style="color:var(--error);">*</span>' : ''}
                  <span style="font-size:0.7rem;opacity:0.5;">${f.hint}</span>
                </div>
                <div class="field-map-value" id="field-val-${f.key}">
                  <span class="placeholder-text">${fieldValues[f.key] || '点击文字行后点 → 填入'}</span>
                </div>
                <button class="btn btn-sm btn-outline fill-btn" data-field="${f.key}" ${extractedText ? '' : 'disabled'}>
                  ← 填入
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 步骤4: 预览 & 导入 -->
      <div class="wiz-step" id="wiz-step-final">
        <div class="wiz-step-num">4</div>
        <div class="wiz-step-body">
          <h3>✅ 预览生成的题目</h3>
          <div id="json-preview" style="margin-bottom:12px;">
            <p style="font-size:0.82rem;color:var(--ink-light);opacity:0.5;">填写必填字段后点击"生成预览"</p>
          </div>
          <div class="btn-row">
            <button class="btn btn-outline btn-sm" id="btn-gen-preview">🔄 生成预览</button>
            <button class="btn btn-accent btn-sm" id="btn-import-final" disabled>📥 导入题库</button>
          </div>
          <div id="import-result" style="margin-top:8px;font-size:0.82rem;"></div>
        </div>
      </div>
    </div>`;
  }

  // ── 绑定事件 ──
  function bindWizardEvents(overlay) {
    overlay.querySelector('#wiz-close').addEventListener('click', close);

    const uploadZone = overlay.querySelector('#upload-zone');
    const fileInput = overlay.querySelector('#file-input');
    const statusEl = overlay.querySelector('#upload-status');

    // 点击上传
    uploadZone.addEventListener('click', () => fileInput.click());

    // 拖拽上传
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file, statusEl, overlay);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) handleFile(file, statusEl, overlay);
    });

    // 文字行选中
    const textBox = overlay.querySelector('#extracted-text-box');
    if (textBox) {
      textBox.addEventListener('click', (e) => {
        const line = e.target.closest('.text-line');
        if (!line) return;
        textBox.querySelectorAll('.text-line.selected').forEach(l => l.classList.remove('selected'));
        line.classList.add('selected');
        // 存到临时变量
        window._selectedText = line.textContent.trim();
      });
    }

    // 填入按钮
    overlay.querySelectorAll('.fill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const text = window._selectedText || '';
        if (!text) {
          flashElement(btn, 'var(--error)');
          return;
        }
        fieldValues[field] = text;
        const valEl = overlay.querySelector(`#field-val-${field}`);
        if (valEl) {
          valEl.innerHTML = `<span style="color:var(--success);font-weight:600;">${escapeHTML(text)}</span>`;
          valEl.classList.add('filled');
        }
        flashElement(btn, 'var(--success)');
      });
    });

    // 生成预览
    overlay.querySelector('#btn-gen-preview').addEventListener('click', () => {
      const preview = buildQuestionPreview();
      overlay.querySelector('#json-preview').innerHTML = preview;
      // 校验必填项
      const missing = FIELD_DEFS.filter(f => f.required && !fieldValues[f.key]);
      const importBtn = overlay.querySelector('#btn-import-final');
      if (missing.length > 0) {
        importBtn.disabled = true;
        overlay.querySelector('#json-preview').insertAdjacentHTML('afterbegin',
          `<p style="color:var(--error);font-size:0.82rem;margin-bottom:8px;">⚠️ 缺少必填字段: ${missing.map(f => f.label).join(', ')}</p>`
        );
      } else {
        importBtn.disabled = false;
      }
    });

    // 导入
    overlay.querySelector('#btn-import-final').addEventListener('click', () => {
      const question = buildQuestionObject();
      if (!question) return;
      // 检查ID冲突
      const existingIds = new Set(QUESTION_BANK.map(q => q.id));
      const newId = 'q' + String(QUESTION_BANK.length + 1).padStart(3, '0');
      while (existingIds.has(newId)) {
        // 递增
        const num = parseInt(newId.slice(1)) + 1;
        question.id = 'q' + String(num).padStart(3, '0');
      }
      question.id = newId;

      QUESTION_BANK.push(question);
      const resultEl = overlay.querySelector('#import-result');
      resultEl.innerHTML = `<span style="color:var(--success);">✅ 题目「${question.title}」已导入题库！3秒后刷新页面…</span>`;
      overlay.querySelector('#btn-import-final').disabled = true;
      setTimeout(() => { window.location.hash = '#/'; window.location.reload(); }, 2000);
    });
  }

  // ── 文件处理 ──
  async function handleFile(file, statusEl, overlay) {
    fileName = file.name;
    const ext = file.name.split('.').pop().toLowerCase();

    statusEl.innerHTML = '<span style="color:var(--info);">⏳ 正在解析文件…</span>';

    try {
      if (ext === 'pdf') {
        extractedText = await parsePDF(file);
      } else if (ext === 'docx') {
        extractedText = await parseDOCX(file);
      } else if (ext === 'txt') {
        extractedText = await parseTXT(file);
      } else {
        statusEl.innerHTML = '<span style="color:var(--error);">❌ 不支持的文件格式</span>';
        return;
      }

      if (!extractedText || extractedText.trim().length === 0) {
        statusEl.innerHTML = '<span style="color:var(--error);">❌ 未提取到文字内容，请检查文件</span>';
        return;
      }

      statusEl.innerHTML = `<span style="color:var(--success);">✅ 成功提取 ${extractedText.length} 个字符</span>`;

      // 刷新步骤2和3
      refreshPreviewSteps(overlay);

    } catch (err) {
      statusEl.innerHTML = `<span style="color:var(--error);">❌ 解析失败: ${err.message}</span>`;
      console.error('File parse error:', err);
    }
  }

  // ── PDF 解析 ──
  async function parsePDF(file) {
    // 使用 PDF.js (需CDN)
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js 未加载，请刷新页面后重试');
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  }

  // ── Word (.docx) 解析 ──
  async function parseDOCX(file) {
    if (typeof mammoth === 'undefined') {
      throw new Error('Mammoth.js 未加载，请刷新页面后重试');
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  }

  // ── 纯文本解析 ──
  async function parseTXT(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  }

  // ── 刷新预览 ──
  function refreshPreviewSteps(overlay) {
    // 更新文本预览
    const textBox = overlay.querySelector('#extracted-text-box');
    if (textBox) {
      textBox.innerHTML = extractedText.split('\n').map(line =>
        `<span class="text-line" data-line>${escapeHTML(line) || '&nbsp;'}</span>`
      ).join('');
      textBox.addEventListener('click', (e) => {
        const line = e.target.closest('.text-line');
        if (!line) return;
        textBox.querySelectorAll('.text-line.selected').forEach(l => l.classList.remove('selected'));
        line.classList.add('selected');
        window._selectedText = line.textContent.trim();
      });
    }

    // 解除步骤2/3的禁用
    overlay.querySelectorAll('.wiz-disabled').forEach(el => el.classList.remove('wiz-disabled'));

    // 启用填入按钮
    overlay.querySelectorAll('.fill-btn').forEach(btn => { btn.disabled = false; });
  }

  // ── 构建题目预览 ──
  function buildQuestionPreview() {
    const obj = buildQuestionObject();
    if (!obj) return '<p style="color:var(--error);">请先填写必填字段</p>';
    return `<pre style="background:var(--paper-warm);padding:14px;border-radius:var(--radius-sm);font-size:0.75rem;overflow-x:auto;max-height:300px;line-height:1.5;">${escapeHTML(JSON.stringify(obj, null, 2))}</pre>`;
  }

  function buildQuestionObject() {
    const passage = fieldValues['passage'] || '';
    const correctAnswer = fieldValues['correctAnswer'] || '';
    const optionB = fieldValues['optionB'] || '';
    const optionC = fieldValues['optionC'] || '';
    const optionD = fieldValues['optionD'] || '';
    const logicType = fieldValues['logicType'] || '';
    const clueDesc = fieldValues['clueDesc'] || '';
    const originalMeaning = fieldValues['originalMeaning'] || '';
    const extendedMeaning = fieldValues['extendedMeaning'] || '';
    const rmrbExample = fieldValues['rmrbExample'] || '';
    const source = fieldValues['source'] || '';

    if (!passage || !correctAnswer || !optionB || !optionC || !optionD || !logicType) return null;

    const id = 'q' + String(QUESTION_BANK.length + 1).padStart(3, '0');
    return {
      id,
      title: `第${QUESTION_BANK.length + 1}题 · ${logicType}`,
      type: "逻辑填空",
      logicTags: [logicType],
      difficulty: 2,
      source: source || '用户导入',
      passage,
      blanks: [{ index: 0, marker: "______", correctWord: correctAnswer }],
      options: [
        {
          label: "A", word: correctAnswer, isCorrect: true, isIdiom: false, isMetaphor: false,
          analysis: {
            originalMeaning: originalMeaning || correctAnswer,
            extendedMeaning: extendedMeaning || '',
            connotation: "待标注",
            commonTargets: "待标注",
            rmrbExample: rmrbExample || '待补充'
          }
        },
        { label: "B", word: optionB, isCorrect: false, isIdiom: false, isMetaphor: false,
          analysis: { originalMeaning: optionB, extendedMeaning: '', connotation: '待标注', commonTargets: '待标注', differenceFromCorrect: '待标注' } },
        { label: "C", word: optionC, isCorrect: false, isIdiom: false, isMetaphor: false,
          analysis: { differenceFromCorrect: '待标注' } },
        { label: "D", word: optionD, isCorrect: false, isIdiom: false, isMetaphor: false,
          analysis: { differenceFromCorrect: '待标注' } }
      ],
      logicClues: [
        {
          id: "clue-1", type: logicType.includes('转折') ? '关联词' : '语义对应',
          keyword: correctAnswer,
          description: clueDesc || '从文段逻辑推导得出',
          location: "文段中",
          redScarfTip: ""
        }
      ],
      commonMisses: [{
        id: "miss-1",
        relatedClueIds: ["clue-1"],
        feedback: clueDesc ? `你可能没有注意到：${clueDesc}` : '回顾文段的逻辑关系，找出对应点',
        redScarfTip: ""
      }],
      similarQuestions: []
    };
  }

  // ── 工具 ──
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function flashElement(el, color) {
    const orig = el.style.background;
    el.style.background = color;
    el.style.color = 'white';
    el.style.transition = 'all 0.15s ease';
    setTimeout(() => { el.style.background = orig; el.style.color = ''; }, 300);
  }

  // ═══════════════════════════════════════════
  // 智能出题模式 UI
  // ═══════════════════════════════════════════

  function renderGenerateWizard() {
    const refTitle = genRefQuestion ? (genRefQuestion.title || '已加载真题') : '未加载';
    const newsLen = genNewsText ? genNewsText.length : 0;

    return `
    <div class="admin-panel wizard-panel fade-in" style="max-width:820px;">
      <button class="close-btn" id="wiz-close">✕</button>
      <h2>🧠 智能出题引擎</h2>
      <p style="font-size:0.82rem;color:var(--ink-light);margin-bottom:16px;">
        上传一道真题（学习陷阱模式）+ 一篇新闻（提取素材）→ 自动生成同类陷阱的新题
      </p>

      <!-- 来源区：双栏 -->
      <div class="gen-source-row">
        <div class="gen-source-col">
          <h3>📝 真题参考</h3>
          <div class="gen-source-status ${genRefQuestion ? 'ready' : ''}">
            ${genRefQuestion ? '✅ ' + refTitle : '📤 上传或选择真题'}
          </div>
          <button class="btn btn-sm btn-outline" id="gen-load-ref">从题库选择</button>
          <input type="file" id="gen-file-ref" accept=".pdf,.docx,.txt,.json" hidden>
          <button class="btn btn-sm btn-outline" id="gen-upload-ref">上传文件</button>
        </div>
        <div class="gen-source-col">
          <h3>📰 新闻素材</h3>
          <div class="gen-source-status ${genNewsText ? 'ready' : ''}">
            ${genNewsText ? '✅ 已加载 ' + newsLen + ' 字' : '📤 上传或粘贴新闻'}
          </div>
          <textarea id="gen-news-textarea" placeholder="粘贴新闻全文…" rows="3"
                    style="width:100%;font-size:0.78rem;padding:8px;border:1px solid var(--border);border-radius:4px;resize:vertical;">${escapeHTML(genNewsText)}</textarea>
          <input type="file" id="gen-file-news" accept=".pdf,.docx,.txt" hidden>
          <button class="btn btn-sm btn-outline" id="gen-upload-news">上传PDF/Word</button>
        </div>
      </div>

      <div class="btn-row" style="justify-content:center;margin-top:14px;">
        <button class="btn btn-accent btn-lg" id="gen-start" ${!genRefQuestion || !genNewsText ? 'disabled' : ''}>
          🚀 开始分析 & 出题
        </button>
      </div>

      <!-- 分析结果区 -->
      <div id="gen-analysis-area" class="${genResult ? '' : 'hidden'}">
        ${genResult ? renderAnalysisResult(genResult) : ''}
      </div>

      <!-- 生成题目区 -->
      <div id="gen-questions-area" class="${genResult && genResult.questions ? '' : 'hidden'}">
        ${genResult && genResult.questions ? renderGeneratedQuestions(genResult) : ''}
      </div>
    </div>`;
  }

  function renderAnalysisResult(result) {
    const dna = result.dna || {};
    const news = result.newsAnalysis || {};
    return `
    <div class="admin-section" style="margin-top:16px;">
      <h3>📊 分析结果</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.82rem;">
        <div style="background:var(--paper-warm);padding:12px;border-radius:8px;">
          <strong>🧬 真题陷阱DNA</strong><br>
          逻辑：${(dna.logicTypes || []).join('、') || '未识别'}<br>
          陷阱：${(dna.distractorStrategies || []).join('、') || '近义混淆'}<br>
          空格词性：${dna.blankPOS || '未知'}<br>
          句式骨架：<span style="font-size:0.75rem;opacity:0.7;">${dna.sentenceStructure || '-'}</span>
        </div>
        <div style="background:var(--paper-warm);padding:12px;border-radius:8px;">
          <strong>📰 新闻分析</strong><br>
          总句数：${news.sentences ? news.sentences.length : 0}<br>
          可考词：${news.testableWords ? news.testableWords.length : 0} 个<br>
          候选句（出题用）：${news.topCandidates ? news.topCandidates.length : 0} 句<br>
          状态：${result.success ? '✅ 成功生成' : '⚠️ ' + (result.error || '')}
        </div>
      </div>
      ${news.topCandidates && news.topCandidates.length > 0 ? `
        <details style="margin-top:10px;font-size:0.8rem;">
          <summary>📋 候选句列表（得分排序）</summary>
          <ol style="max-height:200px;overflow-y:auto;padding-left:18px;line-height:1.6;">
            ${news.topCandidates.slice(0, 10).map(c => `
              <li>
                <span style="color:var(--accent);">${c.score}分</span>
                ${c.text.substring(0, 60)}${c.text.length>60?'…':''}
                <span style="font-size:0.72rem;opacity:0.5;">${c.reasons.join('·')}</span>
              </li>
            `).join('')}
          </ol>
        </details>
      ` : ''}
    </div>`;
  }

  function renderGeneratedQuestions(result) {
    const questions = result.questions || [];
    if (questions.length === 0) {
      return `<div class="admin-section"><p style="color:var(--error);">⚠️ 未能生成题目，请尝试更换新闻素材</p></div>`;
    }
    return `
    <div class="admin-section">
      <h3>📝 生成题目（${questions.length} 道）</h3>
      ${questions.map((q, i) => `
        <div class="gen-question-card" id="gen-q-${i}">
          <div class="gen-q-header">
            <strong>题${i + 1} · ${q.logicTags.join('+')}</strong>
            <span style="font-size:0.75rem;opacity:0.6;">${q.source}</span>
            <div style="margin-left:auto;display:flex;gap:6px;">
              <button class="btn btn-sm btn-outline gen-edit-btn" data-idx="${i}">✏️ 编辑</button>
              <button class="btn btn-sm btn-accent gen-import-btn" data-idx="${i}">📥 导入</button>
            </div>
          </div>
          <div class="gen-q-passage">${q.passage.replace('______', '<span class="blank-marker">______</span>')}</div>
          <div style="font-size:0.82rem;margin-top:6px;">
            <strong>✅ ${q.options[0].label}. ${q.options[0].word}</strong>
            ${q.options.slice(1).map(o => ` · ${o.label}. ${o.word}`).join('')}
          </div>
          <div class="gen-q-edit-area hidden" id="gen-edit-${i}">
            <textarea class="gen-edit-json" id="gen-edit-json-${i}" rows="10">${escapeHTML(JSON.stringify(q, null, 2))}</textarea>
            <button class="btn btn-sm btn-outline gen-save-edit-btn" data-idx="${i}">💾 保存修改</button>
          </div>
        </div>
      `).join('')}
      <div class="btn-row" style="justify-content:center;margin-top:12px;">
        <button class="btn btn-outline btn-sm" id="gen-import-all">📥 全部导入题库</button>
        <button class="btn btn-outline btn-sm" id="gen-retry">🔄 换一批</button>
      </div>
    </div>`;
  }

  function bindGenerateEvents(overlay) {
    overlay.querySelector('#wiz-close').addEventListener('click', close);

    // 加载真题
    overlay.querySelector('#gen-load-ref')?.addEventListener('click', () => {
      overlay.remove();
      // 让用户从首页选择题库中的一道作为参考
      showQuestionPicker((q) => {
        genRefQuestion = q;
        openGenerate(q, genNewsText);
      });
    });

    overlay.querySelector('#gen-upload-ref')?.addEventListener('click', () => {
      overlay.querySelector('#gen-file-ref').click();
    });
    overlay.querySelector('#gen-file-ref')?.addEventListener('change', function() {
      handleGenerateFile(this.files[0], 'ref', overlay);
    });

    // 加载新闻
    overlay.querySelector('#gen-upload-news')?.addEventListener('click', () => {
      overlay.querySelector('#gen-file-news').click();
    });
    overlay.querySelector('#gen-file-news')?.addEventListener('change', function() {
      handleGenerateFile(this.files[0], 'news', overlay);
    });
    overlay.querySelector('#gen-news-textarea')?.addEventListener('input', function() {
      genNewsText = this.value;
      overlay.querySelector('#gen-start').disabled = !genRefQuestion || !genNewsText;
    });

    // 开始出题
    overlay.querySelector('#gen-start')?.addEventListener('click', () => {
      if (typeof QuestionGenerator === 'undefined') {
        alert('出题引擎加载中，请刷新后重试');
        return;
      }
      overlay.querySelector('#gen-start').textContent = '⏳ 分析中…';
      overlay.querySelector('#gen-start').disabled = true;
      setTimeout(() => {
        genResult = QuestionGenerator.generate(genRefQuestion, genNewsText, { maxQuestions: 5 });
        // 重新渲染
        const newHTML = renderGenerateWizard();
        overlay.innerHTML = newHTML;
        bindGenerateEvents(overlay);
        overlay.querySelector('#gen-analysis-area')?.classList.remove('hidden');
        overlay.querySelector('#gen-questions-area')?.classList.remove('hidden');
      }, 100); // 微延迟让UI先更新
    });

    // 单题导入
    overlay.querySelectorAll('.gen-import-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const q = genResult.questions[idx];
        if (!q) return;
        // 检查ID冲突并修复
        const existingIds = new Set(QUESTION_BANK.map(qq => qq.id));
        if (existingIds.has(q.id)) {
          q.id = 'gen' + Date.now().toString(36) + idx;
        }
        QUESTION_BANK.push(q);
        btn.textContent = '✅ 已导入';
        btn.disabled = true;
        showAdminToast(`题${idx + 1} 已导入题库`, 'success');
      });
    });

    // 全部导入
    overlay.querySelector('#gen-import-all')?.addEventListener('click', () => {
      let count = 0;
      const existingIds = new Set(QUESTION_BANK.map(qq => qq.id));
      (genResult.questions || []).forEach((q, i) => {
        if (existingIds.has(q.id)) {
          q.id = 'gen' + Date.now().toString(36) + i;
        }
        QUESTION_BANK.push(q);
        existingIds.add(q.id);
        count++;
      });
      showAdminToast(`全部 ${count} 题已导入题库！`, 'success');
      setTimeout(() => { window.location.hash = '#/'; window.location.reload(); }, 1500);
    });

    // 换一批
    overlay.querySelector('#gen-retry')?.addEventListener('click', () => {
      genResult = QuestionGenerator.generate(genRefQuestion, genNewsText, { maxQuestions: 5 });
      const newHTML = renderGenerateWizard();
      overlay.innerHTML = newHTML;
      bindGenerateEvents(overlay);
    });

    // 编辑按钮
    overlay.querySelectorAll('.gen-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.idx;
        const editArea = overlay.querySelector(`#gen-edit-${idx}`);
        editArea.classList.toggle('hidden');
      });
    });

    // 保存编辑
    overlay.querySelectorAll('.gen-save-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const textarea = overlay.querySelector(`#gen-edit-json-${idx}`);
        try {
          const edited = JSON.parse(textarea.value);
          genResult.questions[idx] = edited;
          showAdminToast('修改已保存 ✅', 'success');
        } catch(e) {
          showAdminToast('JSON 格式错误: ' + e.message, 'error');
        }
      });
    });
  }

  async function handleGenerateFile(file, type, overlay) {
    const statusEl = overlay.querySelector(type === 'ref' ? '.gen-source-col:first-child .gen-source-status' : '.gen-source-col:last-child .gen-source-status');
    if (!statusEl) return;
    statusEl.textContent = '⏳ 解析中…';

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let text = '';
      if (ext === 'pdf') text = await parsePDF(file);
      else if (ext === 'docx') text = await parseDOCX(file);
      else if (ext === 'txt' || ext === 'json') text = await parseTXT(file);
      else throw new Error('不支持的格式');

      if (type === 'ref') {
        // 尝试解析为JSON
        try {
          genRefQuestion = JSON.parse(text);
          if (!genRefQuestion.passage) throw new Error('不是有效的题目JSON');
          statusEl.textContent = '✅ ' + (genRefQuestion.title || '真题已加载');
          statusEl.classList.add('ready');
        } catch {
          // 纯文本，包装为简单题目结构
          genRefQuestion = {
            id: 'ref-upload',
            title: '上传真题',
            type: '逻辑填空',
            logicTags: [],
            difficulty: 2,
            passage: text.substring(0, 300),
            blanks: [{ index: 0, correctWord: '待标注' }],
            options: [
              { label: 'A', word: '待标注', isCorrect: true, analysis: {} },
              { label: 'B', word: '待标注', isCorrect: false, analysis: { differenceFromCorrect: '' } },
              { label: 'C', word: '待标注', isCorrect: false, analysis: {} },
              { label: 'D', word: '待标注', isCorrect: false, analysis: {} },
            ],
            logicClues: [],
            commonMisses: [],
            similarQuestions: [],
          };
          statusEl.textContent = '⚠️ 真题为纯文本（陷阱识别受限）';
        }
      } else {
        genNewsText = text;
        statusEl.textContent = '✅ 已加载 ' + text.length + ' 字';
        statusEl.classList.add('ready');
        // 同步到textarea
        const textarea = overlay.querySelector('#gen-news-textarea');
        if (textarea) textarea.value = text;
      }

      const startBtn = overlay.querySelector('#gen-start');
      if (startBtn) startBtn.disabled = !genRefQuestion || !genNewsText;

    } catch(err) {
      statusEl.textContent = '❌ ' + err.message;
    }
  }

  function showQuestionPicker(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.innerHTML = `
      <div class="admin-panel fade-in" style="max-width:600px;">
        <button class="close-btn" id="picker-close">✕</button>
        <h2>📚 选择题库中的真题作为参考</h2>
        <p style="font-size:0.82rem;color:var(--ink-light);margin-bottom:12px;">
          选择一道题，系统将学习它的陷阱模式来生成新题
        </p>
        <div style="max-height:400px;overflow-y:auto;">
          ${QUESTION_BANK.map(q => `
            <div class="picker-item" data-id="${q.id}" style="padding:10px;border:1px solid var(--border-light);border-radius:6px;margin-bottom:6px;cursor:pointer;transition:all 0.15s;">
              <strong>${q.title}</strong>
              <span style="font-size:0.78rem;opacity:0.6;margin-left:8px;">${q.logicTags.join('+')}</span>
              <div style="font-size:0.75rem;opacity:0.5;">${q.passage.substring(0, 50)}…</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#picker-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelectorAll('.picker-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.style.background = 'var(--paper-warm)');
      item.addEventListener('mouseleave', () => item.style.background = '');
      item.addEventListener('click', () => {
        const q = QUESTION_BANK.find(qq => qq.id === item.dataset.id);
        if (q) { callback(q); overlay.remove(); }
      });
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

  // ── 更新 open 函数：加 Tab 切换 ──
  const _originalOpen = open;
  open = function(mode) {
    wizardMode = mode || 'import';
    if (wizardMode === 'generate') {
      if (!genRefQuestion) {
        // 没有真题，先让用户从题库选
        showQuestionPicker((q) => {
          genRefQuestion = q;
          openGenerate(q, genNewsText);
        });
        return;
      }
      openGenerate(genRefQuestion, genNewsText);
      return;
    }
    // 默认导入模式
    _originalOpen();
  };

})();
