// C2 的互动演示。语料、牌和挑战题都是构造的演示材料（见 notes/C2-data-models-hallucination.md 第 2、4 节）。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 一个极小的「接龙模型」：数一数语料里每个词后面跟过什么词，按次数挑下一个。演示用，和真实的大模型差得很远。
const CORPUS = [
  "披萨 上 放 奶酪", "披萨 上 放 番茄", "奶酪 掉 了 就 多 烤 一会儿", "奶酪 掉 了 就 等 酱 凉 一点",
  "今天 天气 真 好", "今天 天气 真 热", "今天 天气 真 好", "床前 明月 光",
];
const JOKE = "奶酪 掉 了 就 加 胶水";

function train(lines) {
  const next = {};
  lines.forEach((line) => {
    const w = line.split(" ");
    for (let i = 0; i + 1 < w.length; i++) {
      next[w[i]] = next[w[i]] || {};
      next[w[i]][w[i + 1]] = (next[w[i]][w[i + 1]] || 0) + 1;
    }
  });
  return next;
}

function pick(counts) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [w, n] of Object.entries(counts)) { r -= n; if (r <= 0) return w; }
  return Object.keys(counts)[0];
}

function generate(model, start, max = 8) {
  const out = [start];
  while (out.length < max && model[out[out.length - 1]]) out.push(pick(model[out[out.length - 1]]));
  return out.join("");
}

// 首页：反复从「奶酪」开始接龙，一半时间语料里混进了那条玩笑。
function heroChain(el) {
  let k = 0;
  const draw = () => {
    const joke = k % 2 === 1;
    const model = train(joke ? [...CORPUS, JOKE, JOKE] : CORPUS);
    const text = generate(model, "奶酪");
    el.innerHTML = `<p class="hint">语料：${joke ? "<b>混进了一条玩笑</b>" : "正常"}（演示）</p>
      <div class="aicard"><div class="who">接龙模型（演示）</div>${escHTML(text)}</div>
      <p class="feedback ${text.includes("胶水") ? "no" : "ok"}">${text.includes("胶水") ? "数据里的玩笑，被它接了出来。" : "&nbsp;"}</p>`;
    k += 1;
  };
  draw();
  setInterval(draw, 2600);
}

function nextWord(el) {
  el.innerHTML = `<p>选一个开头的词，看模型怎样一个词一个词往下接。每次点都可能不一样。</p>
    <div class="btnrow">${["奶酪", "今天", "披萨", "床前"].map((w) => `<button class="cbtn" data-w="${w}">${w}</button>`).join("")}</div>
    <label style="display:block;margin:10px 0"><input type="checkbox" id="njoke"> 往语料里加一条玩笑：「${JOKE.replace(/ /g, "")}」</label>
    <div id="nout"></div><div id="ncand"></div>`;
  const run = (start) => {
    const joke = el.querySelector("#njoke").checked;
    const model = train(joke ? [...CORPUS, JOKE, JOKE] : CORPUS);
    const text = generate(model, start);
    el.querySelector("#nout").innerHTML = `<div class="aicard"><div class="who">接龙模型（演示）</div>${escHTML(text)}</div>`;
    const after = model[start] || {};
    el.querySelector("#ncand").innerHTML = `<p class="hint">语料里「${escHTML(start)}」后面跟过：${Object.entries(after).map(([w, n]) => `${escHTML(w)} ×${n}`).join("，") || "（没有）"}</p>`;
  };
  el.querySelectorAll("[data-w]").forEach((b) => { b.onclick = () => run(b.dataset.w); });
  run("奶酪");
}

// 纸牌分类器：训练用的 10 张牌挑得有偏（好牌恰好都是红色），学到的规则在新牌上露馅。
const SUITS = { "♥": "red", "♦": "red", "♠": "black", "♣": "black" };
const TRAIN = [["♥", 9], ["♦", 10], ["♥", 8], ["♦", 13], ["♥", 12], ["♠", 3], ["♣", 2], ["♠", 5], ["♣", 6], ["♠", 4]];
const TEST = [["♠", 11], ["♥", 3], ["♣", 9], ["♦", 2], ["♠", 13], ["♥", 10], ["♣", 4], ["♦", 6], ["♠", 8], ["♥", 5]];
const good = ([, n]) => n > 7;   // 老师心里的真规则（演示）
const RULES2 = { color: ["红色是好牌", ([s]) => SUITS[s] === "red"], big: ["点数大于 7 是好牌", (c) => c[1] > 7] };

function cardClassifier(el) {
  const show = ([s, n]) => `<span style="display:inline-block;min-width:3.2em;padding:4px 6px;margin:3px;border:1px solid currentColor;border-radius:6px;color:${SUITS[s] === "red" ? "#B5452F" : "inherit"}">${s}${n}</span>`;
  el.innerHTML = `<p><b>训练牌</b>（标好了好坏）：</p>
    <p>好牌：${TRAIN.filter(good).map(show).join("")}</p><p>坏牌：${TRAIN.filter((c) => !good(c)).map(show).join("")}</p>
    <p><b>你从训练牌里总结出哪条规则？</b></p>
    <div class="choices">${Object.entries(RULES2).map(([k, [t]]) => `<button data-k="${k}">${t}</button>`).join("")}</div>
    <div id="kout"></div>`;
  el.querySelectorAll("[data-k]").forEach((b) => {
    b.onclick = () => {
      el.querySelectorAll("[data-k]").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      const [, rule] = RULES2[b.dataset.k];
      const right = TEST.filter((c) => rule(c) === good(c)).length;
      el.querySelector("#kout").innerHTML = `<p><b>考试：10 张新牌</b></p><p>${TEST.map((c) => `${show(c)}${rule(c) === good(c) ? "✓" : "✗"}`).join(" ")}</p>
        <p class="feedback ${right === TEST.length ? "ok" : "no"}">判对 ${right} / ${TEST.length}。${b.dataset.k === "color"
          ? "训练牌挑得有偏：好牌碰巧都是红色。规则忠实地学了数据里的规律，可那不是真规律。"
          : "这就是老师心里的真规则（演示）。但只看训练牌，「红色」和「点数大」分不开：要靠更多、更全的数据。"}</p>`;
    };
  });
}

const DEMOS = { heroChain, nextWord, cardClassifier };
