// ============================================================
// 言语理解·逻辑填空 题库
// 10道真题改编，覆盖全部逻辑类型
// 每道题标注：逻辑线索 + 常见遗漏 + 红领巾方法论提示
// ============================================================

const QUESTION_BANK = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q001: 转折关系 — 重点练"虽然…但是"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q001",
    title: "第1题 · 转折关系",
    type: "逻辑填空",
    logicTags: ["转折关系", "感情色彩"],
    difficulty: 2,
    source: "2023国考副省级真题改编",

    passage: "尽管诗歌绝无翻译的可能，却大有翻译介绍的必要。对于同一部作品，不同译本之间的比较，比纯粹的翻译介绍更具启发意义。但遗憾的是，目前国内译学界对翻译文本本身的比较研究尚不够______，大多数研究者只停留在对单个译本或单个译者进行孤立分析的层面。",

    blanks: [
      { index: 0, marker: "______", correctWord: "深入" }
    ],

    options: [
      {
        label: "A",
        word: "深入",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "进入事物的内部或中心，到达深层。",
          extendedMeaning: "指研究、分析、思考等达到了较深的层次，不是停留在表面。此处与'不够'搭配，表示研究深度不足。",
          connotation: "中性偏褒（在此处为中性描述研究程度）",
          commonTargets: "研究、分析、思考、改革、合作等",
          rmrbExample: "要深入推进供给侧结构性改革，不断提升经济发展质量。"
        }
      },
      {
        label: "B",
        word: "系统",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "同类事物按一定关系组成的整体。",
          extendedMeaning: "形容有条理、有秩序、全面完整。在此处填入'不够系统'似乎也通顺，但文段说的是'只停留在孤立分析'——强调的是'深不深'而非'全不全'。",
          connotation: "中性偏褒",
          commonTargets: "研究、工程、理论、管理",
          differenceFromCorrect: "文段逻辑重点：'孤立分析'暗示的是缺乏深度关联研究，而非缺乏全面性。'不够深入'比'不够系统'更精准对应'只停留在...层面'。",
          rmrbExample: "要系统推进生态文明建设，打好污染防治攻坚战。"
        }
      },
      {
        label: "C",
        word: "全面",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "所有方面都包括在内，没有遗漏。",
          extendedMeaning: "指涵盖范围广泛、不片面。与B选项'系统'接近，但更侧重广度而非条理性。",
          connotation: "中性偏褒",
          commonTargets: "发展、改革、提升、分析",
          differenceFromCorrect: "同样的逻辑漏洞：'只停留在孤立分析'强调的不是研究范围的宽窄，而是研究层次的深浅。'全面'对应的是'片面'，而文段强调的是'浅层vs深层'。",
          rmrbExample: "全面深化改革是关系党和国家事业发展全局的重大战略部署。"
        }
      },
      {
        label: "D",
        word: "细致",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "精细周密，不疏忽细节。",
          extendedMeaning: "指做事认真仔细，注意到细小的方面。强调'细不细'而非'深不深'。",
          connotation: "褒义",
          commonTargets: "工作、分析、观察、服务",
          differenceFromCorrect: "'只停留在孤立分析'暗示的是分析缺乏深度和关联性，与'细致与否'关系不大。有些研究可以很'细致'但仍只是'停留在孤立层面'。",
          rmrbExample: "要细致做好群众工作，把好事办到群众心坎上。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "关联词-转折",
        keyword: "尽管…却…",
        description: "首句'尽管诗歌绝无翻译的可能，却大有翻译介绍的必要'——看到'尽管…却'，马上意识到这是一个预备铺垫：后面要讨论的'翻译'话题，是在承认局限性前提下的正面讨论。",
        location: "第一句",
        redScarfTip: "巾神说：首句往往预设整个文段的语义方向。第一句在说'翻译有局限但还是有必要的'，说明后面不会再去讨论'要不要翻译'，而是讨论'怎么翻译得更好'。"
      },
      {
        id: "clue-2",
        type: "关联词-转折",
        keyword: "但",
        description: "'但遗憾的是'——关键转折！后面说的肯定是'做得还不够好的地方'。空格前面的'尚不够'也在呼应这个负面信号。",
        location: "第二句",
        redScarfTip: "巾神说：转折后是重点。'但遗憾的是'后面说的就是问题所在——一定是你觉得应该做好、但实际没做好的事。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "只停留在…孤立分析",
        description: "最后一句'只停留在对单个译本或单个译者进行孤立分析的层面'——这是对空格内容的语境反推。空格在'不够____'，后面马上解释'只停留在...'→说明空格要填的是'超越表层/孤立'的程度词。'深入'最贴合：从表层走向深层，从孤立走向关联。",
        location: "第三句",
        redScarfTip: "巾神说：文段的最后一句话往往是对前面的解释。'只停留在孤立分析'就是对'不够深入'的具体展开——逻辑填空最关键的技能就是找到这种前后对应。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-3"],
        feedback: "你可能漏掉了第三句的'解释说明'关系——文段说'只停留在对单个译本或单个译者进行孤立分析'，这实际上是在具体解释'不够____'是什么意思。'孤立'的反面不是'全面'或'系统'，而是'深入关联'。选'深入'最能与'只停留在...层面'形成语义对照。这道题出题人故意放了'系统''全面'来干扰——它们都是'孤立'的常规反义词，但在这个文段语境下不对。",
        redScarfTip: "巾神说：逻辑填空最容易掉进去的坑就是'找反义词'而忽略了'找对应'。孤立的反义词是系统/全面，但文段不是在让你找反义词——它是在描述一个'研究不够X，导致只停留在孤立层面'的因果关系。你要找的是'深度'维度而不是'广度'维度。"
      }
    ],

    similarQuestions: ["q003", "q006"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q002: 递进关系 — "不仅…更…"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q002",
    title: "第2题 · 递进关系",
    type: "逻辑填空",
    logicTags: ["递进关系", "语义对应"],
    difficulty: 2,
    source: "2022国考行测真题改编",

    passage: "在日益复杂的现代社会，公共政策不仅需要事后的______，更需要事前的预见与防范。如果在政策制定阶段就充分评估可能的风险并做好预案，很多社会问题完全可以避免。",

    blanks: [
      { index: 0, marker: "______", correctWord: "应对" }
    ],

    options: [
      {
        label: "A",
        word: "应对",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "采取措施对付出现的情况或问题。",
          extendedMeaning: "指面对已经发生的问题采取行动加以处理。在本文中与'事后的'搭配，逻辑通顺：事发后先应对，然后进一步做到'预见与防范'。",
          connotation: "中性",
          commonTargets: "风险、挑战、危机、问题、变化",
          rmrbExample: "要提升应急管理能力，有效应对各类突发事件。"
        }
      },
      {
        label: "B",
        word: "补救",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "采取行动纠正错误、弥补损失。",
          extendedMeaning: "强调的是'错了之后去修复'，而文段的逻辑链是'面对问题→预见防范'，不一定是'犯错了'，也可能是'遇到了新情况'。",
          connotation: "中性",
          commonTargets: "错误、损失、过失、漏洞",
          differenceFromCorrect: "'补救'过于狭窄——只适用于'犯错'场景。而公共政策面对的不仅是'错误'，更多是'新问题''新挑战'，用'应对'更宽泛。",
          rmrbExample: "发现问题要及时补救，把损失降到最低。"
        }
      },
      {
        label: "C",
        word: "处置",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "处理、安排、发落。",
          extendedMeaning: "强调对具体事务或事件的办理和解决，带有'操作层面'的色彩。公共政策的用词更适合'应对'这一更宏观的表达。",
          connotation: "中性",
          commonTargets: "事件、案件、资产、人员",
          differenceFromCorrect: "'处置'偏操作层面和具体事务，不如'应对'适用于'公共政策'这一宏观语境。且'应对'与后文的'预见防范'形成的递进更自然。",
          rmrbExample: "依法处置违法信访行为，维护正常信访秩序。"
        }
      },
      {
        label: "D",
        word: "反应",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "有机体受到刺激后产生的相应活动。",
          extendedMeaning: "指对事件做出回应，偏'被动的、本能层面的回应'。而公共政策的'应对'应该是有组织的、主动的措施，'反应'程度偏弱偏被动。",
          connotation: "中性",
          commonTargets: "应激、过敏、市场波动、公众情绪",
          differenceFromCorrect: "'反应'偏被动和本能层面，公共政策需要的是主动的'应对'。另外'应对'与'防范'形成的递进更工整——都是积极、有组织的行为。",
          rmrbExample: "面对突发舆情，相关部门迅速反应、妥善应对。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "关联词-递进",
        keyword: "不仅…更…",
        description: "'不仅需要事后的______，更需要事前的预见与防范'——'不仅A，更B'是典型的递进结构。A和B应该是同一维度上的两个层次，B比A更进一步。在这里，'事后的'对应'事前的'，空格词应该和'预见与防范'形成从低到高的递进层次。",
        location: "第一句",
        redScarfTip: "巾神说：递进关系的核心是'程度升级'——你填进去的词，要和后面那个'更需要'的事物在同一维度上，但比它程度浅一级。"
      },
      {
        id: "clue-2",
        type: "语义对应-时间线",
        keyword: "事后 → 事前",
        description: "'事后的'与'事前的'形成了明确的时间线对比。空格词对应的是'事发之后'这个时间点该做的事。'应对'最符合这个时间定位——事发后先应对，进而提升到事前的预见与防范。",
        location: "第一句",
        redScarfTip: "巾神说：逻辑填空不能脱离文段自建的时间逻辑。文段已经给出了'事后→事前'的时间轴，空格词必须落在'事后'这个时间点上。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "预见与防范",
        description: "最后一句具体解释了什么叫做'事前的预见与防范'——'充分评估可能的风险并做好预案'。这是对递进后项的展开说明，帮助理解前项（空格词）应该比这个层次低。",
        location: "第二句",
        redScarfTip: "巾神说：后面对递进后项有展开说明，这是给你送分——看清楚后项的层次，前项比它低一档就行了。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-1", "clue-2"],
        feedback: "你可能没有充分利用'不仅…更'这个递进结构。这道题的关键突破口在于：空格词必须和'预见与防范'形成递进关系——两者都是积极的、有组织的行为，但一个在事后、一个在事前。从这个标准看，'应对'（事后主动处理）→'预见防范'（事前主动预防）是最工整的递进链。'补救'的问题是它暗示'犯错了'，不是所有政策问题都是错误导致的。'反应'太被动，形不成递进。",
        redScarfTip: "巾神说：递进题的陷阱通常是——四个选项从单个来看好像都说得通。但你要记住：递进要求A比B低一档、且两者是同一维度。不符合这个约束的，再顺口也不能选。"
      }
    ],

    similarQuestions: ["q001", "q004"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q003: 并列关系 — 分号 + 语义并列
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q003",
    title: "第3题 · 并列关系",
    type: "逻辑填空",
    logicTags: ["并列关系", "语义对应", "感情色彩"],
    difficulty: 3,
    source: "2023联考真题改编",

    passage: "文艺创作既需要______的灵感迸发，也需要精雕细琢的匠心打磨。前者决定了作品的上限有多高，后者决定了作品的下限有多稳。",

    blanks: [
      { index: 0, marker: "______", correctWord: "天马行空" }
    ],

    options: [
      {
        label: "A",
        word: "天马行空",
        isCorrect: true,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "天马奔腾神速，好像在空中飞行。",
          extendedMeaning: "比喻才思敏捷、想象力丰富奔放，不受拘束。在文艺创作语境中是褒义词，形容创作者的想象力自由驰骋。",
          connotation: "褒义（在文艺创作语境下）",
          commonTargets: "想象力、创意、文笔、艺术风格",
          rmrbExample: "创作者天马行空的想象力，是文化产业最宝贵的资源。"
        }
      },
      {
        label: "B",
        word: "异想天开",
        isCorrect: false,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "比喻荒唐离奇，想象着暂时无法实现的事。",
          extendedMeaning: "指想法非常离奇、不切实际。与'天马行空'近义但感情色彩偏贬——强调的是'不切实际的幻想'而非'自由的想象力'。",
          connotation: "贬义",
          commonTargets: "不切实际的幻想、荒唐的提议",
          differenceFromCorrect: "文段对'灵感迸发'持肯定态度（'决定了作品的上限'），所以不能用贬义的'异想天开'。",
          rmrbExample: "有人认为沙漠变良田是异想天开，但中国治沙人用行动证明了这是可能的。"
        }
      },
      {
        label: "C",
        word: "随心所欲",
        isCorrect: false,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "随着自己的心意，想怎样就怎样。",
          extendedMeaning: "形容随心行事、不受约束。与'天马行空'的区别是：'随心所欲'常用于行为层面（行为不受约束），而'天马行空'专用于思维/想象层面（思维自由奔放）。",
          connotation: "中性偏贬（常含有'过于随意'的批评意味）",
          commonTargets: "行为、生活方式",
          differenceFromCorrect: "在文艺创作语境中，'随心所欲'暗示创作者随意任性，而文段赞美的是'灵感迸发'，用'随心所欲'不恰当。且'随心所欲'偏向行为自由，'天马行空'专指想象力奔放。",
          rmrbExample: "艺术创作不是随心所欲的涂鸦，而是有规律可循的创造。"
        }
      },
      {
        label: "D",
        word: "不拘一格",
        isCorrect: false,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "不局限于一种规格或方式。出自龚自珍'我劝天公重抖擞，不拘一格降人才'。",
          extendedMeaning: "比喻打破常规，采用多种方式，不局限于单一模式。强调方式上的多样性。",
          connotation: "褒义",
          commonTargets: "选人用人、创新方式、表现形式",
          differenceFromCorrect: "'不拘一格'强调形式的多元性（多种方式），而非思维的自由度（想象力奔放）。文段'灵感迸发'强调的是创意的自由奔放，而非表现形式的多样化。",
          rmrbExample: "要不拘一格降人才，让更多优秀青年脱颖而出。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "关联词-并列",
        keyword: "既需要…也需要…",
        description: "'既需要A，也需要B'——这是典型的并列结构，A和B地位平等、同等重要。但不代表A和B含义相近——这里是'对比并列'：A和B是创作的两个不同侧面——一个是灵感（自由的、奔放的），一个是匠心（精细的、打磨的）。",
        location: "第一句",
        redScarfTip: "巾神说：并列不等于近义。'既…也'有时候连接的是一件事的两个侧面——它们是对比关系而不是相似关系。这道题空格词应该是'精雕细琢'的反面——自由奔放。"
      },
      {
        id: "clue-2",
        type: "语义对应-解释说明",
        keyword: "前者…后者…",
        description: "第二句'前者决定了作品的上限有多高，后者决定了作品的下限有多稳'——明确区分了空格词（灵感）和'精雕细琢'（匠心）的不同作用。灵感决定上限高度（想象力），匠心决定下限稳定性（基本功）。这说明空格词应该和'高/上限'的意象匹配。'天马行空'与'高'的意象天然呼应。",
        location: "第二句",
        redScarfTip: "巾神说：出题人在第二句给你送了递进的解释——'决定上限'就是在暗示第一个词要有'高/远/飞'的感觉。'天马行空'的'空'完美扣住了'上限高'。"
      },
      {
        id: "clue-3",
        type: "感情色彩",
        keyword: "灵感迸发",
        description: "'灵感迸发'是一个明显的褒义表达——出题人对这个创作状态是肯定和赞美的。因此空格词也必须带有褒义或至少中性的感情色彩，不能是贬义的。",
        location: "第一句",
        redScarfTip: "巾神说：感情色彩是快速排除选项的利器。整个文段对两种创作方式都是肯定的——马上排除贬义词。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-2"],
        feedback: "你可能漏掉了第二句的'前者…后者…'——这道题的一个精妙之处在于，出题人用'上限有多高'来暗示第一个词应该有'高远/自由'的意象。'天马行空'中的'空'（天空、高处）与'上限高'形成暗合，这是一处隐蔽但关键的逻辑对应。如果不注意第二句的解释说明功能，就可能被'不拘一格'这种看起来也能搭配'灵感'的选项迷惑。",
        redScarfTip: "巾神说：逻辑填空的高手和普通人的差距，就在于能不能多读一句。很多人第一句选了觉得还行的答案就跳过了——但第二句往往藏着让你排除那个'还行'选项的关键线索。这道题第二句的'上限高'就是这种线索。"
      }
    ],

    similarQuestions: ["q006", "q009"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q004: 因果关系
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q004",
    title: "第4题 · 因果关系",
    type: "逻辑填空",
    logicTags: ["因果关系", "语义对应"],
    difficulty: 2,
    source: "2022联考真题改编",

    passage: "随着公众环保意识的不断增强，绿色消费正在从一种小众选择______为主流趋势。越来越多的消费者愿意为环保产品支付溢价，这反过来又激励企业加大绿色技术的研发投入。",

    blanks: [
      { index: 0, marker: "______", correctWord: "演变" }
    ],

    options: [
      {
        label: "A",
        word: "演变",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "事物在长时间内逐渐发展变化。",
          extendedMeaning: "指事物从一种状态自然地、渐进地变化为另一种状态。强调过程性和历史性，不强调人为推动，适合描述社会趋势的变化。",
          connotation: "中性",
          commonTargets: "社会趋势、历史进程、语言、文化、观念",
          rmrbExample: "改革开放以来，中国人的消费观念经历了从'吃饱穿暖'到'吃好穿美'的演变。"
        }
      },
      {
        label: "B",
        word: "跃升",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "跳跃式地上升。",
          extendedMeaning: "指在短时间内迅速上升到更高层次。强调速度——'快'和幅度——'大'。",
          connotation: "褒义",
          commonTargets: "排名、地位、产值、数量指标",
          differenceFromCorrect: "文段描述的是'从小众选择到主流趋势'——这是一个渐进的、自然的社会变迁过程，不是一跃而上的。'演变'比'跃升'更贴合这种'润物无声'的社会变化节奏。另外文段没有任何'快速'的暗示。",
          rmrbExample: "中国GDP总量跃升至世界第二位。"
        }
      },
      {
        label: "C",
        word: "过渡",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "事物由一个阶段逐渐发展而转入另一个阶段。",
          extendedMeaning: "强调阶段之间的衔接和转换，多用于临时状态或中间阶段。",
          connotation: "中性",
          commonTargets: "时期、阶段、状态、体制",
          differenceFromCorrect: "'过渡'暗示的是从A到B中间还有一个过渡阶段，而文段说的是绿色消费'正在'变成主流——它就是直接在变，不是在'过渡期'。且'过渡为主流趋势'搭配不自然。",
          rmrbExample: "我国经济已由高速增长阶段过渡到高质量发展阶段。"
        }
      },
      {
        label: "D",
        word: "晋升",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "提升到更高的职位、等级。",
          extendedMeaning: "多用于人的职级上升或事物在等级体系中的上升。比喻用法可扩展到抽象事物，但有'等级制/阶梯'的隐喻。",
          connotation: "褒义",
          commonTargets: "职位、军衔、等级、层次",
          differenceFromCorrect: "'晋升'带有强烈的'等级阶梯'隐喻——暗示从小众到主流是'升级'了。但文段是一个中性描述——绿色消费从小众变主流是社会变迁的自然结果，不是'升职'了。且'晋升为趋势'搭配不当。",
          rmrbExample: "他因工作表现突出，被晋升为部门主管。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "关联词-因果",
        keyword: "随着…",
        description: "首句'随着公众环保意识的不断增强'——这是一个背景铺垫，给出了变化的原因（环保意识增强）→结果（绿色消费变化）。这种'随着…，X正在从A变为B'的结构，暗示的是渐进的自然演变。",
        location: "第一句",
        redScarfTip: "巾神说：'随着'引导的是一个渐进的时间背景——后面发生的变化应该也是渐进的、自然的。如果后面接一个很'猛'的词（跃升、飙升），就会和前面的渐进感打架。"
      },
      {
        id: "clue-2",
        type: "语义对应",
        keyword: "从小众选择→主流趋势",
        description: "空格前后的'从…______为…'结构，描述了从一种状态到另一种状态的变化。'小众'→'主流'是一个渐进的、自然的社会变迁过程，适合用'演变'来描述这种长时段的社会趋势变化。",
        location: "第一句",
        redScarfTip: "巾神说：看到'从A变为B'的句式，先判断A→B是'渐变'还是'突变'。小众变主流——这是社会趋势的缓慢迁移，不可能是突然跳上去的。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "越来越多…反过来又",
        description: "第二句描述了良性循环：消费者多了→企业研发多了。'越来越多'暗示了这种变化的渐进性质——它是慢慢变多的，不是一蹴而就的。这进一步锁定了'演变'的渐进感。",
        location: "第二句",
        redScarfTip: "巾神说：文段中的每个细节都应该相互印证。'越来越多'在第二句呼应了第一句'演变'的渐进性——好的文章，逻辑是环环相扣的。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-1", "clue-2"],
        feedback: "你可能没有注意到'从小众→主流'这种变化需要的是'演变'而不是'跃升'。这道题的陷阱在于，出题人故意放了一个褒义的、有冲击力的词'跃升'——绿色消费变主流确实是好事，但文段的语气是冷静的、描述性的，不是渲染性的。选择词汇要尊重文段的整体语气，而不是你觉得哪个词'更带感'就选哪个。",
        redScarfTip: "巾神说：一个最常见的错误是——看到'好结果'就选'好词'。但你要区分：文段是在'描述一个现象'还是在'讴歌一个成就'。这道题是客观描述社会趋势，不需要你用'跃升'来帮忙鼓掌。"
      }
    ],

    similarQuestions: ["q002", "q007"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q005: 解释说明 — 冒号/破折号
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q005",
    title: "第5题 · 解释说明",
    type: "逻辑填空",
    logicTags: ["解释说明", "标点符号"],
    difficulty: 3,
    source: "2021国考真题改编",

    passage: "中国古典园林追求的是______之美：山重水复，柳暗花明，在有限的空间里创造出无限的意境。这与西方园林讲究对称、一览无余的风格形成了鲜明对比。",

    blanks: [
      { index: 0, marker: "______", correctWord: "含蓄" }
    ],

    options: [
      {
        label: "A",
        word: "含蓄",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "包含内藏而不外露，言语、诗文等意思含而不露，耐人寻味。",
          extendedMeaning: "在美学中指不直白、不直接袒露的艺术风格——通过暗示、隐喻、层层递进来表达，让观者自己品味和发现。中国园林的'移步换景''曲径通幽'就是含蓄美学的典型。",
          connotation: "褒义",
          commonTargets: "艺术风格、文学表达、建筑美学、情感表达",
          rmrbExample: "中国传统文化推崇含蓄之美，讲究'言有尽而意无穷'。"
        }
      },
      {
        label: "B",
        word: "对称",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "图形或物体对某个点、线、面而言，在大小、形状和排列上具有一一对应关系。",
          extendedMeaning: "在建筑和园林艺术中指左右呼应、排列规整的布局方式。",
          connotation: "中性",
          commonTargets: "建筑、园林、画面构图、数学",
          differenceFromCorrect: "文段最后明确说西方园林才讲究'对称'，中国园林与之'鲜明对比'——所以空格绝对不能填'对称'。加冒号后面的描述'山重水复，柳暗花明'也不是对称意象。",
          rmrbExample: "故宫建筑群严格遵循中轴对称的布局原则。"
        }
      },
      {
        label: "C",
        word: "空灵",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "灵活而难以捉摸，多用于形容艺术境界的灵动剔透。",
          extendedMeaning: "指艺术作品给人一种超脱世俗、飘逸灵动的感觉。偏重'灵动''飘逸''通透'。",
          connotation: "褒义",
          commonTargets: "诗歌意境、山水画、音乐、精神境界",
          differenceFromCorrect: "虽然中国园林有空灵的一面，但冒号后面的解释——'山重水复，柳暗花明'——强调的是'曲折''掩映''层层递进'，这是'含蓄'的美学特征，不是'空灵'（空灵偏'通透''虚无'，含蓄偏'隐藏''不直白'）。",
          rmrbExample: "这幅山水画意境空灵，令人心旷神怡。"
        }
      },
      {
        label: "D",
        word: "典雅",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "高雅别致、优美不粗俗。",
          extendedMeaning: "形容格调高雅、有品位，多用于文学艺术风格或外在风貌的评价。",
          connotation: "褒义",
          commonTargets: "艺术风格、语言表达、建筑外观、人物气质",
          differenceFromCorrect: "'典雅'侧重于'高雅'和'有品位'——气质层面的优雅。但冒号后面解释的核心不是'高雅'，而是'通过曲折隐藏来创造更多意境'——这是'含蓄'的核心内涵。中国园林当然很典雅，但这道题考查的是更精确的逻辑对应。",
          rmrbExample: "苏州园林建筑典雅精致，堪称中国古典园林的杰出代表。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "标点符号-冒号",
        keyword: "：",
        description: "冒号是最强的解释说明信号！空格后面紧跟着冒号，说明'山重水复，柳暗花明，在有限的空间里创造出无限的意境'就是在具体解释空格词是什么意思。你必须从冒号后面的描述往回推导空格词。",
        location: "第一句",
        redScarfTip: "巾神说：冒号=出题人在说'我给你解释一下'。逻辑填空看到冒号，先不纠结选项，把冒号后面读三遍——这里藏着你唯一的答案。"
      },
      {
        id: "clue-2",
        type: "语义对应-对比",
        keyword: "鲜明对比",
        description: "第二句直接指出中国园林的美学与西方'对称、一览无余'形成鲜明对比。因此空格词应该和'一览无余'构成反义——一个是一眼看完，一个是层层推进看不完。'含蓄'正是'一览无余'的最佳反义词。",
        location: "第二句",
        redScarfTip: "巾神说：当你纠结两个选项时，去找文段中是否有'对比'——对比的另一端就是给你锁死答案的锚点。西方园林是'一览无余'→中国园林一定是它的反面→不让你一眼看完→含蓄。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "山重水复，柳暗花明",
        description: "冒号后面的四个字、四个字构成的对仗——'山重水复'：山峦重叠、水流曲折；'柳暗花明'：柳荫深处藏着明媚花景。这两组词的共同点是什么？都是'不是一眼就能看全的'——需要走过去、转个弯才能发现。这就是'含蓄'。",
        location: "第一句（冒号后）",
        redScarfTip: "巾神说：并列的四字短语往往是出题人刻意安排的——用诗意的语言来限定空格词的含义。你要做的不是欣赏它的诗意，而是提取这些描述的'公约数'。山重水复+柳暗花明→不直接袒露→含蓄。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-2"],
        feedback: "最容易被漏掉的是第二句的'鲜明对比'——它把这个空格变成了填空题里的'送分条件'：中国园林的美学 = 西方园林美学的反面 = '一览无余'的反面 = '含蓄'。如果你只看了冒号后面的内容去猜，可能会在'含蓄'和'空灵'之间纠结。一旦把第二句的对比条件加上，'空灵'就排除了——因为'空灵'的反面不是'一览无余'。",
        redScarfTip: "巾神说：做题最怕的就是'忘了读第二句'。第一句的冒号给你提供了正向描述，第二句的对比给你提供了反向锁定。正反两个方向都指向同一个词时，它一定是对的。"
      }
    ],

    similarQuestions: ["q008", "q009"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q006: 感情色彩 + 语义对应
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q006",
    title: "第6题 · 感情色彩排除法",
    type: "逻辑填空",
    logicTags: ["感情色彩", "语义对应"],
    difficulty: 2,
    source: "2022国考真题改编",

    passage: "一些地方在发展旅游经济时，将历史名人故里之争演变为一地鸡毛的闹剧，这种______的做法不仅无助于文化传承，反而对历史人物本身也是一种伤害。",

    blanks: [
      { index: 0, marker: "______", correctWord: "急功近利" }
    ],

    options: [
      {
        label: "A",
        word: "急功近利",
        isCorrect: true,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "急于追求眼前的成效和利益。",
          extendedMeaning: "形容目光短浅、只顾眼前利益而忽视长远价值的行为方式。是批评短视行为的常用成语。",
          connotation: "贬义",
          commonTargets: "经济发展方式、政绩观、教育方式、企业经营",
          rmrbExample: "发展经济不能急功近利，要注重可持续发展和长远效益。"
        }
      },
      {
        label: "B",
        word: "标新立异",
        isCorrect: false,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "提出新奇的主张，显示与众不同。",
          extendedMeaning: "形容为了显得特殊而故意提出与众不同的见解或做法。中性偏贬——强调'刻意求新求异'。",
          connotation: "中性偏贬",
          commonTargets: "学术观点、艺术风格、设计理念、言论表达",
          differenceFromCorrect: "文段批评的核心不是'刻意求新'——争名人故里各地都在做，谈不上'标新'。文段批评的是'为了短期旅游收入而忽视文化传承'，这是'急功近利'而不是'标新立异'。",
          rmrbExample: "学术研究要扎实严谨，不能为了标新立异而哗众取宠。"
        }
      },
      {
        label: "C",
        word: "趋之若鹜",
        isCorrect: false,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "像鸭子一样成群地跑过去。鹜：野鸭。",
          extendedMeaning: "比喻很多人争着去追逐某种事物（多为不好的事物）。强调'跟风''盲从'。",
          connotation: "贬义",
          commonTargets: "盲目追捧、跟风行为",
          differenceFromCorrect: "文段批评的是'只顾眼前利益'的行为动机，而非'跟风'的行为方式。各地争名人故里虽然客观上形成了'一窝蜂'，但空格考查的是对这种现象的性质判断——'急功近利'更能概括'为短期利益不惜闹剧化'的本质。",
          rmrbExample: "不能让青少年对网红职业趋之若鹜，要引导树立正确的职业观。"
        }
      },
      {
        label: "D",
        word: "本末倒置",
        isCorrect: false,
        isIdiom: true,
        isMetaphor: false,
        analysis: {
          originalMeaning: "把根本的当作枝末的，把枝末的当作根本的。",
          extendedMeaning: "比喻把主次、轻重的位置颠倒了。强调'把不重要的看得太重，把重要的忽略了'。",
          connotation: "贬义",
          commonTargets: "主次关系错位、价值判断偏差",
          differenceFromCorrect: "有干扰性——争名人故里确实可以说是把'文化传承'和'旅游收益'主次颠倒了。但文段更准确的批评是：为了短期旅游收入而不择手段——这是'追求眼前小利''急功近利'，'本末倒置'是结果而不是动机。而且文段中'一地鸡毛的闹剧'更直接对应的是'急功近利'导致的乱象。",
          rmrbExample: "抓安全生产不能本末倒置，不能牺牲安全换速度。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "感情色彩",
        keyword: "一地鸡毛的闹剧",
        description: "'闹剧'——非常明显的贬义。整个文段对各地争名人故里的做法持完全否定的态度。因此空格处必须填入一个贬义词来表达批评。",
        location: "第一句",
        redScarfTip: "巾神说：感情色彩是逻辑填空的快速筛子。看到整个文段一边倒地批评一件事，空格一定也是批评性的贬义词。"
      },
      {
        id: "clue-2",
        type: "关联词",
        keyword: "不仅…反而…",
        description: "'这种______的做法不仅无助于文化传承，反而…也是一种伤害'——'不仅无助于A，反而伤害B'构成了递进式的负面评价。空格词应该是能导致这种负面后果的行为特征。",
        location: "第一句",
        redScarfTip: "巾神说：'不仅无助于X，反而伤害Y'——这种句式的逻辑是：这种做法本身就有问题，所以它不但帮不到X，反过头来还害了Y。空格词应该能解释'为什么会有这种两头不讨好的效果'。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "发展旅游经济",
        description: "文段第一句话交代了背景——'在发展旅游经济时'——人们在经济利益的驱动下做出了荒唐事。'发展旅游经济'是动机，'一地鸡毛的闹剧'是结果。空格词应该点出这种动机的缺陷——为了经济利益而急于求成。这就锁定了'急功近利'。",
        location: "第一句",
        redScarfTip: "巾神说：找空格词的'动机'——人们为什么要做这件事？文段开头给的原因（发展旅游经济）就是你锁定词义的锚点。为了经济利益→急于见效→急功近利。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-3"],
        feedback: "'本末倒置'和'趋之若鹜'都有一定的干扰性，但它们各自漏掉了文段的不同关键信息。'本末倒置'是对的判断但不是最精准的词——文段的批评重心是'急'（急于求成）而不是'倒'（主次颠倒）。'趋之若鹜'强调'跟风'，而文段没有说'大家看到别人争就跟着争'。'急功近利'之所以最准确，是因为它直接对应了'发展旅游经济'这个功利性动机和'闹剧'这个因急而乱的结果。",
        redScarfTip: "巾神说：二选一时，回到文段的'动机'——文段开头交代的'为了什么而做这件事'，往往就是锁定正确选项的最后一把钥匙。"
      }
    ],

    similarQuestions: ["q001", "q003"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q007: 搭配习惯
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q007",
    title: "第7题 · 搭配习惯",
    type: "逻辑填空",
    logicTags: ["搭配习惯", "语义对应"],
    difficulty: 2,
    source: "2021联考真题改编",

    passage: "加快培育数据要素市场，需要______数据产权制度，明确数据资源的权属关系，保障数据在安全合规的前提下有序流通和高效利用。",

    blanks: [
      { index: 0, marker: "______", correctWord: "健全" }
    ],

    options: [
      {
        label: "A",
        word: "健全",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "使事物完善、完备，没有缺损。",
          extendedMeaning: "指制度、体系、机制等从不够完善到更加完善的过程。常与'制度''体系''机制'搭配。",
          connotation: "褒义",
          commonTargets: "制度、体系、机制、法律、规章",
          rmrbExample: "要健全完善产权保护制度，激发各类市场主体活力。"
        }
      },
      {
        label: "B",
        word: "确立",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "稳固地建立或树立。",
          extendedMeaning: "指将事物明确地建立起来，使之具有稳固的地位。强调'从无到有建立'。",
          connotation: "褒义",
          commonTargets: "制度、地位、权威、关系、目标",
          differenceFromCorrect: "数据产权制度可能已经有一定基础（不是从零开始），现在需要的是'完善'而不是'建立'。另外'加快培育'暗示的是已有一定基础的'升级'，而不是'从无到有'的创建。",
          rmrbExample: "确立以人民为中心的发展思想在各项工作中的指导地位。"
        }
      },
      {
        label: "C",
        word: "构建",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "建立、搭建（多用于抽象事物）。",
          extendedMeaning: "指有组织地、系统地把各个部分组合成一个整体。强调'系统性搭建'。",
          connotation: "褒义",
          commonTargets: "理论体系、制度框架、话语体系、平台",
          differenceFromCorrect: "'构建'强调'搭框架'——从无到有系统性建设。但数据产权制度可能已有雏形，现在要做的是完善细化。且'加快培育数据要素市场'中'加快'一词暗示这是'推进已有进程'而非'另起炉灶'。",
          rmrbExample: "构建新发展格局是关系我国发展全局的重大战略任务。"
        }
      },
      {
        label: "D",
        word: "规范",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "约定俗成或明文规定的标准。",
          extendedMeaning: "作为动词指使事物符合规定的标准。强调'标准化''合规化'。",
          connotation: "中性偏褒",
          commonTargets: "行为、程序、市场、管理",
          differenceFromCorrect: "'规范'强调的是'标准化'——让事情按规定来做。而'健全'强调的是'完善化'——让制度更完整更到位。数据产权制度不是'不规范'的问题，而是'不够完善'的问题。而且制度的'规范'属于层次偏低的动作，'健全'更符合制度建设的正式表述。",
          rmrbExample: "要规范行政执法行为，切实保障人民群众合法权益。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "搭配习惯",
        keyword: "___制度",
        description: "在正式的政策话语体系中，'健全'与'制度'的搭配频率最高、最自然。'健全制度'意味着制度已有基础但存在不足，需要进一步完善。这与数据产权制度的发展现状吻合。相较之下，'确立制度'（从无到有）、'构建制度'（系统性搭建）都不如'健全'贴合。",
        location: "第一句",
        redScarfTip: "巾神说：搭配题不需要纠结词义辨析——你只需要判断：这个词和后面的宾语搭配，在正式文体中是否常见？多读人民日报，你自然会有语感。"
      },
      {
        id: "clue-2",
        type: "语义对应",
        keyword: "加快培育",
        description: "'加快培育数据要素市场'——'加快'暗示已经有进程在推进中，现在要提速；'培育'暗示像一个生命体一样慢慢成长。这都说明数据要素市场不是'从零开始'的，而是处于发展过程中。对应的制度工作也应该是'完善已有'的'健全'，而不是'从无到有'的'确立'或'构建'。",
        location: "第一句",
        redScarfTip: "巾神说：前文动词的时态感（是'开始'还是'推进'还是'完成'），决定了后面空格动词的时态。'加快'='已经在做了，现在要加速'→制度不可能是零基础→不能选'确立'或'构建'。"
      },
      {
        id: "clue-3",
        type: "语义对应-解释",
        keyword: "明确…关系，保障…流通",
        description: "空格后面跟了两个并列的目的：'明确数据资源的权属关系，保障数据在安全合规的前提下有序流通'。这说明制度要做的事情是'明确关系'和'保障流通'——这是对已有制度的完善和细化，不是从零建立。'健全'最能概括'让制度更好覆盖到这些具体方面'。",
        location: "第一句（后半段）",
        redScarfTip: "巾神说：空格后面的内容往往在具体说'这个动作要做什么'。后面说的是'明确关系+保障流通'——这些是制度的细化工作→前面应该是'健全'而不是'建立'。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-2"],
        feedback: "最容易忽略的是'加快培育'的时态信号——它等于在告诉你：数据要素市场不是零点，已经在路上了。很多人看到'数据产权制度'觉得这是新东西，直觉就选了'构建'。但要注意——新领域不等于零基础。数据产权的讨论已经进行了好几年，制度雏形已存在，现在需要的是'健全'。这道题的关键不是辨析近义词，而是判断文段的时态。",
        redScarfTip: "巾神说：搭配题不只是语感——还要看文段的'时态'。是'从零开始'还是'已有基础要完善'？这种时态判断决定了你应该选'创建类'动词还是'完善类'动词。"
      }
    ],

    similarQuestions: ["q004", "q010"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q008: 指代词/比喻型填空
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q008",
    title: "第8题 · 指代词/比喻型",
    type: "逻辑填空",
    logicTags: ["指代词", "比喻对应", "感情色彩"],
    difficulty: 3,
    source: "公考高频比喻词汇改编",

    passage: "粮食安全是国家安全的______。一个国家只有把饭碗牢牢端在自己手中，才能在风云变幻的国际形势中保持战略定力，不被别人卡住脖子。",

    blanks: [
      { index: 0, marker: "______", correctWord: "压舱石" }
    ],

    options: [
      {
        label: "A",
        word: "压舱石",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: true,
        analysis: {
          originalMeaning: "空船航行时放置在船舱底部的石块等重物，用于降低重心、稳定船身、防止倾覆。",
          extendedMeaning: "比喻起稳定作用、抵御风险、保障健康发展大局的关键力量。侧重'稳定''根基''兜底'。注意：不可用于'动力'场景。",
          connotation: "褒义",
          commonTargets: "粮食安全、实体经济、消费市场、能源保供、就业、农业基本盘",
          rmrbExample: "稳住农业基本盘、守好'三农'基础是应变局、开新局的'压舱石'。",
          metaphorSource: "航运→国家安全话语体系",
          metaphorUsage: "用于描述在动荡环境中维持国家稳定的基础性、保障性力量"
        }
      },
      {
        label: "B",
        word: "助推器",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: true,
        analysis: {
          originalMeaning: "火箭或航天器中用于增加推力的附属推进装置。",
          extendedMeaning: "比喻为事物发展提供推动力、加速发展的因素或手段。侧重'推动''加速'。",
          connotation: "褒义",
          commonTargets: "科技创新、改革开放、数字经济、政策激励",
          differenceFromCorrect: "粮食安全的作用是'兜底'和'稳定'，不是'推动加速'。文段中'不被别人卡住脖子''保持战略定力'强调的是安全保障而非发展动力。'助推器'用在此处方向完全相反。",
          rmrbExample: "数字经济正成为高质量发展的'助推器'。"
        }
      },
      {
        label: "C",
        word: "风向标",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: true,
        analysis: {
          originalMeaning: "指示风向的装置。",
          extendedMeaning: "比喻预示事物发展方向、引领趋势变化的事物。侧重'预示趋势''指示方向'。",
          connotation: "中性偏褒",
          commonTargets: "政策信号、行业趋势、市场走向",
          differenceFromCorrect: "粮食安全不是用来'指示方向'的——它是一个基础保障条件，是用来'稳住局面'的。'风向标'的核心功能是'指示/预示'，与文段强调的'稳定/保障'不匹配。",
          rmrbExample: "中央经济工作会议是观察明年经济政策的'风向标'。"
        }
      },
      {
        label: "D",
        word: "牛鼻子",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: true,
        analysis: {
          originalMeaning: "牛的鼻子，牵牛时牵住牛鼻子整头牛就会顺从跟随。",
          extendedMeaning: "比喻事物的关键、要害或主要矛盾。侧重'抓住关键''牵一发而动全身'。",
          connotation: "褒义",
          commonTargets: "科技创新、就业民生、水资源管理",
          differenceFromCorrect: "粮食安全当然是国家的'关键'问题——但'牛鼻子'强调的是'牵住就能带动全局'的突破口逻辑，而文段强调的是'稳定/保障/不被卡脖子'的压舱逻辑。两者虽然都是褒义比喻，但比喻的意象完全不同。",
          rmrbExample: "抓住了科技创新就抓住了牵动我国发展全局的'牛鼻子'。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "比喻对应",
        keyword: "才能在风云变幻中保持战略定力",
        description: "'风云变幻'=大海中波涛汹涌，'保持战略定力'=船只不倾覆、稳定前行。整个语境就是对航海场景的隐喻描述——那么空格词也应该来自同一隐喻域（航海事）。'压舱石'是航海中用于稳定船只的东西，与后面的航海隐喻完美契合。",
        location: "第一句（后半段）",
        redScarfTip: "巾神说：比喻型填空最重要的技巧——找到文段整体的隐喻域。后面在说'风云变幻''保持定力'，这就是在描绘一艘船在风浪中航行。你的空格词应该和这个隐喻同属一个世界。"
      },
      {
        id: "clue-2",
        type: "语义对应",
        keyword: "不被别人卡住脖子",
        description: "'不被卡脖子'强调自主可控、不被外部力量控制——这是一种'安全保障'的需要，对应的是'压舱石'的稳定保障功能。而不是'加速追赶'（助推器）或'找到突破口'（牛鼻子）。",
        location: "第一句（末尾）",
        redScarfTip: "巾神说：文段最后往往藏着你的最终确认信号。'不被卡脖子'=安全需求=稳定保障底→压舱石。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "端在自己手中",
        description: "'把饭碗牢牢端在自己手中'——'牢牢'强调稳定和兜底，不是发展速度。这进一步确认空格词应该强调'稳定'而非'动力'或'方向'。",
        location: "第一句",
        redScarfTip: "巾神说：同一个意思，作者会用不同的词反复说。'牢牢''保持定力''不被卡脖子'都在说一件事——稳定。空格词也应该是这个方向的。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-1"],
        feedback: "指代词题最大的陷阱是——四个选项都是人民日报高频比喻词，看起来都像'正确答案'。这道题的关键突破口在于发掘文段整体的隐喻域：'风云变幻'+'保持定力'+'不被卡脖子'=航海中船只抗风浪的场景。一旦识别出这个隐喻域，'压舱石'就是唯一和航海相关的词。其他三个——'助推器'（航天）、'风向标'（气象）、'牛鼻子'（农耕）——各有各的隐喻域，和文段的航海场景不匹配。",
        redScarfTip: "巾神说：指代词填空不是考你背了多少比喻词——是考你能不能认出文段在延续哪个隐喻。一旦认出隐喻域，答案就锁死了。这也是为什么背人民日报比喻词时，不能只背'意思'，还要背它的'来源域'——是航海的、航天的、农耕的、还是气象的？"
      }
    ],

    similarQuestions: ["q010"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q009: 语义对应 — 上下文语境推断
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q009",
    title: "第9题 · 语义对应",
    type: "逻辑填空",
    logicTags: ["语义对应", "感情色彩"],
    difficulty: 3,
    source: "2022国考真题改编",

    passage: "从某种意义上说，科幻文学是一种关于'可能性'的文学。它不是对现实的______，而是基于科学逻辑对未来的想象和推演。好的科幻作品往往能在看似天马行空的故事中，折射出人类社会的深层议题。",

    blanks: [
      { index: 0, marker: "______", correctWord: "复制" }
    ],

    options: [
      {
        label: "A",
        word: "复制",
        isCorrect: true,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "仿造原件制作出相同的东西。",
          extendedMeaning: "比喻原封不动地照搬、机械地再现。在此处指科幻文学不是对现实的简单照搬——这个判断与后文'基于科学逻辑的想象和推演'形成了完美的逻辑对照：不是简单的现实复制，而是在科学基础上往前推。",
          connotation: "中性偏贬（在此语境中暗示缺乏创造性）",
          commonTargets: "模式、经验、做法、信息",
          rmrbExample: "乡村振兴不能简单复制城市发展模式。"
        }
      },
      {
        label: "B",
        word: "粉饰",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "涂刷表面使之美观，引申为掩盖真相、美化外表。",
          extendedMeaning: "指通过表面装饰来掩盖问题或美化现实。有强烈的负面贬义。",
          connotation: "贬义",
          commonTargets: "现实问题、数据、成绩、太平",
          differenceFromCorrect: "文段讨论的是科幻文学的'创作方式'（怎么写），而非'创作态度'（怎么对待现实）。科幻文学不是在'粉饰'现实——它根本就不是以现实为直接对象的。用'粉饰'等于说科幻在美化现实，这与科幻的本质不符。",
          rmrbExample: "总结工作成绩要实事求是，不能搞粉饰太平那一套。"
        }
      },
      {
        label: "C",
        word: "颠覆",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "彻底推翻，使事物发生根本性的翻转。",
          extendedMeaning: "指从根本上否定或彻底改变原有的事物。力度很强，带有'革命性改变'的意味。",
          connotation: "中性（可褒可贬，取决于语境）",
          commonTargets: "传统观念、旧秩序、固有认知、行业格局",
          differenceFromCorrect: "科幻文学不是对现实的'颠覆'——它虽然超越现实，但文段强调它'基于科学逻辑'。说科幻'颠覆现实'过于激进了，而且这与文段温和的学术口吻不符。",
          rmrbExample: "移动支付颠覆了传统的支付方式。"
        }
      },
      {
        label: "D",
        word: "逃避",
        isCorrect: false,
        isIdiom: false,
        isMetaphor: false,
        analysis: {
          originalMeaning: "躲开不愿意或不敢接触的事物。",
          extendedMeaning: "指回避现实、不敢面对。有强烈的消极逃避意味。",
          connotation: "贬义",
          commonTargets: "现实、责任、困难、问题",
          differenceFromCorrect: "科幻文学不是在'逃避'现实——'好的科幻作品能折射出人类社会的深层议题'，这说明科幻恰恰是'面对'现实的，只不过不直接照搬。'逃避'与文段对科幻的肯定态度完全相反。",
          rmrbExample: "面对困难要迎难而上，不能消极逃避。"
        }
      }
    ],

    logicClues: [
      {
        id: "clue-1",
        type: "关联词-并列否定",
        keyword: "不是…而是…",
        description: "'不是对现实的______，而是基于科学逻辑对未来的想象和推演'——'不是A，而是B'这个结构在告诉你：A和B是相反的。B是'基于科学的想象推演'（有根据的创造），那么A就是它的反面——'没有创造性的照搬'。'复制'完美地完成了这个语义反义。",
        location: "第一句",
        redScarfTip: "巾神说：'不是A而是B'=出题人给了你现成的反义词。先读懂B是什么，然后选B的反面。B=有科学依据的创造→A=缺少创造的机械照搬→复制。"
      },
      {
        id: "clue-2",
        type: "语义对应",
        keyword: "关于'可能性'的文学",
        description: "首句定义科幻文学为'关于可能性的文学'——说明它关注的是'可能发生但尚未发生的事'。这从一开始就限定了科幻文学不是对'现存事实'的描写（不是'复制'现实）。",
        location: "第一句",
        redScarfTip: "巾神说：文段的第一句话往往给出了定义域——后面的所有判断都是从第一句的定义推导出来的。科幻='可能性'=不是已经存在的东西→不是'复制'现实。"
      },
      {
        id: "clue-3",
        type: "语义对应",
        keyword: "折射",
        description: "最后一句'折射出人类社会的深层议题'——'折射'是关键词。注意：科幻不直接'复制'现实，但它能'折射'现实。'折射'vs'复制'——一个是通过介质发生偏折（间接照到），一个是原样照搬（直接照到）。两相对比，进一步确证'复制'是最佳选项。",
        location: "最后一句",
        redScarfTip: "巾神说：注意文本中的'辞藻呼应'。文段用'折射'来描述科幻与现实的关系——折射就是'不直接'。那么前面空格就该与'折射'形成对照——'复制'（直接照搬）恰恰是'折射'的反面。这种辞藻层面的精细对应，是出题人给高分选手留的暗号。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-2", "clue-3"],
        feedback: "这道题可能在'复制'和'粉饰'之间纠结。'粉饰'为什么错？因为它讨论的是'态度问题'（美化vs丑化），而文段讨论的是'方法问题'（照搬vs创造）。科幻文学根本不以'如实反映现实'为己任，所以不存在'粉饰'还是'贬低'现实的问题。最容易被忽略的是第一句的定义——'关于可能性的文学'——这句话已经把'复制现实'排除在外了，因为'可能性'不等于'现实性'。",
        redScarfTip: "巾神说：当文段第一句给出了概念定义时，后续所有判断都必须在这个定义框架内理解。'科幻=可能性的文学'→不是对现实的什么？→不是对现实的复制（因为'可能性'≠'现实性'）。框架思维让你根本不会考虑'粉饰'。"
      }
    ],

    similarQuestions: ["q003", "q005"]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // q010: 综合型 — 多线索交叉验证
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "q010",
    title: "第10题 · 综合多线索",
    type: "逻辑填空",
    logicTags: ["综合", "指代词", "语义对应", "搭配习惯"],
    difficulty: 4,
    source: "2023国考真题改编",

    passage: "制度优势是一个国家的最大优势，制度竞争是国家间最______的竞争。历史和现实都表明，制度稳则国家稳，制度强则国家强。因此，我们必须把制度建设摆在更加突出的位置，不断______中国特色社会主义制度体系，把我国制度优势更好转化为国家治理效能。",

    blanks: [
      { index: 0, marker: "______", correctWord: "根本" },
      { index: 1, marker: "______", correctWord: "完善" }
    ],

    options: [
      {
        label: "A",
        words: ["根本", "完善"],
        isCorrect: true,
        analyses: [
          {
            word: "根本",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "事物的根源、基础或最重要的部分。",
            extendedMeaning: "指在最深层次上起决定作用的、不能回避的。与'制度优势是一个国家的最大优势'中的'最大'形成呼应——'最大'的优势对应的就是'最根本'的竞争。",
            connotation: "中性偏褒",
            commonTargets: "问题、原因、利益、保障、遵循",
            rmrbExample: "坚持以人民为中心的发展思想，是中国特色社会主义的根本立场。"
          },
          {
            word: "完善",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "使事物变得完备、美好，没有缺陷。",
            extendedMeaning: "指对已有但不够完备的制度/体系进行补充和改进。与前面的'制度建设'呼应——制度已经有了，现在要让它更好。",
            connotation: "褒义",
            commonTargets: "制度、体系、机制、法律、治理",
            rmrbExample: "要不断完善中国特色社会主义法治体系。"
          }
        ]
      },
      {
        label: "B",
        words: ["激烈", "构建"],
        isCorrect: false,
        analyses: [
          {
            word: "激烈",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "剧烈、猛烈，常形容竞争、战斗等的强度高。",
            extendedMeaning: "侧重于竞争的'烈度'（激烈程度），而文段需要的是竞争的'层级'（根本vs表面）。",
            connotation: "中性",
            commonTargets: "竞争、战斗、争论、运动",
            differenceFromCorrect: "'激烈'描写的是竞争的'外在表现形态'，而文段的逻辑链是'最大优势→最X竞争'，这需要的是一个与'最大'同一层级的深度判断词。'根本'与'最大'都是描述事物本质层级的词，'激烈'是描述强度的词——不在同一个话语层级上。",
            rmrbExample: "国际市场竞争日趋激烈。"
          },
          {
            word: "构建",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "建立、搭建（多用于抽象的系统性事物）。",
            extendedMeaning: "指从无到有地系统性建设。",
            connotation: "褒义",
            commonTargets: "体系、框架、格局、平台",
            differenceFromCorrect: "中国特色社会主义制度体系早已存在（'历史和现实都表明，制度稳则国家稳'说明制度已经存在且发挥了作用），现在要做的不是'构建'（从无到有），而是'完善'（让已有的变得更好）。",
            rmrbExample: "构建新发展格局是一项系统工程。"
          }
        ]
      },
      {
        label: "C",
        words: ["直接", "健全"],
        isCorrect: false,
        analyses: [
          {
            word: "直接",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "不经过中间事物、不绕弯子的。",
            extendedMeaning: "强调'无中介''面对面'，与'间接'相对。",
            connotation: "中性",
            commonTargets: "关系、影响、原因、联系、领导",
            differenceFromCorrect: "'最直接的竞争'在语义上可以成立——制度竞争确实是国家间最直接的竞争之一。但它和前面的'最大优势'呼应不够：'最大'→'最根本'是一脉相承的（都在说本质层面），'最大'→'最直接'则存在话语跳跃（本质→方式）。'根本'更精准。",
            rmrbExample: "这项举措直接惠及亿万人民群众。"
          },
          {
            word: "健全",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "使事物完善、完备。",
            extendedMeaning: "与'完善'近义，偏重'让制度没有缺漏'。在正式政策话语中，'健全'和'完善'常互换使用，但'完善制度体系'的搭配更常见。",
            connotation: "褒义",
            commonTargets: "制度、体系、机制",
            differenceFromCorrect: "第二个空的'健全'作为备选其实不错——但在政策话语中，'完善制度体系'比'健全制度体系'的搭配频率更高。并且A选项的'根本'明显优于C选项的'直接'——综合两个空来看，A胜出。",
            rmrbExample: "要健全完善现代企业制度。"
          }
        ]
      },
      {
        label: "D",
        words: ["隐性", "确立"],
        isCorrect: false,
        analyses: [
          {
            word: "隐性",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "性质上不表现在外的。",
            extendedMeaning: "与'显性'相对，指隐藏的、不容易直接看到的。",
            connotation: "中性",
            commonTargets: "成本、风险、规则、知识、文化",
            differenceFromCorrect: "制度竞争恰恰是'显性'的、'摆在台面上'的竞争——制度的优劣是明面上的。所以'隐性'犯了常识性错误。",
            rmrbExample: "隐性债务风险不容忽视。"
          },
          {
            word: "确立",
            isIdiom: false,
            isMetaphor: false,
            originalMeaning: "稳固地建立或树立。",
            extendedMeaning: "与'构建'类似，强调'从无到有建立'，不符合中国特色社会主义制度体系的实际情况。",
            connotation: "褒义",
            commonTargets: "制度、地位、权威、关系",
            differenceFromCorrect: "同'构建'——中国特色社会主义制度体系并非从零开始，因此不能用'确立'。",
            rmrbExample: "确立了社会主义市场经济体制的基本框架。"
          }
        ]
      }
    ],

    logicClues: [
      {
        id: "clue-1a",
        type: "语义对应-递进",
        keyword: "最大优势 → 最___竞争",
        description: "第一个空：'制度优势是一个国家的最大优势，制度竞争是国家间最______的竞争'——前一句说'最大优势'，后一句要接'最X竞争'。'最大'和'最X'形成排比式的强调。'最大'指向的是'根本/核心/本质'层面，而非'激烈/直接'等层面。",
        location: "第一句",
        redScarfTip: "巾神说：排比句式中的对应位置往往需要层级一致的词。'最大优势'→'最根本竞争'是顺畅的递进——都在讨论'制度的重要性层级'。换一个'最激烈的竞争'就跳到了另一个维度（强度而非层级）。"
      },
      {
        id: "clue-2a",
        type: "语义对应",
        keyword: "制度稳则国家稳，制度强则国家强",
        description: "这句话在具体说明为什么制度是'最根本'的竞争——因为它关系到国家的稳与强。'稳''强'都是根本性指标，进一步锁定'根本'。",
        location: "第一句（后半段）",
        redScarfTip: "巾神说：文段中用来支撑论点的论据，往往也在帮你锁定前面的判断词。'稳则国家稳'→制度是根本性的→'根本'。"
      },
      {
        id: "clue-1b",
        type: "搭配习惯 + 语义",
        keyword: "不断______制度体系",
        description: "第二个空：中国特色社会主义制度体系并非从零开始——'制度稳则国家稳'暗示制度已经运行良好。因此这里需要一个'让已有的变得更好'的动词。'完善'和'健全'都合适，但'完善'在'完善制度体系'中的搭配频率更高。",
        location: "最后一句",
        redScarfTip: "巾神说：两空题如果第二个空两个选项都能用——果断回到第一个空去决胜。然后你会发现A的'根本'明显优于C的'直接'。"
      },
      {
        id: "clue-2b",
        type: "关联词-因果",
        keyword: "因此",
        description: "'因此，我们必须把制度建设摆在更加突出的位置，不断______制度体系'——'因此'表明后面是结论。前面论证了制度的根本性，因此得出结论要'把制度建设摆在更突出位置'和'完善制度体系'。注意'更加突出'的'更加'——它告诉你制度已经在重要位置了，现在要更进一步，这与'完善'的'让好的更好'吻合。",
        location: "最后一句",
        redScarfTip: "巾神说：'更加突出'和'不断___'是一对——都在说'让已有的更进一步'。这排除了'构建'和'确立'（从无到有）。"
      }
    ],

    commonMisses: [
      {
        id: "miss-1",
        relatedClueIds: ["clue-1a"],
        feedback: "第一个空最容易漏掉的是'最大优势'和'最X竞争'之间的语义层级对应。很多人凭感觉选了'激烈'——因为'激烈竞争'是常见搭配，读起来顺口。但文段前面给出的判断框架是'最大优势'（本质判断），后面承接的应该也是本质判断（'根本'），而不是现象描述（'激烈'）。一旦你识别出这是一个'本质→本质'的判断链，'激烈'就被排除了。",
        redScarfTip: "巾神说：两空题的做题顺序很重要——先独立做每个空，然后看哪个选项两个空都对。如果某个选项只在第一个空很好、第二个空说不过去，就要重新检查第一个空——可能有你没发现的逻辑线索在否定它。"
      },
      {
        id: "miss-2",
        relatedClueIds: ["clue-2b"],
        feedback: "第二个空很多人会被'构建'迷惑——觉得制度当然是要'构建'的。但注意文段的时态——'制度稳则国家稳'这句用的是现在时，说明制度已经在发挥作用了，不是还没建。再结合'更加突出的位置''不断'等持续性的副词，可以判断这里需要的是'完善'（让已有的更好）而不是'构建'（从无到有建）。",
        redScarfTip: "巾神说：动词的时态判断——是'开始做'还是'继续做'？文段中'把制度建设摆在更加突出的位置'说明已经在做了（不是在开始做），后面的动词应该是'完善/健全/推进'而不是'确立/构建/创建'。"
      }
    ],

    similarQuestions: ["q004", "q007", "q008"]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUESTION_BANK;
}
