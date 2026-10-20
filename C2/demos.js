// C2 的互动演示。语料、牌和挑战题都是构造的演示材料（见 notes/C2-data-models-hallucination.md 第 2、4 节）。
// 中英两版共用这一份（英文页 site/en/C2/ 也加载它）：文字和语料在 L10N 表里，按 course.js 的 PAGE_LANG 取。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const L10N = {
  zh: {
    // 一个极小的「接龙模型」：数一数语料里每个词后面跟过什么词，按次数挑下一个。演示用，和真实的大模型差得很远。
    corpus: [
      "披萨 上 放 奶酪", "披萨 上 放 番茄", "奶酪 掉 了 就 多 烤 一会儿", "奶酪 掉 了 就 等 酱 凉 一点",
      "今天 天气 真 好", "今天 天气 真 热", "今天 天气 真 好", "床前 明月 光",
    ],
    joke: "奶酪 掉 了 就 加 胶水", glue: "胶水", sep: "", starts: ["奶酪", "今天", "披萨", "床前"],
    corpusLabel: (joke) => `语料：${joke ? "<b>混进了一条玩笑</b>" : "正常"}（演示）`,
    model: "接龙模型（演示）", jokeOut: "数据里的玩笑，被它接了出来。",
    pickStart: "选一个开头的词，看模型怎样一个词一个词往下接。每次点都可能不一样。",
    addJoke: (j) => `往语料里加一条玩笑：「${j}」`,
    followed: (w, list) => `语料里「${w}」后面跟过：${list || "（没有）"}`, listSep: "，",
    trainCards: "<b>训练牌</b>（标好了好坏）：", goodCards: "好牌：", badCards: "坏牌：",
    whichRule: "你从训练牌里总结出哪条规则？", ruleColor: "红色是好牌", ruleBig: "点数大于 7 是好牌",
    exam: "考试：10 张新牌", scored: (r, n) => `判对 ${r} / ${n}。`,
    colorLesson: "训练牌挑得有偏：好牌碰巧都是红色。规则忠实地学了数据里的规律，可那不是真规律。",
    bigLesson: "这就是老师心里的真规则（演示）。但只看训练牌，「红色」和「点数大」分不开：要靠更多、更全的数据。",
  },
  en: {
    // A tiny "word-chain model": count which word followed which in the corpus, and pick the next word by those
    // counts. A demo only, nothing like a real large model. (The Chinese edition has a Chinese corpus.)
    corpus: [
      "pizza with cheese on top", "pizza with tomato on top", "cheese slides off so bake it longer",
      "cheese slides off so let sauce cool first", "today the weather is lovely", "today the weather is hot",
      "today the weather is lovely", "twinkle twinkle little star",
    ],
    joke: "cheese slides off so add glue", glue: "glue", sep: " ", starts: ["cheese", "today", "pizza", "twinkle"],
    corpusLabel: (joke) => `Corpus: ${joke ? "<b>a joke has been mixed in</b>" : "normal"} (Demo)`,
    model: "Word-chain model (Demo)", jokeOut: "The joke in the data came out in the answer.",
    pickStart: "Pick a starting word and watch the model continue one word at a time. Each click may differ.",
    addJoke: (j) => `Add a joke to the corpus: “${j}”`,
    followed: (w, list) => `In the corpus, “${w}” was followed by: ${list || "(nothing)"}`, listSep: ", ",
    trainCards: "<b>Training cards</b> (labelled good or bad):", goodCards: "Good: ", badCards: "Bad: ",
    whichRule: "Which rule did you take from the training cards?", ruleColor: "Red cards are good", ruleBig: "Cards above 7 are good",
    exam: "Exam: 10 new cards", scored: (r, n) => `${r} / ${n} judged correctly. `,
    colorLesson: "The training cards were chosen with a bias: the good ones all happened to be red. The rule faithfully learned the pattern in the data, but it isn't the real pattern.",
    bigLesson: "That's the teacher's real rule (Demo). But from the training cards alone, “red” and “high number” can't be told apart: you need more, and more varied, data.",
  },
};
const T = L10N[typeof PAGE_LANG === "string" ? PAGE_LANG : "zh"];
const CORPUS = T.corpus;
const JOKE = T.joke;

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
  return out.join(T.sep);
}

