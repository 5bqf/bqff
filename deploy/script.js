/* ============================================================
   作品集 — 交互脚本
   ============================================================ */

/* ---- 1. 主题切换 ---- */
function setTheme(name) {
  var root = document.documentElement;
  root.className = root.className.replace(/theme-\S+/g, '');
  if (name !== 'spring-berry') root.classList.add('theme-' + name);

  // 更新圆点 active 状态
  document.querySelectorAll('.theme-dot').forEach(function (dot, i) {
    var themes = ['spring-berry', 'purple-yam', 'whale-fall', 'bamboo-dew'];
    dot.classList.toggle('active', themes[i] === name);
  });

  localStorage.setItem('pf-theme', name);
}

// 页面加载时恢复主题
(function () {
  var saved = localStorage.getItem('pf-theme');
  if (saved) setTheme(saved);
})();

/* ---- 2. 导航 scroll spy ---- */
(function () {
  var nav = document.getElementById('nav');
  var allLinks = document.querySelectorAll('.nav-link');
  var sections = [];

  allLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      var sec = document.getElementById(href.substring(1));
      if (sec) sections.push({ id: href.substring(1), el: sec });
    }
  });

  window.addEventListener('scroll', function () {
    // 毛玻璃
    if (window.scrollY > 60) {
      nav.style.background = 'var(--card)';
      nav.style.backdropFilter = 'blur(16px)';
      nav.style.borderBottom = '1px solid var(--border)';
      nav.style.boxShadow = 'var(--shadow-sm)';
    } else {
      nav.style.background = '';
      nav.style.backdropFilter = '';
      nav.style.borderBottom = '';
      nav.style.boxShadow = '';
    }

    // 高亮
    var current = '';
    var pos = window.scrollY + 180;
    sections.forEach(function (sec) {
      if (sec.el.offsetTop <= pos) current = sec.id;
    });

    allLinks.forEach(function (link) {
      var targetId = link.getAttribute('href') ? link.getAttribute('href').substring(1) : '';
      link.classList.toggle('active', targetId === current);
    });
  });
})();

/* ---- 3. 移动端菜单 ---- */
(function () {
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () { menu.classList.toggle('hidden'); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.add('hidden'); });
  });
})();

/* ---- 4. ACE 流程图 C 节点 ---- */
(function () {
  var cIcon = document.getElementById('cIcon');
  var cTooltip = document.getElementById('cTooltip');
  var cNode = document.getElementById('cNode');
  if (!cIcon || !cTooltip || !cNode) return;
  cNode.addEventListener('mouseenter', function () { cIcon.style.transform = 'scale(1.1)'; cTooltip.style.opacity = '1'; });
  cNode.addEventListener('mouseleave', function () { cIcon.style.transform = 'scale(1)'; cTooltip.style.opacity = '0'; });
  function goTech() { document.getElementById('tech').scrollIntoView({ behavior: 'smooth' }); }
  cIcon.addEventListener('click', function (e) { e.stopPropagation(); goTech(); });
  cTooltip.addEventListener('click', function (e) { e.stopPropagation(); goTech(); });
})();

/* ---- 5. 视频播放 ---- */
var videoPlaying = false;
function startPlayback() {
  if (videoPlaying) return; videoPlaying = true;
  var video = document.getElementById('mainVideo');
  var cover = document.getElementById('videoCover');
  var toast = document.getElementById('playingToast');
  var badge = document.getElementById('videoBadge');
  var placeholder = document.getElementById('videoPlaceholder');
  var hasVideo = video.getAttribute('src') && video.getAttribute('src') !== '';

  if (toast) { toast.style.opacity = '1'; setTimeout(function () { toast.style.opacity = '0'; }, 1400); }
  if (badge) {
    badge.textContent = '▶ 正在播放...';
    badge.classList.add('animate-pulse');
    setTimeout(function () { badge.textContent = 'AI + Remotion 生成'; badge.classList.remove('animate-pulse'); }, 3000);
  }
  if (cover) { cover.style.opacity = '0'; cover.style.pointerEvents = 'none'; setTimeout(function () { cover.style.display = 'none'; }, 500); }
  if (hasVideo) { video.play(); if (placeholder) placeholder.style.display = 'none'; }
  else { if (placeholder) { placeholder.style.display = 'flex'; placeholder.style.alignItems = 'center'; placeholder.style.justifyContent = 'center'; } }
}

