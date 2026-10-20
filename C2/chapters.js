// C2 各章内容，改写自 notes/C2-data-models-hallucination.md（讲义为准；改讲义后同步这里）。出处和讲义脚注一一对应。

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "先猜一猜", `<p>${q}</p><details class="reveal"><summary>看答案</summary>${a}</details>`);

// 出处（同讲义脚注，访问于 2026-10-19）。
const SOURCES = [
  ["glue", "Kylie Robison, “Google promised a better search experience — now it’s telling us to put glue on our pizza”, The Verge, 2024-05-23", "https://www.theverge.com/2024/5/23/24162896/google-ai-overview-hallucinations-glue-in-pizza"],
  ["openai-hall", "OpenAI, “Why language models hallucinate”, 2025-09-05", "https://openai.com/index/why-language-models-hallucinate/"],
  ["moe-tongshi", "教育部基础教育教学指导委员会《中小学人工智能通识教育指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35042.html"],
  ["moe-genai", "教育部基础教育教学指导委员会《中小学生成式人工智能使用指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C2",
  badge: "共享核心模块",
  title: "数据、模型与幻觉",
  tagline: "AI 的答案从哪来，为什么会一本正经地编",
  lead: "AI 的本事是从数据里学来的。这一讲往里看一层：数据、训练、模型、回答四步怎么连起来，聊天 AI 为什么像在接龙，又为什么会把玩笑当真、把冷门事实编出来。",
  heroDemo: "heroChain",
  heroLabel: "接龙模型：数据里混进一条玩笑会怎样？（演示）",
  heroCaption: "极小的演示模型，只为说明道理，和真实的大模型差得很远。",
  whyTitle: "为什么要懂一点原理",
  whySub: "知道它为什么会错，才知道哪些回答最该查",
  why: [
    ["它学的是「说得像」", "聊天 AI 一个词一个词往下接，挑最像样的，不是去查一个答案。"],
    ["错有三个来头", "数据里本来就错、数据里很少或没有、数据过时。"],
    ["冷门、最新、要紧，必查", "原理落到一个习惯：这三类回答，用 C4 的五招查一查。"],
  ],
  ctaTitle: "准备好看看 AI 的「脑子」里是什么了吗？",
  minutes: "约 45 分钟",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-glue", nav: "披萨胶水", title: "把玩笑当真的 AI",
    subtitle: "谷歌 AI 概览的一次出错",
    abstract: "AI 为什么会把一句玩笑当成建议？",
    tags: ["真实案例"],
    hero: "toc",
    sections: [
      { id: "story", title: "披萨加胶水", html: `
        <p>2024 年 5 月，谷歌大范围推出搜索里的「AI 概览」。有人问奶酪老从披萨上掉下来怎么办，AI 概览建议往酱料里加些胶水，「无毒的胶水就行」。记者追查发现，这个主意很可能来自论坛 Reddit 上一条十多年前的玩笑评论。同一时期它还说过美国前总统麦迪逊从威斯康星大学毕业了 21 次。谷歌回应说，这些错误来自「非常少见的搜索」。${cite("glue")}</p>
        ${predict("AI 为什么会把一句玩笑当成建议？", "<p>它的答案来自数据和从数据里学到的规律；数据里有玩笑，它就可能把玩笑说出来。下面两章细讲。</p>")}` },
    ],
    takeaways: ["AI 也会把数据里的玩笑、错误说出来。"],
  },
  {
    slug: "2-where", nav: "从哪来", title: "AI 的答案从哪来",
    subtitle: "数据 → 训练 → 模型 → 回答；聊天 AI 是超级接龙",
    abstract: "模型学到的是规律，不是一本可以翻查的答案书。",
    tags: ["数据", "训练", "模型", "接龙"],
    sections: [
      { id: "four", title: "四个词", html: `
        <table><thead><tr><th>步骤</th><th>是什么</th><th>打个比方</th></tr></thead><tbody>
        <tr><td>数据</td><td>大量的文字、图片、声音</td><td>学生读过的书和习题</td></tr>
        <tr><td>训练</td><td>从数据里找规律，反复调整</td><td>做题、对答案、改错</td></tr>
        <tr><td>模型</td><td>训练出来的结果</td><td>学到的「套路」</td></tr>
        <tr><td>回答</td><td>按规律推算输出</td><td>看到新题，照套路作答</td></tr></tbody></table>
        <p>《中小学人工智能通识教育指南（2025年版）》要求初中阶段「掌握机器学习基本流程与监督学习概念，认知数据特征与算法选择的关系」，说的就是这条链。${cite("moe-tongshi")}</p>` },
      { id: "chain", title: "聊天 AI：一个超级接龙", html: `<p>大语言模型先经过「预训练」：在海量文字里反复练习<b>猜下一个词</b>。${cite("openai-hall")} 你提问，它一个词一个词往下接，每一步挑「最像样」的。每一步都有几个差不多像样的词可选，所以同一个问题问两次，答案可能不一样。</p>
        ${callout("pattern", "一句话", "<p>它学的是「说得像」，不是「说得对」。大多数时候像的就是对的，但不总是。</p>")}
        ${demo("nextWord", "接龙模型（演示）", "选开头，再试试加一条玩笑", "这个模型只会数「哪个词后面跟过哪个词」，真实的大模型复杂得多，但「数据里有什么，就可能说出什么」的道理一样。")}` },
    ],
    takeaways: ["数据 → 训练 → 模型 → 回答。", "聊天 AI 一个词一个词往下接。", "模型学到的是规律，不是答案书。"],
  },
  {
    slug: "3-why", nav: "为什么编", title: "它为什么会编",
    subtitle: "幻觉：听起来合理、其实是错的说法",
    abstract: "OpenAI 研究者的解释，和错的三个来头。",
    tags: ["幻觉", "冷门事实", "过时"],
    sections: [
      { id: "reasons", title: "研究者的解释", html: `
        <p>OpenAI 的研究者在 2025 年 9 月的文章里把幻觉定义为语言模型生成的、听起来合理但其实是错的说法，并解释了几个原因。${cite("openai-hall")}</p>
        <ul><li><b>数据里没标真假：</b>预训练的文字不带真假标签，模型学会的是「怎么说才像」。拼写这类有规律的东西越学越准，没有规律的冷门事实（比如一个普通人的生日）光靠规律猜不出来。</li>
        <li><b>例子：</b>研究者问一个常用的聊天机器人，作者之一 Adam Tauman Kalai 的博士论文题目是什么，它很自信地给出三个不同的答案，没有一个是对的。</li>
        <li><b>考试鼓励瞎猜：</b>很多测试只看答对的比例，空着一定零分、蒙一个可能得分，于是「不知道也要猜」的模型分数更好看。研究者主张自信地答错要比说「不知道」扣得更多。</li></ul>` },
      { id: "three", title: "三个来头", html: `
        <table><thead><tr><th>来头</th><th>例子</th></tr></thead><tbody>
        <tr><td>数据里本来就错（错误、玩笑、谣言）</td><td>披萨加胶水${cite("glue")}</td></tr>
        <tr><td>数据里很少或没有（冷门的人名、日期、出处）</td><td>三个不同的论文题目，全错${cite("openai-hall")}</td></tr>
        <tr><td>数据过时（训练之后世界变了）</td><td>珠峰高程（<a href="../C4/index.html#/4-demo">C4 演示一</a>，AI 回答为构造）</td></tr></tbody></table>
        ${callout("pitfall", "「先搜索、再回答」也不保险", `<p>谷歌 AI 概览是先在网上找资料再写回答的，照样把玩笑当了真。${cite("glue")} 所以 C4 第一招说：让它给出处，还要自己打开看。</p>`)}
        ${predict("哪个问题最容易让 AI 编？(a) 水的沸点；(b) 你们镇上那家老面馆是哪年开的；(c) 今天的油价。", "<p>(b) 最容易编：冷门事实；(c) 容易过时；(a) 数据里说法一致，最不容易错，但也要注意条件（一个标准大气压下）。</p>")}` },
    ],
    takeaways: ["幻觉：听起来合理、其实是错的。", "没规律的冷门事实最容易编。", "数据里错的、少的、过时的，都可能说出来。"],
  },
  {
    slug: "4-activities", nav: "活动", title: "活动",
    subtitle: "纸牌分类器 · 让 AI 说错",
    abstract: "两个活动：一个不用电脑，一个要用 AI。牌和题都是构造的演示。",
    tags: ["不插电", "挑战"],
    sections: [
      { id: "cards", title: "纸牌分类器", html: demo("cardClassifier", "纸牌分类器（演示）", "先看训练牌，再选规则") + callout("unplugged", "不插电版", "<p>用一副扑克牌：老师给学习组看 10 张标好「好牌 / 坏牌」的牌（故意挑成好牌都是红色），学习组写下规则，再用 10 张新牌考试。讨论：为什么错？训练用的牌挑得有偏。数据里有什么、缺什么，模型就会什么、缺什么（C6 接着讲数据里的偏见）。</p>") },
      { id: "challenge", title: "让 AI 说错", html: callout("activity", "挑战（演示）", "<ol><li>想一个冷门但能查到答案的问题：本地一所学校的建校年份、一座小桥名字的由来、家里一本旧书的出版社。</li><li>问 AI，记下原话。</li><li>自己去查：学校官网、地方志、书的版权页、问长辈。</li><li>填一行 C4 的核验记录表。</li></ol><p>抓到一次编造得 2 分；AI 老实说「不知道」也记下来，得 1 分；答对了同样记下来。<b>目的不是证明 AI 不行，而是看清它在哪类问题上容易错。</b></p>") },
    ],
    takeaways: ["有偏的数据，教出有偏的规则。", "让 AI 说错，是为了看清它的边界。"],
  },
  {
    slug: "5-tracks", nav: "分人群", title: "不同人群的版本",
    subtitle: "孩子、长辈、上班族、老师",
    abstract: "原理对所有人一样，落到的习惯按人群调整。",
    tags: ["K12", "银发族", "在职", "教师"],
    sections: [
      { id: "kids", title: "儿童 / K12：它是猜的，不是查的", html: callout("track", "按学段", `<p><b>小学：</b>《中小学生成式人工智能使用指南（2025年版）》规定小学阶段禁止学生独自使用开放式内容生成功能。${cite("moe-genai")} 小学版玩纸牌分类器和同学之间的接龙游戏，「让 AI 说错」由老师操作、全班一起查。</p><p><b>初中：</b>对应《中小学人工智能通识教育指南（2025年版）》里机器学习基本流程、监督学习概念和辨析虚假信息风险的要求。${cite("moe-tongshi")} 可以让 AI 把同一个问题回答两次，比较不同。</p>`) },
      { id: "seniors", title: "银发族：说得像，不等于是真的", html: callout("track", "最该小心的三类", "<p>偏方和保健品（数据里谣言多）、「最新政策」（容易过时）、本地的具体信息（数据里很少）。碰到这三类，问医生、打官方电话、问社区。</p>") },
      { id: "workers", title: "在职：冷门、最新、精确，三类必查", html: callout("track", "三类必查", "<p>冷门（客户名字、法规条文号、文献出处）、最新（价格、政策、版本号）、精确（一字不差的引用、数字、日期）。布置任务时写明「不确定就说不确定，不要猜」，并要求标出需要人核实的部分。</p>") },
      { id: "teachers", title: "教师：把原理讲成一个习惯", html: callout("track", "教法", "<p>讲透一句话：「它学的是说得像，不是说得对」。纸牌分类器和接龙游戏比讲参数更有用。布置「让 AI 说错」作业，附核验记录；评价看挑的问题是否属于容易错的类别、证据是否可追溯。</p>") },
    ],
    takeaways: ["孩子：它是猜的，不是查的。", "长辈：偏方、最新政策、本地信息要问人。", "上班族：冷门、最新、精确，三类必查。"],
  },
  {
    slug: "6-summary", nav: "小结", title: "小结与练习",
    subtitle: "三句话、自测、练习、出处",
    abstract: "把这一讲收拢成三句话，再做几道题。",
    tags: ["自测", "练习", "出处"],
    sections: [
      { id: "three", title: "三句话", html: `<ol><li>AI 的答案来自数据和从数据里训练出来的模型；聊天 AI 就是一个一个词往下接。</li><li>它学的是「说得像」，不是「说得对」；数据里错的、少的、过时的，它都可能一本正经地编。</li><li>冷门的、最新的、要紧的，一定要查（用 <a href="../C4/index.html">C4</a> 的五招）。</li></ol>` },
      { id: "selftest", title: "自测", html: [
        predict("「AI 的回答是从网上搜来抄的」，对吗？", "<p>不对。聊天 AI 默认是按学到的规律生成；有的产品会先搜索再写，但写的那一步仍是生成，可能出错。</p>"),
        predict("同一个问题问两次，答案不一样，为什么？", "<p>每一步都有几个差不多像样的词可选，选得不同，接出来的话就不同。</p>"),
        predict("为什么 AI 很少拼错字，却会编错一个人的生日？", "<p>拼写有固定规律，越学越准；生日没有规律可循，光靠规律猜不出来。</p>"),
      ].join("") },
      { id: "practice", title: "练习", html: `<ol><li>完成一次「让 AI 说错」挑战，填一行核验记录表。</li><li>同一个问题问 AI 两次，找出说法不一致的地方，查一查哪个对。</li><li>回想 <a href="../C1/index.html">C1</a> 的伊丽莎：规则是人写的；今天的 AI 规则从数据里学。这让 AI 更强在哪里，错又更难预料在哪里？</li></ol>` },
      { id: "sources", title: "出处", html: `<p>以下页面都在 2026-10-19 打开核对过。</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["答案来自数据和模型。", "说得像 ≠ 说得对。", "冷门、最新、要紧，一定要查。"],
  },
];
