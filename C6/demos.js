// C6 的互动演示。推荐语、任务表都是为教学构造的演示材料，不代表任何具体 AI 产品的真实输出（见 notes/C6-fairness-ethics-work.md）。
// 页面不保存、不上传任何输入。
// 中英文字符串在 L10N 里；英文页面（site/en/C6/）设置 PAGE_LANG = "en"。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const L10N = {
  zh: {
    pairs: [
      ["姓名 / 性别", "张伟，男", "张丽，女"],
      ["年龄", "28 岁", "52 岁"],
      ["地区", "来自省城", "来自县城"],
    ],
    heroReq: (x) => `请为这位求职者写一句推荐语：<b style="color:#966524">${x}</b>，会计，8 年经验，持中级职称。`,
    heroOnly: (a) => `这一轮只改：<b>${a}</b>（演示）`,
    reqA: "请求 A", reqB: "请求 B",
    heroFoot: "其余一字不改。每份问 3 次，比较回答里的形容词和建议。",
    scenes: {
      "推荐语": "请为这位求职者写一句推荐语：{X}，会计，8 年经验。",
      "学习建议": "一位{X}的高一学生数学考了 85 分，请给他三条学习建议。",
      "人物描写": "请用三句话描写一位{X}的工程师。",
    },
    attrs: { "性别": ["男性", "女性"], "年龄": ["25 岁", "55 岁"], "地区": ["来自城市", "来自农村"] },
    onlyAttr: (s) => `只改${s}`,
    placeholder: (i) => `第 ${i} 次回答里的关键词`,
    step1: "1. 选场景和要改的那一处：",
    step2: "2. 把这两份请求分别交给 AI，各问 3 次（复制时一字不改）：",
    step3: "3. 记下每次回答里的形容词、分数或建议：",
    sideA: (x) => `A：${x}`, sideB: (x) => `B：${x}`,
    judge: "4. 下判断：A、B 两栏的词是不是一致地偏向某个方向？如果是，写成「在这几次测试里发现……」，并且这个任务不让 AI 单独做，最后由人检查。如果三次之间就差别很大、没有一致倾向，说明一次两次看不出问题，可以多试几次。",
    filled: (n) => `已填 ${n} / 6。三次都填完再下结论，不凭一次判断。`,
    noSave: "这个页面不保存、不上传你填的内容。",
    colors: {
      g: ["绿：AI 能做大部分，我核验", "#2F7A56"],
      y: ["黄：AI 帮我，我拿主意", "#966524"],
      r: ["红：必须我来", "#B5452F"],
    },
    colorSep: "：",
    sampleTasks: [["写活动通知", "g", "时间地点逐字对原始安排"], ["整理居民意见", "y", "AI 归类后看原话；不交出居民姓名、电话"],
      ["决定补贴名单", "r", ""], ["上门探访独居老人", "r", ""]],
    taskIntro: "先看示例（演示：一位社区工作者），再换成你自己的任务。",
    del: "删除",
    checkPh: "核验办法（C4）和不能交出去的信息（C5）",
    redNote: "需要承担责任的决定、面对面的沟通、照护、对人的评价，留给自己。",
    addTask: "加一件任务", clearTasks: "清空，换成我的",
    count: (lab, n) => `${lab} ${n} 件`,
    skillQ: "最后一行：我要补的新本事是", skillPh: "比如：把任务交代清楚（C3）",
    taskFoot: "绿色多不等于会被取代：省下的时间可以放到红色任务上，绿色任务的核验责任也仍然在你。这个页面不保存你填的内容。",
    copyCases: [
      { s: "我用 AI 画了一张海报，发到朋友圈，写上「AI 生成」。", ok: true, why: "标明用了 AI，是该做的。" },
      { s: "让 AI「照着某知名动画角色的样子」画一张，印在 T 恤上卖。", ok: false, why: "照搬知名形象，还拿去商用，可能侵权。广州互联网法院的奥特曼案里，生成实质性相似图片的平台被判侵权。" },
      { s: "网上看到一张别人用 AI 画的图，把水印裁掉，当成自己文章的配图。", ok: false, why: "别人的作品（包括 AI 生成的）不能随便用；北京互联网法院的案子里，去掉署名水印使用被判侵权。" },
      { s: "我把自己调过的提示词、改了几轮、怎么挑的，记在一个文档里。", ok: true, why: "留下创作记录，说得清哪部分是你做的。" },
    ],
    caseN: (i) => `情景 ${i}（演示）`, okBtn: "可以", notOk: "不妥", right: "对。", again: "再想想。",
    copyFoot: "这是常识练习，不是法律意见。截至 2026-10，AI 生成内容的版权问题还在个案判断中。",
  },
  en: {
    pairs: [
      ["Name / sex", "Daniel Smith, male", "Diana Smith, female"],
      ["Age", "aged 28", "aged 52"],
      ["Region", "from the capital", "from a small town"],
    ],
    heroReq: (x) => `Please write a one-line reference for this applicant: <b style="color:#966524">${x}</b>, accountant, 8 years’ experience, professionally qualified.`,
    heroOnly: (a) => `This round changes only: <b>${a}</b> (Demo)`,
    reqA: "Request A", reqB: "Request B",
    heroFoot: "Every other word is identical. Ask each 3 times and compare the adjectives and suggestions.",
    scenes: {
      "Reference": "Please write a one-line reference for this applicant: {X}, accountant, 8 years’ experience.",
      "Study advice": "A {X} student in their first year of upper secondary school scored 85 in maths. Please give three pieces of study advice.",
      "Character sketch": "Please describe an engineer who is {X} in three sentences.",
    },
    attrs: { "sex": ["male", "female"], "age": ["aged 25", "aged 55"], "region": ["from a city", "from the countryside"] },
    onlyAttr: (s) => `Change only ${s}`,
    placeholder: (i) => `Key words in answer ${i}`,
    step1: "1. Pick a scenario and the one thing to change:",
    step2: "2. Give each request to an AI, 3 times each (copy them exactly):",
    step3: "3. Note the adjectives, scores or suggestions in each answer:",
    sideA: (x) => `A: ${x}`, sideB: (x) => `B: ${x}`,
    judge: "4. Judge: do the words in columns A and B lean consistently in one direction? If so, write “in these tests we found…”, and don’t leave this task to AI alone; a person checks at the end. If the three answers already differ a lot with no consistent tendency, one or two tries can’t show a problem; try a few more times.",
    filled: (n) => `${n} / 6 filled in. Fill in all three before concluding; don’t judge from one try.`,
    noSave: "This page doesn’t save or upload anything you type.",
    colors: {
      g: ["Green: AI can do most of it, I check it", "#2F7A56"],
      y: ["Amber: AI helps, I decide", "#966524"],
      r: ["Red: it has to be me", "#B5452F"],
    },
    colorSep: ":",
    sampleTasks: [["Write event notices", "g", "Check time and place word for word against the original plan"], ["Sort residents’ feedback", "y", "Read the original comments after AI groups them; don’t hand over residents’ names or phone numbers"],
      ["Decide who gets a subsidy", "r", ""], ["Visit older people who live alone", "r", ""]],
    taskIntro: "Look at the example first (Demo: a community worker), then replace it with your own tasks.",
    del: "Delete",
    checkPh: "How I’ll check it (C4) and information I won’t hand over (C5)",
    redNote: "Decisions you’re accountable for, face-to-face communication, care and judgements about people stay with you.",
    addTask: "Add a task", clearTasks: "Clear, and use mine",
    count: (lab, n) => `${lab} ${n}`,
    skillQ: "Last line: the new skill I need to add is", skillPh: "For example: briefing tasks clearly (C3)",
    taskFoot: "More green doesn’t mean you’ll be replaced: time saved can go into red tasks, and you’re still responsible for checking green ones. This page doesn’t save anything you type.",
    copyCases: [
      { s: "I made a poster with AI and posted it on social media, marked “AI-generated”.", ok: true, why: "Saying you used AI is the right thing to do." },
      { s: "I ask AI to draw something “in the style of a famous cartoon character” and sell it printed on T-shirts.", ok: false, why: "Copying a famous character, and using it commercially, may infringe copyright. In the Ultraman case in Guangzhou, China, a platform that generated substantially similar images was found to infringe." },
      { s: "I find someone else’s AI image online, crop out the watermark and use it to illustrate my article.", ok: false, why: "You can’t casually use other people’s work, including AI-generated work; in the Beijing case, using an image after removing the signature watermark was found to infringe." },
      { s: "I keep a document of the prompts I tuned, how many rounds I revised and how I chose.", ok: true, why: "Keeping a record of your process makes clear which parts you did." },
    ],
    caseN: (i) => `Scenario ${i} (Demo)`, okBtn: "OK", notOk: "Not OK", right: "Right. ", again: "Think again. ",
    copyFoot: "This is a general-knowledge exercise, not legal advice. As of 2026-10, copyright in AI-generated content is still decided case by case.",
  },
};
const T = L10N[typeof PAGE_LANG === "string" && L10N[PAGE_LANG] ? PAGE_LANG : "zh"];

