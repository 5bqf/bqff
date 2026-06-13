// ============================================================
// 智能出题引擎 — 真题陷阱克隆 + 新闻素材 → 自动生成新题
// 纯规则引擎 · 零 API 依赖 · 离线可用
// ============================================================

(function() {
  'use strict';

  window.QuestionGenerator = { analyze, generate, getStatus };

  // ═══════════════════════════════════════════
  // 常量定义
  // ═══════════════════════════════════════════

  const LOGIC_PATTERNS = [
    { name: '转折关系',   keywords: ['但','然而','却','可是','不过','尽管','虽然','虽说','固然'], weight: 30 },
    { name: '递进关系',   keywords: ['不仅','更','甚至','而且','尤其','愈加','越发','进而'], weight: 30 },
    { name: '并列关系',   keywords: ['；','同时','和','与','既','又','一方面','另一方面'], weight: 25 },
    { name: '因果关系',   keywords: ['因此','所以','因为','由于','从而','致使','导致','因而'], weight: 30 },
    { name: '解释说明',   keywords: [':','：','——','即','也就是说','换言之','换句话说'], weight: 28 },
    { name: '条件关系',   keywords: ['只有','只要','除非','无论','不管','如果','倘若','一旦'], weight: 22 },
  ];

  const POS_CATEGORIES = {
    '形容词': ['的','地','很','非常','更加','越来越','极其','十分'],
    '动词':   ['了','着','过','正在','已经','将要','必须','应该'],
    '名词':   ['的','一个','一种','这个','那个','作为','成为','是'],
    '成语':   [''],
    '指代词': [''],
  };

  // ═══════════════════════════════════════════
  // 真题分析器：提取陷阱 DNA
  // ═══════════════════════════════════════════

  function analyzeReferenceQuestion(questionObj) {
    const dna = {
      logicTypes: [],
      trapPatterns: [],
      blankPOS: 'unknown',
      sentenceStructure: '',
      distractorStrategies: [],
      difficulty: questionObj.difficulty || 2,
    };

    // 1. 提取逻辑类型
    if (questionObj.logicTags) {
      dna.logicTypes = questionObj.logicTags;
    }

    // 2. 从句式提取逻辑骨架
    const passage = questionObj.passage.replace(/______/g, '___');
    for (const pattern of LOGIC_PATTERNS) {
      for (const kw of pattern.keywords) {
        if (passage.includes(kw)) {
          if (!dna.logicTypes.includes(pattern.name)) {
            dna.logicTypes.push(pattern.name);
          }
          break;
        }
      }
    }

    // 3. 从句式中提取逻辑骨架模式
    dna.sentenceStructure = extractStructure(passage);

    // 4. 提取干扰策略
    dna.distractorStrategies = extractDistractorStrategies(questionObj);

    // 5. 判断空格词性
    const correctOpt = questionObj.options.find(o => o.isCorrect);
    if (correctOpt) {
      const word = correctOpt.word || (correctOpt.words ? correctOpt.words[0] : '');
      dna.blankWord = word;
      dna.blankPOS = guessPOS(word, passage);
      dna.isIdiom = correctOpt.isIdiom || word.length === 4;
      dna.isMetaphor = correctOpt.isMetaphor || false;
    }

    // 6. 提取陷阱模式
    dna.trapPatterns = questionObj.options
      .filter(o => !o.isCorrect)
      .map(o => {
        const analysis = o.analysis || (o.analyses ? o.analyses[0] : {});
        const diff = analysis.differenceFromCorrect || '';
        return categorizeTrap(diff, o.word || '');
      })
      .filter(Boolean);

    return dna;
  }

  function extractStructure(passage) {
    // 简化为"___前的N个字 + ___ + ___后的N个字"
    const idx = passage.indexOf('___');
    if (idx < 0) return passage;
    const before = passage.substring(Math.max(0, idx - 15), idx);
    const after = passage.substring(idx + 3, Math.min(passage.length, idx + 18));
    return `…${before}___${after}…`;
  }

  function extractDistractorStrategies(questionObj) {
    const strategies = [];
    for (const opt of questionObj.options) {
      if (opt.isCorrect) continue;
      const analysis = opt.analysis || (opt.analyses ? opt.analyses[0] : {});
      const diff = (analysis.differenceFromCorrect || '').toLowerCase();
      if (diff.includes('感情') || diff.includes('褒') || diff.includes('贬')) strategies.push('感情色彩反配');
      if (diff.includes('程度') || diff.includes('过重') || diff.includes('过轻')) strategies.push('程度错配');
      if (diff.includes('搭配') || diff.includes('对象')) strategies.push('搭配不当');
      if (diff.includes('近义') || diff.includes('混淆')) strategies.push('近义混淆');
      if (diff.includes('望文生义') || diff.includes('误解')) strategies.push('望文生义');
    }
    return [...new Set(strategies)];
  }

  function guessPOS(word, passage) {
    if (word.length === 4) {
      // 检查是否在成语词典中
      if (typeof IDIOM_DICT !== 'undefined' && IDIOM_DICT[word]) return '成语';
      return '四字词';
    }
    if (typeof METAPHOR_DICT !== 'undefined' && METAPHOR_DICT[word]) return '指代词';
    // 简单词性猜测
    if (word.endsWith('的')) return '形容词';
    if (word.endsWith('地')) return '副词';
    if (word.length <= 2 && !word.endsWith('了')) return '双字词';
    return '词汇';
  }

  function categorizeTrap(diffText, word) {
    const t = (diffText || '').toLowerCase();
    if (t.includes('感情') || t.includes('褒') || t.includes('贬') || t.includes('色彩')) return '感情色彩反配';
    if (t.includes('程度') || t.includes('过重') || t.includes('过轻')) return '程度错配';
    if (t.includes('搭配') || t.includes('对象') || t.includes('语境')) return '搭配不当';
    if (t.includes('近义') || t.includes('混淆') || t.includes('相近')) return '近义混淆';
    if (t.includes('望文生义') || t.includes('误解') || t.includes('字面')) return '望文生义';
    if (t.includes('并列') || t.includes('递进')) return '逻辑关系错配';
    return '近义混淆'; // 默认
  }

  // ═══════════════════════════════════════════
  // 新闻分析器
  // ═══════════════════════════════════════════

  function analyzeNewsArticle(text) {
    // 1. 分句
    const sentences = splitSentences(text);
    if (sentences.length === 0) return { sentences: [], testableWords: [], topCandidates: [] };

    // 2. 提取可考词汇
    const testableWords = extractTestableWords(text);

    // 3. 给每句打分
    const scored = sentences.map((s, idx) => {
      let score = 0;
      const reasons = [];

      // 长度适中 (20-60字)
      const len = s.length;
      if (len >= 20 && len <= 60) { score += 15; reasons.push('长度适中'); }
      else if (len >= 15 && len <= 80) { score += 8; reasons.push('长度可接受'); }

      // 逻辑标记
      for (const pattern of LOGIC_PATTERNS) {
        for (const kw of pattern.keywords) {
          if (s.includes(kw)) {
            score += pattern.weight;
            reasons.push(`逻辑:${pattern.name}(${kw})`);
            break;
          }
        }
      }

      // 含可考词汇
      const wordsInSentence = testableWords.filter(w => s.includes(w.word));
      score += wordsInSentence.length * 15;
      if (wordsInSentence.length > 0) reasons.push(`含${wordsInSentence.length}个可考词`);

      // 句式工整（对仗/排比/引用）
      if (/[；;]/.test(s) && s.split(/[；;]/).length >= 2) { score += 10; reasons.push('含分号并列'); }
      if (/[：:]/.test(s)) { score += 8; reasons.push('含冒号解释'); }

      return { index: idx, text: s.trim(), score, reasons, words: wordsInSentence };
    });

    // 排序取前15
    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, 15);

    return { sentences, testableWords, topCandidates };
  }

  function splitSentences(text) {
    // 按句号、问号、感叹号、换行分割
    return text
      .split(/[。！？\n]+/)
      .map(s => s.replace(/[，,]/g, '，').trim())
      .filter(s => s.length >= 15 && s.length <= 200 && !/^\d+/.test(s) && !/^(记者|编辑|作者|来源)/.test(s));
  }

  function extractTestableWords(text) {
    const words = [];

    // 1. 四字成语/固定短语
    const idiomPattern = /[一-龥]{4}/g;
    const found = text.match(idiomPattern) || [];
    for (const w of found) {
      if (words.find(x => x.word === w)) continue;
      const info = (typeof IDIOM_DICT !== 'undefined' && IDIOM_DICT[w]) ? IDIOM_DICT[w] : null;
      words.push({
        word: w,
        type: info ? '成语' : '四字词',
        hasDictEntry: !!info,
        connotation: info ? info.connotation : '未知',
        pos: '四字词',
      });
    }

    // 2. 指代词（从 metaphor-dict 匹配）
    if (typeof METAPHOR_DICT !== 'undefined') {
      for (const [key, val] of Object.entries(METAPHOR_DICT)) {
        if (val.skip || val.isDuplicate) continue;
        if (text.includes(key) && !words.find(x => x.word === key)) {
          words.push({
            word: key,
            type: '指代词',
            hasDictEntry: true,
            connotation: val.connotation,
            pos: '指代词',
            metaphorInfo: val,
          });
        }
      }
    }

    // 3. 双字热点词（政策术语、高频动词）
    const hotWords = ['夯实','凝聚','彰显','健全','完善','构建','推进','深化','强化','优化',
                      '提升','增强','筑牢','守住','突破','创新','转型','升级','跨越','引领',
                      '保障','兜底','护航','助力','赋能','驱动','激活','释放','提振','稳定'];
    for (const w of hotWords) {
      if (text.includes(w) && !words.find(x => x.word === w)) {
        const info = (typeof IDIOM_DICT !== 'undefined' && IDIOM_DICT[w]) ? IDIOM_DICT[w] : null;
        words.push({
          word: w,
          type: '热点词',
          hasDictEntry: !!info,
          connotation: info ? info.connotation : '褒义',
          pos: '动词',
        });
      }
    }

    return words;
  }

  // ═══════════════════════════════════════════
  // 题目生成器
  // ═══════════════════════════════════════════

  function generate(referenceQuestion, newsText, options = {}) {
    const maxQuestions = options.maxQuestions || 5;
    const results = [];

    // 1. 分析真题
    const dna = analyzeReferenceQuestion(referenceQuestion);

    // 2. 分析新闻
    const newsAnalysis = analyzeNewsArticle(newsText);
    if (newsAnalysis.topCandidates.length === 0) {
      return { success: false, error: '新闻中未找到适合出题的句子，请提供更丰富的文本', dna, newsAnalysis };
    }

    // 3. 对每个候选句尝试出题
    for (const candidate of newsAnalysis.topCandidates) {
      if (results.length >= maxQuestions) break;
      if (candidate.words.length === 0) continue;

      // 选择最佳可考词（优先选跟真题空格同类型的）
      const bestWord = selectBestWord(candidate.words, dna);
      if (!bestWord) continue;

      // 生成题目
      const question = buildQuestion(candidate, bestWord, dna, referenceQuestion);
      if (question) {
        results.push(question);
      }
    }

    return {
      success: true,
      dna,
      newsAnalysis,
      questions: results,
      generated: results.length,
      totalCandidates: newsAnalysis.topCandidates.length,
    };
  }

  function selectBestWord(words, dna) {
    // 优先匹配同类型
    const posMatch = words.filter(w => {
      if (dna.blankPOS === '成语' && w.type === '成语') return true;
      if (dna.blankPOS === '指代词' && w.type === '指代词') return true;
      if (dna.isIdiom && w.type === '成语') return true;
      if (dna.isMetaphor && w.type === '指代词') return true;
      return false;
    });
    if (posMatch.length > 0) return posMatch[0];

    // 其次选有词典条目的
    const withDict = words.filter(w => w.hasDictEntry);
    if (withDict.length > 0) return withDict[0];

    // 最后随便选
    return words[0];
  }

  function buildQuestion(candidate, targetWord, dna, refQ) {
    const sentence = candidate.text;
    const word = targetWord.word;

    // 生成挖空文段
    const passage = sentence.replace(word, '______');
    if (passage === sentence) return null; // 替换失败

    // 生成干扰项
    const distractors = generateDistractors(word, targetWord, dna);

    // 构建选项
    const options = [
      buildCorrectOption('A', word, targetWord),
      ...distractors.map((d, i) => buildDistractorOption(String.fromCharCode(66 + i), d.word, d.reason, targetWord)),
    ];

    // 生成逻辑线索
    const logicClues = generateClues(sentence, dna, word);

    // 生成常见遗漏
    const commonMisses = generateMisses(dna, distractors);

    const id = 'gen' + Date.now().toString(36);
    const logicType = dna.logicTypes[0] || '语义对应';

    return {
      id,
      title: `生成题 · ${logicType}`,
      type: '逻辑填空',
      logicTags: dna.logicTypes.length > 0 ? dna.logicTypes : ['语义对应'],
      difficulty: dna.difficulty,
      source: `AI生成 · 基于「${refQ.title || '未知真题'}」陷阱模式`,
      passage,
      blanks: [{ index: 0, marker: '______', correctWord: word }],
      options,
      logicClues,
      commonMisses,
      similarQuestions: [],
      _generated: true,
      _sourceSentence: sentence,
      _referenceQuestionId: refQ.id,
    };
  }

  function generateDistractors(correctWord, wordInfo, dna) {
    const distractors = [];
    const strategies = dna.distractorStrategies.length > 0 ? dna.distractorStrategies : ['近义混淆', '感情色彩反配', '搭配不当'];
    const usedWords = new Set([correctWord]);

    // 从词典找近义词
    if (wordInfo.hasDictEntry) {
      const dictEntry = (typeof IDIOM_DICT !== 'undefined' && IDIOM_DICT[correctWord]) ? IDIOM_DICT[correctWord] : null;
      if (dictEntry && dictEntry.synonyms) {
        for (const syn of dictEntry.synonyms) {
          if (distractors.length >= 3) break;
          if (usedWords.has(syn)) continue;
          usedWords.add(syn);
          const strategy = strategies[distractors.length] || '近义混淆';
          distractors.push({ word: syn, reason: getDistractorReason(strategy, syn) });
        }
      }
    }

    // 从指代词库找同类词
    if (typeof METAPHOR_DICT !== 'undefined' && wordInfo.type === '指代词') {
      const currentMeta = METAPHOR_DICT[correctWord];
      if (currentMeta && currentMeta.type) {
        const sameType = Object.entries(METAPHOR_DICT)
          .filter(([k, v]) => v.type === currentMeta.type && k !== correctWord && !usedWords.has(k))
          .slice(0, 3 - distractors.length);
        for (const [key] of sameType) {
          usedWords.add(key);
          distractors.push({ word: key, reason: getDistractorReason('近义混淆', key) });
        }
      }
    }

    // 补足：通用干扰词池
    const generalPool = {
      '形容词': ['显著','明显','突出','重大','深刻','广泛','积极','有效','有力','坚实'],
      '动词':   ['推进','加强','提升','加快','促进','推动','深化','完善','强化','优化'],
      '名词':   ['基础','关键','核心','重点','根本','保障','支撑','引擎','基石','支柱'],
    };

    const poolKey = wordInfo.pos || '动词';
    const pool = generalPool[poolKey] || generalPool['动词'];
    while (distractors.length < 3) {
      const w = pool.find(p => !usedWords.has(p));
      if (!w) break;
      usedWords.add(w);
      distractors.push({ word: w, reason: getDistractorReason('搭配不当', w) });
    }

    return distractors.slice(0, 3);
  }

  function getDistractorReason(strategy, word) {
    const reasons = {
      '近义混淆': `与正确答案近义，但在此语境下不够精准`,
      '感情色彩反配': `感情色彩与文段不符`,
      '搭配不当': `不适用于该语境/主语类型`,
      '程度错配': `程度过重/过轻，与文段逻辑不匹配`,
      '望文生义': `字面意思接近但实际含义不同`,
      '逻辑关系错配': `与文段的逻辑关系不一致`,
    };
    return reasons[strategy] || `与正确答案存在差异`;
  }

  function buildCorrectOption(label, word, wordInfo) {
    let analysis = {
      originalMeaning: word,
      extendedMeaning: '',
      connotation: wordInfo.connotation || '待标注',
      commonTargets: '待标注',
      rmrbExample: '待补充',
    };

    // 尝试从词典补全
    const dict = (typeof IDIOM_DICT !== 'undefined' && IDIOM_DICT[word]) ? IDIOM_DICT[word] :
                 (typeof METAPHOR_DICT !== 'undefined' && METAPHOR_DICT[word]) ? METAPHOR_DICT[word] : null;

    if (dict) {
      analysis = {
        originalMeaning: dict.originalMeaning || dict.literalMeaning || word,
        extendedMeaning: dict.extendedMeaning || dict.metaphoricalMeaning || '',
        connotation: dict.connotation || wordInfo.connotation,
        commonTargets: dict.commonTargets || dict.commonCollocations?.join('、') || '待标注',
        rmrbExample: (dict.rmrbExamples && dict.rmrbExamples[0]) || '待补充',
      };
      if (dict.metaphorSource) {
        analysis.metaphorSource = dict.metaphorSource;
        analysis.metaphorUsage = dict.metaphorUsage || '';
      }
    }

    return {
      label,
      word,
      isCorrect: true,
      isIdiom: wordInfo.type === '成语' || word.length === 4,
      isMetaphor: wordInfo.type === '指代词',
      analysis,
    };
  }

  function buildDistractorOption(label, word, reason, wordInfo) {
    let analysis = {
      originalMeaning: word,
      extendedMeaning: '',
      connotation: '待标注',
      commonTargets: '待标注',
      differenceFromCorrect: reason,
    };

    const dict = (typeof IDIOM_DICT !== 'undefined' && IDIOM_DICT[word]) ? IDIOM_DICT[word] :
                 (typeof METAPHOR_DICT !== 'undefined' && METAPHOR_DICT[word]) ? METAPHOR_DICT[word] : null;

    if (dict) {
      analysis.originalMeaning = dict.originalMeaning || dict.literalMeaning || word;
      analysis.extendedMeaning = dict.extendedMeaning || dict.metaphoricalMeaning || '';
      analysis.connotation = dict.connotation || '待标注';
      analysis.commonTargets = dict.commonTargets || '';
    }

    return {
      label,
      word,
      isCorrect: false,
      isIdiom: word.length === 4,
      isMetaphor: wordInfo.type === '指代词',
      analysis,
    };
  }

  function generateClues(sentence, dna, blankWord) {
    const clues = [];
    let clueIdx = 1;

    for (const logicType of dna.logicTypes.slice(0, 2)) {
      const pattern = LOGIC_PATTERNS.find(p => p.name === logicType);
      if (pattern) {
        const foundKw = pattern.keywords.find(kw => sentence.includes(kw));
        clues.push({
          id: `gen-clue-${clueIdx}`,
          type: pattern.keywords.length > 0 ? '关联词' : '语义对应',
          keyword: foundKw || blankWord,
          description: foundKw ?
            `"${foundKw}"提示${logicType}关系，空格处的词应与前后形成${logicType}的逻辑对应` :
            `文段中存在${logicType}，空格词应与之呼应`,
          location: '文中',
          redScarfTip: '',
        });
        clueIdx++;
      }
    }

    if (clues.length === 0) {
      clues.push({
        id: 'gen-clue-1',
        type: '语义对应',
        keyword: blankWord,
        description: '从上下文语义推导空格词的含义和感情色彩',
        location: '文中',
        redScarfTip: '',
      });
    }

    return clues;
  }

  function generateMisses(dna, distractors) {
    return [{
      id: 'gen-miss-1',
      relatedClueIds: ['gen-clue-2'],
      feedback: `可能遗漏了干扰项的设置逻辑。错误选项分别使用了${dna.distractorStrategies.join('、')}等陷阱手法，需要从逻辑对应和感情色彩两个维度同时判断。`,
      redScarfTip: dna.logicTypes.length > 0 ?
        `巾神说：${dna.logicTypes[0]}题的关键是找到转折/递进/并列的标志词，然后判断对应的感情色彩和语义方向` : '',
    }];
  }

  // ═══════════════════════════════════════════
  // 状态查询
  // ═══════════════════════════════════════════

  function getStatus() {
    return {
      dictIdiomCount: typeof IDIOM_DICT !== 'undefined' ? Object.keys(IDIOM_DICT).length : 0,
      dictMetaphorCount: typeof METAPHOR_DICT !== 'undefined' ?
        Object.keys(METAPHOR_DICT).filter(k => !METAPHOR_DICT[k].skip && !METAPHOR_DICT[k].isDuplicate).length : 0,
      logicPatterns: LOGIC_PATTERNS.length,
      supportedFormats: ['PDF', 'DOCX', 'TXT', 'JSON', '粘贴文本'],
    };
  }

  // ── 公开分析接口（供UI预览用）
  function analyze(refQuestion, newsText) {
    const dna = analyzeReferenceQuestion(refQuestion);
    const news = analyzeNewsArticle(newsText);
    return { dna, news };
  }

})();
