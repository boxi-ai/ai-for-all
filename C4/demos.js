// C4 的互动演示。所有「AI 回答」都是构造的演示材料（见 notes/C4-verify.md 第 4、6 节）。
// 中英文字符串在 L10N 里；英文页面（site/en/C4/）设置 PAGE_LANG = "en"。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const L10N = {
  zh: {
    // 首页：自动轮播三个演示例子（AI 说 → 用哪招 → 结论）。
    heroSteps: [
      { ai: "从 2026 年 3 月 1 日算起，30 天后是 3 月 30 日。", move: "自己算", verdict: "错：3 月有 31 天，应是 3 月 31 日", ok: false },
      { ai: "所有质数都是奇数。", move: "找反例", verdict: "错：2 是质数，但是偶数", ok: false },
      { ai: "珠穆朗玛峰海拔 8844.43 米。", move: "交叉核对", verdict: "过时：2020 年公布的最新高程是 8848.86 米", ok: false },
      { ai: "一件 260 元的衣服打八折是 208 元。", move: "自己算", verdict: "对：260 × 0.8 = 208", ok: true },
    ],
    aiDemo: "AI（演示）",
    whichMove: "用哪一招：",
    // 信号灯：给 8 件事定级。
    lightTasks: [
      ["让 AI 给小狗起十个名字", "g", "错了也没损失，挑喜欢的就行。"],
      ["让 AI 写一段生日祝福", "g", "看着顺眼就行。"],
      ["让 AI 总结一篇新闻，准备转发到家庭群", "y", "转发前找到原始新闻核对关键事实。"],
      ["让 AI 帮忙整理复习提纲", "y", "核对提纲里的定义、年份和公式。"],
      ["让 AI 写周报里的销售数字分析", "y", "数字逐个对回原始表格，自己复算。"],
      ["问 AI 某种药能不能和降压药一起吃", "r", "健康问题：问医生或药师。"],
      ["「孙子」视频里说急需用钱，让你转账", "r", "钱：挂断，用自己存的号码打回去确认。"],
      ["让 AI 解释合同里的违约条款", "r", "法律问题：以合同原文为准，问律师或法务。"],
    ],
    lightName: { g: "绿灯", y: "黄灯", r: "红灯" },
    suggest: (n) => "✗ 建议：" + n + "。",
    lightScore: (done, total, n) => `已答 ${done} / ${total}，和建议一致 ${n} 个`,
    // 自己算：打折和满减。
    calc: {
      price: "原价", discount: "折扣", over: "满", off: "减", unit: "元",
      ai: "最后需要付 182 元。",
      fmt: (x) => `${x} 元`, bold: (x) => `<b>${x}</b> 元`, sep: "；",
      discFirst: "先打折、再用券：", couponFirst: "先用券、再打折：",
      applies: (t, c, a) => `满 ${t}，减 ${c}，得 ${a}`,
      notApplies: (t, a) => `不满 ${t}，券不能用，得 ${a}`,
      match: "AI 的 182 元和其中一种算法对上了。",
      noMatch: "AI 的 182 元和两种算法都对不上。真正付多少，看店里的规则。",
    },
    // 找错挑战：6 张卡（同讲义第 6 节）。
    cards: [
      ["A", "从 2026 年 3 月 1 日算起，30 天后是 3 月 30 日。", "错", "自己算：3 月有 31 天，3 月 1 日之后的第 30 天是 3 月 31 日。"],
      ["B", "所有质数都是奇数。", "错", "找反例：2 是质数，但是偶数。"],
      ["C", "一瓶 500 毫升的矿泉水，就是 5 升。", "错", "自己算 / 单位：500 毫升 = 0.5 升。"],
      ["D", "会议定在下周二上午。……那我们下周三上午会上见！", "错", "前后不一致：同一段回答里日期自相矛盾，要回头问清楚。"],
      ["E", "今年是 2023 年，所以你出生于 2010 年的话今年 13 岁。", "过时", "对照今天的日期：AI 不一定知道「今天」是哪天。"],
      ["F", "一件 260 元的衣服打八折是 208 元。", "对", "260 × 0.8 = 208。也有对的卡：核验不是认定 AI 全错。"],
    ],
    opts: ["对", "错", "过时", "未核实"],
    card: (id) => `卡 ${id} · AI（演示）`,
    answerIs: (w) => `✗ 答案是「${w}」。`,
    cardScore: (n, total) => `得分 ${n} / ${total}（课堂上还要写出证据才算满分）`,
    // 核验记录表。
    log: {
      key: "aiforall-c4-log",
      cols: ["AI 说的原话", "信号灯", "用了哪一招", "证据（链接 / 书名页码 / 问了谁）", "结论", "我最后怎么用"],
      pick: { 1: ["", "绿", "黄", "红"], 2: ["", "问来源", "交叉核对", "自己算", "找反例", "问人"], 4: ["", "对", "错", "过时", "未核实"], 5: ["", "照用", "改了再用", "不用"] },
      sample: ["「珠穆朗玛峰海拔 8844.43 米」（演示）", "黄", "交叉核对", "新华网 2020-12-09 转载人民日报报道", "过时", "改了再用"],
      add: "加一行", csv: "下载 CSV", clear: "清空",
      hint: "只存在你自己的浏览器里，不会上传。",
      file: "核验记录表.csv",
    },
  },
  en: {
    heroSteps: [
      { ai: "Counting from 1 March 2026, 30 days later is 30 March.", move: "Do the sums", verdict: "Wrong: March has 31 days, so it’s 31 March", ok: false },
      { ai: "All prime numbers are odd.", move: "Find a counterexample", verdict: "Wrong: 2 is prime, but even", ok: false },
      { ai: "Mount Everest is 8,844.43 metres high.", move: "Cross-check", verdict: "Out of date: the latest elevation, announced in 2020, is 8,848.86 metres", ok: false },
      { ai: "A $260 jacket at 20% off is $208.", move: "Do the sums", verdict: "Right: 260 × 0.8 = 208", ok: true },
    ],
    aiDemo: "AI (Demo)",
    whichMove: "Which move: ",
    lightTasks: [
      ["Ask AI for ten names for a puppy", "g", "Nothing lost if it’s wrong; just pick one you like."],
      ["Ask AI to write a birthday message", "g", "If it reads well, it’s fine."],
      ["Ask AI to summarise a news story you’ll forward to the family group chat", "y", "Before forwarding, find the original story and check the key facts."],
      ["Ask AI to tidy up your revision notes", "y", "Check the definitions, dates and formulas in the notes."],
      ["Ask AI to analyse the sales figures for your weekly report", "y", "Check each number against the original spreadsheet and re-calculate."],
      ["Ask AI whether a medicine can be taken with blood-pressure tablets", "r", "Health: ask a doctor or pharmacist."],
      ["Your “grandson” says on video he urgently needs money and asks you to transfer it", "r", "Money: hang up and call back on a number you saved yourself."],
      ["Ask AI to explain the penalty clause in a contract", "r", "Law: go by the contract itself, and ask a lawyer or your legal team."],
    ],
    lightName: { g: "Green", y: "Amber", r: "Red" },
    suggest: (n) => `✗ Suggested: ${n}.`,
    lightScore: (done, total, n) => `Answered ${done} / ${total}; ${n} match the suggestions`,
    calc: {
      price: "Price $", discount: "Pay (× price)", over: "Spend $", off: "Get $ off", unit: "",
      ai: "You’ll pay $182 in the end.",
      fmt: (x) => `$${x}`, bold: (x) => `<b>$${x}</b>`, sep: "; ",
      discFirst: "Discount first, then voucher: ", couponFirst: "Voucher first, then discount: ",
      applies: (t, c, a) => `over $${t}, so $${c} off: ${a}`,
      notApplies: (t, a) => `under $${t}, so the voucher doesn’t apply: ${a}`,
      match: "The AI’s $182 matches one of the two methods.",
      noMatch: "The AI’s $182 matches neither method. What you actually pay depends on the shop’s rules.",
    },
    cards: [
      ["A", "Counting from 1 March 2026, 30 days later is 30 March.", "Wrong", "Do the sums: March has 31 days, so 30 days after 1 March is 31 March."],
      ["B", "All prime numbers are odd.", "Wrong", "Counterexample: 2 is prime, but even."],
      ["C", "A 500-millilitre bottle of water is 5 litres.", "Wrong", "Do the sums / units: 500 millilitres = 0.5 litres."],
      ["D", "The meeting is set for next Tuesday morning. … So see you at the meeting next Wednesday morning!", "Wrong", "Inconsistent: the dates contradict each other in the same answer; go back and ask."],
      ["E", "This year is 2023, so if you were born in 2010 you are 13 this year.", "Out of date", "Compare with today’s date: AI doesn’t necessarily know what “today” is."],
      ["F", "A $260 jacket at 20% off is $208.", "Right", "260 × 0.8 = 208. Some cards are right: checking doesn’t mean assuming AI is always wrong."],
    ],
    opts: ["Right", "Wrong", "Out of date", "Unverified"],
    card: (id) => `Card ${id} · AI (Demo)`,
    answerIs: (w) => `✗ The answer is “${w}”. `,
    cardScore: (n, total) => `Score ${n} / ${total} (in class, you also need written evidence for full marks)`,
    log: {
      key: "aiforall-c4-log-en",
      cols: ["What the AI said", "Light", "Move used", "Evidence (link / book and page / whom you asked)", "Conclusion", "How I used it"],
      pick: { 1: ["", "Green", "Amber", "Red"], 2: ["", "Source", "Cross-check", "Sums", "Counterexample", "Ask a person"], 4: ["", "Right", "Wrong", "Out of date", "Unverified"], 5: ["", "As is", "Edited", "Not used"] },
      sample: ["“Mount Everest is 8,844.43 metres” (Demo)", "Amber", "Cross-check", "People’s Daily report reposted by Xinhua, 2020-12-09", "Out of date", "Edited"],
      add: "Add a row", csv: "Download CSV", clear: "Clear",
      hint: "Stored only in your own browser; nothing is uploaded.",
      file: "checking-log.csv",
    },
  },
};
const T = L10N[typeof PAGE_LANG === "string" && L10N[PAGE_LANG] ? PAGE_LANG : "zh"];

