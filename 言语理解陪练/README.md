# 📖 言语理解 · 逻辑填空陪练

> 基于 B站网友红领巾解题方法论 · 5步训练闭环 · 纯前端零后端

## 🚀 快速开始

1. 浏览器打开 `index.html`（或部署到 GitHub Pages）
2. 首页选择题库 → 进入5步训练闭环
3. 全程可用键盘：`1-4` 选答案 · `Enter` 提交 · `←→` 切换步骤 · `Esc` 回首页

## 🔄 五步训练闭环

| 步骤 | 操作 | 方法论 |
|------|------|--------|
| ① 找逻辑 | 选项锁定，勾选逻辑线索 | 不看选项，只读文段找对应 |
| ② 查遗漏 | 对比系统答案，查看遗漏提示 | 每条遗漏附赠"怎么看"+ 🧣红领巾技巧 |
| ③ 选答案 | 选项解锁，点击或按1-4作答 | 基于逻辑分析而非语感 |
| ④ 看解析 | 展开选项卡片看深度解析 | 本意→引申义→褒贬→常用对象→人民日报例句 |
| ⑤ 固同类 | 推荐同类逻辑题继续练 | 按逻辑标签(转折/递进/并列…)匹配 |

## ⌨️ 键盘快捷键

| 按键 | 功能 |
|------|------|
| `1` `2` `3` `4` | 作答步骤：快速选择对应选项 |
| `Enter` | 线索步骤：提交线索 · 作答步骤：确认答案 |
| `→` | 跳到下一步 |
| `←` | 返回上一步 |
| `Esc` | 返回首页 |

---

# 📝 维护指南

## 一、文件结构

```
言语理解陪练/
├── index.html           # 入口（无需修改）
├── css/style.css        # 样式（按需调整）
├── js/
│   ├── app.js           # 主逻辑（一般无需修改）
│   ├── question-bank.js # ⭐ 题库（主要维护对象）
│   ├── idiom-dict.js    # ⭐ 成语/生僻词词典
│   └── metaphor-dict.js # ⭐ 指代词库
└── README.md            # 本文件
```

## 二、添加新题目（最重要）

### 方式A：JSON 导入（推荐，无需改代码）

1. 在网页底部点 **⚙️ 管理题库**
2. 点 **📋 下载题目模板** 拿到标准模板
3. 按模板格式填写题目，粘贴到导入框
4. 点 **📥 导入并刷新** — 自动校验并加入题库
5. 刷新页面生效

### 方式B：直接编辑 question-bank.js

编辑 `js/question-bank.js`，在 `QUESTION_BANK` 数组末尾添加新题目对象。

#### 题目 JSON 完整字段说明

```javascript
{
  // ── 基本信息 ──
  id: "q011",                          // 唯一ID，格式 q+数字
  title: "第11题 · 转折关系",           // 显示用标题
  type: "逻辑填空",                     // 固定值
  logicTags: ["转折关系", "感情色彩"],  // 用于同类推荐和筛选，可选多项
  difficulty: 2,                       // 1-4，1最简单
  source: "2024国考副省级真题改编",     // 题目来源

  // ── 文段 ──
  passage: "完整的文段，用______表示空格。如有多空，都用______标记。",
  blanks: [                            // 空格信息
    { index: 0, marker: "______", correctWord: "正确答案" }
  ],

  // ── 选项 ──
  options: [
    {
      label: "A",                      // 选项标签
      word: "深入",                    // 词汇
      isCorrect: true,                 // 是否正确答案
      isIdiom: false,                  // 是否成语
      isMetaphor: false,               // 是否指代词
      analysis: {                      // 深度解析（正确选项写全，错误选项简写）
        originalMeaning: "本意",
        extendedMeaning: "引申义",
        connotation: "褒/贬/中性",
        commonTargets: "常用对象",
        rmrbExample: "人民日报例句",
        // 错误选项额外字段：
        differenceFromCorrect: "为什么这个选项不对（必填）"
      }
    }
    // ... B、C、D 三个选项同理
  ],

  // ── 逻辑线索 ──
  logicClues: [
    {
      id: "clue-1",                    // 线索ID（格式 clue-N）
      type: "关联词",                  // 关联词 | 标点符号 | 语义对应 | 感情色彩 | 搭配习惯
      keyword: "尽管…却…",            // 关键词
      description: "这条线索说明了什么，出题人在这里设了什么考点",
      location: "第一句",              // 在文段中的位置
      redScarfTip: "巾神说：(可选) 红领巾对此类线索的方法论点评"
    }
    // 每道题至少 2 条逻辑线索
  ],

  // ── 常见遗漏提示 ──
  commonMisses: [
    {
      id: "miss-1",                    // 遗漏ID
      relatedClueIds: ["clue-2"],      // 关联的被遗漏线索ID
      feedback: "你漏了X处，具体说明怎么漏的、怎么看",
      redScarfTip: "巾神说：(可选) 红领巾方法论点评"
    }
    // 每道题至少 1 条常见遗漏
  ],

  // ── 同类题推荐 ──
  similarQuestions: ["q008", "q015"]   // 推荐同类题的ID，至少 1 个
}
```

