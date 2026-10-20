// C8 的互动演示。例子、日志都是为教学构造的演示材料（见 notes/C8-when-not-to-use-ai.md）。页面不保存、不上传任何输入。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 六问：对一件事逐条回答，给出建议。
const SIX = [
  ["我在学这个本事吗？", "先自己做；需要帮忙时，只让 AI 给提示，不给答案。"],
  ["需要我的判断和责任吗？", "AI 可以参谋，决定自己做（C6）。"],
  ["是人和人之间的事吗？", "道歉、安慰、感谢，用自己的话更好。"],
  ["规定不允许吗？", "按考试、作业、单位的规定来。"],
  ["涉及隐私或保密吗？", "不能交出去的信息就不交（C5）。"],
  ["结果很重要，而我又核验不了吗？", "不要靠 AI（C4）。"],
];
const EXAMPLES = ["准备明天的数学小测", "给朋友写一封道歉信", "把会议记录整理成待办清单", "用 AI 起草一份对外合同"];

function heroDecide(el) {
  const st = { task: EXAMPLES[0], a: {} };
  const draw = () => {
    const yes = SIX.filter((_, i) => st.a[i] === true);
    const done = Object.keys(st.a).length === SIX.length;
    el.innerHTML = `<p class="hint">选一件事（演示），或写你自己的：</p>
      <div class="choices">${EXAMPLES.map((e) => `<button data-e="${escHTML(e)}" class="${e === st.task ? "on" : ""}">${escHTML(e)}</button>`).join("")}</div>
      ${SIX.map(([q], i) => `<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:1">${i + 1}. ${escHTML(q)}</span>
        <button class="cbtn" data-i="${i}" data-v="1" style="${st.a[i] === true ? "background:#B5452F;color:#fff" : ""}">是</button>
        <button class="cbtn" data-i="${i}" data-v="0" style="${st.a[i] === false ? "background:#2F7A56;color:#fff" : ""}">否</button></div>`).join("")}
      <p class="feedback ${done ? (yes.length ? "no" : "ok") : ""}">${!done ? `「${escHTML(st.task)}」：六个问题都答完，再看建议。`
        : yes.length ? `「${escHTML(st.task)}」先别直接交给 AI：${yes.map(([, adv]) => escHTML(adv)).join(" ")}`
        : `「${escHTML(st.task)}」可以用 AI，用完照样核验。`}</p>`;
    el.querySelectorAll("[data-e]").forEach((b) => { b.onclick = () => { st.task = b.dataset.e; st.a = {}; draw(); }; });
    el.querySelectorAll("[data-i]").forEach((b) => { b.onclick = () => { st.a[b.dataset.i] = b.dataset.v === "1"; draw(); }; });
  };
  draw();
}

// 反思日志：五行，可以先看演示。
const LOG_Q = ["今天用 AI 做了什么？", "哪部分是我自己做的？", "关掉 AI，我能做到吗？", "我学到了什么？", "下次哪部分自己来？"];
const LOG_DEMO = ["用 AI 起草了给业主的停水通知。", "核对了时间和范围，删掉了一句吓人的话。", "能，但要多花十分钟。",
  "通知要把「影响谁、多久、怎么办」放在前面。", "先自己列这三项，再让 AI 润色。"];

function reflectLog(el) {
  let vals = ["", "", "", "", ""];
  const draw = () => {
    const filled = vals.filter((v) => v.trim()).length;
    el.innerHTML = LOG_Q.map((q, i) => `<label style="display:block;margin:8px 0 2px"><b>${i + 1}. ${escHTML(q)}</b></label>
      <input data-i="${i}" value="${escHTML(vals[i])}" placeholder="演示：${escHTML(LOG_DEMO[i])}" style="width:100%;font-size:16px;padding:6px">`).join("")
      + `<div class="btnrow"><button class="cbtn" id="fill">填入演示</button><button class="cbtn" id="clr">清空</button></div>
      <p class="feedback ${filled === 5 ? "ok" : ""}">${filled === 5 ? (/不能|不会/.test(vals[2]) ? "第 3 行写了「不能」：这项本事值得设一个关闭 AI 的检查点。" : "写完了。两分钟，五行，坚持一周看看。") : `已写 ${filled} / 5 行。`}</p>
      <p class="hint">这个页面不保存你写的内容；想留着，抄到自己的本子上。</p>`;
    el.querySelectorAll("input[data-i]").forEach((x) => { x.onchange = () => { vals[x.dataset.i] = x.value; draw(); }; });
    el.querySelector("#fill").onclick = () => { vals = [...LOG_DEMO]; draw(); };
    el.querySelector("#clr").onclick = () => { vals = ["", "", "", "", ""]; draw(); };
  };
  draw();
}

// 系列回顾：C1–C8 每讲一件「已经在做」的事，勾选后看三级徽章需要什么。
const MODS = [
  ["C1", "分清「会说话」和「会思考、会负责」", "L1"], ["C2", "知道 AI 为什么会编，能让它说错一次", "L1"],
  ["C3", "用四件事交代任务，交出一份任务作品", "L2"], ["C4", "按风险定级，用五招核验，填过核验记录表", "L3"],
  ["C5", "守住三条红线，和家人约过暗号", "L1"], ["C6", "做过一次偏见审计，写过任务表", ""],
  ["C7", "写过一份监督日志，标过确认点", "L3"], ["C8", "设过关闭 AI 的检查点，写过反思日志", "L3"],
];

function seriesCheck(el) {
  const on = {};
  const draw = () => {
    const has = (lv) => MODS.filter((m) => m[2] === lv).every((m) => on[m[0]]);
    el.innerHTML = MODS.map(([c, d]) => `<div class="aicard" style="display:flex;gap:10px;align-items:center">
        <button class="cbtn" data-c="${c}" style="${on[c] ? "background:#2F7A56;color:#fff" : ""}">${on[c] ? "已在做" : "还没有"}</button>
        <span><b><a href="../${c}/index.html">${c}</a></b> ${escHTML(d)}</span></div>`).join("")
      + `<p class="feedback">${[["L1「知」", "L1", "C1、C2、C5 的实践小测"], ["L2「用」", "L2", "一份任务作品（C3）"], ["L3「验」", "L3", "核验挑战、监督日志，加口头答辩"]]
        .map(([n, lv, how]) => `${has(lv) ? "✓" : "○"} ${n}：${how}`).join("<br>")}</p>
      <p class="hint">徽章是本课程的设计，全部是实践型考核；这里只是自查，不是认证。能否纳入学分银行或学分互认，截至 2026-10 还在洽谈中。</p>`;
    el.querySelectorAll("[data-c]").forEach((b) => { b.onclick = () => { on[b.dataset.c] = !on[b.dataset.c]; draw(); }; });
  };
  draw();
}

const DEMOS = { heroDecide, reflectLog, seriesCheck };
