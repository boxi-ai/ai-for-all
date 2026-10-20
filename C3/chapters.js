// C3 各章内容，改写自 notes/C3-describe-delegate.md（讲义为准；改讲义后同步这里）。出处和讲义脚注一一对应。

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "先猜一猜", `<p>${q}</p><details class="reveal"><summary>看答案</summary>${a}</details>`);

// 出处（同讲义脚注，访问于 2026-10-19）。
const SOURCES = [
  ["anthropic-clear", "Anthropic, “Prompting best practices · Be clear and direct”（Claude 提示词官方文档）", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct"],
  ["openai-tips", "OpenAI Help Center, “Best practices for prompt engineering with the OpenAI API”", "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api"],
  ["4d-academy", "Anthropic Academy, “The 4D Framework”（AI Fluency: Framework & Foundations 第 3 课）", "https://academy.claude.com/courses/ai-fluency-framework-foundations/the-4d-framework"],
  ["4d-terms", "Rick Dakan、Joseph Feller、Anthropic, “AI Fluency: Key Terminology Cheat Sheet”, 2025（CC BY-NC-SA 4.0，这里只简短转述术语定义，未改编原文）", "https://www-cdn.anthropic.com/4396730ed190e691a3712cf2fd6bfe35509deca2.pdf"],
  ["4d-course", "Anthropic, “AI Fluency: Framework & Foundations” 课程目录（含 “The Description-Discernment loop”）", "https://anthropic.skilljar.com/ai-fluency-framework-foundations"],
  ["moe-genai", "教育部基础教育教学指导委员会《中小学生成式人工智能使用指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["mss-ai", "《AI融入生活：这些细节要警惕！》，「国家安全部」微信公众号，广东网信网转载，2024-10-15", "https://www.cagd.gov.cn/v/2024/10/6006.html"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C3",
  badge: "共享核心模块",
  title: "怎样把事情交代清楚",
  tagline: "描述与委托：先想要不要交，再把它交代清楚",
  lead: "同一个任务，交代得含糊和交代得清楚，拿回来的东西可以差很远。这一讲学两件事：交出去之前想清楚要不要交、交哪一部分；交的时候说清楚四件事：做什么、给谁用、什么样算好、哪些不要。",
  heroDemo: "heroBrief",
  heroLabel: "同一个任务，三种写法（演示）",
  heroCaption: "交代和 AI 回答都是为教学构造的示意。",
  whyTitle: "为什么要学交代",
  whySub: "AI 很聪明，但它不知道你脑子里的东西",
  why: [
    ["像个刚来的新同事", "很聪明，但不了解你的习惯和做法。你说得越准确，结果越好。"],
    ["你没给的，它会自己补", "补得像真的。所以要写明「没给的信息不要编」。"],
    ["交代清楚也要查", "清楚的交代让错误少一些、好发现一些，但不能消灭错误。"],
  ],
  ctaTitle: "准备好把一件事交代清楚了吗？",
  minutes: "约 45 分钟",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-colleague", nav: "新同事", title: "一个聪明但刚来的新同事",
    subtitle: "给 AI 交代事情，就像给新同事交代工作",
    abstract: "只说「帮我写个通知」，新同事会怎样？",
    tags: ["比方", "检验办法"],
    hero: "toc",
    sections: [
      { id: "story", title: "把 AI 想成新员工", html: `
        <p>Anthropic 在给 Claude 写提示词的官方文档里打了个比方：把它想成一个<b>很聪明、但刚来的新员工</b>，不了解你的习惯和工作流程。你把想要什么说得越准确，结果越好。文档还给了一条「黄金法则」：把你的提示拿给一个不了解这件事的同事看，请他照着做；如果他会糊涂，AI 多半也会。${cite("anthropic-clear")}</p>
        ${predict("你请一位刚来的同事「帮我写个通知」。他最可能回来问你哪些问题？", "<p>发给谁？写什么事？什么时候、在哪儿？写多长？正式还是口语？这些问题，就是第 3 章的「四件事」。</p>")}` },
    ],
    takeaways: ["AI 像一个聪明但刚来的新同事。", "同事看不懂的交代，AI 多半也看不懂。"],
  },
  {
    slug: "2-delegate", nav: "要不要交", title: "先想清楚：要不要交给 AI",
    subtitle: "委托：哪些交给 AI，哪些自己做",
    abstract: "交出去之前问自己四个问题。",
    tags: ["委托", "4D 框架"],
    sections: [
      { id: "4d", title: "4D 框架里的「委托」", html: `
        <p>AI 素养的 4D 框架把和 AI 一起做事的本事分成四项：委托、描述、辨别、尽责。${cite("4d-academy")} 框架的术语表把<b>委托</b>解释为：决定哪些工作由人做、哪些由 AI 做、怎样分工，其中包括先弄清楚自己的目标和这件事的性质，再了解不同 AI 系统能做什么、不能做什么。${cite("4d-terms")}</p>` },
      { id: "four-q", title: "四个问题", html: `
        <table><thead><tr><th>问题</th><th>为什么要问</th><th>对应模块</th></tr></thead><tbody>
        <tr><td>我自己清楚要什么吗？</td><td>自己都说不清，AI 只能猜</td><td>本讲</td></tr>
        <tr><td>这是 AI 擅长的吗？</td><td>起草、改写、整理、出主意擅长；冷门事实、最新消息容易错</td><td><a href="../C1/index.html">C1</a>、<a href="../C2/index.html">C2</a></td></tr>
        <tr><td>错了代价有多大？</td><td>代价大的，交回来要查得更严，或者自己做</td><td><a href="../C4/index.html">C4</a> 信号灯</td></tr>
        <tr><td>里面有不能给出去的信息吗？</td><td>身份证号、病历、单位文件、别人的隐私，不要交给 AI</td><td><a href="../C5/index.html">C5</a></td></tr></tbody></table>
        ${callout("pattern", "一句话", "<p>先想清楚要不要交、交哪一部分，再想怎么交代。有的事整件交，有的只交一部分（比如只让它改语气），有的自己做（C8）。</p>")}` },
    ],
    takeaways: ["先想要不要交，再想怎么交代。", "代价大的、有隐私的，要格外小心。"],
  },
  {
    slug: "3-four", nav: "四件事", title: "交代清楚四件事",
    subtitle: "做什么、给谁用、什么样算好、哪些不要",
    abstract: "把脑子里的东西说出来，没有万能咒语。",
    tags: ["描述", "写法"],
    sections: [
      { id: "four", title: "四件事", html: `
        <p>4D 框架里的<b>描述</b>，指和 AI 有效沟通：说清楚要什么成品（内容、格式、读者、风格），怎么做（比如一步一步的要求），以及合作时它该怎么表现（比如简洁还是详细）。${cite("4d-terms")} 落到日常，我们把它归成四件事：</p>
        <table><thead><tr><th>四件事</th><th>要说清什么</th><th>例子</th></tr></thead><tbody>
        <tr><td><b>做什么</b></td><td>任务和成品</td><td>「写一条发在业主群的通知」</td></tr>
        <tr><td><b>给谁用</b></td><td>读者、用途、背景材料</td><td>「读者大多是六七十岁的老人，用手机看」</td></tr>
        <tr><td><b>什么样算好</b></td><td>长度、格式、语气，最好给个样子</td><td>「不超过 100 字，分 3 行，口语、亲切」</td></tr>
        <tr><td><b>哪些不要</b></td><td>边界和底线</td><td>「我没给的信息不要编，不确定的标【待确认】」</td></tr></tbody></table>` },
      { id: "docs", title: "和 AI 公司的写法建议一致", html: `<ul>
        <li>OpenAI 的帮助文档建议，对想要的背景、结果、长度、格式、风格说得具体、详细；用例子说明想要的格式；少用「写短一点」这种含糊说法，改成「写一段 3 到 5 句话」；与其只说不要做什么，不如说清楚要做什么。${cite("openai-tips")}</li>
        <li>Anthropic 的文档建议说清楚输出格式和限制条件；顺序要紧的步骤用编号列出来；说明原因，比只下命令效果好；给几个贴切的例子。${cite("anthropic-clear")}</li></ul>
        ${callout("pitfall", "「哪些不要」最容易忘，也最要紧", "<p><a href=\"../C2/index.html\">C2</a> 讲过，AI 照着「说得像」往下接：你没给的信息，它常常自己补一个像样的。写明「没给的信息不要编」「不确定就说不确定」，能让编造少一些、好发现一些，但不能保证不编，交回来照样要查。</p>")}
        ${demo("briefBuilder", "交代单", "按四件事填一填，看看还缺什么")}` },
    ],
    takeaways: ["做什么、给谁用、什么样算好、哪些不要。", "说具体：「3 到 5 句话」胜过「写短一点」。"],
  },
  {
    slug: "4-compare", nav: "三种写法", title: "招牌活动：同一个任务，三种写法",
    subtitle: "社区讲座通知（演示）",
    abstract: "比一比，分数从哪件事上拉开。",
    tags: ["演示", "对比", "打分"],
    sections: [
      { id: "three", title: "三种写法打分", html: demo("compareThree", "三种写法（演示）", "看交代和回答，再给每项打 0–2 分", "三种交代和三段 AI 回答都是为教学构造的示意，不是真实运行记录。")
        + callout("activity", "接着做", "<p>换成自己的一个真实任务（给家人的消息、给客户的回复、给学生的说明），先写一句话的版本，再一步步补成四件事的版本，各问一次 AI，把回答放在一起比。</p>") },
    ],
    takeaways: ["一句话的交代，AI 只能猜。", "四件事说全，几乎能直接用，但还要查。"],
  },
  {
    slug: "5-loop", nav: "来回改", title: "来回改：说清楚哪里不行",
    subtitle: "描述—辨别循环",
    abstract: "第一稿不满意很正常，关键是说清楚哪里不行。",
    tags: ["修改", "画图游戏"],
    sections: [
      { id: "loop", title: "交代 → 看 → 指出 → 再交代", html: `
        <p>4D 课程里有一节叫「描述—辨别循环」：交代、看结果、判断好坏、再交代。${cite("4d-course")}</p>
        <ul><li>不说「不好，重写」，而说「第二行太长，改成一句话；去掉『拨冗莅临』这种书面词」。</li>
        <li>不说「再专业点」，而说「读者是会计，可以用『应收账款』这类术语，不用解释」。</li>
        <li>发现它编了东西，直接指出：「主讲人名字是你加的，删掉。」</li></ul>
        ${callout("pattern", "一句话", "<p>改到满意以后，涉及事实的地方照 <a href=\"../C4/index.html\">C4</a> 的办法查一遍，再发出去。发出去的东西，责任在你。</p>")}` },
      { id: "unplugged", title: "不插电：画图指令游戏", html: callout("unplugged", "演示材料", "<p>两人一组：说的人看一张画好简单图形的卡片（比如一个大圆，圆里左上方一个小三角形，圆下面一条横线），背对画的人。第一轮只说一句话；第二轮多说几句但不许问；第三轮用四件事交代，画的人可以提问。比较三张画：哪一轮最像？哪句话最管用？</p><p>画的人就像 AI：你没说的，他只能猜。第三轮对应「有不清楚的地方先问我」这个办法。</p>") },
    ],
    takeaways: ["说清楚哪里不行，再交代一轮。", "改完还要查。"],
  },
  {
    slug: "6-tracks", nav: "分人群", title: "不同人群的版本",
    subtitle: "孩子、长辈、上班族、老师",
    abstract: "四件事对所有人一样，练法按人群调整。",
    tags: ["K12", "银发族", "在职", "教师"],
    sections: [
      { id: "kids", title: "儿童 / K12：先说给同学听", html: callout("track", "按学段", `<p><b>小学：</b>《中小学生成式人工智能使用指南（2025年版）》规定小学阶段禁止学生独自使用开放式内容生成功能。${cite("moe-genai")} 小学版玩画图指令游戏，再由老师把全班写好的四件事交给 AI，大家看结果、挑毛病。</p><p><b>初中、高中：</b>同一份指南要求学生避免在作业中简单复制生成式 AI 的内容，避免将个人信息输入。${cite("moe-genai")} 练习时交三样：自己写的交代、AI 的回答、自己改了哪里和为什么。</p>`) },
      { id: "seniors", title: "银发族：用嘴说清楚", html: callout("track", "语音提问", "<p>查公交时说全：我在哪、要去哪、什么时候走、想坐公交还是地铁。说清楚情况就行，不要说身份证号、银行卡号、验证码（<a href=\"../C5/index.html\">C5</a>）。涉及钱、健康的回答，照「三条红线，一个电话」再核实。</p>") },
      { id: "workers", title: "在职：岗位任务交代单", html: callout("track", "交代单", `<p>把常做的任务写成固定的交代单，下次直接填。国家安全机关提示，切勿将国家秘密、商业秘密或个人隐私等敏感信息输入 AI 工具。${cite("mss-ai")} 交代时用化名、打码，或者只描述情况、不贴原文。交出去之前按 C4 的五项检查过一遍。</p>`) },
      { id: "teachers", title: "教师：教写法，也评写法", html: callout("track", "教法与评价", `<p>《中小学生成式人工智能使用指南（2025年版）》要求教师不得将生成式 AI 作为替代性教学主体，禁止直接使用 AI 回答学生问题；严禁将个人信息、考试试题等敏感数据输入 AI 工具。${cite("moe-genai")} 评「三种写法对比」作业看三点：四件事说全没有；能不能指出 AI 在哪里自己补了信息；改的理由说得清不清楚。</p>`) },
    ],
    takeaways: ["孩子：先说给同学听。", "长辈：用嘴说清楚，不说隐私。", "上班族：交代单 + 不贴敏感原文。"],
  },
  {
    slug: "7-summary", nav: "小结", title: "小结与练习",
    subtitle: "三句话、自测、练习、出处",
    abstract: "把这一讲收拢成三句话，再做几道题。",
    tags: ["自测", "练习", "出处"],
    sections: [
      { id: "three", title: "三句话", html: `<ol><li>先想要不要交：自己清楚吗、AI 擅长吗、错了代价多大、有没有不能给的信息。</li><li>交代四件事：做什么、给谁用、什么样算好、哪些不要。</li><li>来回改，说清楚哪里不行；交代得再清楚，也要查（<a href="../C4/index.html">C4</a>）。</li></ol>` },
      { id: "selftest", title: "自测", html: [
        predict("「写个讲座通知」这句交代，缺了四件事里的哪几件？", "<p>给谁用、什么样算好、哪些不要都缺，「做什么」也只说了一半（发在哪儿、什么讲座）。</p>"),
        predict("「写短一点」和「写 3 到 5 句话」，哪个更好？", "<p>后者：说得具体，AI 不用猜。</p>"),
        predict("写了「我没给的信息不要加」，能保证 AI 不编吗？", "<p>不能保证，只能减少、也更容易发现，交回来仍要查。</p>"),
        predict("想让 AI 帮你回复一封客户投诉邮件，交出去之前先想哪件事？", "<p>邮件里有没有客户的个人信息、单位不能外传的内容，先去掉或打码（C5）。</p>"),
      ].join("") },
      { id: "practice", title: "练习", html: `<ol><li>拿一个自己的真实任务，写三种交代，各问一次 AI，用第 4 章的表打分。</li><li>找一次你对 AI 回答不满意的经历，写出「哪里不行」的具体说法，再交代一轮。</li><li>你身边哪件事，交代清楚所花的工夫比自己做还多？这种事还值得交给 AI 吗？</li></ol>` },
      { id: "sources", title: "出处", html: `<p>以下页面都在 2026-10-19 打开核对过。</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["先想要不要交。", "交代四件事。", "来回改，改完还要查。"],
  },
];