### 质量检查清单

每道题提交前确认：

- [ ] `id` 唯一，不与已有题目冲突
- [ ] `logicClues` ≥ 2 条，每条有 description
- [ ] `commonMisses` ≥ 1 条，每条有 feedback
- [ ] 正确选项的分析字段完整：originalMeaning + extendedMeaning + connotation + commonTargets + rmrbExample
- [ ] 错误选项有 differenceFromCorrect
- [ ] `similarQuestions` 至少关联 1 道同类题
- [ ] 指代词（如压舱石）在 metaphor-dict.js 中有对应词条
- [ ] 成语/生僻词在 idiom-dict.js 中有对应词条
- [ ] JSON 格式正确（可用管理面板导入功能自动校验）

## 三、补充成语/生僻词

编辑 `js/idiom-dict.js`，在 `IDIOM_DICT` 对象末尾添加：

```javascript
"成语名": {
  pinyin: "chéng yǔ míng",
  type: "成语",                        // 成语 | 成语-易错 | 成语-生僻 | 成语-热点 | 双字词 | 双字词-生僻
  frequency: "高/中高/中",            // 考试出现频率
  originalMeaning: "字面本意",
  extendedMeaning: "引申义和使用场景",
  connotation: "褒义/贬义/中性",
  commonTargets: "常用于哪些对象/领域",
  keyCollocation: "常见搭配",
  commonMistakes: "常见误用（可选）",
  synonyms: ["近义词1", "近义词2"],     // 可选
  antonyms: ["反义词1"],               // 可选
  rmrbExamples: ["人民日报例句1", "例句2"]
}
```

## 四、补充指代词

编辑 `js/metaphor-dict.js`，在 `METAPHOR_DICT` 对象末尾添加：

```javascript
"指代词名": {
  pinyin: "zhǐ dài cí",
  type: "比喻-稳定类",                 // 分类见现有词条
  literalMeaning: "字面本意",
  metaphoricalMeaning: "比喻义和核心含义",
  connotation: "褒义/贬义/中性",
  commonTargets: "常用领域/对象",
  commonCollocations: ["常见搭配1", "搭配2"],
  rmrbExamples: ["人民日报例句1", "例句2"],
  distinguishFrom: {
    "易混词A": "区别说明",
    "易混词B": "区别说明"
  }
}
```

## 五、部署到 GitHub Pages

1. 确保所有修改已保存
2. 运行 `cp -r 言语理解陪练/* docs/` 同步到部署目录
3. `git add docs/ && git commit -m "feat: 更新题目" && git push origin main`
4. 等待约1分钟后访问 `https://5bqf.github.io/bqff/`

## 六、常见问题

**Q: 导入 JSON 时报"ID 冲突"？**
A: 检查新题目的 `id` 字段是否与已有题目重复。可用管理面板"导出 JSON"查看所有现有 ID。

**Q: 如何批量添加 10+ 道题？**
A: 按模板格式写一个 JSON 数组（`[{题1}, {题2}, ...]`），用管理面板一次导入。

**Q: 人民日报例句从哪里找？**
A: 
- [人民网搜索](http://search.people.com.cn/)
- 微信公众号文章《跟着人民日报学写作》
- 现有 `idiom-dict.js` 和 `metaphor-dict.js` 中的词条

**Q: 如何增加新的逻辑类型？**
A: 在题目的 `logicTags` 中使用新标签名即可，筛选标签会自动更新。建议先在已有 10 种类型中归类。

## 七、技术架构

| 项目 | 说明 |
|------|------|
| 架构 | 纯前端 SPA，零后端依赖 |
| 框架 | 原生 HTML/CSS/JS，无构建工具 |
| 状态 | Hash 路由 + 内存状态机 + localStorage 持久化 |
| 部署 | 任何静态文件服务器，推荐 GitHub Pages |
| 浏览器 | Chrome/Firefox/Safari/Edge 现代版本均支持 |