const HERO_STEPS = T.heroSteps;

function heroCheck(el) {
  let k = 0, phase = 0;
  const draw = () => {
    const s = HERO_STEPS[k];
    el.innerHTML = `<div class="aicard"><div class="who">${T.aiDemo}</div>${escHTML(s.ai)}</div>
      <p style="margin:6px 0">${phase >= 1 ? `${T.whichMove}<b>${s.move}</b>` : "&nbsp;"}</p>
      <p class="feedback ${s.ok ? "ok" : "no"}">${phase >= 2 ? escHTML(s.verdict) : "&nbsp;"}</p>`;
  };
  draw();
  setInterval(() => {
    phase += 1;
    if (phase > 2) { phase = 0; k = (k + 1) % HERO_STEPS.length; }
    draw();
  }, 1800);
}

const LIGHT_TASKS = T.lightTasks;

function lights(el) {
  const name = T.lightName;
  el.innerHTML = LIGHT_TASKS.map(([task], i) => `<div style="margin:10px 0"><div>${i + 1}. ${escHTML(task)}</div>
    <div class="choices" data-i="${i}">${["g", "y", "r"].map((c) => `<button data-c="${c}"><span class="lamp ${c}"></span>${name[c]}</button>`).join("")}</div>
    <div class="feedback" id="lf${i}"></div></div>`).join("") + `<p class="counter" id="lscore"></p>`;
  const got = {};
  el.querySelectorAll(".choices").forEach((row) => {
    row.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const i = +row.dataset.i, [, want, why] = LIGHT_TASKS[i];
        row.querySelectorAll("button").forEach((x) => x.classList.remove("on", "bad"));
        const right = b.dataset.c === want;
        b.classList.add(right ? "on" : "bad");
        const fb = el.querySelector(`#lf${i}`);
        fb.className = `feedback ${right ? "ok" : "no"}`;
        fb.textContent = `${right ? "✓" : T.suggest(name[want])} ${why}`;
        got[i] = right;
        const n = Object.values(got).filter(Boolean).length;
        el.querySelector("#lscore").textContent = T.lightScore(Object.keys(got).length, LIGHT_TASKS.length, n);
      };
    });
  });
}

