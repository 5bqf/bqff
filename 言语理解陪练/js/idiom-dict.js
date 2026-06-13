// ============================================================
// 成语/生僻词汇深度解析库
// 涵盖公考逻辑填空高频词汇
// 数据来源：历年真题 + chinese-xinhua + 人民日报语料
// ============================================================

const IDIOM_DICT = {

  // ═══════════════════════════════════════════════
  // 一、高频成语（四字成语为主）
  // ═══════════════════════════════════════════════

  "一蹴而就": {
    pinyin: "yī cù ér jiù",
    type: "成语",
    frequency: "极高",
    originalMeaning: "踏一步就成功。蹴：踏、迈步；就：成功、达成。",
    extendedMeaning: "比喻事情轻而易举，一下子就成功。多用于否定语境中，强调事情需要长期积累和持续努力，不能急于求成。",
    connotation: "中性偏否定（常与'不能''不可能''绝非'等否定词连用，批评急于求成的心态）",
    commonTargets: "事业、学问、改革、建设、科技攻关等需要长期积累的事物或过程",
    keyCollocation: "多用于否定句：不可一蹴而就、绝非一蹴而就、不能一蹴而就",
    commonMistakes: "常被误用为'一步登天'。区别：一蹴而就强调'过程轻松'，一步登天强调'跨度大/地位跃升快'",
    synonyms: ["一步登天", "立竿见影", "唾手可得", "一劳永逸"],
    antonyms: ["循序渐进", "水滴石穿", "久久为功", "积微成著"],
    rmrbExamples: [
      "乡村振兴不可能一蹴而就，需要久久为功、持续发力。",
      "实现科技自立自强绝非一蹴而就之事，需要几代人接续奋斗。",
      "解决深层次体制机制问题，不能指望一蹴而就。"
    ]
  },

  "立竿见影": {
    pinyin: "lì gān jiàn yǐng",
    type: "成语",
    frequency: "极高",
    originalMeaning: "在阳光下竖起竹竿，立刻就能看到影子。",
    extendedMeaning: "比喻收效迅速、见效快，措施一施行就马上见到效果。",
    connotation: "中性偏褒（但有语境限制——不适用于需要长期积累才能见效的场景）",
    commonTargets: "政策措施的效果、改革举措的成效、治疗方法的效果",
    keyCollocation: "多与'效果''成效'搭配：效果立竿见影、取得立竿见影的效果",
    commonMistakes: "不可用于需要长期积累的事情——如教育、科研等",
    synonyms: ["一蹴而就", "药到病除", "立见成效"],
    antonyms: ["水滴石穿", "潜移默化", "润物无声"],
    rmrbExamples: [
      "减税降费政策的效果立竿见影，企业负担明显减轻。",
      "营商环境改善对市场活力的提振并非立竿见影，但长远效果必将显现。"
    ]
  },

  "潜移默化": {
    pinyin: "qián yí mò huà",
    type: "成语",
    frequency: "极高",
    originalMeaning: "暗中迁移，无声变化。潜：暗中；移：改变；默：无声；化：变化。",
    extendedMeaning: "指人的思想、性格或习惯在不知不觉中受到感染、影响而发生变化。强调影响是渐进的、不易察觉的。",
    connotation: "中性（可褒可贬，取决于影响内容的性质）",
    commonTargets: "文化熏陶、教育影响、环境对人的塑造、价值观的渗透",
    keyCollocation: "多与'影响''熏陶'搭配：潜移默化的影响、在潜移默化中改变",
    commonMistakes: "只适用于'思想/性格/习惯'等内在变化，不适用于外在的物理变化",
    synonyms: ["耳濡目染", "润物无声", "春风化雨"],
    antonyms: ["立竿见影", "一蹴而就", "幡然醒悟"],
    rmrbExamples: [
      "优秀文化在潜移默化中滋养着人们的心灵。",
      "家风家教对人的影响是潜移默化、深远持久的。"
    ]
  },

  "耳濡目染": {
    pinyin: "ěr rú mù rǎn",
    type: "成语",
    frequency: "高",
    originalMeaning: "耳朵经常听到，眼睛经常看到，不知不觉受到影响。濡：沾湿；染：沾染。",
    extendedMeaning: "形容长期在某种环境中生活，不知不觉受到熏陶和影响。与'潜移默化'近义但更强调感官的直接接触。",
    connotation: "中性（可褒可贬）",
    commonTargets: "家庭环境、职业熏陶、文化环境的长期影响",
    keyCollocation: "耳濡目染之下、从小就耳濡目染",
    commonMistakes: "与'潜移默化'的区别：耳濡目染强调学习方式（听+看），潜移默化强调影响过程（不知不觉）",
    synonyms: ["潜移默化", "近朱者赤", "春风化雨"],
    antonyms: ["无动于衷", "置若罔闻"],
    rmrbExamples: [
      "从小在艺术世家长大，耳濡目染之下，他对绘画产生了浓厚的兴趣。",
      "孩子们耳濡目染着父母的言行举止，家风传承就在这日常之中。"
    ]
  },

  "积重难返": {
    pinyin: "jī zhòng nán fǎn",
    type: "成语",
    frequency: "高",
    originalMeaning: "长期积累的问题太重，难以扭转回到正轨。积：积累；重：深重；返：返回、扭转。",
    extendedMeaning: "指长期形成的不良习惯、风气或问题根深蒂固，已经到了很难改变的地步。",
    connotation: "贬义（描述问题严重性）",
    commonTargets: "社会弊病、体制问题、不良风气、腐败问题等长期积累的负面事物",
    keyCollocation: "多与'问题''弊病'搭配：积重难返的问题、已经积重难返",
    commonMistakes: "不可用于'优点'或'正面积累'；强调的是一种'令人担忧的局面'",
    synonyms: ["积习难改", "根深蒂固", "冰冻三尺"],
    antonyms: ["拨乱反正", "正本清源", "焕然一新"],
    rmrbExamples: [
      "一些地方的形式主义问题积重难返，需要下大力气整治。",
      "不能让小问题拖成积重难返的大问题。"
    ]
  },

  "未雨绸缪": {
    pinyin: "wèi yǔ chóu móu",
    type: "成语",
    frequency: "极高",
    originalMeaning: "天还没有下雨，就先修好门窗。绸缪：用绳索缠捆，引申为修缮、准备。出自《诗经·豳风·鸱鸮》。",
    extendedMeaning: "比喻事先做好准备工作，防患于未然。强调预见性和提前准备的智慧。",
    connotation: "褒义",
    commonTargets: "风险防范、应急预案、战略储备、人才培养等需要前瞻性布局的领域",
    keyCollocation: "未雨绸缪地、做到未雨绸缪、未雨绸缪的举措",
    commonMistakes: "与'防患未然'的区别：未雨绸缪偏'提前准备'，防患未然偏'防止发生'",
    synonyms: ["防患未然", "有备无患", "曲突徙薪"],
    antonyms: ["临渴掘井", "亡羊补牢", "临阵磨枪"],
    rmrbExamples: [
      "应对人口老龄化需要未雨绸缪，提前布局养老服务体系。",
      "防汛抗旱工作要未雨绸缪，宁可十防九空，不可失防万一。"
    ]
  },

  "防患未然": {
    pinyin: "fáng huàn wèi rán",
    type: "成语",
    frequency: "高",
    originalMeaning: "在祸患发生之前就加以预防。",
    extendedMeaning: "指在问题或危险尚未出现时就采取措施加以防范。侧重'阻止发生'而非'做好准备'。",
    connotation: "褒义",
    commonTargets: "安全生产、公共卫生、风险防控",
    keyCollocation: "防患于未然、做到防患未然",
    synonyms: ["未雨绸缪", "曲突徙薪", "防微杜渐"],
    antonyms: ["亡羊补牢", "江心补漏"],
    rmrbExamples: [
      "安全生产重在防患于未然，不能等出了事故再追责。",
      "防患未然胜过亡羊补牢，这是被无数教训证明的真理。"
    ]
  },

  "一劳永逸": {
    pinyin: "yī láo yǒng yì",
    type: "成语",
    frequency: "高",
    originalMeaning: "辛苦一次，把事情办好，以后就不再费事了。",
    extendedMeaning: "指通过一次努力就永久地解决问题。多用于否定句，强调不存在一劳永逸的解决方案。",
    connotation: "中性偏否定（现实中常被否定，带有'不切实际'的意味）",
    commonTargets: "改革、制度建设、问题解决等需要持续努力的领域",
    keyCollocation: "多用于否定句：没有一劳永逸、不是一劳永逸的、不可能一劳永逸",
    synonyms: ["毕其功于一役", "一蹴而就"],
    antonyms: ["久久为功", "持之以恒", "锲而不舍"],
    rmrbExamples: [
      "全面从严治党永远在路上，没有一劳永逸。",
      "解决民生问题不可能一劳永逸，需要持续用力、久久为功。"
    ]
  },

  "根深蒂固": {
    pinyin: "gēn shēn dì gù",
    type: "成语",
    frequency: "高",
    originalMeaning: "根基深厚牢固，不可动摇。蒂：花或瓜果连接枝茎的部分。",
    extendedMeaning: "比喻基础深厚、牢固，不易动摇或改变。可以形容好的事物（传统、观念），也可以形容坏的事物（偏见、陋习）。",
    connotation: "中性（可褒可贬，取决于修饰对象）",
    commonTargets: "观念、传统、偏见、习俗、体制问题、文化根基",
    keyCollocation: "根深蒂固的观念/偏见/传统",
    synonyms: ["积重难返", "牢不可破", "深入人心"],
    antonyms: ["无源之水", "无本之木", "摇摇欲坠"],
    rmrbExamples: [
      "在有些地方，重男轻女的观念仍然根深蒂固。",
      "中华优秀传统文化在民间根深蒂固，具有强大的生命力。"
    ]
  },

  "与日俱增": {
    pinyin: "yǔ rì jù zēng",
    type: "成语",
    frequency: "高",
    originalMeaning: "随着时间一天天增长。形容不断增长，增长得很快。",
    extendedMeaning: "指事物（数量、程度、情感等）随着时间的推移而不断增加。强调持续性和趋势性。",
    connotation: "中性（可褒可贬）",
    commonTargets: "压力、需求、矛盾、感情、实力、影响力",
    synonyms: ["日积月累", "日益增长", "蒸蒸日上"],
    antonyms: ["日渐式微", "江河日下", "每况愈下"],
    rmrbExamples: [
      "人民群众对美好生活的向往与日俱增。",
      "随着老龄化程度加深，养老服务的需求与日俱增。"
    ]
  },

  "如火如荼": {
    pinyin: "rú huǒ rú tú",
    type: "成语",
    frequency: "高",
    originalMeaning: "像火那样红，像荼（一种白花）那样白。原形容军容壮盛。出自《诗经》。",
    extendedMeaning: "后用来形容气势旺盛、气氛热烈，多指群众性活动或大规模建设。",
    connotation: "褒义",
    commonTargets: "建设热潮、运动、活动、改革、发展态势",
    keyCollocation: "开展得如火如荼、如火如荼地进行、如火如荼的建设",
    synonyms: ["热火朝天", "轰轰烈烈", "风起云涌"],
    antonyms: ["偃旗息鼓", "冷冷清清", "无人问津"],
    rmrbExamples: [
      "全国各地的乡村振兴建设正如火如荼地开展。",
      "数字经济的浪潮如火如荼，深刻改变着人们的生产生活方式。"
    ]
  },

  "相得益彰": {
    pinyin: "xiāng dé yì zhāng",
    type: "成语",
    frequency: "高",
    originalMeaning: "两者互相配合，使各自的优点更加显著。益：更加；彰：明显、显著。",
    extendedMeaning: "指两个人或两件事互相配合、互相辅助，使双方的作用和长处都充分显示出来。强调1+1>2的协同效应。",
    connotation: "褒义",
    commonTargets: "合作搭配、古今结合、中西融合、产业协同",
    keyCollocation: "相得益彰的效果、与X相得益彰",
    synonyms: ["相辅相成", "珠联璧合", "相映成趣"],
    antonyms: ["两败俱伤", "格格不入", "相互掣肘"],
    rmrbExamples: [
      "传统文化与现代科技相得益彰，共同推动着文化产业的繁荣。",
      "'有效市场'和'有为政府'相得益彰，是中国经济成功的重要经验。"
    ]
  },

  "相辅相成": {
    pinyin: "xiāng fǔ xiāng chéng",
    type: "成语",
    frequency: "极高",
    originalMeaning: "互相辅助，互相促成。辅：辅助。",
    extendedMeaning: "指两件事物互相依赖、互相补充、互相促进，缺一不可。侧重互补关系。",
    connotation: "褒义",
    commonTargets: "政策组合、理论与实践的互动、多方力量的配合",
    synonyms: ["相得益彰", "互为表里", "并行不悖"],
    antonyms: ["相互掣肘", "背道而驰", "此消彼长"],
    rmrbExamples: [
      "发展与安全相辅相成，安全是发展的前提，发展是安全的保障。",
      "法治与德治相辅相成、相得益彰。"
    ]
  },

  "源远流长": {
    pinyin: "yuán yuǎn liú cháng",
    type: "成语",
    frequency: "高",
    originalMeaning: "河流的源头很远，水流自然很长。",
    extendedMeaning: "比喻历史悠久、根基深厚。常用于形容文化、传统、友谊。",
    connotation: "褒义",
    commonTargets: "中华文化、传统、友谊、学术传统",
    synonyms: ["历史悠久", "积淀深厚", "绵延不断"],
    antonyms: ["无源之水", "昙花一现", "空中楼阁"],
    rmrbExamples: [
      "中华文明源远流长，是世界上唯一没有中断的古文明。",
      "中俄两国人民的友谊源远流长。"
    ]
  },

  "经久不衰": {
    pinyin: "jīng jiǔ bù shuāi",
    type: "成语",
    frequency: "中高",
    originalMeaning: "经历很长时间而不衰落。",
    extendedMeaning: "形容事物具有强大的生命力，能够长期保持旺盛的状态。多用于形容文化产品、艺术、精神。",
    connotation: "褒义",
    commonTargets: "经典作品、传统文化、品牌、精神力量",
    synonyms: ["历久弥新", "生生不息", "绵延不绝"],
    antonyms: ["昙花一现", "转瞬即逝", "盛极而衰"],
    rmrbExamples: [
      "雷锋精神经久不衰，激励了一代又一代中国人。",
      "这部经典话剧经久不衰，七十年来长演不衰。"
    ]
  },

  "不可或缺": {
    pinyin: "bù kě huò quē",
    type: "成语",
    frequency: "极高",
    originalMeaning: "不可以有一点缺失。或：稍微。",
    extendedMeaning: "表示非常重要、必不可少，缺少了就不行。比'重要'程度更深，强调必须性。",
    connotation: "中性偏褒",
    commonTargets: "关键要素、基础条件、核心力量、必要条件",
    synonyms: ["必不可少", "举足轻重", "至关重要"],
    antonyms: ["可有可无", "无足轻重", "无关紧要"],
    rmrbExamples: [
      "法治是市场经济不可或缺的制度保障。",
      "青年人才是国家创新发展不可或缺的重要力量。"
    ]
  },

  "显而易见": {
    pinyin: "xiǎn ér yì jiàn",
    type: "成语",
    frequency: "极高",
    originalMeaning: "很明显，很容易看出来。",
    extendedMeaning: "形容事情或道理非常明显，极容易看清楚。强调不需要深入分析就能得出判断。",
    connotation: "中性",
    commonTargets: "事实、道理、利弊、效果、差距",
    synonyms: ["不言而喻", "一目了然", "彰明较著"],
    antonyms: ["隐晦曲折", "难以察觉", "扑朔迷离"],
    rmrbExamples: [
      "生态环境改善带来的好处是显而易见的。",
      "中国经济的韧性和潜力显而易见。"
    ]
  },

  // ═══════════════════════════════════════════════
  // 二、生僻词 / 易错词 / 热点词
  // ═══════════════════════════════════════════════

  "叶公好龙": {
    pinyin: "yè gōng hào lóng",
    type: "成语-易错",
    frequency: "高",
    originalMeaning: "叶公子高非常喜欢龙，家里到处都画着龙。天上的真龙听说后便来拜访他，叶公却吓得魂飞魄散。出自汉代刘向《新序》。",
    extendedMeaning: "比喻口头上声称爱好某事物，实际上并不真正爱好，甚至畏惧它。讽刺表里不一、言行脱节的人。",
    connotation: "贬义",
    commonTargets: "虚假的爱好、口是心非、言行不一的现象",
    commonMistakes: "①常被误解为'爱好广泛' ②常被误用为'向名人学习' ③'叶'读yè不读shè（旧读已弃用）",
    synonyms: ["口是心非", "表里不一", "言不由衷"],
    antonyms: ["表里如一", "言行一致"],
    rmrbExamples: [
      "提倡创新不能'叶公好龙'——嘴上喊创新，真正面对颠覆性技术时却畏惧退缩。",
      "对待新事物要真心接纳，不能叶公好龙。"
    ]
  },

  "差强人意": {
    pinyin: "chā qiáng rén yì",
    type: "成语-易错",
    frequency: "中高",
    originalMeaning: "勉强还能让人满意。差：稍微、大致；强：振奋。原意是'还算能振奋人心'。",
    extendedMeaning: "指大体上还能让人满意，带有'勉强还可以'的意味。注意：不是'让人不满意'的意思！这是最常见的误用。",
    connotation: "中性偏褒（勉强满意，放低标准后觉得还行）",
    commonTargets: "评价表现、结果、成绩",
    commonMistakes: "⚠️ 最常见的误用：很多人理解为'很差劲，不能让人满意'——完全用反了！正确意思是'还算满意'",
    synonyms: ["聊胜于无", "还过得去", "勉强可以"],
    antonyms: ["尽如人意", "十全十美", "无可挑剔"],
    rmrbExamples: [
      "新赛季球队的表现差强人意，虽未夺冠但整体进步明显。"
    ]
  },

  "无可厚非": {
    pinyin: "wú kě hòu fēi",
    type: "成语-易错",
    frequency: "中高",
    originalMeaning: "没有什么可以过分批评指责的。厚：过分；非：责备。",
    extendedMeaning: "指说话做事虽有缺点，但可以理解和原谅，不必过分指责。与'无可非议'程度不同——'无可厚非'是有小毛病但可以原谅，'无可非议'是完全没问题。",
    connotation: "中性（表示可以理解，但不一定完全赞同）",
    commonTargets: "评价行为、言论、选择",
    commonMistakes: "常与'无可非议'混淆。区别：无可厚非 = 有点小问题但可以理解；无可非议 = 完全正确，没什么好说的",
    synonyms: ["情有可原", "可以理解"],
    antonyms: ["不可原谅", "罪不可赦"],
    rmrbExamples: [
      "年轻人追求更好的生活条件无可厚非，但要警惕过度消费。"
    ]
  },

  "休戚与共": {
    pinyin: "xiū qī yǔ gòng",
    type: "成语-易错",
    frequency: "中高",
    originalMeaning: "喜忧和祸福共同分担。休：喜悦；戚：悲伤。",
    extendedMeaning: "形容彼此的利害和命运紧密相连、同甘共苦。是比'息息相关'更深的联系——不仅是'相关'，更是'命运共同体'。",
    connotation: "褒义",
    commonTargets: "国际关系、民族关系、团队凝聚力、人类命运共同体",
    commonMistakes: "与'息息相关'的区别：休戚与共强调共同面对利害（命运共同体）；息息相关仅强调有关联（不一定同甘共苦）",
    synonyms: ["同舟共济", "患难与共", "命运与共"],
    antonyms: ["形同陌路", "漠不相关"],
    rmrbExamples: [
      "两岸同胞是血脉相连、休戚与共的命运共同体。",
      "在气候变化面前，世界各国休戚与共。"
    ]
  },

  "等量齐观": {
    pinyin: "děng liàng qí guān",
    type: "成语-易错",
    frequency: "中",
    originalMeaning: "对有差别的事物同等看待。等：同等；量：衡量；齐：一样；观：看待。",
    extendedMeaning: "指把不同性质、不同水平的事物放在同一标准下看待。用于否定句中强调'不应混为一谈'。",
    connotation: "中性偏贬（常用于否定句，表示不应该这样做）",
    commonTargets: "比较不同性质的事物",
    commonMistakes: "多用于否定句：不可等量齐观、不能等量齐观",
    synonyms: ["相提并论", "同日而语", "混为一谈"],
    antonyms: ["区别对待", "分清主次"],
    rmrbExamples: [
      "不能将正常的学术讨论与恶意造谣等量齐观。",
      "不同国家的国情不同，发展模式不可等量齐观。"
    ]
  },

  "方兴未艾": {
    pinyin: "fāng xīng wèi ài",
    type: "成语-热点",
    frequency: "中高",
    originalMeaning: "事物正在兴起发展，还没有停止。方：正在；兴：兴起；艾：停止。",
    extendedMeaning: "形容新生事物蓬勃发展、势头正旺，前景广阔。是描述'好势头'的高频词。",
    connotation: "褒义",
    commonTargets: "新兴产业、科技浪潮、社会运动、改革进程",
    synonyms: ["蓬勃兴起", "蒸蒸日上", "欣欣向荣"],
    antonyms: ["日薄西山", "穷途末路", "盛极而衰"],
    rmrbExamples: [
      "数字经济方兴未艾，正深刻重塑全球经济格局。",
      "中国新能源汽车产业方兴未艾，已经成为全球领跑者。"
    ]
  },

  "筚路蓝缕": {
    pinyin: "bì lù lán lǚ",
    type: "成语-生僻",
    frequency: "中",
    originalMeaning: "驾着柴车、穿着破旧衣服去开辟山林。筚路：柴车；蓝缕：破衣服。出自《左传》。",
    extendedMeaning: "比喻创业的艰辛和开拓者的不易。常用于总结发展历程时表达对先驱者的敬意。",
    connotation: "褒义（饱含对艰辛创业者的敬意）",
    commonTargets: "创业历程、国家建设、行业发展、科技创新",
    synonyms: ["栉风沐雨", "披荆斩棘", "艰苦创业"],
    antonyms: ["坐享其成"],
    rmrbExamples: [
      "从筚路蓝缕到世界领先，中国高铁的发展历程令人振奋。",
      "一代代航天人筚路蓝缕，铸就了中国航天的辉煌。"
    ]
  },

  "跌宕起伏": {
    pinyin: "diē dàng qǐ fú",
    type: "成语-热点",
    frequency: "中高",
    originalMeaning: "音调抑扬顿挫或文章富于变化。",
    extendedMeaning: "比喻事物发展过程中经历很多波折和变化，不顺利但很精彩。可用于情节、人生、市场、赛事等。",
    connotation: "中性（强调变化剧烈、充满波折）",
    commonTargets: "故事情节、人生经历、市场行情、比赛进程",
    synonyms: ["一波三折", "波澜壮阔", "曲折离奇"],
    antonyms: ["一帆风顺", "平淡无奇", "顺风顺水"],
    rmrbExamples: [
      "2022年全球经济形势跌宕起伏，不确定性显著增加。",
      "这部电视剧情节跌宕起伏，扣人心弦。"
    ]
  },

  "中流砥柱": {
    pinyin: "zhōng liú dǐ zhù",
    type: "成语-热点",
    frequency: "中",
    originalMeaning: "黄河激流中的砥柱山，任凭水流冲击巍然不动。",
    extendedMeaning: "比喻在艰难环境中起支柱作用、坚强不屈的人或力量。比'重要'多了'在危难中撑住局面'的含义。",
    connotation: "褒义",
    commonTargets: "关键力量、核心团队、中坚力量",
    synonyms: ["擎天之柱", "定海神针", "栋梁之材"],
    antonyms: ["无足轻重"],
    rmrbExamples: [
      "国有企业是国民经济的中流砥柱。",
      "基层党组织是乡村振兴的中流砥柱。"
    ]
  },

  // ═══════════════════════════════════════════════
  // 三、高频双字词汇（非成语，但在逻辑填空中常见）
  // ═══════════════════════════════════════════════

  "积淀": {
    pinyin: "jī diàn",
    type: "双字词",
    frequency: "高",
    originalMeaning: "长期积累沉淀。",
    extendedMeaning: "多指文化、知识、经验等的长期积累形成的深厚底蕴。与'积累'的区别：'积淀'更强调'沉淀下来的精华'，带有文化厚度感。",
    connotation: "褒义",
    commonTargets: "文化、历史、知识、经验、传统",
    keyCollocation: "文化积淀、历史积淀、深厚的积淀",
    synonyms: ["积累", "沉淀", "底蕴"],
    rmrbExamples: [
      "故宫承载着深厚的历史文化积淀。",
      "这些作品是作者数十年生活积淀的结晶。"
    ]
  },

  "彰显": {
    pinyin: "zhāng xiǎn",
    type: "双字词",
    frequency: "高",
    originalMeaning: "鲜明地显示。彰：明显、显著。",
    extendedMeaning: "非常鲜明、突出地表现出来。常用于积极的、值得宣扬的事物。比'显示''体现'程度更深、更有主动性。",
    connotation: "褒义",
    commonTargets: "制度优势、文化自信、大国担当、精神风貌",
    keyCollocation: "充分彰显、彰显了、彰显出",
    synonyms: ["体现", "展示", "显露"],
    antonyms: ["隐藏", "掩盖"],
    rmrbExamples: [
      "这一壮举充分彰显了中国力量和中国精神。",
      "进博会彰显了中国扩大开放的坚定决心。"
    ]
  },

  "凝聚": {
    pinyin: "níng jù",
    type: "双字词",
    frequency: "极高",
    originalMeaning: "气体凝结聚集变为液体，比喻力量、精神等聚集在一起。",
    extendedMeaning: "把分散的人心、力量、智慧集中到一起，形成合力。强调从分散到集中的过程。",
    connotation: "褒义",
    commonTargets: "共识、力量、人心、智慧、精神",
    keyCollocation: "凝聚共识、凝聚力量、凝聚人心",
    synonyms: ["汇集", "集聚", "凝结"],
    antonyms: ["涣散", "分散"],
    rmrbExamples: [
      "用习近平新时代中国特色社会主义思想凝聚共识。",
      "伟大抗疫精神凝聚起全国人民的磅礴力量。"
    ]
  },

  "夯实": {
    pinyin: "hāng shí",
    type: "双字词",
    frequency: "高",
    originalMeaning: "用夯把地基打实。夯：砸实地基的工具。",
    extendedMeaning: "比喻把基础打牢、使根基更加稳固。多用于抽象事物。",
    connotation: "褒义",
    commonTargets: "基础、根基、制度、能力",
    keyCollocation: "夯实基础、夯实根基、进一步夯实",
    synonyms: ["筑牢", "打牢", "巩固"],
    antonyms: ["削弱", "动摇"],
    rmrbExamples: [
      "要夯实科技自立自强的基础。",
      "这些措施有效夯实了经济回升向好的根基。"
    ]
  },

  "掣肘": {
    pinyin: "chè zhǒu",
    type: "双字词-生僻",
    frequency: "中",
    originalMeaning: "拉住胳膊肘。掣：牵引、拉。",
    extendedMeaning: "比喻从旁牵制、阻挠别人做事，使人不能顺利开展工作。多用于描述体制性、机制性的障碍。",
    connotation: "贬义",
    commonTargets: "权力运行、工作效率、改革推进中的阻碍",
    keyCollocation: "相互掣肘、受到掣肘、掣肘因素",
    synonyms: ["牵制", "阻挠", "羁绊"],
    antonyms: ["助推", "促进"],
    rmrbExamples: [
      "要理顺体制机制，避免部门之间相互掣肘。",
      "这些掣肘因素严重影响了改革措施的落地效率。"
    ]
  },

  "痼疾": {
    pinyin: "gù jí",
    type: "双字词-生僻",
    frequency: "中",
    originalMeaning: "经久难治愈的疾病。痼：顽固的。",
    extendedMeaning: "比喻长期存在、难以解决的社会问题或制度弊病。强调问题的'顽固性'和'长期性'。",
    connotation: "贬义",
    commonTargets: "社会问题、体制弊病、管理短板",
    keyCollocation: "痼疾难除、根治痼疾、沉疴痼疾",
    synonyms: ["顽疾", "积弊", "沉疴"],
    antonyms: ["新生事物"],
    rmrbExamples: [
      "要下决心根治形式主义这个痼疾。",
      "医疗领域的这些痼疾，需要深化改革来破解。"
    ]
  },

  "滥觞": {
    pinyin: "làn shāng",
    type: "双字词-生僻",
    frequency: "中",
    originalMeaning: "江河发源的地方，水浅得只能浮起酒杯。滥：浮起；觞：古代酒杯。",
    extendedMeaning: "比喻事物的起源、发端。用于指出某个事物最初的源头。",
    connotation: "中性",
    commonTargets: "文化起源、历史渊源、思想发端",
    keyCollocation: "滥觞于、XX的滥觞",
    commonMistakes: "很多人误以为'滥觞'是'泛滥'的意思——完全用反了。滥觞是'起源/发端'的意思。",
    rmrbExamples: [
      "现代足球运动滥觞于19世纪的英国。",
      "'以人为本'的思想滥觞于先秦时期的民本理念。"
    ]
  },

  "沉疴": {
    pinyin: "chén kē",
    type: "双字词-生僻",
    frequency: "中",
    originalMeaning: "沉重而久治不愈的疾病。",
    extendedMeaning: "比喻长期存在的严重弊病或难以解决的问题。程度比'痼疾'更重，暗示问题更严重、更沉。",
    connotation: "贬义",
    commonTargets: "严重的社会弊病、体制问题",
    keyCollocation: "沉疴痼疾、沉疴已久、根治沉疴",
    synonyms: ["痼疾", "顽疾", "积弊"],
    rmrbExamples: [
      "要以壮士断腕的决心根治沉疴痼疾。"
    ]
  },

  "圭臬": {
    pinyin: "guī niè",
    type: "双字词-生僻",
    frequency: "中",
    originalMeaning: "圭表和臬表，古代测日影的仪器，用来确定时间和节气。",
    extendedMeaning: "比喻准则、典范、法度。多指被大家公认的权威标准。",
    connotation: "褒义",
    commonTargets: "学术准则、行业标准、道德规范",
    keyCollocation: "奉为圭臬、视为圭臬",
    commonMistakes: "字形易错：'臬'下半部分为'木'，不是'水'",
    rmrbExamples: [
      "这些经典论述至今仍被奉为圭臬。"
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IDIOM_DICT;
}
