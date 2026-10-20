// C8 各章内容，改写自 notes/C8-when-not-to-use-ai.md（讲义为准；改讲义后同步这里）。出处和讲义脚注一一对应。

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "先猜一猜", `<p>${q}</p><details class="reveal"><summary>看答案</summary>${a}</details>`);

// 出处（同讲义脚注，访问于 2026-10-19）。
const SOURCES = [
  ["bastani", "Hamsa Bastani 等, “Generative AI without guardrails can harm learning: Evidence from high school mathematics”, PNAS, 2025, PMC 全文", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/"],
  ["ms-critical", "Hao-Ping (Hank) Lee 等, “The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers”, CHI 2025, Microsoft Research", "https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/"],
  ["mit-brain", "Nataliya Kosmyna 等, “Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task”, arXiv 预印本 2506.08872, 2025, MIT Media Lab", "https://www.media.mit.edu/publications/your-brain-on-chatgpt/"],
  ["ailit-fw", "European Commission & OECD, “AILit Framework”, Frameworks 页面（能力 Manage AI 1；©2026 OECD 保留所有权利，只简短转述能力名称）", "https://ailiteracyframework.org/frameworks/"],
  ["unesco-genai", "Fengchun Miao、Wayne Holmes, UNESCO, “Guidance for generative AI in education and research”, 2023（页面更新于 2026-01-16）", "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research"],
  ["moe-genai", "教育部基础教育教学指导委员会《中小学生成式人工智能使用指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C8",
  badge: "共享核心模块 · 核心系列最后一讲",
  title: "何时不用 AI、保持自主学习",
  tagline: "有些本事，要长在自己身上",
  lead: "前七讲都在学怎样用好 AI。最后一讲反过来问：什么时候不用？练的时候把答案交给 AI，下次没有 AI，你就不会了。这一讲给你两个工具：关闭 AI 的检查点和反思日志，最后把 C1–C8 串成一张图。",
  heroDemo: "heroDecide",
  heroLabel: "六问：这件事交不交给 AI",
  heroCaption: "例子是为教学构造的。六个问题里有一个「是」，就先别直接交给 AI。",
  whyTitle: "为什么要学这一讲",
  whySub: "会用，也要会不用",
  why: [
    ["练习时拿答案，考试时更差", "一项高中数学实验里，练习时随便问 AI 的学生，之后不准用 AI 的考试成绩低了 17%。"],
    ["自己察觉不到", "同一项研究发现，学生并没有察觉自己学得更少。"],
    ["只给提示就好得多", "AI 只给提示、不给答案的那一组，负面影响基本被抵消。"],
  ],
  ctaTitle: "准备好设第一个检查点了吗？",
  minutes: "约 45 分钟",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-study", nav: "一项实验", title: "一项高中数学实验",
    subtitle: "练习时拿答案，考试时更差",
    abstract: "练习成绩提高 48%，考试成绩反而低 17%。",
    tags: ["研究", "自主学习"],
    hero: "toc",
    sections: [
      { id: "exp", title: "实验和结果", html: `
        ${callout("note", "关于本讲的例子", "<p>三项研究都来自公开发表的论文或论文页面，我们会写清每项研究的局限。标着「演示」的检查点和日志是为教学构造的。<b>这一讲不是「反 AI」</b>：关键在怎么用，以及什么时候先不用。</p>")}
        <p>2023 年秋季，研究者在土耳其一所高中、近 1000 名学生里做了一个实验：一部分学生练习时可以用一个普通的 GPT-4 聊天界面（GPT Base），一部分用加了限制的版本（GPT Tutor，只给提示、不直接给答案），还有一部分不用 AI。${cite("bastani")}</p>
        <ul><li><b>练习时：</b>用 GPT Base 的学生成绩提高了 48%，用 GPT Tutor 的提高了 127%。</li>
        <li><b>随后不准用 AI 的考试里：</b>用过 GPT Base 的学生，成绩反而比从没用过 AI 的学生低 17%；用 GPT Tutor 的学生，这种负面影响基本被抵消了。</li>
        <li><b>原因：</b>没有限制时，学生把 GPT-4 当「拐杖」，主要是要答案、抄答案；而且学生<b>并没有察觉</b>自己学得更少了。</li>
        <li><b>顺带一提：</b>研究中 GPT Base 给出正确答案的比例平均只有 51%。${cite("bastani")}</li></ul>
        <p><b>局限：</b>只有一所学校、一个学科（数学），时间在生成式 AI 刚普及不久，测的是短期效果。研究者自己也写明了这些。${cite("bastani")}</p>
        ${predict("练习时成绩提高了 48%，为什么考试时反而更差？如果你是那个学生，你会发现吗？", "<p>练习时是 AI 在解题，自己没练到；研究发现学生自己并没有察觉。</p>")}` },
    ],
    takeaways: ["练习时直接拿答案，可能学得更少。", "只给提示的用法好得多。"],
  },
  {
    slug: "2-read", nav: "读研究", title: "其他研究怎么说（要小心读）",
    subtitle: "看样本、看条件、看是不是同行评审",
    abstract: "写成「在这项研究里」，不写成「用 AI 会变笨」。",
    tags: ["研究", "核验"],
    sections: [
      { id: "two", title: "两项研究", html: `<ul>
        <li><b>一项知识工作者调查。</b>微软研究院等研究者在 CHI 2025 发表的研究，调查了 319 名知识工作者、936 个使用生成式 AI 的工作实例：对 AI 越有信心，报告的批判性思考越少；对自己越有信心，报告的批判性思考越多。批判性思考的重心也在转移：转向核验信息、整合回答、对任务负责。<b>局限：</b>是自我报告。${cite("ms-critical")}</li>
        <li><b>一项脑电实验。</b>麻省理工学院媒体实验室的研究让 54 人分三组写作文（用大模型、用搜索引擎、只靠自己），用脑电图测量。用大模型的那组，脑区连接最弱，对自己文章的「这是我写的」感最低，也最难准确引用自己刚写的文章。<b>局限：</b>以 arXiv 预印本形式发布，样本小（第四次实验只有 18 人完成）。${cite("mit-brain")}</li></ul>
        ${callout("pattern", "怎么读这类研究", "<p>看样本多大、测的是什么、在什么条件下、是不是同行评审。结论写成「在这项研究里……」，不写成「用 AI 会让人变笨」。这就是 <a href=\"../C4/index.html\">C4</a> 的核验，用在研究上。</p>")}` },
    ],
    takeaways: ["每项研究都有局限。", "结论不要说过头。"],
  },
  {
    slug: "3-six", nav: "六问", title: "什么时候不用：六问",
    subtitle: "根据任务的性质决定是否使用 AI",
    abstract: "六个问题里有一个「是」，就先别直接交给 AI。",
    tags: ["六问", "何时不用"],
    sections: [
      { id: "six", title: "六个问题", html: `
        <p>欧盟委员会和 OECD 的 AILit 框架把「<b>根据任务的性质决定是否使用 AI 系统</b>」列为一项 AI 素养能力。${cite("ailit-fw")} UNESCO 的生成式 AI 教育指南也提出，要为独立使用生成式 AI 对话平台设定年龄下限，并按年龄设计使用方式。${cite("unesco-genai")} 落到每个人身上，用六个问题来判断：</p>
        <ol><li><b>我在学这个本事吗？</b>练习的过程本身就是目的，就先自己做；需要帮忙时，只让 AI 给提示，不给答案。${cite("bastani")}</li>
        <li><b>需要我的判断和责任吗？</b>关系到人的决定（<a href="../C6/index.html">C6</a>）、要你签字负责的事，AI 可以参谋，决定自己做。</li>
        <li><b>是人和人之间的事吗？</b>道歉、安慰、感谢，用自己的话更好。</li>
        <li><b>规定允许吗？</b>考试、作业要求、单位制度。《中小学生成式人工智能使用指南（2025年版）》规定小学阶段禁止学生独自使用开放式内容生成功能，要求学生避免在作业中简单复制生成式 AI 的内容。${cite("moe-genai")}</li>
        <li><b>涉及隐私或保密吗？</b>不能交出去的信息就不交（<a href="../C5/index.html">C5</a>）。</li>
        <li><b>我核验得了吗？</b>结果很重要、自己又没办法核验，就不要靠 AI（<a href="../C4/index.html">C4</a>）。</li></ol>
        ${callout("pitfall", "常见误会", `<p>「先用 AI 做完，我再看一遍，就等于我会了。」看懂和会做是两回事。实验里的学生也以为自己学会了。${cite("bastani")}</p>`)}` },
    ],
    takeaways: ["在学本事，先自己做。", "要帮忙，只要提示。"],
  },
  {
    slug: "4-tools", nav: "检查点和日志", title: "关闭 AI 的检查点和反思日志",
    subtitle: "隔一段时间关掉 AI；每次用完写五行",
    abstract: "关掉 AI，我还会吗？",
    tags: ["招牌活动", "检查点", "反思日志"],
    sections: [
      { id: "check", title: "关闭 AI 的检查点", html: `<ol>
        <li><b>选一项本事：</b>你最近常让 AI 帮忙的事，比如写一段工作总结、解一类题、算一笔账。</li>
        <li><b>定时间：</b>比如每用 AI 做五次，就有一次完全自己做；或者每周固定一次。</li>
        <li><b>关掉 AI 做一遍：</b>不查 AI，可以查书、查笔记。</li>
        <li><b>对照：</b>和以前 AI 帮忙时的结果比，哪里做不出来、哪里慢了。</li>
        <li><b>调整用法：</b>做不出来的地方，下次先自己想五分钟再问；问的时候说「只给我提示，不要直接给答案」。</li></ol>
        ${callout("demo", "演示：一位大学生的检查点（构造的例子）", "<p>她连续几周用 AI 帮忙写实验报告的「讨论」部分。检查点那天关掉 AI，自己写：数据描述写得出来，但「结果说明了什么、为什么和预期不同」写不出来。<b>调整：</b>以后讨论部分先自己写三句要点，再让 AI 只指出逻辑漏洞，不改写。</p>")}` },
      { id: "log", title: "试一试：反思日志", html: demo("reflectLog", "反思日志", "每次用完 AI，写五行", "演示内容是构造的例子。") },
    ],
    takeaways: ["定期关掉 AI 检查自己。", "每次用完写五行。"],
  },
  {
    slug: "5-series", nav: "系列小结", title: "系列小结：C1–C8 一张图",
    subtitle: "一条主线、三级徽章",
    abstract: "核验 → 监督 → 不用。",
    tags: ["系列小结", "徽章"],
    sections: [
      { id: "map", title: "C1–C8", html: `
        <table><thead><tr><th>模块</th><th>一句话</th><th>你交出的东西</th></tr></thead><tbody>
        <tr><td><a href="../C1/index.html">C1</a> AI 是什么 / 不是什么</td><td>会说话 ≠ 会思考、会负责</td><td>「猜规则」游戏记录</td></tr>
        <tr><td><a href="../C2/index.html">C2</a> 数据、模型与幻觉</td><td>答案从数据里来，所以会编</td><td>「让 AI 说错」记录</td></tr>
        <tr><td><a href="../C3/index.html">C3</a> 描述与委托</td><td>四件事：做什么、给谁用、什么样算好、哪些不要</td><td>一份任务作品</td></tr>
        <tr><td><a href="../C4/index.html">C4</a> 核验</td><td>按风险定级，五招核验</td><td>核验记录表</td></tr>
        <tr><td><a href="../C5/index.html">C5</a> 安全、隐私与防诈骗</td><td>三条红线，一个电话</td><td>家庭暗号演练</td></tr>
        <tr><td><a href="../C6/index.html">C6</a> 公平、伦理与工作</td><td>偏见能查；版权标明；工作拆成任务</td><td>偏见审计、任务表</td></tr>
        <tr><td><a href="../C7/index.html">C7</a> 智能体：委托与监督</td><td>确认点 + 监督日志</td><td>监督日志</td></tr>
        <tr><td>C8 何时不用 AI</td><td>关掉 AI，我还会吗</td><td>检查点 + 反思日志</td></tr></tbody></table>
        ${callout("pattern", "一条主线", "<p><b>核验（C4）→ 监督（C7）→ 不用（C8）。</b>先学会查一句话，再学会盯一个智能体，最后知道什么时候自己来。</p>")}` },
      { id: "badges", title: "三级徽章", html: `<ul>
        <li><b>L1「知」：</b>通过 C1、C2、C5 的实践小测（不只是选择题）。</li>
        <li><b>L2「用」：</b>完成一份任务作品（C3）。</li>
        <li><b>L3「验」：</b>通过核验挑战（C4）、提交监督日志（C7），并完成口头答辩（含 C8：哪些部分没让 AI 做，为什么）。</li></ul>
        <p>徽章是本课程的设计，全部是实践型考核；能否纳入学分银行或高校学分互认，截至 2026-10 还在洽谈中，属于建议。</p>`
        + demo("seriesCheck", "系列自查", "每讲勾一件「已经在做」的事") },
    ],
    takeaways: ["核验、监督、不用，是一条线。", "三级徽章全是实践型考核。"],
  },
  {
    slug: "6-tracks", nav: "分人群", title: "活动与不同人群的版本",
    subtitle: "先自己、再提示、再自己；孩子、大学生、上班族、长辈、老师",
    abstract: "把检查点用到每一类学习者身上。",
    tags: ["不插电", "K12", "大学", "在职", "银发族", "教师"],
    sections: [
      { id: "activity", title: "活动：我的第一个检查点", html: callout("activity", "20 分钟，有 AI 版", "<ol><li>每人写下一件最近常让 AI 帮忙的事。</li><li>现场关掉 AI，用 10 分钟自己做一遍同类的小任务。</li><li>两人一组对照：哪里卡住了？用六问判断，这件事以后该怎么用 AI？</li><li>写第一条反思日志，约定下一次检查点的日期。</li></ol>") },
      { id: "unplugged", title: "不插电：先自己，再提示，再自己", html: callout("unplugged", "演示材料（15 分钟）", "<p>老师准备一道题，再准备三张「提示卡」，每张只给一点线索，最后一张也不给答案。</p><ol><li>先自己做 3 分钟，写下做到哪一步。</li><li>卡住的人领一张提示卡，再做 3 分钟；还卡住再领下一张。</li><li>最后不看卡片，把题从头讲给同桌听。</li><li>讨论：提示卡和直接给答案有什么不同？这就是研究里「只给提示」的思路。</li></ol>") },
      { id: "kids", title: "儿童 / K12：先想，再问", html: callout("track", "孩子们", `<p>小学不独自使用开放式生成功能；初中、高中作业不简单复制 AI 的内容。${cite("moe-genai")} 课堂规矩：先自己想、写下想法，再看 AI 或老师的提示；作业附一行「哪部分是我自己做的」。</p>`) },
      { id: "uni", title: "大学：期中关 AI，期末讲清楚", html: callout("track", "大学生", "<p>第 8 周期中关闭 AI 的笔试就是检查点；第 16 周口头答辩要讲清「哪些部分我们没让 AI 做，为什么」。反思日志全学期累计，计入「反思」成绩。</p>") },
      { id: "work", title: "在职人员：核心本事留在自己手里", html: callout("track", "上班族", "<p>为岗位里最核心的一两项本事设检查点（写方案、读合同、算成本），每月自己做一次。AI 坏了、断网了、不让用了，工作还能做下去。</p>") },
      { id: "seniors", title: "银发族：会用 AI，也留着自己的办法", html: callout("track", "长辈们", "<p>查公交、算账、记电话，AI 可以帮，自己的老办法也留着：常用电话写在纸上，算账自己再按一遍计算器。钱、健康、个人信息，最后自己拿主意或问家人（和 C5 一致）。</p>") },
      { id: "teachers", title: "教师：把检查点设计进作业", html: callout("track", "老师们", `<p>作业里留一个关闭 AI 的环节（课堂限时完成、口头讲解），并要求附反思日志。给学生用 AI 时，优先「只给提示、不给答案」的用法。${cite("bastani")} 教师不得把生成式 AI 作为替代性教学主体，禁止直接用 AI 回答学生问题。${cite("moe-genai")}</p>`) },
    ],
    takeaways: ["每类学习者都能设检查点。", "提示卡比答案好。"],
  },
  {
    slug: "7-summary", nav: "小结", title: "小结与练习",
    subtitle: "三句话、自测、练习、出处",
    abstract: "会用，会查，会盯，也知道什么时候自己来。",
    tags: ["自测", "练习", "出处"],
    sections: [
      { id: "three", title: "三句话", html: `<ol><li><b>练习时直接拿答案，可能学得更少，而且自己察觉不到</b>；只给提示的用法好得多。</li><li><b>用六问判断要不要用 AI</b>：在学本事吗、需要我负责吗、是人和人的事吗、规定允许吗、涉及隐私吗、我核验得了吗。</li><li><b>定期关掉 AI 检查自己</b>，写反思日志；核验、监督、不用，是一条线。</li></ol>` },
      { id: "selftest", title: "自测", html: [
        predict("实验里，用 GPT Base 和用 GPT Tutor 的学生，在不准用 AI 的考试里表现有什么不同？", `<p>用 GPT Base 的比从没用过 AI 的低 17%；用 GPT Tutor 的负面影响基本被抵消。${cite("bastani")}</p>`),
        predict("「用 AI 会让大脑变笨」这个说法，哪里不对？", "<p>研究说的是特定用法、特定条件下的结果，有的还是预印本或自我报告，不能推广成一句话。</p>"),
        predict("哪种情况更应该先不用 AI：写一封道歉信、查一个英文单词的意思、准备明天的数学小测？", "<p>道歉信（人和人的事）和准备数学小测（在学本事）；查单词可以用，但最好查词典核对。</p>"),
        predict("L3「验」徽章要交哪三样东西？", "<p>核验挑战、监督日志、口头答辩。</p>"),
      ].join("") },
      { id: "practice", title: "练习", html: `<ol><li><b>检查点：</b>选一项本事，定下你的检查点规则，下周做第一次。</li><li><b>反思日志：</b>连续一周，每次用完 AI 写五行。</li><li><b>系列回顾：</b>用第 5 章的表给自己打分：哪一讲的东西你已经在用了，哪一讲还没有？</li></ol><p>相关模块：<a href="../C4/index.html">C4</a> 核验、<a href="../C5/index.html">C5</a> 红线、<a href="../C6/index.html">C6</a> 关系到人的判断、<a href="../C7/index.html">C7</a> 监督。回到 <a href="../index.html">全部模块</a>。</p>` },
      { id: "sources", title: "出处", html: `<p>以下页面都在 2026-10-19 打开核对过。</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["关掉 AI，我还会吗？", "六问。", "核验、监督、不用。"],
  },
];
