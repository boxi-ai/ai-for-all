// C4 的互动演示。所有「AI 回答」都是构造的演示材料（见 notes/C4-verify.md 第 4、6 节）。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 首页：自动轮播三个演示例子（AI 说 → 用哪招 → 结论）。
const HERO_STEPS = [
  { ai: "从 2026 年 3 月 1 日算起，30 天后是 3 月 30 日。", move: "自己算", verdict: "错：3 月有 31 天，应是 3 月 31 日", ok: false },
  { ai: "所有质数都是奇数。", move: "找反例", verdict: "错：2 是质数，但是偶数", ok: false },
  { ai: "珠穆朗玛峰海拔 8844.43 米。", move: "交叉核对", verdict: "过时：2020 年公布的最新高程是 8848.86 米", ok: false },
  { ai: "一件 260 元的衣服打八折是 208 元。", move: "自己算", verdict: "对：260 × 0.8 = 208", ok: true },
];

function heroCheck(el) {
  let k = 0, phase = 0;
  const draw = () => {
    const s = HERO_STEPS[k];
    el.innerHTML = `<div class="aicard"><div class="who">AI（演示）</div>${escHTML(s.ai)}</div>
      <p style="margin:6px 0">${phase >= 1 ? `用哪一招：<b>${s.move}</b>` : "&nbsp;"}</p>
      <p class="feedback ${s.ok ? "ok" : "no"}">${phase >= 2 ? escHTML(s.verdict) : "&nbsp;"}</p>`;
  };
  draw();
  setInterval(() => {
    phase += 1;
    if (phase > 2) { phase = 0; k = (k + 1) % HERO_STEPS.length; }
    draw();
  }, 1800);
}

// 信号灯：给 8 件事定级。
const LIGHT_TASKS = [
  ["让 AI 给小狗起十个名字", "g", "错了也没损失，挑喜欢的就行。"],
  ["让 AI 写一段生日祝福", "g", "看着顺眼就行。"],
  ["让 AI 总结一篇新闻，准备转发到家庭群", "y", "转发前找到原始新闻核对关键事实。"],
  ["让 AI 帮忙整理复习提纲", "y", "核对提纲里的定义、年份和公式。"],
  ["让 AI 写周报里的销售数字分析", "y", "数字逐个对回原始表格，自己复算。"],
  ["问 AI 某种药能不能和降压药一起吃", "r", "健康问题：问医生或药师。"],
  ["「孙子」视频里说急需用钱，让你转账", "r", "钱：挂断，用自己存的号码打回去确认。"],
  ["让 AI 解释合同里的违约条款", "r", "法律问题：以合同原文为准，问律师或法务。"],
];

function lights(el) {
  const name = { g: "绿灯", y: "黄灯", r: "红灯" };
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
        fb.textContent = `${right ? "✓" : "✗ 建议：" + name[want] + "。"} ${why}`;
        got[i] = right;
        const n = Object.values(got).filter(Boolean).length;
        el.querySelector("#lscore").textContent = `已答 ${Object.keys(got).length} / ${LIGHT_TASKS.length}，和建议一致 ${n} 个`;
      };
    });
  });
}

// 自己算：打折和满减，两种顺序都算出来。
function calc(el) {
  el.innerHTML = `<div class="calc">
      <label>原价 <input id="cp" type="number" value="260" min="0"> 元</label>
      <label>折扣 <input id="cd" type="number" value="0.8" step="0.05" min="0" max="1"></label>
      <label>满 <input id="ct" type="number" value="200" min="0"> 元</label>
      <label>减 <input id="cc" type="number" value="30" min="0"> 元</label>
    </div>
    <div class="aicard"><div class="who">AI（演示）</div>最后需要付 182 元。</div>
    <div id="cout"></div>`;
  const v = (id) => parseFloat(el.querySelector(id).value) || 0;
  const money = (x) => (Math.round(x * 100) / 100).toString();
  const update = () => {
    const p = v("#cp"), d = v("#cd"), t = v("#ct"), c = v("#cc");
    const a1 = p * d, a = a1 >= t ? a1 - c : a1;
    const b1 = p >= t ? p - c : p, b = b1 * d;
    el.querySelector("#cout").innerHTML = `<p><b>先打折、再用券：</b>${money(p)} × ${d} = ${money(a1)} 元；${a1 >= t ? `满 ${t}，减 ${c}，得 <b>${money(a)}</b> 元` : `不满 ${t}，券不能用，得 <b>${money(a)}</b> 元`}</p>
      <p><b>先用券、再打折：</b>${p >= t ? `(${money(p)} − ${c})` : money(p)} × ${d} = <b>${money(b)}</b> 元</p>
      <p class="feedback ${[a, b].some((x) => Math.abs(x - 182) < 0.005) ? "ok" : "no"}">${[a, b].some((x) => Math.abs(x - 182) < 0.005) ? "AI 的 182 元和其中一种算法对上了。" : "AI 的 182 元和两种算法都对不上。真正付多少，看店里的规则。"}</p>`;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = update; });
  update();
}