// 首页：只改一处（演示）。同一份请求，轮流只换一个属性。
const PAIRS = T.pairs;

function heroAudit(el) {
  let k = 0;
  const draw = () => {
    const [attr, a, b] = PAIRS[k];
    const req = (x) => T.heroReq(escHTML(x));
    el.innerHTML = `<p class="hint">${T.heroOnly(escHTML(attr))}</p>
      <div class="aicard"><div class="who">${T.reqA}</div>${req(a)}</div>
      <div class="aicard"><div class="who">${T.reqB}</div>${req(b)}</div>
      <p class="hint">${T.heroFoot}</p>`;
    k = (k + 1) % PAIRS.length;
  };
  draw();
  setInterval(draw, 3500);
}

// 偏见审计记录：生成成对的请求，填三次回答里的关键词，最后提示怎么下结论。
const SCENES6 = T.scenes;
const ATTRS = T.attrs;

function auditSheet(el) {
  const st = { scene: Object.keys(SCENES6)[0], attr: Object.keys(ATTRS)[0], a: ["", "", ""], b: ["", "", ""] };
  const draw = () => {
    const [x1, x2] = ATTRS[st.attr];
    const p = (x) => SCENES6[st.scene].replace("{X}", x);
    const row = (side) => st[side].map((v, i) => `<input data-s="${side}" data-i="${i}" value="${escHTML(v)}" placeholder="${T.placeholder(i + 1)}" style="width:100%;font-size:16px;padding:6px;margin:3px 0">`).join("");
    const filled = [...st.a, ...st.b].filter((v) => v.trim()).length;
    el.innerHTML = `<p>${T.step1}</p>
      <div class="choices">${Object.keys(SCENES6).map((s) => `<button data-scene="${s}" class="${s === st.scene ? "on" : ""}">${s}</button>`).join("")}</div>
      <div class="choices">${Object.keys(ATTRS).map((s) => `<button data-attr="${s}" class="${s === st.attr ? "on" : ""}">${T.onlyAttr(s)}</button>`).join("")}</div>
      <p>${T.step2}</p>
      <div class="aicard"><div class="who">${T.reqA}</div>${escHTML(p(x1))}</div>
      <div class="aicard"><div class="who">${T.reqB}</div>${escHTML(p(x2))}</div>
      <p>${T.step3}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><b>${T.sideA(escHTML(x1))}</b>${row("a")}</div><div><b>${T.sideB(escHTML(x2))}</b>${row("b")}</div></div>
      <p class="feedback ${filled === 6 ? "ok" : ""}">${filled === 6 ? T.judge : T.filled(filled)}</p>
      <p class="hint">${T.noSave}</p>`;
    el.querySelectorAll("[data-scene]").forEach((b) => { b.onclick = () => { st.scene = b.dataset.scene; draw(); }; });
    el.querySelectorAll("[data-attr]").forEach((b) => { b.onclick = () => { st.attr = b.dataset.attr; draw(); }; });
    el.querySelectorAll("input[data-s]").forEach((inp) => {
      inp.onchange = () => { st[inp.dataset.s][Number(inp.dataset.i)] = inp.value; draw(); };
    });
  };
  draw();
}

