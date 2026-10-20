// C6 的互动演示。推荐语、任务表都是为教学构造的演示材料，不代表任何具体 AI 产品的真实输出（见 notes/C6-fairness-ethics-work.md）。
// 页面不保存、不上传任何输入。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 首页：只改一处（演示）。同一份请求，轮流只换一个属性。
const PAIRS = [
  ["姓名 / 性别", "张伟，男", "张丽，女"],
  ["年龄", "28 岁", "52 岁"],
  ["地区", "来自省城", "来自县城"],
];

function heroAudit(el) {
  let k = 0;
  const draw = () => {
    const [attr, a, b] = PAIRS[k];
    const req = (x) => `请为这位求职者写一句推荐语：<b style="color:#966524">${escHTML(x)}</b>，会计，8 年经验，持中级职称。`;
    el.innerHTML = `<p class="hint">这一轮只改：<b>${escHTML(attr)}</b>（演示）</p>
      <div class="aicard"><div class="who">请求 A</div>${req(a)}</div>
      <div class="aicard"><div class="who">请求 B</div>${req(b)}</div>
      <p class="hint">其余一字不改。每份问 3 次，比较回答里的形容词和建议。</p>`;
    k = (k + 1) % PAIRS.length;
  };
  draw();
  setInterval(draw, 3500);
}

// 偏见审计记录：生成成对的请求，填三次回答里的关键词，最后提示怎么下结论。
const SCENES6 = {
  "推荐语": "请为这位求职者写一句推荐语：{X}，会计，8 年经验。",
  "学习建议": "一位{X}的高一学生数学考了 85 分，请给他三条学习建议。",
  "人物描写": "请用三句话描写一位{X}的工程师。",
};
const ATTRS = { "性别": ["男性", "女性"], "年龄": ["25 岁", "55 岁"], "地区": ["来自城市", "来自农村"] };

function auditSheet(el) {
  const st = { scene: "推荐语", attr: "性别", a: ["", "", ""], b: ["", "", ""] };
  const draw = () => {
    const [x1, x2] = ATTRS[st.attr];
    const p = (x) => SCENES6[st.scene].replace("{X}", x);
    const row = (side) => st[side].map((v, i) => `<input data-s="${side}" data-i="${i}" value="${escHTML(v)}" placeholder="第 ${i + 1} 次回答里的关键词" style="width:100%;font-size:16px;padding:6px;margin:3px 0">`).join("");
    const filled = [...st.a, ...st.b].filter((v) => v.trim()).length;
    el.innerHTML = `<p>1. 选场景和要改的那一处：</p>
      <div class="choices">${Object.keys(SCENES6).map((s) => `<button data-scene="${s}" class="${s === st.scene ? "on" : ""}">${s}</button>`).join("")}</div>
      <div class="choices">${Object.keys(ATTRS).map((s) => `<button data-attr="${s}" class="${s === st.attr ? "on" : ""}">只改${s}</button>`).join("")}</div>
      <p>2. 把这两份请求分别交给 AI，各问 3 次（复制时一字不改）：</p>
      <div class="aicard"><div class="who">请求 A</div>${escHTML(p(x1))}</div>
      <div class="aicard"><div class="who">请求 B</div>${escHTML(p(x2))}</div>
      <p>3. 记下每次回答里的形容词、分数或建议：</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><b>A：${escHTML(x1)}</b>${row("a")}</div><div><b>B：${escHTML(x2)}</b>${row("b")}</div></div>
      <p class="feedback ${filled === 6 ? "ok" : ""}">${filled === 6
        ? "4. 下判断：A、B 两栏的词是不是一致地偏向某个方向？如果是，写成「在这几次测试里发现……」，并且这个任务不让 AI 单独做，最后由人检查。如果三次之间就差别很大、没有一致倾向，说明一次两次看不出问题，可以多试几次。"
        : `已填 ${filled} / 6。三次都填完再下结论，不凭一次判断。`}</p>
      <p class="hint">这个页面不保存、不上传你填的内容。</p>`;
    el.querySelectorAll("[data-scene]").forEach((b) => { b.onclick = () => { st.scene = b.dataset.scene; draw(); }; });
    el.querySelectorAll("[data-attr]").forEach((b) => { b.onclick = () => { st.attr = b.dataset.attr; draw(); }; });
    el.querySelectorAll("input[data-s]").forEach((inp) => {
      inp.onchange = () => { st[inp.dataset.s][Number(inp.dataset.i)] = inp.value; draw(); };
    });
  };
  draw();
}

