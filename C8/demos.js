// C8 的互动演示。例子、日志都是为教学构造的演示材料（见 notes/C8-when-not-to-use-ai.md）。页面不保存、不上传任何输入。
// 中英文字符串在 L10N 里；英文页面（site/en/C8/）设置 PAGE_LANG = "en"。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const L10N = {
  zh: {
    six: [
      ["我在学这个本事吗？", "先自己做；需要帮忙时，只让 AI 给提示，不给答案。"],
      ["需要我的判断和责任吗？", "AI 可以参谋，决定自己做（C6）。"],
      ["是人和人之间的事吗？", "道歉、安慰、感谢，用自己的话更好。"],
      ["规定不允许吗？", "按考试、作业、单位的规定来。"],
      ["涉及隐私或保密吗？", "不能交出去的信息就不交（C5）。"],
      ["结果很重要，而我又核验不了吗？", "不要靠 AI（C4）。"],
    ],
    examples: ["准备明天的数学小测", "给朋友写一封道歉信", "把会议记录整理成待办清单", "用 AI 起草一份对外合同"],
    pick: "选一件事（演示），或写你自己的：", yes: "是", no: "否",
    pending: (t) => `「${t}」：六个问题都答完，再看建议。`,
    hold: (t, adv) => `「${t}」先别直接交给 AI：${adv}`,
    go: (t) => `「${t}」可以用 AI，用完照样核验。`,
    logQ: ["今天用 AI 做了什么？", "哪部分是我自己做的？", "关掉 AI，我能做到吗？", "我学到了什么？", "下次哪部分自己来？"],
    logDemo: ["用 AI 起草了给业主的停水通知。", "核对了时间和范围，删掉了一句吓人的话。", "能，但要多花十分钟。",
      "通知要把「影响谁、多久、怎么办」放在前面。", "先自己列这三项，再让 AI 润色。"],
    demoPh: (d) => `演示：${d}`, fillDemo: "填入演示", clear: "清空",
    cant: /不能|不会/,
    cantMsg: "第 3 行写了「不能」：这项本事值得设一个关闭 AI 的检查点。",
    doneMsg: "写完了。两分钟，五行，坚持一周看看。",
    written: (n) => `已写 ${n} / 5 行。`,
    logFoot: "这个页面不保存你写的内容；想留着，抄到自己的本子上。",
    mods: [
      ["C1", "分清「会说话」和「会思考、会负责」", "L1"], ["C2", "知道 AI 为什么会编，能让它说错一次", "L1"],
      ["C3", "用四件事交代任务，交出一份任务作品", "L2"], ["C4", "按风险定级，用五招核验，填过核验记录表", "L3"],
      ["C5", "守住三条红线，和家人约过暗号", "L1"], ["C6", "做过一次偏见审计，写过任务表", ""],
      ["C7", "写过一份监督日志，标过确认点", "L3"], ["C8", "设过关闭 AI 的检查点，写过反思日志", "L3"],
    ],
    doing: "已在做", notYet: "还没有",
    badges: [["L1「知」", "L1", "C1、C2、C5 的实践小测"], ["L2「用」", "L2", "一份任务作品（C3）"], ["L3「验」", "L3", "核验挑战、监督日志，加口头答辩"]],
    badgeSep: "：",
    seriesFoot: "徽章是本课程的设计，全部是实践型考核；这里只是自查，不是认证。能否纳入学分银行或学分互认，截至 2026-10 还在洽谈中。",
  },
  en: {
    six: [
      ["Am I learning this skill?", "Do it yourself first; when you need help, have AI give hints, not answers."],
      ["Does it need my judgement and responsibility?", "AI can advise; you decide (C6)."],
      ["Is it something between people?", "Apologies, comfort and thanks are better in your own words."],
      ["Do the rules forbid it?", "Follow the rules for the exam, assignment or workplace."],
      ["Does it involve privacy or confidentiality?", "Information that mustn’t leave your hands doesn’t go to AI (C5)."],
      ["Does the result matter, and I can’t check it?", "Don’t rely on AI (C4)."],
    ],
    examples: ["Prepare for tomorrow’s maths quiz", "Write an apology letter to a friend", "Turn meeting notes into a to-do list", "Draft a contract with an outside party using AI"],
    pick: "Pick a task (Demo), or think of your own:", yes: "Yes", no: "No",
    pending: (t) => `“${t}”: answer all six questions to see the advice.`,
    hold: (t, adv) => `“${t}”: don’t hand this straight to AI. ${adv}`,
    go: (t) => `“${t}”: you can use AI, and check the result as usual.`,
    logQ: ["What did I use AI for today?", "Which part did I do myself?", "With AI off, could I do it?", "What did I learn?", "Which part will I do myself next time?"],
    logDemo: ["Used AI to draft a water-shutoff notice for residents.", "Checked the times and area, and deleted one alarming sentence.", "Yes, but it would take ten minutes longer.",
      "A notice should put “who’s affected, for how long, what to do” first.", "List those three myself first, then have AI polish it."],
    demoPh: (d) => `Demo: ${d}`, fillDemo: "Fill in the demo", clear: "Clear",
    cant: /\b(no|not|can’?t|can't|cannot|couldn’?t|couldn't)\b/i,
    cantMsg: "Line 3 says you couldn’t: this skill deserves an AI-off checkpoint.",
    doneMsg: "Done. Two minutes, five lines: try it for a week.",
    written: (n) => `${n} / 5 lines written.`,
    logFoot: "This page doesn’t save what you write; to keep it, copy it into your own notebook.",
    mods: [
      ["C1", "Tell “talking” apart from “thinking and taking responsibility”", "L1"], ["C2", "Know why AI makes things up, and have made it get something wrong", "L1"],
      ["C3", "Brief tasks with the four things, and hand in a task piece", "L2"], ["C4", "Grade by risk, check with five moves, and have filled in a checking log", "L3"],
      ["C5", "Guard the three red lines, and have agreed a code word with family", "L1"], ["C6", "Have run a bias audit and written a task table", ""],
      ["C7", "Have written a supervision log and marked checkpoints", "L3"], ["C8", "Have set an AI-off checkpoint and kept a reflection log", "L3"],
    ],
    doing: "Doing it", notYet: "Not yet",
    badges: [["L1 “Know”", "L1", "practical quizzes for C1, C2 and C5"], ["L2 “Use”", "L2", "a task piece (C3)"], ["L3 “Check”", "L3", "the checking challenge, a supervision log, plus an oral defence"]],
    badgeSep: ": ",
    seriesFoot: "The badges are this course’s own design, all assessed by practical work; this is only a self-check, not certification. Whether they can count towards a credit bank or credit recognition is, as of 2026-10, still under discussion.",
  },
};
const T = L10N[typeof PAGE_LANG === "string" && L10N[PAGE_LANG] ? PAGE_LANG : "zh"];