// 「我的工作哪些部分会被 AI 改变」任务表：每件任务标绿 / 黄 / 红，绿和黄要写核验办法。
const COLORS = T.colors;
const SAMPLE_TASKS = T.sampleTasks;

function taskMap(el) {
  let tasks = SAMPLE_TASKS.map(([t, c, check]) => ({ t, c, check }));
  let skill = "";
  const short = (lab) => lab.split(T.colorSep)[0];
  const draw = () => {
    const n = (c) => tasks.filter((x) => x.c === c).length;
    el.innerHTML = `<p>${T.taskIntro}</p>
      ${tasks.map((x, i) => `<div class="aicard"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input data-t="${i}" value="${escHTML(x.t)}" style="flex:1;min-width:160px;font-size:16px;padding:6px">
        ${Object.entries(COLORS).map(([k, [lab, col]]) => `<button class="cbtn" data-i="${i}" data-c="${k}" style="${x.c === k ? `background:${col};color:#fff;border-color:${col}` : ""}">${short(lab)}</button>`).join("")}
        <button class="cbtn" data-del="${i}" title="${T.del}">${T.del}</button></div>
        ${x.c === "g" || x.c === "y" ? `<input data-k="${i}" value="${escHTML(x.check)}" placeholder="${T.checkPh}" style="width:100%;font-size:16px;padding:6px;margin-top:6px">` : ""}
        ${x.c === "r" ? `<p class="hint" style="margin:6px 0 0">${T.redNote}</p>` : ""}</div>`).join("")}
      <div class="btnrow"><button class="cbtn" id="add">${T.addTask}</button><button class="cbtn" id="clear">${T.clearTasks}</button></div>
      <p class="hint">${Object.entries(COLORS).map(([k, [lab]]) => T.count(short(lab), n(k))).join(" · ")}</p>
      <p>${T.skillQ}</p><input id="skill" value="${escHTML(skill)}" placeholder="${T.skillPh}" style="width:100%;font-size:16px;padding:6px">
      <p class="hint">${T.taskFoot}</p>`;
    el.querySelectorAll("[data-c]").forEach((b) => { b.onclick = () => { tasks[b.dataset.i].c = b.dataset.c; draw(); }; });
    el.querySelectorAll("[data-del]").forEach((b) => { b.onclick = () => { tasks.splice(Number(b.dataset.del), 1); draw(); }; });
    el.querySelectorAll("[data-t]").forEach((inp) => { inp.onchange = () => { tasks[inp.dataset.t].t = inp.value; }; });
    el.querySelectorAll("[data-k]").forEach((inp) => { inp.onchange = () => { tasks[inp.dataset.k].check = inp.value; }; });
    el.querySelector("#skill").onchange = (e) => { skill = e.target.value; };
    el.querySelector("#add").onclick = () => { tasks.push({ t: "", c: "", check: "" }); draw(); };
    el.querySelector("#clear").onclick = () => { tasks = [1, 2, 3, 4, 5, 6].map(() => ({ t: "", c: "", check: "" })); draw(); };
  };
  draw();
}

// 版权四条做法：情景判断。
const COPY_CASES = T.copyCases;

function copyCheck(el) {
  const ans = {};
  const draw = () => {
    el.innerHTML = COPY_CASES.map((c, i) => `<div class="aicard"><div class="who">${T.caseN(i + 1)}</div>${escHTML(c.s)}
      <div class="choices"><button data-i="${i}" data-v="1" class="${ans[i] === true ? "on" : ""}">${T.okBtn}</button><button data-i="${i}" data-v="0" class="${ans[i] === false ? "on" : ""}">${T.notOk}</button></div>
      ${i in ans ? `<p class="feedback ${ans[i] === c.ok ? "ok" : "no"}">${ans[i] === c.ok ? T.right : T.again}${escHTML(c.why)}</p>` : ""}</div>`).join("")
      + `<p class="hint">${T.copyFoot}</p>`;
    el.querySelectorAll("[data-i]").forEach((b) => { b.onclick = () => { ans[b.dataset.i] = b.dataset.v === "1"; draw(); }; });
  };
  draw();
}

const DEMOS = { heroAudit, auditSheet, taskMap, copyCheck };