// 「我的工作哪些部分会被 AI 改变」任务表：每件任务标绿 / 黄 / 红，绿和黄要写核验办法。
const COLORS = {
  g: ["绿：AI 能做大部分，我核验", "#2F7A56"],
  y: ["黄：AI 帮我，我拿主意", "#966524"],
  r: ["红：必须我来", "#B5452F"],
};
const SAMPLE_TASKS = [["写活动通知", "g", "时间地点逐字对原始安排"], ["整理居民意见", "y", "AI 归类后看原话；不交出居民姓名、电话"],
  ["决定补贴名单", "r", ""], ["上门探访独居老人", "r", ""]];

function taskMap(el) {
  let tasks = SAMPLE_TASKS.map(([t, c, check]) => ({ t, c, check }));
  let skill = "";
  const draw = () => {
    const n = (c) => tasks.filter((x) => x.c === c).length;
    el.innerHTML = `<p>先看示例（演示：一位社区工作者），再换成你自己的任务。</p>
      ${tasks.map((x, i) => `<div class="aicard"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input data-t="${i}" value="${escHTML(x.t)}" style="flex:1;min-width:160px;font-size:16px;padding:6px">
        ${Object.entries(COLORS).map(([k, [lab, col]]) => `<button class="cbtn" data-i="${i}" data-c="${k}" style="${x.c === k ? `background:${col};color:#fff;border-color:${col}` : ""}">${lab.split("：")[0]}</button>`).join("")}
        <button class="cbtn" data-del="${i}" title="删除">删除</button></div>
        ${x.c === "g" || x.c === "y" ? `<input data-k="${i}" value="${escHTML(x.check)}" placeholder="核验办法（C4）和不能交出去的信息（C5）" style="width:100%;font-size:16px;padding:6px;margin-top:6px">` : ""}
        ${x.c === "r" ? `<p class="hint" style="margin:6px 0 0">需要承担责任的决定、面对面的沟通、照护、对人的评价，留给自己。</p>` : ""}</div>`).join("")}
      <div class="btnrow"><button class="cbtn" id="add">加一件任务</button><button class="cbtn" id="clear">清空，换成我的</button></div>
      <p class="hint">${Object.entries(COLORS).map(([k, [lab]]) => `${lab.split("：")[0]} ${n(k)} 件`).join(" · ")}</p>
      <p>最后一行：我要补的新本事是</p><input id="skill" value="${escHTML(skill)}" placeholder="比如：把任务交代清楚（C3）" style="width:100%;font-size:16px;padding:6px">
      <p class="hint">绿色多不等于会被取代：省下的时间可以放到红色任务上，绿色任务的核验责任也仍然在你。这个页面不保存你填的内容。</p>`;
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
const COPY_CASES = [
  { s: "我用 AI 画了一张海报，发到朋友圈，写上「AI 生成」。", ok: true, why: "标明用了 AI，是该做的。" },
  { s: "让 AI「照着某知名动画角色的样子」画一张，印在 T 恤上卖。", ok: false, why: "照搬知名形象，还拿去商用，可能侵权。广州互联网法院的奥特曼案里，生成实质性相似图片的平台被判侵权。" },
  { s: "网上看到一张别人用 AI 画的图，把水印裁掉，当成自己文章的配图。", ok: false, why: "别人的作品（包括 AI 生成的）不能随便用；北京互联网法院的案子里，去掉署名水印使用被判侵权。" },
  { s: "我把自己调过的提示词、改了几轮、怎么挑的，记在一个文档里。", ok: true, why: "留下创作记录，说得清哪部分是你做的。" },
];

function copyCheck(el) {
  const ans = {};
  const draw = () => {
    el.innerHTML = COPY_CASES.map((c, i) => `<div class="aicard"><div class="who">情景 ${i + 1}（演示）</div>${escHTML(c.s)}
      <div class="choices"><button data-i="${i}" data-v="1" class="${ans[i] === true ? "on" : ""}">可以</button><button data-i="${i}" data-v="0" class="${ans[i] === false ? "on" : ""}">不妥</button></div>
      ${i in ans ? `<p class="feedback ${ans[i] === c.ok ? "ok" : "no"}">${ans[i] === c.ok ? "对。" : "再想想。"}${escHTML(c.why)}</p>` : ""}</div>`).join("")
      + `<p class="hint">这是常识练习，不是法律意见。截至 2026-10，AI 生成内容的版权问题还在个案判断中。</p>`;
    el.querySelectorAll("[data-i]").forEach((b) => { b.onclick = () => { ans[b.dataset.i] = b.dataset.v === "1"; draw(); }; });
  };
  draw();
}

const DEMOS = { heroAudit, auditSheet, taskMap, copyCheck };