// 自己算：打折和满减，两种顺序都算出来。
function calc(el) {
  const C = T.calc;
  const unit = C.unit ? ` ${C.unit}` : "";
  el.innerHTML = `<div class="calc">
      <label>${C.price} <input id="cp" type="number" value="260" min="0">${unit}</label>
      <label>${C.discount} <input id="cd" type="number" value="0.8" step="0.05" min="0" max="1"></label>
      <label>${C.over} <input id="ct" type="number" value="200" min="0">${unit}</label>
      <label>${C.off} <input id="cc" type="number" value="30" min="0">${unit}</label>
    </div>
    <div class="aicard"><div class="who">${T.aiDemo}</div>${C.ai}</div>
    <div id="cout"></div>`;
  const v = (id) => parseFloat(el.querySelector(id).value) || 0;
  const money = (x) => (Math.round(x * 100) / 100).toString();
  const update = () => {
    const p = v("#cp"), d = v("#cd"), t = v("#ct"), c = v("#cc");
    const a1 = p * d, a = a1 >= t ? a1 - c : a1;
    const b1 = p >= t ? p - c : p, b = b1 * d;
    const hit = [a, b].some((x) => Math.abs(x - 182) < 0.005);
    el.querySelector("#cout").innerHTML = `<p><b>${C.discFirst}</b>${money(p)} × ${d} = ${C.fmt(money(a1))}${C.sep}${a1 >= t ? C.applies(t, c, C.bold(money(a))) : C.notApplies(t, C.bold(money(a)))}</p>
      <p><b>${C.couponFirst}</b>${p >= t ? `(${money(p)} − ${c})` : money(p)} × ${d} = ${C.bold(money(b))}</p>
      <p class="feedback ${hit ? "ok" : "no"}">${hit ? C.match : C.noMatch}</p>`;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = update; });
  update();
}

