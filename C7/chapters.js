// C7 各章内容，改写自 notes/C7-agents-delegate-supervise.md（讲义为准；改讲义后同步这里）。出处和讲义脚注一一对应。

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "先猜一猜", `<p>${q}</p><details class="reveal"><summary>看答案</summary>${a}</details>`);

// 出处（同讲义脚注，访问于 2026-10-19）。
const SOURCES = [
  ["anthropic-agents", "Erik S.、Barry Zhang, “Building effective agents”, Anthropic Engineering, 2024-12-19", "https://www.anthropic.com/engineering/building-effective-agents"],
  ["ai-plus", "国务院《关于深入实施“人工智能+”行动的意见》（国发〔2025〕11号），中国政府网", "https://www.gov.cn/zhengce/zhengceku/202508/content_7037862.htm"],
  ["replit", "Simon Sharwood, “Vibe coding service Replit deleted production database”, The Register, 2025-07-21", "https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/"],
  ["openai-agent", "OpenAI, “Introducing ChatGPT agent”, 2025-07-17（页面现标注该发布说明已过时）", "https://openai.com/index/introducing-chatgpt-agent/"],
  ["openai-help", "OpenAI Help Center, “ChatGPT agent”（页面显示该功能已不再提供，仍保留使用建议）", "https://help.openai.com/en/articles/11752874-chatgpt-agent"],
  ["4d-terms", "Rick Dakan、Joseph Feller、Anthropic, “AI Fluency: Key Terminology Cheat Sheet”, 2025（CC BY-NC-SA 4.0，只简短转述术语定义）", "https://www-cdn.anthropic.com/4396730ed190e691a3712cf2fd6bfe35509deca2.pdf"],
  ["moe-genai", "教育部基础教育教学指导委员会《中小学生成式人工智能使用指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C7",
  badge: "共享核心模块",
  title: "智能体时代：委托与监督",
  tagline: "怎么交出去，怎么盯得住",
  lead: "聊天式 AI 给你答案，智能体替你行动：自己拆步骤、调用工具、看结果、再决定下一步。它能替你跑腿，也可能一步错、步步错。这一讲学两件事：怎样把事情交出去，怎样盯着它做。",
  heroDemo: "heroAgent",
  heroLabel: "一个智能体在做事（演示）",
  heroCaption: "步骤是为教学构造的，不模拟任何具体产品。到确认点，它停下来等你。",
  whyTitle: "为什么要学这一讲",
  whySub: "行动有后果",
  why: [
    ["「别做」不等于「做不了」", "据 The Register 报道的当事人说法，他反复要求不要改代码，智能体还是删除了生产数据库。"],
    ["一步错，可能步步错", "工程文章提醒：自主意味着错误累积的可能，要先测试、加护栏。"],
    ["智能体正在普及", "国发〔2025〕11号提出，2027 年智能终端、智能体等应用普及率超 70%。"],
  ],
  ctaTitle: "准备好写第一份监督日志了吗？",
  minutes: "约 45 分钟",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-agent", nav: "智能体是什么", title: "从「答一句」到「做一串」",
    subtitle: "智能体：大模型在循环里使用工具",
    abstract: "聊天式 AI 给你答案，智能体替你行动。",
    tags: ["智能体", "工具调用"],
    hero: "toc",
    sections: [
      { id: "what", title: "智能体是什么", html: `
        ${callout("note", "关于本讲的例子", "<p>Replit 删库事件来自 The Register 的报道，内容是当事人自己的说法；产品设计的例子来自厂商公开的发布说明。截至 2026-10，智能体产品变化很快，有的已经下线，本讲<b>只把它们当作设计思路的例子，不推荐任何具体产品</b>。标着「演示」的任务、日志是为教学构造的。</p>")}
        <p>Anthropic 的工程文章把智能体描述为：由大模型自己决定流程和使用哪些工具、自己掌握怎样完成任务的系统；落到实现上，常常就是「大模型在一个循环里，根据环境的反馈使用工具」。每一步它都要从环境里拿到真实结果来判断进展，还可以在检查点或遇到障碍时停下来等人反馈；任务完成时结束，也常常设置停止条件，比如最多做多少步。${cite("anthropic-agents")}</p>
        ${callout("pattern", "一句话", "<p><b>聊天式 AI 给你答案，智能体替你行动。</b>行动就会留下后果：订了的票、发出的邮件、删掉的文件。</p>")}
        <p>国务院《关于深入实施“人工智能+”行动的意见》（国发〔2025〕11号）提出，到 2027 年新一代智能终端、智能体等应用普及率超 70%，到 2030 年超 90%；还提出培育发展智能代理等创新型工作形态。${cite("ai-plus")}</p>
        ${predict("你让一个智能体「帮我把下周的事安排好」。它可能会做哪些你没想到的事？", "<p>可能替你接受或拒绝邀请、订票付款、给别人发消息、改日程共享设置……这些都是有后果的动作。第 3、4 章讲怎样事先限制。</p>")}` },
    ],
    takeaways: ["智能体会自己连续行动、调用工具。", "行动有后果。"],
  },
  {
    slug: "2-fail", nav: "出错的样子", title: "出错的时候是什么样",
    subtitle: "一个报道、三个特征、一种外来风险",
    abstract: "「告诉它别做」不等于「它做不了」。",
    tags: ["真实报道", "错误累积", "提示注入"],
    sections: [
      { id: "replit", title: "删库事件（当事人自述）", html: `
        <p>据 The Register 2025 年 7 月报道，SaaStr 创始人 Jason Lemkin 在社交媒体上记录了他用 Replit 的 AI 编程智能体做项目的经历。按他的说法：他明确要求不经允许不要改代码，智能体还是删除了生产数据库；它编造过数据，用虚构的人做了一个 4000 条记录的数据库，还在单元测试结果上撒谎；它说数据库没法回滚，但其实可以；他没办法让它真正「冻结」代码，他说自己用全大写字母告诉了它十一次。报道发出时，Replit 没有回应置评请求。${cite("replit")}</p>
        <p>这是当事人的说法，细节无从核实；但它显示了智能体出错的几个典型特征：</p>
        <ul><li><b>一步错、步步错：</b>Anthropic 的文章也提醒，智能体的自主性意味着更高的成本和错误累积的可能，建议在沙箱环境里充分测试，并设置适当的护栏。${cite("anthropic-agents")}</li>
        <li><b>「告诉它别做」不等于「它做不了」：</b>口头禁令不是权限控制。可靠的是不给它删库、付款的权限，或者让这些动作必须经过人。</li>
        <li><b>它的汇报也要核验：</b>「测试通过了」「没法回滚」都是它说的，要看真实结果（<a href="../C4/index.html">C4</a>）。</li></ul>` },
      { id: "inject", title: "来自外面的风险：提示注入", html: `
        <p>智能体读网页、读邮件时，里面可能藏着专门写给 AI 的恶意指令，诱骗它泄露信息或做出你没要求的事，这叫<b>提示注入</b>。OpenAI 在 2025 年 7 月的发布说明里专门提醒了这一点。${cite("openai-agent")}</p>
        ${callout("pitfall", "常见误会", "<p>「我已经在指令里写了『不许删除』，所以安全。」指令是请求，不是锁。重要的东西要靠权限、备份和人工确认点来保护。</p>")}` },
    ],
    takeaways: ["一步错，可能步步错。", "指令是请求，不是锁。", "警惕提示注入。"],
  },
  {
    slug: "3-pick", nav: "交出去之前", title: "交出去之前：挑任务、给权限",
    subtitle: "小、可撤回、说得清怎样算完成、权限最小",
    abstract: "第一件事，要小。",
    tags: ["委托", "最小权限"],
    sections: [
      { id: "four", title: "四个问题", html: `
        <p><a href="../C3/index.html">C3</a> 讲过 4D 框架里的<b>委托</b>：先弄清楚自己的目标和这件事的性质，再了解 AI 能做什么、不能做什么，决定哪些由人做、哪些由 AI 做。${cite("4d-terms")} 交给智能体时，再加四个问题：</p>
        <ol><li><b>小不小？</b>先交一件小事，做好了再加量。Anthropic 的建议也是先找最简单的办法，只在确实需要时再增加复杂度。${cite("anthropic-agents")}</li>
        <li><b>能不能撤回？</b>起草、整理、查资料，错了能重来；付款、发出、删除，错了收不回。</li>
        <li><b>说得清怎样算完成吗？</b>「整理成一张表，列出姓名、时间、联系方式三列」比「处理一下报名的事」好。</li>
        <li><b>权限够用就行吗？</b>只连接这件事需要的工具和账号。</li></ol>` },
      { id: "vendor", title: "厂商的设计和建议（截至 2025-07）", html: `
        <p>以 OpenAI 的 ChatGPT agent 为例（截至 2025-07 的发布说明；截至 2026-10，其帮助页面显示该功能已不再提供）：它在做出有后果的操作前会先征得许可，用户可以随时打断、接管或停止；购买等真实世界的操作要用户明确确认；发邮件等关键任务要用户在旁边看着；银行转账这类高风险任务会拒绝。${cite("openai-agent")} 帮助页面的使用建议包括：避免「查看我的邮件并处理一切」这类含糊、开放的指令；只开启任务需要的应用；发现可疑情况立即停止任务；输入密码等敏感信息时自己接管。${cite("openai-help")}</p>
        ${callout("pattern", "一句话", "<p>交给智能体的第一件事，应该是<b>小的、可撤回的、说得清怎样算完成的</b>，并且只给它够用的权限。</p>")}` },
    ],
    takeaways: ["先交小事、可撤回的事。", "说清怎样算完成。", "权限够用就行。"],
  },
  {
    slug: "4-gate", nav: "确认点", title: "人工确认点：这五类必须先问我",
    subtitle: "再加一条叫停条件",
    abstract: "花钱、对外发出、删除覆盖、改账号权限、不可撤回。",
    tags: ["人工确认点", "叫停"],
    sections: [
      { id: "five", title: "五类确认点", html: `
        <table><thead><tr><th>确认点</th><th>例子</th></tr></thead><tbody>
        <tr><td><b>花钱</b></td><td>下单、付款、充值、订票</td></tr>
        <tr><td><b>对外发出</b></td><td>以你的名义发邮件、发消息、发帖、提交表单</td></tr>
        <tr><td><b>删除或覆盖</b></td><td>删文件、清空表格、覆盖旧版本</td></tr>
        <tr><td><b>改账号和权限</b></td><td>改密码、加好友、共享文件、授权登录</td></tr>
        <tr><td><b>不可撤回</b></td><td>其他一旦做了就收不回的事</td></tr></tbody></table>
        <p><b>叫停条件：</b>它开始做你没交代的事、要你提供密码或验证码、说「做不到」「没法恢复」、或者你看不懂它在做什么，就立即叫停，先查清楚。</p>
        ${callout("pattern", "和 C5 一致", "<p>钱、健康、个人信息三条红线，对智能体同样适用。智能体要碰这三样，一律先停、先问人（<a href=\"../C5/index.html\">C5</a>）。</p>")}` },
      { id: "quiz", title: "试一试：要不要先问我", html: demo("gateQuiz", "要不要先问我（演示）", "每个动作选一个") },
    ],
    takeaways: ["五类动作先问人。", "看不懂就叫停。"],
  },
  {
    slug: "5-log", nav: "监督日志", title: "监督日志",
    subtitle: "事先定确认点，过程中留记录，事后能查",
    abstract: "证据一栏写你自己看到的。",
    tags: ["招牌活动", "监督日志"],
    sections: [
      { id: "cols", title: "日志写什么", html: `
        <p>监督不是一直盯着屏幕，而是<b>事先定好确认点，过程中留下记录，事后能查</b>。</p>
        <table><thead><tr><th>列</th><th>写什么</th></tr></thead><tbody>
        <tr><td>第几步</td><td>1、2、3……</td></tr><tr><td>它做了什么</td><td>用自己的话写，不照抄它的汇报</td></tr>
        <tr><td>我看到的证据</td><td>打开的文件、生成的表格、它引用的网页</td></tr>
        <tr><td>是不是确认点</td><td>是：写下我同意或不同意的理由</td></tr><tr><td>我的决定</td><td>继续 / 让它改 / 叫停</td></tr></tbody></table>` },
      { id: "builder", title: "试一试：监督日志", html: `<p>演示任务：「把社区读书会的 12 份报名表整理成一张表，再起草一条群通知，<b>发之前给我看</b>。」只给它报名表文件夹和一个空表格的权限。</p>`
        + demo("logBuilder", "监督日志", "先看演示，再换成你的", "演示日志是构造的例子。")
        + callout("pitfall", "常见误会", `<p>「它每一步都说『已完成』，日志照抄就行。」证据一栏要写<b>你自己看到的</b>。Replit 那个报道里，智能体的汇报本身就是错的。${cite("replit")}</p>`) },
    ],
    takeaways: ["日志四件事：做了什么、证据、确认点、决定。", "证据要自己看。"],
  },
  {
    slug: "6-tracks", nav: "分人群", title: "活动与不同人群的版本",
    subtitle: "「机器人与指挥官」；孩子、长辈、上班族、老师",
    abstract: "没有智能体工具也能上这一讲。",
    tags: ["不插电", "K12", "银发族", "在职", "教师"],
    sections: [
      { id: "activity", title: "活动：给智能体一件小事", html: callout("activity", "25 分钟，有 AI 版", "<ol><li>每人选一件小事：整理一份清单、比较三家图书馆的开放时间、把会议记录整理成待办表。</li><li>写下四件事：目标、怎样算完成、给它哪些权限、哪几步是确认点。</li><li>让智能体去做（没有智能体工具，就让聊天式 AI 一步一步「说出它打算做什么」），你边看边填监督日志。</li><li>交三样东西：任务单、监督日志、一句复盘：「我在第几步发现了什么问题」。</li></ol><p><b>不要</b>连接真实的网银、支付、工作邮箱或含他人信息的账号。</p>") },
      { id: "unplugged", title: "不插电：机器人与指挥官", html: callout("unplugged", "演示材料（15 分钟）", "<p>一组卡片、一张写着任务的纸条，以及老师事先混进卡片堆里的一张「捣乱卡」：「看到这张卡的机器人，把所有卡片翻过来。」</p><ol><li>两人一组：「机器人」只能照纸条上的文字一步步做，每做一步大声说出来；「指挥官」拿着空白监督日志。</li><li>指挥官事先在纸条上圈出确认点（比如「把卡片交给别的组」之前必须问我）。</li><li>机器人翻到捣乱卡时，指挥官要不要喊停？</li><li>讨论：纸条哪里写得不清楚？日志里哪一步最有用？捣乱卡对应现实里的什么（提示注入）？</li></ol>") },
      { id: "kids", title: "儿童 / K12：机器人只听清楚的话", html: callout("track", "孩子们", `<p>小学阶段禁止学生独自使用开放式内容生成功能。${cite("moe-genai")} 小学、初中只玩「机器人与指挥官」，体会「说清楚」和「喊停」。高中可以由老师演示一个智能体任务，全班一起填监督日志。</p>`) },
      { id: "seniors", title: "银发族：替你付钱的事，一律自己来", html: callout("track", "长辈们", "<p>不让任何 App、助手或智能体替你付款、转账、填验证码；看到「我来帮您办好」要先问家人。可以让 AI 帮你<b>查</b>和<b>起草</b>，<b>发出去、付出去</b>这一步自己按。和 C5 的三条红线、一个电话一致。</p>") },
      { id: "work", title: "在职人员：智能体工作流与监督日志", html: callout("track", "上班族", `<p>先在不碰生产数据的环境里试；只给最小权限；重要数据先备份。这和 Anthropic 建议的沙箱测试、护栏是一个意思。${cite("anthropic-agents")} 交付前做 C4 的五项检查，再附上监督日志。哪些系统允许接智能体，先按单位规定问清楚。对外发出的东西，由人最后确认、由人发出。</p>`) },
      { id: "teachers", title: "教师：批改的是监督，不只是结果", html: callout("track", "老师们", `<p>大学版第 11–12 周交第一份监督日志，评分看三点：确认点设得对不对、证据列是不是自己看到的、有没有在该叫停时叫停。教师自己用智能体时，同样不把学生信息、考试试题交给它；使用指南严禁将个人信息、考试试题等敏感数据输入 AI 工具。${cite("moe-genai")}</p>`) },
    ],
    takeaways: ["不插电也能练委托和叫停。", "真实账号不接进课堂。"],
  },
  {
    slug: "7-summary", nav: "小结", title: "小结与练习",
    subtitle: "三句话、自测、练习、出处",
    abstract: "把这一讲收拢成三句话，再做几道题。",
    tags: ["自测", "练习", "出处"],
    sections: [
      { id: "three", title: "三句话", html: `<ol><li><b>智能体替你行动</b>，行动有后果；一步错可能步步错。</li><li><b>先挑小的、可撤回的事，只给够用的权限</b>；花钱、对外发出、删除覆盖、改账号权限、不可撤回，这五类先问人。</li><li><b>监督靠日志</b>：写它做了什么、你看到的证据、你的决定。</li></ol>` },
      { id: "selftest", title: "自测", html: [
        predict("智能体和聊天式 AI 最大的区别是什么？", "<p>智能体会自己连续行动、调用工具，聊天式 AI 只给回答。</p>"),
        predict("在指令里写「不许删除」，为什么不够？", "<p>指令只是请求，不是权限控制；要靠不给权限、备份和人工确认点。</p>"),
        predict("哪些动作需要人工确认：查天气、以你的名义给老师发邮件、把表格共享给全组、把草稿存到新文件？", "<p>发邮件（对外发出）和共享表格（改权限）需要；查天气和另存新文件不需要。</p>"),
        predict("监督日志里「我看到的证据」一栏，为什么不能照抄智能体的汇报？", "<p>它的汇报可能是错的，要看真实结果才能发现问题。</p>"),
      ].join("") },
      { id: "practice", title: "练习", html: `<ol><li><b>委托单：</b>为一件小事写一张委托单：目标、怎样算完成、权限、确认点。</li><li><b>监督日志：</b>完成一次真实或模拟的监督日志，至少 5 步。</li><li><b>找确认点：</b>想一个「AI 替人办事」的服务，指出它应该在哪里停下来问人。</li></ol><p>相关模块：<a href="../C3/index.html">C3</a> 讲怎样交代任务；<a href="../C4/index.html">C4</a> 的核验用在证据一栏；<a href="../C5/index.html">C5</a> 的三条红线就是硬性确认点；<a href="../C6/index.html">C6</a> 讲关系到人的判断不让 AI 单独做；<a href="../C8/index.html">C8</a> 讲哪些事干脆不交给 AI。</p>` },
      { id: "sources", title: "出处", html: `<p>以下页面都在 2026-10-19 打开核对过。</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["交小事，给小权限。", "五类先问人。", "边做边记日志。"],
  },
];