// 六问：对一件事逐条回答，给出建议。
const SIX = T.six;
const EXAMPLES = T.examples;

function heroDecide(el) {
  const st = { task: EXAMPLES[0], a: {} };
  const draw = () => {
    const yes = SIX.filter((_, i) => st.a[i] === true);
    const done = Object.keys(st.a).length === SIX.length;
    el.innerHTML = `<p class="hint">${T.pick}</p>
      <div class="choices">${EXAMPLES.map((e) => `<button data-e="${escHTML(e)}" class="${e === st.task ? "on" : ""}">${escHTML(e)}</button>`).join("")}</div>
      ${SIX.map(([q], i) => `<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:1">${i + 1}. ${escHTML(q)}</span>
        <button class="cbtn" data-i="${i}" data-v="1" style="${st.a[i] === true ? "background:#B5452F;color:#fff" : ""}">${T.yes}</button>
        <button class="cbtn" data-i="${i}" data-v="0" style="${st.a[i] === false ? "background:#2F7A56;color:#fff" : ""}">${T.no}</button></div>`).join("")}
      <p class="feedback ${done ? (yes.length ? "no" : "ok") : ""}">${!done ? T.pending(escHTML(st.task))
        : yes.length ? T.hold(escHTML(st.task), yes.map(([, adv]) => escHTML(adv)).join(" "))
        : T.go(escHTML(st.task))}</p>`;
    el.querySelectorAll("[data-e]").forEach((b) => { b.onclick = () => { st.task = b.dataset.e; st.a = {}; draw(); }; });
    el.querySelectorAll("[data-i]").forEach((b) => { b.onclick = () => { st.a[b.dataset.i] = b.dataset.v === "1"; draw(); }; });
  };
  draw();
}

// 反思日志：五行，可以先看演示。
const LOG_Q = T.logQ;
const LOG_DEMO = T.logDemo;

function reflectLog(el) {
  let vals = ["", "", "", "", ""];
  const draw = () => {
    const filled = vals.filter((v) => v.trim()).length;
    el.innerHTML = LOG_Q.map((q, i) => `<label style="display:block;margin:8px 0 2px"><b>${i + 1}. ${escHTML(q)}</b></label>
      <input data-i="${i}" value="${escHTML(vals[i])}" placeholder="${T.demoPh(escHTML(LOG_DEMO[i]))}" style="width:100%;font-size:16px;padding:6px">`).join("")
      + `<div class="btnrow"><button class="cbtn" id="fill">${T.fillDemo}</button><button class="cbtn" id="clr">${T.clear}</button></div>
      <p class="feedback ${filled === 5 ? "ok" : ""}">${filled === 5 ? (T.cant.test(vals[2]) ? T.cantMsg : T.doneMsg) : T.written(filled)}</p>
      <p class="hint">${T.logFoot}</p>`;
    el.querySelectorAll("input[data-i]").forEach((x) => { x.onchange = () => { vals[x.dataset.i] = x.value; draw(); }; });
    el.querySelector("#fill").onclick = () => { vals = [...LOG_DEMO]; draw(); };
    el.querySelector("#clr").onclick = () => { vals = ["", "", "", "", ""]; draw(); };
  };
  draw();
}

// 系列回顾：C1–C8 每讲一件「已经在做」的事，勾选后看三级徽章需要什么。
const MODS = T.mods;

function seriesCheck(el) {
  const on = {};
  const draw = () => {
    const has = (lv) => MODS.filter((m) => m[2] === lv).every((m) => on[m[0]]);
    el.innerHTML = MODS.map(([c, d]) => `<div class="aicard" style="display:flex;gap:10px;align-items:center">
        <button class="cbtn" data-c="${c}" style="${on[c] ? "background:#2F7A56;color:#fff" : ""}">${on[c] ? T.doing : T.notYet}</button>
        <span><b><a href="../${c}/index.html">${c}</a></b> ${escHTML(d)}</span></div>`).join("")
      + `<p class="feedback">${T.badges
        .map(([n, lv, how]) => `${has(lv) ? "✓" : "○"} ${n}${T.badgeSep}${how}`).join("<br>")}</p>
      <p class="hint">${T.seriesFoot}</p>`;
    el.querySelectorAll("[data-c]").forEach((b) => { b.onclick = () => { on[b.dataset.c] = !on[b.dataset.c]; draw(); }; });
  };
  draw();
}

const DEMOS = { heroDecide, reflectLog, seriesCheck };
