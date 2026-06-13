// ============================================================
// 指代词库 — 人民日报高频比喻/借代词深度解析
// 涵盖公考逻辑填空常考的比喻型词汇
// ============================================================

const METAPHOR_DICT = {

  // ── 稳定/基础类 ──
  "压舱石": {
    pinyin: "yā cāng shí",
    type: "比喻-稳定类",
    literalMeaning: "空船航行时放置在船舱底部的石块、铸铁等重物，用于降低船体重心、稳定船身，防止在风浪中倾覆。",
    metaphoricalMeaning: "比喻起稳定作用、抵御风险、保障健康发展大局的关键事物或力量。核心含义是'稳定''根基''兜底'，不可用于'动力''推动'场景。",
    connotation: "褒义",
    commonTargets: "粮食安全、实体经济、消费市场、能源保供、就业、社会稳定、农业基本盘、党的领导",
    commonCollocations: ["筑牢压舱石", "稳住压舱石", "发挥压舱石作用", "守好压舱石"],
    rmrbExamples: [
      "稳住农业基本盘、守好'三农'基础是应变局、开新局的'压舱石'。",
      "就业是最基本的民生，是经济发展的'晴雨表'、社会稳定的'压舱石'。",
      "充分发挥煤炭'压舱石'作用，加强煤炭清洁高效利用。",
      "严格考核，督促各地真正把保障粮食安全的责任扛起来，才能更好稳住粮食安全这块'压舱石'。"
    ],
    distinguishFrom: {
      "定盘星": "压舱石强调稳定底线、防止倾覆；定盘星强调校准方向、确立基准",
      "助推器": "压舱石是稳定力量（往下压），助推器是推动力量（往前推），二者方向相反，不可混用",
      "稳定器": "二者含义接近，但压舱石更有'根基''基础'的意味，稳定器更偏功能性"
    }
  },

  "定盘星": {
    pinyin: "dìng pán xīng",
    type: "比喻-方向类",
    literalMeaning: "杆秤上的第一颗基准星（秤杆上的零点标记），用于确定秤的定盘重量基准。没有定盘星，杆秤便失去了准确计量的根本依据。",
    metaphoricalMeaning: "比喻稳定全局、校准方向的核心标准、根本遵循或关键力量。侧重'定准方向''不可替代''根本基准'。",
    connotation: "褒义",
    commonTargets: "党的领导、以人民为中心的发展思想、理想信念、大国担当、制度根基",
    commonCollocations: ["把牢定盘星", "认准定盘星", "坚守定盘星", "压稳定盘星"],
    rmrbExamples: [
      "以人民为中心的发展思想是各项工作的'定盘星'。",
      "把牢'定盘星'、认定'主心骨'、绘好'同心圆'。",
      "中国共产党是中国人民团结奋斗的定盘星。"
    ],
    distinguishFrom: {
      "压舱石": "定盘星强调方向基准和校准作用；压舱石强调稳定底线和防风险",
      "指南针": "指南针指引方向（动态导航），定盘星确立坐标（静态基准）"
    }
  },

  "牛鼻子": {
    pinyin: "niú bí zi",
    type: "比喻-关键类",
    literalMeaning: "牛的鼻子。牵牛时只要牵住牛鼻子，整头牛就会顺从地跟随。源自农谚'牵牛要牵牛鼻子'。",
    metaphoricalMeaning: "比喻事物的关键、要害或主要矛盾——牵一发而动全身、起决定性作用的问题或环节。侧重'抓住关键''以点带面''扭转全局'。",
    connotation: "褒义（强调抓住要害的智慧）",
    commonTargets: "科技创新、就业民生、水资源管理、耕地与种子安全、乡村组织建设、教师能力提升、项目建设",
    commonCollocations: ["抓住牛鼻子", "牵住牛鼻子", "扭住牛鼻子", "牵牛要牵牛鼻子"],
    rmrbExamples: [
      "抓住创新，就抓住了牵动经济社会发展全局的'牛鼻子'。",
      "面向未来，抓住了科技创新就抓住了牵动我国发展全局的'牛鼻子'。",
      "托底民生，就要抓住就业这个'牛鼻子'。",
      "抓住耕地和种子这两个'牛鼻子'，确保中国粮主要用中国种、中国饭碗主要装中国粮。"
    ],
    distinguishFrom: {
      "压舱石": "牛鼻子是突破口（往前牵），压舱石是保障力（往下压），作用方向不同",
      "突破口": "二者含义接近，但牛鼻子更强调'牵一发而动全身'的系统性关键作用"
    }
  },

  // ── 引领/动力类 ──
  "火车头": {
    pinyin: "huǒ chē tóu",
    type: "比喻-引领类",
    literalMeaning: "列车的动力机车，牵引整列火车前进。",
    metaphoricalMeaning: "比喻起带头作用、引领发展、提供动力的关键力量或地区。侧重'带动''引领''先行'。",
    connotation: "褒义",
    commonTargets: "经济增长极、先行示范区、龙头企业、科技创新引擎",
    commonCollocations: ["发挥火车头作用", "当好火车头", "勇当火车头"],
    rmrbExamples: [
      "长三角地区要继续当好全国经济发展的'火车头'。",
      "深圳要发挥中国特色社会主义先行示范区的'火车头'作用。"
    ],
    distinguishFrom: {
      "压舱石": "火车头是拉动的力量（动力），压舱石是压底的力量（稳定）",
      "引擎": "二者含义接近，火车头偏整体引领，引擎偏能量输出"
    }
  },

  "助推器": {
    pinyin: "zhù tuī qì",
    type: "比喻-动力类",
    literalMeaning: "火箭或航天器中用于增加推力的附属推进装置。",
    metaphoricalMeaning: "比喻为事物发展提供推动力、加速发展的因素或手段。",
    connotation: "褒义",
    commonTargets: "科技创新、改革开放、数字经济、政策激励",
    commonCollocations: ["注入助推剂", "加装助推器", "发挥助推作用"],
    rmrbExamples: [
      "数字经济正成为高质量发展的'助推器'。",
      "改革开放是当代中国发展进步的'助推器'。"
    ],
    distinguishFrom: {
      "压舱石": "助推器是加速力，压舱石是稳定力，角色相反"
    }
  },

  "引擎": {
    pinyin: "yǐn qíng",
    type: "比喻-动力类",
    literalMeaning: "将燃料能量转化为机械动力的装置，汽车/飞机的核心动力源。",
    metaphoricalMeaning: "比喻驱动事物发展的核心动力来源。",
    connotation: "褒义",
    commonTargets: "创新驱动、消费升级、数字经济、新兴产业",
    commonCollocations: ["打造新引擎", "激活引擎", "强大引擎"],
    rmrbExamples: [
      "让创新成为引领发展的第一引擎。",
      "消费已成为拉动经济增长的强劲引擎。"
    ],
    distinguishFrom: {
      "火车头": "引擎强调内在动力输出，火车头强调带动的角色和地位"
    }
  },

  // ── 基础/支撑类 ──
  "硬骨头": {
    pinyin: "yìng gǔ tóu",
    type: "比喻-困难类",
    literalMeaning: "坚硬的骨头，难以咬碎。",
    metaphoricalMeaning: "比喻难以攻克、阻力大、需要下大力气才能解决的困难任务或顽固问题。",
    connotation: "中性偏贬（指困难，但带有攻坚的积极姿态）",
    commonTargets: "改革难题、脱贫攻坚、污染治理、深层矛盾",
    commonCollocations: ["啃硬骨头", "敢啃硬骨头", "啃下硬骨头"],
    rmrbExamples: [
      "改革已进入攻坚期和深水区，剩下的都是难啃的'硬骨头'。",
      "以刮骨疗毒的勇气啃下污染防治这块'硬骨头'。"
    ],
    distinguishFrom: {
      "拦路虎": "硬骨头强调难度大（需要持续攻坚）；拦路虎强调阻碍性（需要清除障碍）"
    }
  },

  "最后一公里": {
    pinyin: "zuì hòu yī gōng lǐ",
    type: "比喻-关键环节类",
    literalMeaning: "长距离输送中最后一段路程。",
    metaphoricalMeaning: "比喻工作完成前的最后一个关键环节，也常指政策落实、服务触达末端的瓶颈。",
    connotation: "中性（常带问题意识）",
    commonTargets: "政策落实、公共服务、物流配送、改革落地",
    commonCollocations: ["打通最后一公里", "畅通最后一公里", "卡在最后一公里"],
    rmrbExamples: [
      "要打通政策落实的'最后一公里'，让好政策真正惠及群众。",
      "社区是服务群众的'最后一公里'。"
    ]
  },

  "最后一公里": {
    pinyin: "zuì hòu yī gōng lǐ",
    isDuplicate: true,
    skip: true
  },

  "领头羊": {
    pinyin: "lǐng tóu yáng",
    type: "比喻-引领类",
    literalMeaning: "羊群中走在最前面、带领羊群前进的羊。",
    metaphoricalMeaning: "比喻在某一领域或群体中起带头作用的个人、组织或地区。",
    connotation: "褒义",
    commonTargets: "龙头企业、先行地区、行业标杆",
    commonCollocations: ["当好领头羊", "争当领头羊", "发挥领头羊作用"],
    rmrbExamples: [
      "广东要继续当好改革开放的'领头羊'。",
      "华为是5G技术领域的'领头羊'。"
    ],
    distinguishFrom: {
      "火车头": "领头羊偏'走在前列做示范'，火车头偏'提供动力拉动整体'"
    }
  },

  // ── 基础/屏障类 ──
  "红线": {
    pinyin: "hóng xiàn",
    type: "比喻-底线类",
    literalMeaning: "红色的线条标记。",
    metaphoricalMeaning: "比喻不可逾越的底线、界限或禁止触及的禁区。",
    connotation: "中性（表示严格约束）",
    commonTargets: "耕地保护、生态保护、安全生产、党纪国法",
    commonCollocations: ["守住红线", "划定红线", "不越红线", "生态红线"],
    rmrbExamples: [
      "要像保护大熊猫一样保护耕地，守住18亿亩耕地红线。",
      "安全生产是不可逾越的红线。"
    ],
    distinguishFrom: {
      "底线": "红线更形象化、更具视觉强制力；底线是抽象原则"
    }
  },

  "安全网": {
    pinyin: "ān quán wǎng",
    type: "比喻-保障类",
    literalMeaning: "高空作业或杂技表演时铺设的防护网。",
    metaphoricalMeaning: "比喻为弱势群体或风险场景提供兜底保障的制度体系。",
    connotation: "褒义",
    commonTargets: "社会保障、医疗保障、失业保险、养老体系",
    commonCollocations: ["织密安全网", "筑牢安全网", "兜底安全网"],
    rmrbExamples: [
      "织密社会保障安全网，让人民群众无后顾之忧。",
      "基本医保、大病保险、医疗救助三重保障制度筑牢健康安全网。"
    ]
  },

  "高压线": {
    pinyin: "gāo yā xiàn",
    type: "比喻-禁区类",
    literalMeaning: "输送高压电的线路，触碰即致命。",
    metaphoricalMeaning: "比喻绝对不能触碰的纪律红线或法律禁区，触碰必受严惩。",
    connotation: "中性（表示严格禁止）",
    commonTargets: "党纪国法、廉政纪律、安全生产禁令",
    commonCollocations: ["触碰高压线", "架起高压线", "通上高压电"],
    rmrbExamples: [
      "让纪律真正成为'带电的高压线'。",
      "八项规定是不可触碰的高压线。"
    ],
    distinguishFrom: {
      "红线": "高压线强调'触碰即惩处'的即时惩戒性，红线强调'不可逾越'的边界性"
    }
  },

  "晴雨表": {
    pinyin: "qíng yǔ biǎo",
    type: "比喻-反映类",
    literalMeaning: "用来预测天气变化的气压计。",
    metaphoricalMeaning: "比喻能够灵敏反映事物变化趋势的指标或参照物。",
    connotation: "中性",
    commonTargets: "经济指标、民生数据、社会心态、市场表现",
    commonCollocations: ["经济发展晴雨表", "社会心态晴雨表", "成为晴雨表"],
    rmrbExamples: [
      "就业是经济发展的'晴雨表'、社会稳定的'压舱石'。",
      "股市常被视为宏观经济的'晴雨表'。"
    ],
    distinguishFrom: {
      "风向标": "晴雨表侧重'反映现状'（显示结果），风向标侧重'预示趋势'（指示方向）"
    }
  },

  "风向标": {
    pinyin: "fēng xiàng biāo",
    type: "比喻-趋势类",
    literalMeaning: "指示风向的装置。",
    metaphoricalMeaning: "比喻预示事物发展方向、引领趋势变化的人或事物。侧重'预示趋势''指示方向'。",
    connotation: "中性偏褒",
    commonTargets: "政策信号、行业趋势、技术方向、市场走向",
    commonCollocations: ["树立风向标", "把握风向标", "成为风向标"],
    rmrbExamples: [
      "中央经济工作会议是观察明年经济政策的'风向标'。",
      "进博会已成为全球贸易的'风向标'。"
    ],
    distinguishFrom: {
      "晴雨表": "风向标侧重'预示未来方向'，晴雨表侧重'反映当前状态'"
    }
  },

  "试金石": {
    pinyin: "shì jīn shí",
    type: "比喻-检验类",
    literalMeaning: "用来检验黄金成色的黑色硅质岩石，黄金在上面摩擦会留下不同颜色的痕迹以判断纯度。",
    metaphoricalMeaning: "比喻能够检验事物真伪、价值、品质的可靠标准或考验。",
    connotation: "中性偏褒",
    commonTargets: "人民满意度、实践检验、市场验证、时间考验",
    commonCollocations: ["最好的试金石", "以X为试金石", "经历试金石考验"],
    rmrbExamples: [
      "人民拥护不拥护、赞成不赞成、高兴不高兴，是检验我们一切工作的'试金石'。",
      "市场是检验产品的最终'试金石'。"
    ]
  },

  "排头兵": {
    pinyin: "pái tóu bīng",
    type: "比喻-先行类",
    literalMeaning: "队列中站在最前排的士兵。",
    metaphoricalMeaning: "比喻在某一领域走在最前面、起带头示范作用的个人或集体。",
    connotation: "褒义",
    commonTargets: "改革先行者、行业领军者、创新先锋",
    commonCollocations: ["争当排头兵", "勇做排头兵", "行业排头兵"],
    rmrbExamples: [
      "深圳要继续争当全面深化改革的'排头兵'。",
      "青年要勇做创新创业的排头兵。"
    ]
  },

  "桥头堡": {
    pinyin: "qiáo tóu bǎo",
    type: "比喻-前沿类",
    literalMeaning: "桥头设立的堡垒，军事上用于控制桥梁、渡口的前沿阵地。",
    metaphoricalMeaning: "比喻设在最前沿、作为进一步推进基地的重要据点或平台。",
    connotation: "褒义",
    commonTargets: "对外开放、国际合作、区域发展战略",
    commonCollocations: ["打造桥头堡", "建设桥头堡", "开放桥头堡"],
    rmrbExamples: [
      "云南要建设成为面向南亚东南亚的辐射中心和对外开放'桥头堡'。",
      "新疆是丝绸之路经济带核心区的'桥头堡'。"
    ]
  },

  "加减法": {
    pinyin: "jiā jiǎn fǎ",
    type: "比喻-方法类",
    literalMeaning: "算术中的加法和减法。",
    metaphoricalMeaning: "比喻调整结构、优化配置的策略：'做加法'即增投入、扩规模；'做减法'即减负担、去冗余。",
    connotation: "中性",
    commonTargets: "改革策略、政策调整、产业结构优化",
    commonCollocations: ["做好加减法", "善用加减法", "加减法并举"],
    rmrbExamples: [
      "供给侧结构性改革要做好'加减法'——做减法去产能，做加法补短板。",
      "优化营商环境要做好简政放权的'减法'和优化服务的'加法'。"
    ]
  },

  "组合拳": {
    pinyin: "zǔ hé quán",
    type: "比喻-策略类",
    literalMeaning: "拳击中连续出拳、多种拳法配合的进攻技巧。",
    metaphoricalMeaning: "比喻多措并举、协同发力的系统性政策措施组合。",
    connotation: "褒义",
    commonTargets: "政策工具、宏观调控、改革措施",
    commonCollocations: ["打出组合拳", "政策组合拳", "一套组合拳"],
    rmrbExamples: [
      "面对经济下行压力，国家打出了一套稳增长的'组合拳'。",
      "这套政策'组合拳'精准有力，有效提振了市场信心。"
    ]
  },

  "先手棋": {
    pinyin: "xiān shǒu qí",
    type: "比喻-策略类",
    literalMeaning: "棋局中抢先落子、占据主动的下法。",
    metaphoricalMeaning: "比喻在竞争中抢占先机、掌握主动权的战略举措。",
    connotation: "褒义",
    commonTargets: "战略布局、科技竞争、产业规划",
    commonCollocations: ["下好先手棋", "布好先手棋", "打好先手棋"],
    rmrbExamples: [
      "要在人工智能领域下好'先手棋'，抢占科技竞争制高点。",
      "下好防范化解重大风险的'先手棋'。"
    ]
  },

  "主心骨": {
    pinyin: "zhǔ xīn gǔ",
    type: "比喻-核心类",
    literalMeaning: "人体的脊椎骨，支撑身体的中轴。",
    metaphoricalMeaning: "比喻在集体中起核心凝聚作用、让大家有依靠和信心的人或力量。",
    connotation: "褒义",
    commonTargets: "党的领导、核心人物、精神支柱",
    commonCollocations: ["有了主心骨", "认定主心骨", "人民群众的主心骨"],
    rmrbExamples: [
      "把牢'定盘星'、认定'主心骨'、绘好'同心圆'。",
      "灾难面前，党员干部就是群众的主心骨。"
    ]
  },

  "同心圆": {
    pinyin: "tóng xīn yuán",
    type: "比喻-团结类",
    literalMeaning: "几何中圆心相同、半径不同的圆。",
    metaphoricalMeaning: "比喻在共同目标下、围绕核心力量形成的团结凝聚格局。",
    connotation: "褒义",
    commonTargets: "民族团结、统一战线、组织凝聚",
    commonCollocations: ["绘好同心圆", "画出最大同心圆", "凝聚同心圆"],
    rmrbExamples: [
      "画出中华民族团结奋斗的最大'同心圆'。",
      "把牢'定盘星'、认定'主心骨'、绘好'同心圆'。"
    ]
  }
};

// 导出（用于模块化引用，非模块环境通过全局变量使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = METAPHOR_DICT;
}
