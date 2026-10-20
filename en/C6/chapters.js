// C6 chapters, English edition. Adapted from notes/en/C6-fairness-ethics-work.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C6/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["amazon", "Jeffrey Dastin, “Amazon scraps secret AI recruiting tool that showed bias against women”, Reuters, reposted by CNBC, 2018-10-10", "https://www.cnbc.com/2018/10/10/amazon-scraps-a-secret-ai-recruiting-tool-that-showed-bias-against-women.html"],
  ["gendershades", "Larry Hardesty, “Study finds gender and skin-type bias in commercial artificial-intelligence systems”, MIT News, 2018-02-11 (Buolamwini & Gebru, FAT* 2018)", "https://news.mit.edu/2018/study-finds-gender-skin-type-bias-artificial-intelligence-systems-0212"],
  ["ailit-fw", "European Commission & OECD, “AILit Framework”, Frameworks page (knowledge item 2.5; ©2026 OECD, all rights reserved, so only briefly paraphrased here)", "https://ailiteracyframework.org/frameworks/"],
  ["genai-rules", "Cyberspace Administration of China and six other departments, 《生成式人工智能服务管理暂行办法》 Interim Measures for the Management of Generative AI Services (Order No. 15), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/202307/content_6891752.htm"],
  ["algo-rules", "Cyberspace Administration of China and three other departments, 《互联网信息服务算法推荐管理规定》 Provisions on the Management of Algorithmic Recommendations in Internet Information Services (Order No. 9), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/2022-01/04/content_5666429.htm"],
  ["ai-plus", "State Council (China), 《关于深入实施“人工智能+”行动的意见》 Opinions on Deepening the “AI+” Initiative (国发〔2025〕11号), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/202508/content_7037862.htm"],
  ["bj-ai-image", "Beijing Internet Court, civil judgment (2023)京0491民初11279号, 2023-11-27, full text on Chinese Wikisource (in Chinese)", "https://zh.wikisource.org/zh-hans/%E5%8C%97%E4%BA%AC%E4%BA%92%E8%81%94%E7%BD%91%E6%B3%95%E9%99%A2%EF%BC%882023%EF%BC%89%E4%BA%AC0491%E6%B0%91%E5%88%9D11279%E5%8F%B7%E6%B0%91%E4%BA%8B%E5%88%A4%E5%86%B3%E4%B9%A6"],
  ["bj-ai-debate", "Zheng Ziyu and Xie Ruirui, 《人工智能（AI）著作权第一案判决后仍存诸多异议》 “Many objections remain after the judgment in China’s first AI copyright case”, Jiefang Daily, reposted by China Economic Net (in Chinese), 2024-01-17", "http://www.ce.cn/xwzx/fazhi/202401/17/t20240117_38869650.shtml"],
  ["usco", "U.S. Copyright Office, “Copyright and Artificial Intelligence” (Part 2 of the report published 2025-01-29)", "https://www.copyright.gov/ai/"],
  ["gz-ultraman", "Wang Jun and Feng Liange, 《独家丨AI画出奥特曼：中国法院作出全球首例生成式AI服务侵犯著作权的生效判决》 “AI draws Ultraman: a Chinese court’s effective judgment that a generative AI service infringed copyright”, 21st Century Business Herald (in Chinese), 2024-02-26", "https://www.21jingji.com/article/20240226/herald/133a6c2f9c0b045899e4dea10c5778eb.html"],
  ["ilo2025", "ILO, “One in four jobs at risk of being transformed by GenAI, new ILO–NASK Global Index shows”, 2025-05-20", "https://www.ilo.org/resource/news/one-four-jobs-risk-being-transformed-genai-new-ilo%E2%80%93nask-global-index-shows"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学生成式人工智能使用指南（2025年版）》 Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["ai-label", "Cyberspace Administration of China and three other departments, 《人工智能生成合成内容标识办法》 Measures for Labelling AI-Generated and Synthesised Content (国信办通字〔2025〕2号), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/202503/content_7014286.htm"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C6",
  badge: "Shared core module",
  title: "Fairness, ethics and work",
  tagline: "How to test for bias, who owns AI’s output, how my work will change",
  lead: "AI helps screen CVs, recognise faces, set prices, draw pictures and write text, and its judgements land on real people. This module asks three questions: Is AI fair? Who owns what AI makes? How will AI change my work? Each comes with a check you can do yourself.",
  heroDemo: "heroAudit",
  heroLabel: "Change just one thing (Demo)",
  heroCaption: "The two requests differ in one attribute; every other word is identical. The requests are made up for teaching.",
  whyTitle: "Why this module matters",
  whySub: "AI’s judgements land on people",
  why: [
    ["Bias isn’t necessarily intentional", "Amazon’s recruiting program learned to penalise “women’s” from 10 years of CVs that came mostly from men."],
    ["Copyright is still case by case", "A Chinese court has recognised the person using AI as an author, and another held a platform liable for infringing images."],
    ["A job is a set of tasks", "The research talks about jobs that “may be affected”; most will be transformed, not replaced."],
  ],
  ctaTitle: "Ready to run a bias audit?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-amazon", nav: "Real case", title: "A recruiting program that learned to be biased",
    subtitle: "Amazon’s experimental recruiting tool, as reported by Reuters",
    abstract: "Nobody wrote a rule saying “no women”. Where did it learn that?",
    tags: ["Real case", "Recruiting"],
    hero: "toc",
    sections: [
      { id: "story", title: "Penalising “women’s”", html: `
        ${callout("note", "About the examples", "<p>The Amazon recruiting tool, the face-recognition tests, the two AI copyright rulings and the ILO study all come from public reporting, papers and court judgments. Content marked “Demo” was made up for teaching and does not represent the real output of any particular AI product. <b>The copyright section is general knowledge, not legal advice.</b></p>")}
        <p>According to a 2018 Reuters report, Amazon set up a team in 2014 to build a program that reviewed CVs automatically and rated applicants from one to five stars. By 2015 the company realised it was not rating candidates for technical jobs such as software developer in a gender-neutral way. The cause was the training data: the program learned from CVs submitted over the previous 10 years, most of which came from men. So it learned to penalise CVs containing the word “women’s” (as in “women’s chess club captain”), and downgraded graduates of two all-women’s colleges.${cite("amazon")}</p>
        <p>Engineers edited the program to make it neutral to these terms, but that was no guarantee it wouldn’t find other ways to discriminate. The team was later disbanded. Reuters quoted people familiar with the matter as saying recruiters looked at its recommendations but never relied solely on its rankings. Amazon declined to comment.${cite("amazon")}</p>
        ${predict("Nobody wrote a rule telling the program “no women”. So where did it learn that from?", "<p>From the data: most past hires were men, so the program treated “looks like past hires” as “good”. Chapter 2 goes into detail.</p>")}` },
    ],
    takeaways: ["Bias can be learned from historical data.", "Editing a few words doesn’t guarantee it stops discriminating."],
  },
  {
    slug: "2-source", nav: "Where bias comes from", title: "Where bias comes from",
    subtitle: "Historical data, test populations, how it’s used",
    abstract: "Bias mostly comes from data and use, so it can be found, and fixed.",
    tags: ["Algorithmic bias", "Regulation"],
    sections: [
      { id: "three", title: "Three sources", html: `<ul>
        <li><b>The historical data is unbalanced.</b> In the Amazon example, most past hires were men, so the program treated “looks like past hires” as “good”.${cite("amazon")}</li>
        <li><b>The test population is incomplete.</b> In 2018, Joy Buolamwini and Timnit Gebru of the MIT Media Lab tested three companies’ face-based gender classification programs: for lighter-skinned men, error rates were never worse than 0.8%; for darker-skinned women, the three programs’ error rates were 20.8%, 34.5% and 34.7%. The study also noted that one major US company claimed accuracy of more than 97%, but its test data was more than 77% male and more than 83% white.${cite("gendershades")}</li>
        <li><b>How it’s used.</b> The same program used “for reference” and used “to make the final call” has completely different consequences.</li></ul>
        <p>The European Commission and OECD’s AILit framework also lists this as basic AI literacy: bias is inevitable in AI systems, and human choices can make it worse or reduce it.${cite("ailit-fw")}</p>
        ${callout("pattern", "In one line", "<p>Bias isn’t necessarily anyone’s intention; it mostly comes from <b>data and how systems are used</b>. That’s why it can be found, and fixed.</p>")}` },
      { id: "law", title: "China’s rules", html: `<ul>
        <li>Article 4 of China’s <i>Interim Measures for the Management of Generative AI Services</i> (Order No. 15) requires effective measures, in algorithm design, choice of training data, model generation and optimisation, and service provision, to prevent discrimination by ethnicity, belief, country, region, sex, age, occupation, health and so on.${cite("genai-rules")}</li>
        <li>Article 21 of the <i>Provisions on the Management of Algorithmic Recommendations</i> (Order No. 9): algorithms must not be used to apply unreasonable differential treatment in prices or other trading conditions based on consumers’ preferences, trading habits and similar characteristics; Article 17 requires an option not targeted at personal characteristics, or a convenient way to switch off algorithmic recommendations.${cite("algo-rules")}</li>
        <li>The State Council’s <i>Opinions on Deepening the “AI+” Initiative</i> (国发〔2025〕11号) call for guarding against risks from models’ black-box nature, hallucinations and algorithmic discrimination.${cite("ai-plus")}</li></ul>
        <p class="note"><i>China-specific rules. Elsewhere, anti-discrimination, consumer-protection and AI rules differ by country; look up the ones that apply where you live and work.</i></p>` },
    ],
    takeaways: ["Historical data, test populations and use can all introduce bias.", "China’s rules require preventing discrimination and unreasonable price differences."],
  },
  {
    slug: "3-audit", nav: "Bias audit", title: "Try it yourself: a bias audit",
    subtitle: "Change just one thing, try several times",
    abstract: "If you can’t open up the AI, test it from the outside.",
    tags: ["Signature activity", "Bias audit"],
    sections: [
      { id: "steps", title: "Five steps of an audit", html: `<ol>
        <li><b>Pick a scenario:</b> a task whose result lands on a person, such as writing a reference, assessing a CV or giving advice.</li>
        <li><b>Change just one thing:</b> prepare two to four requests that swap only one attribute (name, sex, age, region…).</li>
        <li><b>Try several times:</b> AI can answer differently each time (<a href="../C2/index.html">C2</a>), so ask each request at least three times and look at the overall tendency.</li>
        <li><b>Record it:</b> write down the adjectives, scores and suggestions exactly.</li>
        <li><b>Judge, and propose a fix:</b> is the difference linked to that attribute? If so, don’t leave the task to AI alone, or add a human review step.</li></ol>
        ${callout("demo", "Demo: an audit record (a made-up example)", "<table><thead><tr><th>Request (otherwise identical)</th><th>Words that recur across three answers</th><th>Suggestion given</th></tr></thead><tbody><tr><td>Daniel Smith, male, 35, accountant, 8 years’ experience</td><td>decisive, a natural leader, trustworthy</td><td>Could be head of finance</td></tr><tr><td>Diana Smith, female, 35, accountant, 8 years’ experience</td><td>careful, steady, conscientious</td><td>Suited to a bookkeeping role</td></tr></tbody></table><p><b>Judgement:</b> only the name and sex changed, yet the adjectives and the level of the suggested role changed too, consistently. <b>Fix:</b> remove sex, age and other irrelevant details before giving it to AI; hiring and promotion decisions are made by people.</p>")}` },
      { id: "sheet", title: "Try it: a bias audit record", html: demo("auditSheet", "Bias audit record", "Pick a scenario, change one thing, fill in three answers", "The request templates are made up; you can swap in your own scenario.")
        + callout("pitfall", "A common misunderstanding", "<p>“I tried it once and there was no difference, so there’s no bias.” Once proves nothing; equally, one difference may be random. Write the conclusion as “in these tests we found…”.</p>") },
    ],
    takeaways: ["Change just one thing; keep every other word the same.", "Ask each request at least three times and look at the tendency.", "Don’t leave judgements about people to AI alone."],
  },
  {
    slug: "4-copyright", nav: "Copyright", title: "Who owns what AI makes?",
    subtitle: "Two rulings, a debate, four habits",
    abstract: "As of 2026-10, still decided case by case.",
    tags: ["Copyright", "Labelling"],
    sections: [
      { id: "bj", title: "A Chinese ruling that recognised an author", html: `
        <p>On 27 November 2023, the Beijing Internet Court gave judgment in case (2023)京0491民初11279号: the plaintiff had generated an image with the Stable Diffusion model by repeatedly entering prompts and adjusting parameters, and posted it online; the defendant used it without permission and removed the signature watermark. The court held that the plaintiff had made an intellectual investment in conceiving the image, choosing the prompts, setting the parameters and selecting the result, that the image reflected his personal expression and was an artistic work, and that he held the copyright; the AI model itself cannot be an author. The judgment also said the plaintiff should clearly indicate AI was used (he had labelled it “AI illustration”), and stressed such questions must be judged case by case. The defendant was ordered to apologise and pay 500 yuan.${cite("bj-ai-image")}</p>
        <p><b>The debate continues.</b> This first-instance judgment was not appealed and is in force; but scholars such as Wang Qian of East China University of Political Science and Law are cautious, arguing that prompts only convey “ideas”, not the “expression” of a work. The same report mentions that the US Copyright Office had refused to register the AI-generated picture <i>Théâtre D’opéra Spatial</i>.${cite("bj-ai-debate")} On 29 January 2025 the US Copyright Office published a report (Part 2) on the copyrightability of AI-generated material.${cite("usco")}</p>` },
      { id: "gz", title: "A Chinese ruling that held a platform liable", html: `
        <p>According to a 21st Century Business Herald report of 26 February 2024, the Guangzhou Internet Court had recently issued a judgment, now in force: when users entered certain prompts, an AI image platform generated images substantially similar to the character Ultraman. The court found the platform had infringed the rights of reproduction and adaptation, required measures such as keyword filtering so ordinary prompts would not produce infringing images, and ordered it to pay 10,000 yuan; it also said providers should set up complaint mechanisms, warn of potential risks and add prominent labels.${cite("gz-ultraman")}</p>
        <p>Article 4 of China’s <i>Interim Measures for the Management of Generative AI Services</i> requires respect for intellectual property; Article 7 requires that training data must not infringe others’ intellectual property.${cite("genai-rules")} 国发〔2025〕11号 calls for data-property and copyright systems suited to AI.${cite("ai-plus")} <i>Copyright law differs by country; this is not legal advice.</i></p>` },
      { id: "rules", title: "Four habits when creating with AI", html: `<ol>
        <li><b>Say you used AI.</b> The Beijing court valued the label, and China’s labelling measures also require it (<a href="../C5/index.html">C5</a>).${cite("bj-ai-image")}${cite("ai-label")}</li>
        <li><b>Don’t have AI copy someone else’s work, character or style.</b> “Inspired by” and “copied from” are different.</li>
        <li><b>Don’t casually use other people’s work, including AI-generated work.</b> Removing a watermark or signature and using it anyway is infringement.</li>
        <li><b>Keep a record of your process:</b> prompts, how many rounds you revised, how you chose.</li></ol>`
        + demo("copyCheck", "OK or not? (Demo)", "Pick one for each scenario") },
    ],
    takeaways: ["The person using AI may be an author; the AI isn’t.", "Platforms that generate infringing content can be liable too.", "Label it, don’t copy, don’t misuse, keep a record."],
  },
  {
    slug: "5-work", nav: "My work", title: "How AI will change my work",
    subtitle: "May be affected ≠ job loss; a job is a set of tasks",
    abstract: "Break your job into tasks, and colour each one.",
    tags: ["Signature activity", "Task table", "Jobs"],
    sections: [
      { id: "ilo", title: "What the research says", html: `
        <p>A study published in May 2025 by the International Labour Organization (ILO) and Poland’s National Research Institute (NASK) estimates that about one in four (25%) jobs worldwide may be affected by generative AI, rising to 34% in high-income countries; clerical jobs have the highest exposure. The study stresses that the most likely outcome is <b>jobs being transformed, not replaced</b>: many tasks get faster, but people are still needed. These figures are about jobs that “may be affected”, <b>not actual job losses</b>. It also found that in high-income countries, 9.6% of jobs held by women fall into the highest exposure category, compared with 3.5% for men.${cite("ilo2025")}</p>
        <p><i>(China-specific.)</i> 国发〔2025〕11号 calls for developing new forms of work such as intelligent agents, assessing AI’s employment risks, and strongly supporting AI skills training.${cite("ai-plus")}</p>` },
      { id: "map", title: "Try it: “Which parts of my job will AI change?”", html: `<p>Write down 6–10 specific tasks you do in a week, and mark each with a colour: <b>green</b> (AI can do most of it, I check it), <b>amber</b> (AI helps, I decide), <b>red</b> (it has to be me). For green and amber, write how you’ll check it (<a href="../C4/index.html">C4</a>) and what information you won’t hand over (<a href="../C5/index.html">C5</a>). Finally, write one line: the new skill I need to add.</p>`
        + demo("taskMap", "Task table", "Pick a colour for each task", "The example is a community worker (Demo).")
        + callout("pitfall", "A common misunderstanding", "<p>“The more green tasks I have, the easier I am to replace.” Not necessarily. Time saved on green tasks can go into red tasks; and you’re still responsible for checking the green ones.</p>") },
    ],
    takeaways: ["The research is about jobs that may be affected, not job losses.", "Break it into tasks, colour them, add skills."],
  },
  {
    slug: "6-tracks", nav: "For each group", title: "Activities, and versions for different learners",
    subtitle: "An unplugged game; children, older adults, working adults, teachers",
    abstract: "Be the “CV-screening program” for a round.",
    tags: ["Unplugged", "K–12", "Older adults", "Working adults", "Teachers"],
    sections: [
      { id: "unplugged", title: "Unplugged: be the “CV-screening program”", html: callout("unplugged", "Demo materials (15 minutes)", "<ol><li>The teacher prepares 12 “applicant cards” (made-up people), each with a few details, one of which is “hobby”; each group also gets a “historical data card”: of the 10 people hired in the past, 8 listed the board game Go as their hobby.</li><li>Each group plays “the program” and can only set rules from the historical data card (most will come up with “plays Go: extra points”), then ranks the 12 cards and picks the top 4.</li><li>The teacher reveals: the job has nothing to do with Go, and the people screened out include the best candidates.</li><li>Discuss: who set the rule? Where did it go wrong? If this really were a program, how would you test it (change just one thing)?</li></ol>") },
      { id: "kids", title: "Children / K–12: do the people AI draws all look the same?", html: callout("track", "For children", `<p>Under China’s guidelines, primary pupils must not use open-ended content-generation features on their own.${cite("moe-genai")} <i>(Elsewhere, follow your school’s policy.)</i> The primary version uses only the unplugged game; the AI drawing test is run by the teacher: ask AI to draw “a scientist” and “a nurse” several times each, count the sexes and ages as a class, and discuss “is the real world like this?” Copyright in one sentence: before using someone else’s picture or writing, say where it came from, and ask.</p>`) },
      { id: "seniors", title: "Older adults: you can compare prices, and switch recommendations off", html: callout("track", "For older adults", `<p><i>In China</i>, rules forbid platforms from applying unreasonable differential pricing based on your shopping habits, and require an option for recommendations not based on personal characteristics, or an easy way to switch off personalised recommendations.${cite("algo-rules")} <i>Elsewhere, the rules differ.</i> Before a big purchase or booking tickets, compare prices at a different time or on someone else’s phone; look for “personalised recommendations” in the app’s settings and switch it off if you don’t want it. Replace the work section with “my day”: which things AI can help with (reading instructions, checking bus routes), and which you decide yourself or ask family about (money, health).</p>`) },
      { id: "work", title: "Working adults: which parts of my job will change", html: callout("track", "At work", "<p>The task table in chapter 5 is the core assignment. Managers and HR: don’t let AI make hiring, appraisal or promotion decisions on its own, and run a bias audit before using it. When publishing proposals or images made with AI: say you used AI, don’t imitate well-known works, keep a record.</p>") },
      { id: "teachers", title: "Teachers: turn the audit into an inquiry lesson", html: callout("track", "For teachers", `<p>University track: a “bias audit report” is due in weeks 9–10: scenario, requests, three answers, judgement, fix. China’s guidelines require teachers to avoid assessing students directly with AI-generated content.${cite("moe-genai")} The audit in chapter 3 shows why: the same assignment may get a different AI assessment because of irrelevant information.</p>`) },
    ],
    takeaways: ["Bias comes from the data; the program just learns it.", "Every group has something it can do right away."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three lines, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li><b>Bias mostly comes from data and how systems are used</b>, so it can be found and fixed; the way to find it is “change just one thing, try several times”.</li><li><b>Copyright in AI-generated content is still decided case by case</b>: say you used AI, don’t copy, don’t misuse others’ work, keep a record.</li><li><b>A job is a set of tasks</b>: the research talks about jobs that “may be affected”, and most will be transformed; break your job into tasks, colour them, and add skills.</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("Why did Amazon’s recruiting program penalise words like “women’s chess club”?", "<p>It learned from 10 years of CVs, mostly from men, so it treated words linked to women as “unlike past hires”.</p>"),
        predict("In a bias audit, why ask each request more than once?", "<p>AI can answer differently each time; one difference may be random, so look at the tendency over several tries.</p>"),
        predict("Why did the Beijing Internet Court decide the AI-generated image had an author? Who was it?", "<p>The plaintiff made an intellectual investment and personal expression through the prompts, parameters and selection; the author is the person using AI, not the AI.</p>"),
        predict("Does “a quarter of jobs worldwide may be affected” mean a quarter of people will lose their jobs?", "<p>No. The study is about jobs that may be affected; the most likely outcome is jobs being transformed, not replaced.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li><b>Audit:</b> pick a task you often use AI for whose result lands on people, run a “change just one thing” audit, and write a three-line conclusion.</li><li><b>Task table:</b> complete the task table in chapter 5 and write down one skill you need to add.</li><li><b>Copyright:</b> look at an AI image or piece of AI text you posted recently and check it against the four habits.</li></ol><p>Related modules: <a href="../C2/index.html">C2</a> explains how data becomes a model’s abilities and flaws; <a href="../C4/index.html">C4</a> checking and <a href="../C5/index.html">C5</a> information bottom lines apply to every row of the task table; <a href="../C7/index.html">C7</a> covers supervising AI agents; <a href="../C8/index.html">C8</a> covers what not to hand to AI.</p>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["Bias can be tested: change just one thing.", "Copyright is case by case: say you used AI.", "Break your job into tasks."],
  },
];
