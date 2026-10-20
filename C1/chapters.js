// C1 各章内容，改写自 notes/C1-what-is-ai.md（讲义为准；改讲义后同步这里）。出处和讲义脚注一一对应。

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "先猜一猜", `<p>${q}</p><details class="reveal"><summary>看答案</summary>${a}</details>`);

// 出处（同讲义脚注，访问于 2026-10-19）。
const SOURCES = [
  ["eliza", "“ELIZA”, Wikipedia（含 Weizenbaum 1966 年论文和 1976 年著作的引用）", "https://en.wikipedia.org/wiki/ELIZA"],
  ["oecd", "Stuart Russell, Karine Perset, Marko Grobelnik, “Updates to the OECD’s definition of an AI system explained”, OECD.AI, 2023-11-29", "https://oecd.ai/en/wonk/ai-system-definition-update"],
  ["bard", "James Vincent, “Google’s AI chatbot Bard makes factual error in first demo”, The Verge, 2023-02-08", "https://www.theverge.com/2023/2/8/23590864/google-ai-chatbot-bard-mistake-error-exoplanet-demo"],
  ["aircanada", "“Moffatt v. Air Canada”（2024 BCCRT 149）, Wikipedia", "https://en.wikipedia.org/wiki/Moffatt_v._Air_Canada"],
  ["moe-tongshi", "教育部基础教育教学指导委员会《中小学人工智能通识教育指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35042.html"],
  ["moe-genai", "教育部基础教育教学指导委员会《中小学生成式人工智能使用指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["unesco", "UNESCO, “AI competency framework for students”, 2024", "https://www.unesco.org/en/articles/ai-competency-framework-students"],
  ["ailit", "European Commission & OECD, “AILit Framework”", "https://ailiteracyframework.org/"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C1",
  badge: "共享核心模块",
  title: "AI 是什么 / 不是什么",
  tagline: "会说话，不等于会思考、会负责",
  lead: "手机导航、短视频推荐、刷脸解锁、聊天机器人都叫 AI。这一讲帮你分清：AI 根据输入推算输出，很能干；但会说话不等于懂，会回答不等于知道，会办事不等于会负责。",
  heroDemo: "heroIsAI",
  heroLabel: "这是 AI 吗？是哪一种输出？（演示）",
  heroCaption: "分类卡是为教学构造的演示。",
  whyTitle: "为什么先学这一讲",
  whySub: "弄清 AI 是什么，后面学核验、防诈骗才有根",
  why: [
    ["人很容易把「说得像」当成「懂了」", "1966 年的聊天程序伊丽莎只会套规则，很多人还是觉得它懂自己。"],
    ["AI 很有用", "预测、推荐、生成内容、做决定，身边到处都是。"],
    ["责任始终在人", "机器做的事，用它的人和让它上岗的机构来负责。"],
  ],
  ctaTitle: "准备好认识一下 AI 了吗？",
  minutes: "约 45 分钟",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-eliza", nav: "伊丽莎", title: "一个会聊天的老程序",
    subtitle: "只会套规则，为什么让人觉得它懂？",
    abstract: "1966 年的伊丽莎和「伊丽莎效应」。",
    tags: ["真实案例", "伊丽莎效应"],
    hero: "toc",
    sections: [
      { id: "story", title: "伊丽莎的故事", html: `
        <p>1966 年，美国麻省理工学院的约瑟夫·魏森鲍姆公布了一个会「聊天」的程序伊丽莎（ELIZA）。它最有名的脚本扮演心理咨询师：从你的话里找关键词，按写好的规则把你的话换个说法问回来。你说「你很有帮助」，它可能回「你为什么觉得我很有帮助？」。它并不理解你在说什么。${cite("eliza")}</p>
        <p>可是很多人聊了几句就觉得它懂自己。据记载，魏森鲍姆的秘书和伊丽莎聊天时，请他离开房间，好让她和伊丽莎「好好谈谈」。人们以为程序「懂」自己的现象，后来被叫做<b>伊丽莎效应</b>。${cite("eliza")}</p>
        ${predict("今天的聊天 AI 比伊丽莎强得多。「它说得像」能不能证明「它懂了」？", "<p>不能。说得像是一回事，理解、在乎是另一回事。第 3 章细说。</p>")}` },
    ],
    takeaways: ["伊丽莎只会套规则，人们还是觉得它懂。", "「说得像」不能证明「懂了」。"],
  },
  {
    slug: "2-what", nav: "是什么", title: "AI 是什么",
    subtitle: "根据输入，推算输出",
    abstract: "一句话定义、四种输出、规则写出来的和数据里学出来的。",
    tags: ["定义", "预测", "推荐", "内容", "决定"],
    sections: [
      { id: "define", title: "一句话定义", html: `
        <p>OECD 在 2023 年更新的定义，大意是：AI 系统是一种机器系统，它为了明确或隐含的目标，根据收到的输入，推算出怎样生成输出，比如预测、内容、推荐或决定；这些输出会影响现实或虚拟的环境。${cite("oecd")}</p>
        ${callout("pattern", "大白话", "<p><b>AI 根据输入，推算出输出。</b></p>")}
        <table><thead><tr><th>输出</th><th>是什么</th><th>身边的例子</th></tr></thead><tbody>
        <tr><td>预测</td><td>猜一个还不知道的结果</td><td>导航估计到达时间</td></tr>
        <tr><td>推荐</td><td>从很多选项里挑你可能要的</td><td>短视频的下一条</td></tr>
        <tr><td>内容</td><td>生成文字、图片、声音、视频</td><td>聊天机器人写的一段话</td></tr>
        <tr><td>决定</td><td>直接做出选择或动作</td><td>刷脸开门</td></tr></tbody></table>` },
      { id: "learned", title: "规则写出来的，和数据里学出来的", html: `<p>伊丽莎的本事全在人写好的规则里。今天大多数 AI 的规则是<b>从大量数据里学出来的</b>：能处理人写不完的情况，毛病也更难预料（C2 细讲）。OECD 的说明里提到，像 ChatGPT 这样的大语言模型，目标部分通过模仿人写的文字、部分通过人的反馈学出来；推荐系统上线以后还会随用户偏好继续调整。${cite("oecd")}</p>` },
      { id: "sort", title: "试一试：这是不是 AI？", html: demo("isAI", "分类卡（演示）", "给每张卡选一个答案", "有争议的卡（比如自动美颜）正好拿来讨论。") },
    ],
    takeaways: ["AI 根据输入推算输出。", "四种输出：预测、推荐、内容、决定。", "今天的 AI，本事大多从数据里学来。"],
  },
  {
    slug: "3-nots", nav: "不是什么", title: "AI 不是什么：三个「不等于」",
    subtitle: "会说话 ≠ 懂 · 会回答 ≠ 知道 · 会办事 ≠ 会负责",
    abstract: "当工具用，当工具查，出了事人来担。",
    tags: ["不等于", "责任"],
    sections: [
      { id: "talk", title: "会说话，不等于懂", html: `<p>人很容易把「说得像」当成「懂了」。${cite("eliza")} 聊天 AI 说一句「我理解你的感受」，不代表它真的理解、真的在乎。它可以是好用的工具，却不是会为你着想的朋友。</p>` },
      { id: "know", title: "会回答，不等于知道", html: `<p>2023 年 2 月，谷歌的聊天机器人 Bard 在发布演示里说韦布太空望远镜拍下了「太阳系外行星的第一张照片」，而第一张系外行星照片其实在 2004 年就拍到了。${cite("bard")} 为什么会这样，看 <a href="../C2/index.html">C2</a>；遇到了怎么办，看 <a href="../C4/index.html">C4 核验</a>。</p>` },
      { id: "duty", title: "会办事，不等于会负责", html: `<p>加拿大一位乘客按航空公司网站上客服机器人的说法买了票，事后申请优惠被拒。航空公司主张机器人要「对自己的行为负责」；2024 年 2 月，仲裁庭没有接受，判航空公司赔偿。${cite("aircanada")}</p>
        ${callout("pitfall", "两头都别走", "<p>别把 AI 当成「人」，也别把它当成「什么都不是」。<b>当工具用，当工具查，出了事人来担。</b></p>")}
        <table><thead><tr><th>AI 擅长</th><th>AI 不擅长 / 不能替代</th></tr></thead><tbody>
        <tr><td>从大量数据里找规律，又快又多</td><td>真正理解意思、在乎后果</td></tr>
        <tr><td>起草、改写、翻译、总结、出点子</td><td>保证事实一定对，尤其是冷门的、最新的事</td></tr>
        <tr><td>按规律预测、推荐、分类</td><td>为结果负责、做价值判断、替你拿主意</td></tr></tbody></table>` },
    ],
    takeaways: ["会说话不等于懂。", "会回答不等于知道。", "会办事不等于会负责：责任在人。"],
  },
  {
    slug: "4-game", nav: "猜规则", title: "猜规则游戏",
    subtitle: "做得对，不等于懂",
    abstract: "不插电游戏，也可以在这里玩电脑版。规则卡和词语都是构造的演示。",
    tags: ["不插电", "游戏"],
    sections: [
      { id: "online", title: "电脑版", html: demo("guessRule", "猜规则（演示）", "输入词语，再猜规则卡") },
      { id: "unplugged", title: "不插电版", html: callout("unplugged", "没有设备也能玩", `<p>一人当「机器」，拿一张规则卡（比如「词语里有动物就举左手」），只能按规则动作。其他人轮流说词，谁先猜出规则谁当下一轮的「机器」。每轮问三个问题：「机器」做对了吗？它知道小猫可爱、老虎危险吗？来一个规则卡上没想到的词，它会怎么做？</p><p>伊丽莎的规则是人写的；今天的 AI 的规则是从大量例子里学出来的，所以能应付更多没见过的词，但道理一样：<b>做得对，不等于懂</b>。</p>`) },
    ],
    takeaways: ["「机器」照规则办事，又快又准，但不懂。", "今天的 AI 从数据里学规则，道理一样。"],
  },
  {
    slug: "5-tracks", nav: "分人群", title: "不同人群的版本",
    subtitle: "孩子、长辈、上班族、老师",
    abstract: "核心意思对所有人一样，例子和重点按人群调整。",
    tags: ["K12", "银发族", "在职", "教师"],
    sections: [
      { id: "kids", title: "儿童 / K12：它会，可它懂吗？", html: callout("track", "对比人和机器", `<p>《中小学人工智能通识教育指南（2025年版）》提出，小学阶段要了解语音识别、图像分类等基础人工智能技术，通过对比人工智能与人类行为差异培养基础质疑意识。${cite("moe-tongshi")} 《中小学生成式人工智能使用指南（2025年版）》规定小学阶段禁止学生独自使用开放式内容生成功能，所以小学版用猜规则游戏和分类卡。${cite("moe-genai")}</p>`) },
      { id: "seniors", title: "银发族：会说话的，不一定是人", html: callout("track", "认清是机器", `<p>电话里、视频里、群聊里会说话的，可能是 AI。不要把钱、身份证号、验证码和心里话交给聊天机器人。查天气、问公交很方便；关系到钱和健康的事，问子女、问医生。</p>`) },
      { id: "workers", title: "在职：工具不签字，签字的是你", html: callout("track", "分清谁负责", `<p>加拿大航空一案里，公司想把责任推给客服机器人，没有成功。${cite("aircanada")} 你用 AI 起草的报告、邮件、合同，署的是你的名。</p>`) },
      { id: "teachers", title: "教师：先拆误解，再教用法", html: callout("track", "国际框架", `<p>联合国教科文组织《学生人工智能能力框架》列出四个维度的 12 项能力，第一个维度是以人为本的思维，并分理解、应用、创造三个层级。${cite("unesco")} 欧盟委员会和 OECD 的 AILit 框架把人工智能素养分成 Engage、Create、Manage、Shape 四个领域。${cite("ailit")} 本讲属于「理解」层级和 Engage 领域的起点。</p>`) },
    ],
    takeaways: ["孩子：用游戏对比人和机器。", "长辈：会说话的不一定是人。", "上班族和老师：工具不签字，签字的是人。"],
  },
  {
    slug: "6-summary", nav: "小结", title: "小结与练习",
    subtitle: "三句话、自测、练习、出处",
    abstract: "把这一讲收拢成三句话，再做几道题。",
    tags: ["自测", "练习", "出处"],
    sections: [
      { id: "three", title: "三句话", html: `<ol><li>AI 根据输入推算输出：预测、推荐、内容、决定；今天的 AI，本事大多从数据里学来。</li><li>会说话不等于懂，会回答不等于知道，会办事不等于会负责。</li><li>当工具用，当工具查，出了事人来担。</li></ol>` },
      { id: "selftest", title: "自测", html: [
        predict("计算器算 23 × 47，又快又准。它是 AI 吗？", "<p>一般不算：它按固定的算术规则运行，不是从数据里学出来的推算。</p>"),
        predict("聊天机器人说「别难过，我一直都在」。这能说明它在乎你吗？", "<p>不能。说得像不等于懂、不等于在乎（伊丽莎效应）。</p>"),
        predict("公司的客服机器人答应给你退款，后来公司不认账。该找谁？", "<p>找公司：让机器人上岗的机构要负责。</p>"),
      ].join("") },
      { id: "practice", title: "练习", html: `<ol><li>今天数一数你用了几次 AI，每次它在做预测、推荐、生成内容，还是做决定？</li><li>和家人玩一局猜规则游戏，玩完问：「机器」懂这些词吗？</li><li>想一个你猜 AI 可能会答错的问题，学完 <a href="../C2/index.html">C2</a> 再回来看看为什么。</li></ol>` },
      { id: "sources", title: "出处", html: `<p>以下页面都在 2026-10-19 打开核对过。</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["AI 根据输入推算输出。", "三个「不等于」。", "责任在人。"],
  },
];