/* ---- 6. 缩略图联动 ---- */
var imageData = {
  plan:   { title: '功能分区平面图', desc: '「三环五境」渐变网格，300㎡口袋公园。', src: '三角平村平面图.jpg' },
  model:  { title: '3D模型视图', desc: 'SketchUp + Blender + 混元3D 混合建模。', src: '' },
  canvas: { title: '商业模式画布', desc: '党群联动：免费便民茶水+自愿扫码捐赠。', src: '' },
  render: { title: '剖面图', desc: '三角村·邻里汇场地剖面图，三环渐变带展示。', src: '三角村剖面图.jpg' },
  effect: { title: '效果图', desc: '三角村·邻里汇廊架核心场景效果图。', src: '三角村效果图_第1页.jpg' },
};

function showImage(key) {
  var data = imageData[key]; if (!data) return;
  var video = document.getElementById('mainVideo');
  var placeholder = document.getElementById('videoPlaceholder');
  video.pause(); video.style.opacity = '0';
  if (data.src) {
    var isPdf = data.src.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      placeholder.innerHTML = '<iframe src="' + data.src + '" class="absolute inset-0 w-full h-full rounded-3xl" style="background:var(--code-bg);border:0;" title="' + data.title + '"></iframe>';
    } else {
      placeholder.innerHTML = '<img src="' + data.src + '" alt="' + data.title + '" class="absolute inset-0 w-full h-full object-contain rounded-3xl" style="background:var(--code-bg);"/>';
    }
  } else {
    placeholder.innerHTML = '<div class="text-center px-6"><div class="text-4xl mb-4 opacity-40">📷</div><p class="font-bold text-sm mb-2" style="color:var(--text);">' + data.title + '</p><p class="text-xs max-w-md leading-relaxed" style="color:var(--text-muted);">' + data.desc + '</p></div>';
  }
  placeholder.style.display = 'flex'; placeholder.style.alignItems = 'center'; placeholder.style.justifyContent = 'center';
  clearTimeout(window._imgTimeout);
  window._imgTimeout = setTimeout(function () { placeholder.style.display = 'none'; video.style.opacity = '1'; video.play(); }, 30000);
  aiRespond('image:' + key);
}

/* ---- 7. AI 助手聊天 ---- */
var qaPairs = {
  '技术细节': '三角村项目采用 ComfyUI + ControlNet 工作流实现线稿→效果图自动化。Claude Code 生成 Remotion React 动画代码（spring 弹性动画 + interpolate 渐变控制），将传统 1 周的设计+前端开发周期压缩至约 48 小时。Midjourney 负责视觉概念验证，Prompt 词库固定包含"岭南水乡""蚝壳墙""旧船木""莲雾粉"等约束标签。',
  '商业模式': '「品牌经营权竞标」轻资产模型：村民家庭以"周"为单位轮值经营「邻里廊架」双面廊架，仅售 3–4 种饮品（凉茶、莲雾汁、陈皮水），统一定价 5 元/杯。营收：轮值家庭 80%，村委会 20% 维护基金。非营业时段推车折叠锁闭→景观装置+暖灯。村委会保留钥匙管理权和品质抽查权。',
  '团队分工': '本项目由我（白清凤）作为 AI 产品负责人全程主导：需求定义 → AI 工具链选型 → 原型开发 → 商业模式设计 → 方案包输出。Claude Code 辅助完成约 80% 代码编写，我负责 Prompt 输入、代码审查、参数调试和最终集成。设计顾问提供岭南文化建议，村委会参与运营可行性讨论。',
  '默认': '感谢提问！我是本项目的 AI 助手，可为你解读技术细节、商业模式或团队分工。也可直接输入问题，或点击左侧缩略图触发图文联动。',
};