const CARDS = T.cards;

function challenge(el) {
  const opts = T.opts;
  el.innerHTML = CARDS.map(([id, text], i) => `<div class="aicard"><div class="who">${T.card(id)}</div>${escHTML(text)}
      <div class="choices" data-i="${i}">${opts.map((o) => `<button>${o}</button>`).join("")}</div>
      <div class="feedback" id="cf${i}"></div></div>`).join("") + `<p class="score" id="cscore"></p>`;
  const got = {};
  el.querySelectorAll(".choices").forEach((row) => {
    row.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const i = +row.dataset.i, [, , want, why] = CARDS[i];
        row.querySelectorAll("button").forEach((x) => x.classList.remove("on", "bad"));
        const right = b.textContent === want;
        b.classList.add(right ? "on" : "bad");
        const fb = el.querySelector(`#cf${i}`);
        fb.className = `feedback ${right ? "ok" : "no"}`;
        fb.textContent = `${right ? "✓ " : T.answerIs(want)}${why}`;
        got[i] = right;
        el.querySelector("#cscore").textContent = T.cardScore(Object.values(got).filter(Boolean).length, CARDS.length);
      };
    });
  });
}

// 核验记录表：在浏览器里填，存在本机（localStorage），可下载 CSV。不上传任何数据。
function logSheet(el) {
  const G = T.log;
  const KEY = G.key;
  const cols = G.cols;
  const pick = G.pick;
  let rows;
  try { rows = JSON.parse(localStorage.getItem(KEY)) || []; } catch { rows = []; }
  if (!rows.length) rows = [G.sample.slice(), ["", "", "", "", "", ""]];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch { /* storage unavailable */ } };
  const draw = () => {
    el.innerHTML = `<div style="overflow-x:auto"><table class="log"><thead><tr><th>#</th>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td>${i + 1}</td>${r.map((v, j) => `<td>${pick[j] ? `<select data-r="${i}" data-c="${j}">${pick[j].map((o) => `<option${o === v ? " selected" : ""}>${o}</option>`).join("")}</select>` : `<input data-r="${i}" data-c="${j}" value="${escHTML(v)}">`}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div>
      <div class="btnrow" style="margin-top:10px"><button class="cbtn" id="ladd">${G.add}</button><button class="cbtn" id="lcsv">${G.csv}</button><button class="cbtn" id="lclear">${G.clear}</button></div>
      <p class="hint">${G.hint}</p>`;
    el.querySelectorAll("input, select").forEach((x) => {
      x.onchange = x.oninput = () => { rows[+x.dataset.r][+x.dataset.c] = x.value; save(); };
    });
    el.querySelector("#ladd").onclick = () => { rows.push(["", "", "", "", "", ""]); save(); draw(); };
    el.querySelector("#lclear").onclick = () => { rows = [["", "", "", "", "", ""]]; save(); draw(); };
    el.querySelector("#lcsv").onclick = () => {
      const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
      const csv = "\ufeff" + [cols, ...rows].map((r) => r.map(q).join(",")).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = G.file;
      a.click();
    };
  };
  draw();
}

const DEMOS = { heroCheck, lights, calc, challenge, logSheet };