// 首页：反复从「奶酪」开始接龙，一半时间语料里混进了那条玩笑。
function heroChain(el) {
  let k = 0;
  const draw = () => {
    const joke = k % 2 === 1;
    const model = train(joke ? [...CORPUS, JOKE, JOKE] : CORPUS);
    const text = generate(model, T.starts[0]);
    el.innerHTML = `<p class="hint">${T.corpusLabel(joke)}</p>
      <div class="aicard"><div class="who">${T.model}</div>${escHTML(text)}</div>
      <p class="feedback ${text.includes(T.glue) ? "no" : "ok"}">${text.includes(T.glue) ? T.jokeOut : "&nbsp;"}</p>`;
    k += 1;
  };
  draw();
  setInterval(draw, 2600);
}

function nextWord(el) {
  el.innerHTML = `<p>${T.pickStart}</p>
    <div class="btnrow">${T.starts.map((w) => `<button class="cbtn" data-w="${w}">${w}</button>`).join("")}</div>
    <label style="display:block;margin:10px 0"><input type="checkbox" id="njoke"> ${T.addJoke(JOKE.split(" ").join(T.sep))}</label>
    <div id="nout"></div><div id="ncand"></div>`;
  const run = (start) => {
    const joke = el.querySelector("#njoke").checked;
    const model = train(joke ? [...CORPUS, JOKE, JOKE] : CORPUS);
    const text = generate(model, start);
    el.querySelector("#nout").innerHTML = `<div class="aicard"><div class="who">${T.model}</div>${escHTML(text)}</div>`;
    const after = model[start] || {};
    el.querySelector("#ncand").innerHTML = `<p class="hint">${T.followed(escHTML(start), Object.entries(after).map(([w, n]) => `${escHTML(w)} ×${n}`).join(T.listSep))}</p>`;
  };
  el.querySelectorAll("[data-w]").forEach((b) => { b.onclick = () => run(b.dataset.w); });
  run(T.starts[0]);
}

// 纸牌分类器：训练用的 10 张牌挑得有偏（好牌恰好都是红色），学到的规则在新牌上露馅。
const SUITS = { "♥": "red", "♦": "red", "♠": "black", "♣": "black" };
const TRAIN = [["♥", 9], ["♦", 10], ["♥", 8], ["♦", 13], ["♥", 12], ["♠", 3], ["♣", 2], ["♠", 5], ["♣", 6], ["♠", 4]];
const TEST = [["♠", 11], ["♥", 3], ["♣", 9], ["♦", 2], ["♠", 13], ["♥", 10], ["♣", 4], ["♦", 6], ["♠", 8], ["♥", 5]];
const good = ([, n]) => n > 7;   // 老师心里的真规则（演示）
const RULES2 = { color: [T.ruleColor, ([s]) => SUITS[s] === "red"], big: [T.ruleBig, (c) => c[1] > 7] };

function cardClassifier(el) {
  const show = ([s, n]) => `<span style="display:inline-block;min-width:3.2em;padding:4px 6px;margin:3px;border:1px solid currentColor;border-radius:6px;color:${SUITS[s] === "red" ? "#B5452F" : "inherit"}">${s}${n}</span>`;
  el.innerHTML = `<p>${T.trainCards}</p>
    <p>${T.goodCards}${TRAIN.filter(good).map(show).join("")}</p><p>${T.badCards}${TRAIN.filter((c) => !good(c)).map(show).join("")}</p>
    <p><b>${T.whichRule}</b></p>
    <div class="choices">${Object.entries(RULES2).map(([k, [t]]) => `<button data-k="${k}">${t}</button>`).join("")}</div>
    <div id="kout"></div>`;
  el.querySelectorAll("[data-k]").forEach((b) => {
    b.onclick = () => {
      el.querySelectorAll("[data-k]").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      const [, rule] = RULES2[b.dataset.k];
      const right = TEST.filter((c) => rule(c) === good(c)).length;
      el.querySelector("#kout").innerHTML = `<p><b>${T.exam}</b></p><p>${TEST.map((c) => `${show(c)}${rule(c) === good(c) ? "✓" : "✗"}`).join(" ")}</p>
        <p class="feedback ${right === TEST.length ? "ok" : "no"}">${T.scored(right, TEST.length)}${b.dataset.k === "color" ? T.colorLesson : T.bigLesson}</p>`;
    };
  });
}

const DEMOS = { heroChain, nextWord, cardClassifier };