var imageResponses = {
  'image:plan':   '这是三角村·邻里汇总平面图。场地300㎡口袋公园，采用「三环五境」渐变网格——环一迎候环（透水砖）→ 环二社交环（碎石草缝+蚝壳水磨石广场）→ 环三沉浸环（草坪+树皮木屑）。全程无硬质边界，党群服务中心西门直通公园。',
  'image:model':  '这是3D模型视图。核心装置「邻里廊架」——双面L形廊架（热镀锌方钢骨架+旧木格栅顶棚），候事侧+聊天侧背靠背长凳，廊架前方圆形蚝壳水磨石小广场（直径3m）+两把水蓝色渐变遮阳伞。全部本土回收材料（旧船木、蚝壳、青砖）。',
  'image:canvas': '商业模式画布——产品最重要的"软件层"。经营权竞标：村民轮值、统一定价、营收分成。村委会监督（钥匙管理、品质抽查），本质是"平台治理层"——平衡商户自治与平台管控。',
  'image:render': '三角村·邻里汇场地剖面图，展示从迎候环（透水砖）→社交环（碎石草缝）→沉浸环（草坪+树皮）的三环渐变铺装体系。无硬质边界，铺装自然渗入过渡。',
  'image:effect': '三角村·邻里汇廊架核心场景效果图——双面L形廊架正对党群服务中心西门，前方蚝壳水磨石圆形广场，水蓝渐变遮阳伞，保留大榕树投下斑驳光影。ComfyUI+ControlNet+SDXL工作流生成。',
};

function addMessage(text, isUser) {
  var container = document.getElementById('chatMessages'); if (!container) return;
  var div = document.createElement('div');
  div.className = 'flex ' + (isUser ? 'justify-end' : 'justify-start');

  var bubble = document.createElement('div');
  bubble.className = 'text-xs rounded-xl px-3 py-2 max-w-[85%] leading-relaxed ' + (isUser ? 'rounded-br-md' : 'rounded-bl-md');
  if (isUser) {
    bubble.style.background = 'var(--primary)';
    bubble.style.color = 'var(--text)';
  } else {
    bubble.style.background = 'var(--bg)';
    bubble.style.color = 'var(--text-secondary)';
    bubble.style.border = '1px solid var(--border)';
  }
  bubble.textContent = '';
  div.appendChild(bubble);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function typewriter(bubble, text, speed, onDone) {
  var i = 0; speed = speed || 25;
  function tick() {
    if (i < text.length) {
      bubble.textContent += text.charAt(i); i++;
      var mc = document.getElementById('chatMessages');
      if (mc) mc.scrollTop = mc.scrollHeight;
      setTimeout(tick, speed);
    } else { if (onDone) onDone(); }
  }
  tick();
}

function findAnswer(q) {
  q = q.trim();
  if (qaPairs[q]) return qaPairs[q];
  var keys = Object.keys(qaPairs);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] !== '默认' && (q.includes(keys[i]) || keys[i].includes(q))) return qaPairs[keys[i]];
  }
  return qaPairs['默认'];
}

function aiRespond(key, instant) {
  var text = imageResponses[key] || findAnswer(key);
  if (!text) return;
  var bubble = addMessage('', false);
  if (bubble) typewriter(bubble, text, instant ? 5 : 25);
}

function sendMessage() {
  var input = document.getElementById('chatInput');
  var text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  setTimeout(function () { aiRespond(text); }, 500);
}

function sendPreset(label) {
  addMessage(label, true);
  setTimeout(function () { aiRespond(label); }, 400);
}

// 欢迎消息
setTimeout(function () {
  var b = addMessage('', false);
  if (b) typewriter(b, '你好！我是本项目 AI 助手。可点击下方按钮了解技术细节、商业模式或团队分工，也可直接输入问题。', 25);
}, 800);
