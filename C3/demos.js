// C3 的互动演示。讲座通知的三种写法、AI 回答和打分表都是构造的演示材料（见 notes/C3-describe-delegate.md 第 4 节）。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 同讲义第 4 节：三种交代，三段 AI 回答（演示，不是真实运行记录）。
const STYLES = [
  {
    name: "写法 A · 一句话",
    prompt: "写个讲座通知。",
    reply: "尊敬的各位居民：兹定于本月 20 日下午 2 点，在社区二楼会议室举办『健康生活』专题讲座，特邀某医院张主任主讲……",
    note: "时间、地点、题目、主讲人全是 AI 自己补的，读起来像真的。",
    bad: true,
  },
  {
    name: "写法 B · 给了事实",
    prompt: "写个讲座通知：本周六上午 9 点半，社区活动室，讲防诈骗。",
    reply: "关于举办防范电信网络诈骗专题讲座的通知。为进一步提高广大业主的防骗意识，经研究决定……诚邀各位业主拨冗莅临。",
    note: "事实对了，但写成了一页正式公文，老人在手机上看着费劲。",
    bad: true,
  },
  {
    name: "写法 C · 四件事都说了",
    prompt: "请帮我写一条发在小区业主群的通知。读者大多是六七十岁的老人，用手机看。内容：本周六上午 9 点半，在社区活动室，有一场防诈骗讲座，大约一小时，可以带家人一起来。要求：不超过 100 字，分 3 行，口语、亲切；不用英文和网络用语；我没给的信息不要加，比如主讲人名字；不确定的地方用【待确认】标出来。",
    reply: "【周六防骗讲座】本周六上午 9 点半，社区活动室，讲讲怎么防骗。大约一小时，欢迎带上家人一起来。有问题在群里问我。",
    note: "短、清楚。但「有问题在群里问我」是 AI 加的，发之前要确认谁来回答。",
    bad: false,
  },
];

// 首页：轮播三种写法。
function heroBrief(el) {
  let k = 0;
  const draw = () => {
    const s = STYLES[k];
    el.innerHTML = `<p class="hint"><b>${s.name}</b>（演示）</p>
      <div class="aicard"><div class="who">我的交代</div>${escHTML(s.prompt.length > 70 ? s.prompt.slice(0, 70) + "……" : s.prompt)}</div>
      <div class="aicard"><div class="who">AI 回答（演示）</div>${escHTML(s.reply)}</div>
      <p class="feedback ${s.bad ? "no" : "ok"}">${escHTML(s.note)}</p>`;
    k = (k + 1) % STYLES.length;
  };
  draw();
  setInterval(draw, 4200);
}

// 交代单：四件事分别填，下面实时拼成一段交代，并指出还缺哪件事。
const PARTS = [
  ["what", "做什么", "任务和成品，比如：写一条发在业主群的通知"],
  ["who", "给谁用", "读者、用途、背景材料，比如：读者大多是老人，用手机看"],
  ["good", "什么样算好", "长度、格式、语气，比如：不超过 100 字，分 3 行，口语"],
  ["dont", "哪些不要", "边界，比如：我没给的信息不要加，不确定的标【待确认】"],
];

function briefBuilder(el) {
  el.innerHTML = `<p>把一件你想交给 AI 的事，按四件事分别写下来。下面会拼成一段完整的交代。</p>
    ${PARTS.map(([id, label, ph]) => `<label style="display:block;margin:10px 0 4px"><b>${label}</b></label>
      <textarea data-part="${id}" rows="2" style="width:100%;font-size:16px;padding:8px" placeholder="${escHTML(ph)}"></textarea>`).join("")}
    <div class="aicard" style="margin-top:12px"><div class="who">拼好的交代</div><div id="bout">（还没写）</div></div>
    <p class="feedback" id="bmiss"></p>
    <p class="hint">提醒：不要在这里或交代里写身份证号、银行卡号、病历、单位文件等信息（C5）。这个页面不保存、不上传你写的内容。</p>`;
  const update = () => {
    const vals = Object.fromEntries([...el.querySelectorAll("[data-part]")].map((t) => [t.dataset.part, t.value.trim()]));
    const text = PARTS.map(([id]) => vals[id]).filter(Boolean).join("。");
    el.querySelector("#bout").textContent = text ? text + "。" : "（还没写）";
    const miss = PARTS.filter(([id]) => !vals[id]).map(([, label]) => label);
    const m = el.querySelector("#bmiss");
    m.className = `feedback ${miss.length ? "no" : "ok"}`;
    m.textContent = miss.length ? `还缺：${miss.join("、")}。` : "四件事都说了。交回来以后，事实部分照 C4 查一遍。";
  };
  el.querySelectorAll("[data-part]").forEach((t) => t.addEventListener("input", update));
}

// 三种写法打分：每项 0–2 分，看分数从哪件事上拉开。
const RUBRIC = ["事实对不对，有没有编", "适不适合读者", "长度、格式合不合要求", "拿回来还要改多少（改得少分高）"];

function compareThree(el) {
  el.innerHTML = `<div class="btnrow">${STYLES.map((s, i) => `<button class="cbtn" data-s="${i}">${s.name}</button>`).join("")}</div>
    <div id="cview"></div>
    <table style="margin-top:12px"><thead><tr><th>看什么</th>${STYLES.map((_, i) => `<th>${"ABC"[i]}</th>`).join("")}</tr></thead>
    <tbody>${RUBRIC.map((r, ri) => `<tr><td>${r}</td>${STYLES.map((_, si) => `<td><select data-r="${ri}" data-s="${si}" style="font-size:16px">
      <option value="">–</option><option>0</option><option>1</option><option>2</option></select></td>`).join("")}</tr>`).join("")}
    <tr><td><b>合计</b></td>${STYLES.map((_, si) => `<td><b data-sum="${si}">0</b></td>`).join("")}</tr></tbody></table>
    <p class="hint">参考：A 在「有没有编」上丢分最多，B 在「适不适合读者」上丢分，C 也不是满分：它加了一句我们没给的话。</p>`;
  const show = (i) => {
    const s = STYLES[i];
    el.querySelectorAll("[data-s].cbtn").forEach((b) => b.classList.toggle("on", Number(b.dataset.s) === i));
    el.querySelector("#cview").innerHTML = `<div class="aicard"><div class="who">我的交代</div>${escHTML(s.prompt)}</div>
      <div class="aicard"><div class="who">AI 回答（演示）</div>${escHTML(s.reply)}</div>`;
  };
  el.querySelectorAll(".cbtn").forEach((b) => { b.onclick = () => show(Number(b.dataset.s)); });
  el.querySelectorAll("select").forEach((sel) => sel.addEventListener("change", () => {
    STYLES.forEach((_, si) => {
      const sum = [...el.querySelectorAll(`select[data-s="${si}"]`)].reduce((a, x) => a + (Number(x.value) || 0), 0);
      el.querySelector(`[data-sum="${si}"]`).textContent = sum;
    });
  }));
  show(0);
}

const DEMOS = { heroBrief, briefBuilder, compareThree };
