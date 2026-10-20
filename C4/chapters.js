// C4 各章内容，改写自 notes/C4-verify.md（讲义为准；改讲义后同步这里）。出处和讲义脚注一一对应。

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "先猜一猜", `<p>${q}</p><details class="reveal"><summary>看答案</summary>${a}</details>`);

// 出处（同讲义脚注，访问于 2026-10-19）。
const SOURCES = [
  ["bard", "James Vincent, “Google’s AI chatbot Bard makes factual error in first demo”, The Verge, 2023-02-08", "https://www.theverge.com/2023/2/8/23590864/google-ai-chatbot-bard-mistake-error-exoplanet-demo"],
  ["mata", "“Mata v. Avianca, Inc.”, Wikipedia", "https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc."],
  ["aircanada", "“Moffatt v. Air Canada”（2024 BCCRT 149）, Wikipedia", "https://en.wikipedia.org/wiki/Moffatt_v._Air_Canada"],
  ["baotou", "《AI诈骗上热搜！长相声音都对，“换脸”的“朋友”骗了他430万…》，澎湃新闻，2023-05-24", "https://www.thepaper.cn/newsDetail_forward_23206576"],
  ["baotou-tip", "《10分钟被骗走430万！小心AI换脸新型诈骗手段》，平安包头，2023-05-20（安全内参转载）", "https://www.secrss.com/articles/54863"],
  ["everest", "《8848.86米 珠峰新高程》，人民日报，新华网转载，2020-12-09", "https://www.xinhuanet.com/politics/2020-12/09/c_1126837804.htm"],
  ["everest-gov", "《习近平同尼泊尔总统班达里互致信函 共同宣布珠穆朗玛峰高程》，新华社，中国政府网，2020-12-08", "https://www.gov.cn/xinwen/2020-12/08/content_5568012.htm"],
  ["moe-genai", "教育部基础教育教学指导委员会《中小学生成式人工智能使用指南（2025年版）》（学校网站转载全文）", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["plan2026", "教育部等五部门《“人工智能+教育”行动计划》（教科信〔2026〕1号），中国政府网", "https://www.gov.cn/zhengce/zhengceku/202604/content_7065138.htm"],
  ["4d", "Anthropic, “AI Fluency: Framework & Foundations”", "https://anthropic.skilljar.com/ai-fluency-framework-foundations"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C4",
  badge: "核心模块",
  title: "核验",
  tagline: "AI 说的，怎么知道对不对",
  lead: "AI 很会说话：通顺、笃定、格式漂亮。可是说得好不等于说得对。这一讲教你花几分钟判断 AI 的回答靠不靠谱：该查的会查，查不清的知道去问谁。",
  heroDemo: "heroCheck",
  heroLabel: "核验三步：AI 说 → 用哪招 → 结论（演示）",
  heroCaption: "这些「AI 回答」是为教学构造的演示。",
  whyTitle: "为什么要学核验",
  whySub: "人人会用、人人会验、人人知道何时不用：这一讲是中间那个「验」",
  why: [
    ["AI 会一本正经地说错", "错误看起来不像错误，常常藏在年份、数字、出处这些细节里。"],
    ["责任在用的人", "律师被罚款，航空公司被判赔偿：都没法把责任推给 AI。"],
    ["五招就够用", "问来源、交叉核对、自己算、找反例、问人。按风险挑着用。"],
  ],
  ctaTitle: "准备好给 AI 的回答「验个货」了吗？",
  minutes: "约 60–90 分钟",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-why", nav: "为什么会错", title: "AI 为什么会一本正经地说错",
    subtitle: "四个真实的例子，和一句话的原理",
    abstract: "说得好不等于说得对。先看几次真实发生过的「说错」，再看它为什么会这样。",
    tags: ["真实案例", "幻觉", "责任"],
    hero: "toc",
    sections: [
      { id: "cases", title: "四个真实的例子", html: `
        <p><b>例一：第一张系外行星照片。</b>2023 年 2 月，谷歌发布聊天机器人 Bard 时放出一段演示：有人问韦布太空望远镜有哪些新发现可以讲给 9 岁的孩子听，Bard 的回答里说韦布望远镜「拍下了太阳系外行星的第一张照片」。天文学家指出，第一张系外行星照片是 2004 年拍到的。${cite("bard")}</p>
        <p><b>例二：编出来的判例。</b>美国 Mata v. Avianca 一案中，原告律师用 ChatGPT 帮忙写法律文书，引用的多个判例根本不存在。律师再问 ChatGPT，它还「保证」这些案子确实存在。2023 年 6 月，法官对相关律师处以 5000 美元罚款。${cite("mata")}</p>
        <p><b>例三：客服机器人许下的退款。</b>加拿大航空网站上的 AI 客服告诉一位刚失去祖母的乘客：可以先全价买票，事后申请丧亲优惠退差价。航空公司拒绝退款，还主张机器人「对自己的行为负责」。2024 年 2 月，仲裁庭驳回这个说法，判航空公司赔偿。${cite("aircanada")}</p>
        <p><b>例四：视频里的「好友」。</b>2023 年 4 月，福州一家科技公司的负责人接到「好友」的微信视频，在视频里「确认了面孔和声音」后转出 430 万元；事后打电话给好友本人，才发现对方是 AI 换脸和拟声伪造的。警方紧急止付拦下了大部分资金。${cite("baotou")}</p>
        ${callout("pitfall", "AI 说「我确定」不等于确定", "<p>例二里律师问 ChatGPT「这些判例是真的吗」，它说「是」。<b>用同一个 AI 来核验它自己的话，不算核验。</b>一定要跳出这段对话，找对话之外的证据。</p>")}` },
      { id: "why", title: "为什么会这样", html: `
        <p>一句话：<b>聊天 AI 的本职是「接着往下写出最像样的话」，不是「先查证再回答」。</b>大多数时候最像样的话恰好是对的；但在它没见过、记混了或已经过时的地方，它照样写得通顺、笃定。这种错误常被叫做<b>幻觉</b>（C2 细讲）。</p>
        <ul><li><b>看起来不像错：</b>语气和对的回答一模一样。</li>
        <li><b>错在细节：</b>年份、数字、人名、出处、「第一个」「所有」。</li>
        <li><b>责任在用的人：</b>例二、例三都没法把责任推给 AI。</li></ul>
        ${predict("三件事你会怎样处理 AI 的回答？(a) 给小狗起十个名字；(b) 总结一篇新闻准备转发到家庭群；(c) 问某种药能不能和降压药一起吃。", "<p>(a) 绿灯，不必查；(b) 黄灯，转发前找原始新闻核对；(c) 红灯，问医生或药师。下一章讲怎么判断。</p>")}` },
    ],
    takeaways: ["AI 的错看起来不像错，常错在细节。", "用同一个 AI 核验它自己，不算核验。", "出了错，责任在用 AI 的人和机构。"],
  },
  {
    slug: "2-lights", nav: "信号灯", title: "先判断：要查到什么程度",
    subtitle: "如果 AI 说错了，会怎样？",
    abstract: "不是每句话都要查。按「错了的后果」分成绿、黄、红三档，决定花多少力气。",
    tags: ["绿灯", "黄灯", "红灯"],
    sections: [
      { id: "table", title: "三个信号灯", html: `
        <table><thead><tr><th>信号灯</th><th>错了的后果</th><th>例子</th><th>怎么做</th></tr></thead><tbody>
        <tr><td><span class="lamp g"></span>绿灯</td><td>没什么损失</td><td>起名字、写祝福语、想点子</td><td>不必查</td></tr>
        <tr><td><span class="lamp y"></span>黄灯</td><td>会出丑、误导别人、耽误事</td><td>学习资料、工作报告、要转发的消息</td><td>至少用一招核验关键事实</td></tr>
        <tr><td><span class="lamp r"></span>红灯</td><td>伤到钱、健康、法律责任、安全</td><td>转账、用药、合同、正式材料</td><td>必须核验，而且一定要问人</td></tr>
        </tbody></table>
        ${callout("pattern", "一句话", "<p>越要紧，越要查；最要紧的，一定问人。</p>")}` },
      { id: "try", title: "试一试：给 8 件事定级", html: demo("lights", "信号灯", "点选每件事的信号灯", "这是建议，不是标准答案：同一件事，后果不同，定级也可以不同。") },
    ],
    takeaways: ["先问「错了会怎样」，再决定查不查。", "黄灯：至少核验关键数字、日期、出处。", "红灯：钱、健康、法律、安全，必须问人。"],
  },
  {
    slug: "3-five", nav: "五招", title: "核验五招",
    subtitle: "问来源 · 交叉核对 · 自己算 · 找反例 · 问人",
    abstract: "五招不必每次全用。黄灯挑一两招，红灯多用几招，而且第五招必用。",
    tags: ["问来源", "交叉核对", "自己算", "找反例", "问人"],
    sections: [
      { id: "source", title: "第一招：问来源", html: `<p>让 AI 说出根据，然后<b>亲自打开</b>来源，看它是否存在、是否真这么说。打不开、查不到：<b>不等于错，但不能用</b>，记作「未核实」。来源也可能是编的（例二）。</p>` },
      { id: "cross", title: "第二招：交叉核对", html: `<p>找<b>至少两个彼此独立、靠谱的来源</b>，优先找源头：政府网站原文件、机构公告、教材、正规媒体原始报道。</p><p>两个「假交叉」：换一个 AI 再问一遍（可能一起错）；几篇文章互相转载（等于一个来源）。</p>` },
      { id: "calc", title: "第三招：自己算一遍", html: `<p>有<b>数字、日期、单位、百分比、价格</b>就自己算，计算器、日历都行。先弄清规则（先打折还是先用券），规则不清楚本身就要问。</p>` },
      { id: "counter", title: "第四招：找反例", html: `<p>看到<b>「第一个」「唯一」「所有」「从来不」「一定」</b>，就找一个反例；找到一个，这句话就不成立。例一的「第一张照片」就是这样被推翻的。${cite("bard")}</p>` },
      { id: "ask", title: "第五招：问人", html: `<p>问懂行的人：医生、药师、律师、老师、银行柜台。<b>换一个渠道</b>问：视频里「熟人」说的，挂断后用自己存的号码打回去。警方的提示也是：转账前通过电话、见面等多种渠道核验身份，被骗立即拨打 96110 报警。${cite("baotou-tip")}</p>
        ${callout("pattern", "口诀", "<p><b>一问来源二对照，三算数字四反例，五要问人别忘掉。</b></p>")}
        ${predict("例三的乘客，可以用哪一招提前发现问题？", `<p>交叉核对：航空公司网站上另有一页写着丧亲优惠的正式政策，和机器人的说法对不上。或者第五招：打客服电话问清楚。${cite("aircanada")}</p>`)}` },
    ],
    takeaways: ["查不到 = 未核实，不能用，但不等于错。", "换一个 AI 再问，不算交叉核对。", "红灯的事，第五招「问人」必用，而且要换渠道。"],
  },
  {
    slug: "4-demo", nav: "走一遍", title: "走一遍：两次完整的核验",
    subtitle: "过时的数字，算错的账（都是演示）",
    abstract: "两个构造的例子：AI 的回答是编出来示范错误类型的，核对用的资料是真的。",
    tags: ["演示", "过时", "自己算"],
    sections: [
      { id: "everest", title: "演示一：过时的数字", html: callout("demo", "演示", `<p>假设你问 AI「珠穆朗玛峰有多高？」，AI 答「8844.43 米」（构造的回答）。</p>
        <ol><li><b>定级：</b>写作业用，黄灯。</li>
        <li><b>交叉核对：</b>人民日报报道（新华网转载）写着：1975 年测得 8848.13 米；2005 年测得峰顶岩石面 8844.43 米；2020 年 12 月 8 日中尼共同宣布最新高程 8848.86 米。${cite("everest")} 中国政府网的新华社电讯也写明「最新高程为8848.86米」。${cite("everest-gov")}</li>
        <li><b>结论：</b>不是错得离谱，而是<b>过时</b>了。写「8848.86 米（2020 年中尼共同宣布）」。</li>
        <li><b>学到的：</b>「最新」「现在」「今年」的问题尤其要查。</li></ol>`) },
      { id: "price", title: "演示二：算错的账", html: callout("demo", "演示", `<p>假设你问 AI「260 元的外套打八折，再用满 200 减 30 的券，最后付多少？」，AI 答「182 元」（构造的回答）。下面的小工具把两种规则都算出来，你也可以改数字。</p>`) + demo("calc", "自己算一遍", "改原价、折扣或券，看结果") },
    ],
    takeaways: ["AI 的知识有截止时间，会给出过时的数字。", "算之前先问清规则。", "核验结论要写明用了哪份资料。"],
  },
  {
    slug: "5-log", nav: "记录表", title: "核验记录表",
    subtitle: "查了什么、在哪查的、结论是什么",
    abstract: "核验做了就要留下记录：自己能复查，别人能看懂，大学版和在职版里它是要交的作业。",
    tags: ["记录", "四种结论"],
    sections: [
      { id: "fill", title: "在这里填（只存在你的浏览器里）", html: demo("logSheet", "核验记录表", "可以加行、下载 CSV") + callout("pitfall", "查不到要写「未核实」，不要写「错」", "<p>结论只有四种：对、错、过时、未核实。</p>") },
    ],
    takeaways: ["每条记录写清：原话、信号灯、哪一招、证据、结论。", "证据要让别人能找到：链接、书名页码、问了谁。", "结论只有四种：对、错、过时、未核实。"],
  },
  {
    slug: "6-challenge", nav: "找错挑战", title: "找错挑战",
    subtitle: "六张 AI 回答卡，你能抓到几个错？",
    abstract: "六张卡都是构造的演示，所有问题都能靠自己算、找反例、看前后是否一致查出来，不需要上网。",
    tags: ["课堂活动", "不插电"],
    sections: [
      { id: "play", title: "挑战", html: callout("activity", "玩法", "<p>课堂上 3–4 人一组：10 分钟判断并在记录表上写证据，10 分钟互相挑战，5 分钟公布答案。结论对 1 分，证据清楚加 1 分，能说出以后怎么防再加 1 分。</p>") + demo("challenge", "六张卡（演示）", "每张选一个结论") },
      { id: "unplugged", title: "不插电版本", html: callout("unplugged", "没有网络、没有设备也能玩", `<p>准备 12 张「AI 说」卡（约三分之一藏错）和 5 种「证据」卡：计算器、日历、字典 / 课本、找反例、问专家（老师扮演，只答「是 / 不是 / 我需要看原文」）。每组抽 3 张，先定信号灯，再决定打哪张证据卡；每张证据卡每局只能用一次，「问专家」全组只有一张。练的是「先定级、再选招」。</p>`) },
    ],
    takeaways: ["核验看的是理由，不是运气。", "也有对的卡：核验不是认定 AI 全错。", "证据卡有限，正像现实里时间有限。"],
  },
  {
    slug: "7-tracks", nav: "分人群", title: "不同人群的版本",
    subtitle: "孩子、长辈、上班族、老师",
    abstract: "核心方法对所有人一样，例子、深度和重点按人群调整。",
    tags: ["K12", "银发族", "在职", "教师"],
    sections: [
      { id: "kids", title: "儿童 / K12：AI 小侦探", html: callout("track", "三招就够", `<p>问「你怎么知道的？」、算一算、问大人。《中小学生成式人工智能使用指南（2025年版）》规定小学阶段禁止学生独自使用开放式内容生成功能，教师可在课内适当使用；还提醒学生不要在查阅教材或权威资料之前贸然用 AI 获取信息。${cite("moe-genai")} 所以小学用打印好的 AI 回答卡：老师操作 AI，孩子当侦探。</p>`) },
      { id: "seniors", title: "银发族：三条红线，一个电话", html: callout("track", "三条红线", `<p>钱、健康、个人信息。碰到这三样，AI 说的、视频里「熟人」说的、群里转的，都先核验。</p><p><b>一个电话：</b>挂断，用自己存的号码打回去问本人；拿不准问子女或社区；可疑就拨打 96110。${cite("baotou-tip")} 健康问题，AI 的回答只当作看病时可以问医生的问题清单。</p>`) },
      { id: "workers", title: "在职：交出去之前的五项检查", html: callout("track", "五项检查", `<ol><li>数字：能指出来源，复算过。</li><li>引用：每条都亲自打开核对过原文。${cite("mata")}</li><li>名字和日期：逐一核对。</li><li>能运行的东西：代码、公式实际跑过。</li><li>对外承诺：以公司正式文件为准，机构要为自己的机器人负责。${cite("aircanada")}</li></ol>`) },
      { id: "teachers", title: "教师：教核验，也评核验", html: callout("track", "评分量规（核验记录表）", `<p>四个维度各 3 档：选对要查的句子；用对了招；证据可追溯；结论措辞准确。</p><p>使用指南写明，教师不得把生成式 AI 作为替代性教学主体，禁止直接用 AI 回答学生问题，避免直接用 AI 生成的内容评价学生，严禁把个人信息、考试试题等敏感数据输入 AI 工具。${cite("moe-genai")} 《“人工智能+教育”行动计划》（教科信〔2026〕1号）提出制定教师智能素养标准、把人工智能纳入教师资格考试和认证内容。${cite("plan2026")}</p>`) },
    ],
    takeaways: ["孩子：老师操作 AI，孩子当侦探。", "长辈：钱、健康、个人信息，挂断再打回去。", "上班族和老师：留痕，让「怎么查的」被看见。"],
  },
  {
    slug: "8-summary", nav: "小结", title: "小结与练习",
    subtitle: "三句话、自测、练习、出处",
    abstract: "把这一讲收拢成三句话，再做几道题。",
    tags: ["自测", "练习", "出处"],
    sections: [
      { id: "selftest", title: "自测", html: [
        predict("AI 给的链接打开是空页面，结论写什么？", "<p>未核实：不能用，但不能断定是错。</p>"),
        predict("用两个不同的 AI 问同一个问题，答案一样，算交叉核对吗？", "<p>不算。它们可能学过同样的错误材料；要找对话之外的独立来源。</p>"),
        predict("「某某是全国第一个……」最适合先用哪一招？", "<p>找反例，再交叉核对。</p>"),
        predict("家里老人收到「孙子」的视频，说急需用钱。第一步做什么？", "<p>挂断，用自己存的号码打给孙子本人或家人确认，不要先转账。</p>"),
      ].join("") },
      { id: "practice", title: "练习", html: `<ol><li>找一条最近在家庭群或朋友圈看到的「据说」消息，填一行核验记录表。</li><li>让 AI 回答一个你专业或工作里的问题，挑 3 个关键事实，用至少两招核验。</li><li>回想一次「信了、后来发现不对」的经历：当时用哪一招能早点发现？</li></ol>` },
      { id: "frameworks", title: "和国际框架的对应", html: `<p>Anthropic 与 University College Cork、Ringling College 的学者合作的 AI Fluency 课程把能力分成 4D：Delegation、Description、Discernment、Diligence。${cite("4d")} 本讲的核验五招对应辨别（Discernment），核验记录表和「责任在用的人」对应尽责（Diligence）。</p>` },
      { id: "sources", title: "出处", html: `<p>以下页面都在 2026-10-19 打开核对过。</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["AI 会一本正经地说错；用它自己核验它不算数。", "先定信号灯，红灯一定问人。", "五招 + 记录表；结论分对、错、过时、未核实。"],
  },
];