// 找错挑战：6 张卡（同讲义第 6 节）。
const CARDS = [
  ["A", "从 2026 年 3 月 1 日算起，30 天后是 3 月 30 日。", "错", "自己算：3 月有 31 天，3 月 1 日之后的第 30 天是 3 月 31 日。"],
  ["B", "所有质数都是奇数。", "错", "找反例：2 是质数，但是偶数。"],
  ["C", "一瓶 500 毫升的矿泉水，就是 5 升。", "错", "自己算 / 单位：500 毫升 = 0.5 升。"],
  ["D", "会议定在下周二上午。……那我们下周三上午会上见！", "错", "前后不一致：同一段回答里日期自相矛盾，要回头问清楚。"],
  ["E", "今年是 2023 年，所以你出生于 2010 年的话今年 13 岁。", "过时", "对照今天的日期：AI 不一定知道「今天」是哪天。"],
  ["F", "一件 260 元的衣服打八折是 208 元。", "对", "260 × 0.8 = 208。也有对的卡：核验不是认定 AI 全错。"],
];

function challenge(el) {
  const opts = ["对", "错", "过时", "未核实"];
  el.innerHTML = CARDS.map(([id, text], i) => `<div class="aicard"><div class="who">卡 ${id} · AI（演示）</div>${escHTML(text)}
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
        fb.textContent = `${right ? "✓ " : `✗ 答案是「${want}」。`}${why}`;
        got[i] = right;
        el.querySelector("#cscore").textContent = `得分 ${Object.values(got).filter(Boolean).length} / ${CARDS.length}（课堂上还要写出证据才算满分）`;
      };
    });
  });
}

// 核验记录表：在浏览器里填，存在本机（localStorage），可下载 CSV。不上传任何数据。
function logSheet(el) {
  const KEY = "aiforall-c4-log";
  const cols = ["AI 说的原话", "信号灯", "用了哪一招", "证据（链接 / 书名页码 / 问了谁）", "结论", "我最后怎么用"];
  const pick = { 1: ["", "绿", "黄", "红"], 2: ["", "问来源", "交叉核对", "自己算", "找反例", "问人"], 4: ["", "对", "错", "过时", "未核实"], 5: ["", "照用", "改了再用", "不用"] };
  let rows;
  try { rows = JSON.parse(localStorage.getItem(KEY)) || []; } catch { rows = []; }
  if (!rows.length) rows = [["「珠穆朗玛峰海拔 8844.43 米」（演示）", "黄", "交叉核对", "新华网 2020-12-09 转载人民日报报道", "过时", "改了再用"], ["", "", "", "", "", ""]];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch { /* storage unavailable */ } };
  const draw = () => {
    el.innerHTML = `<div style="overflow-x:auto"><table class="log"><thead><tr><th>#</th>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td>${i + 1}</td>${r.map((v, j) => `<td>${pick[j] ? `<select data-r="${i}" data-c="${j}">${pick[j].map((o) => `<option${o === v ? " selected" : ""}>${o}</option>`).join("")}</select>` : `<input data-r="${i}" data-c="${j}" value="${escHTML(v)}">`}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div>
      <div class="btnrow" style="margin-top:10px"><button class="cbtn" id="ladd">加一行</button><button class="cbtn" id="lcsv">下载 CSV</button><button class="cbtn" id="lclear">清空</button></div>
      <p class="hint">只存在你自己的浏览器里，不会上传。</p>`;
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
      a.download = "核验记录表.csv";
      a.click();
    };
  };
  draw();
}

const DEMOS = { heroCheck, lights, calc, challenge, logSheet };
