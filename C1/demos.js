// C1 的互动演示。分类卡、规则卡和词语都是构造的演示材料（见 notes/C1-what-is-ai.md 第 4 节）。
// 中英两版共用这一份（英文页 site/en/C1/ 也加载它）：文字和数据在 L10N 表里，按 course.js 的 PAGE_LANG 取。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const L10N = {
  zh: {
    // 「这是不是 AI？」：同讲义第 4 节的分类卡。kind 为空表示按固定规则运行，一般不叫 AI。
    items: [
      ["导航估计到达时间", "预测", "根据路况等输入，推算你几点到。"],
      ["计算器算加法", "", "按固定的算术规则运行，一般不叫 AI。"],
      ["短视频推荐下一条", "推荐", "根据你看过什么，推算你可能想看什么。"],
      ["刷脸开门", "决定", "认出是不是你，再决定开不开门。"],
      ["按时响铃的闹钟", "", "到点就响，是固定规则。"],
      ["聊天机器人写作文", "内容", "根据你的要求，生成一段文字。"],
      ["垃圾邮件自动归类", "决定", "根据邮件内容，推算是不是垃圾邮件并归类。"],
      ["电梯按楼层停", "", "按按钮停，是固定规则。"],
      ["自动翻译", "内容", "根据原文，生成另一种语言的文字。"],
      ["拍照自动美颜", "内容", "有争议：如果是从大量照片里学出来的效果，算 AI；如果只是固定的磨皮滤镜，就不算。"],
    ],
    heroWho: "这是 AI 吗？（演示）",
    isAI: (kind) => `是 AI · 输出：<b>${kind}</b>`, notAIusually: "一般不叫 AI",
    opts: ["不是 AI", "预测", "推荐", "内容", "决定"], notAI: "不是 AI",
    suggest: (w) => `✗ 建议：${w}。`,
    score: (n, total, ok) => `已答 ${n} / ${total}，和建议一致 ${ok} 个`,
    // 猜规则：「机器」按一张藏起来的规则卡回答。规则只看字数，所以电脑也能「照规则办事」。
    rules: [["词语里有动物，就说「是」", false], ["词语是两个字，就说「是」", true], ["词语能吃，就说「是」", false]],
    rule: (w) => [...w.trim()].length === 2,
    yes: "是", no: "不是",
    guessIntro: "输入一个词，看「机器」怎么答。多试几个，再猜它的规则卡。",
    word: "词语", firstWord: "小猫", ask: "问机器", guessQ: "你猜规则卡是哪一张？",
    machine: "机器（演示）", quote: (w) => `「${w}」`,
    right: "✓ 就是字数。「小猫」「老虎」碰巧是两个字的动物，很像「有动物」那张卡：机器做得对，却根本不知道什么是动物。",
    wrong: "✗ 再试几个词，比如「大熊猫」「桌子」「苹果」。",
  },
  en: {
    // "Is this AI?" sorting cards, as in section 4 of notes/en/C1. An empty kind means fixed rules, usually not called AI.
    items: [
      ["A map app estimating your arrival time", "Prediction", "From traffic and other inputs, it works out when you'll get there."],
      ["A calculator adding numbers", "", "It follows fixed arithmetic rules; usually not called AI."],
      ["A video app recommending the next video", "Recommendation", "From what you've watched, it works out what you might want next."],
      ["A door that unlocks by face", "Decision", "It recognises whether it's you, then decides whether to open."],
      ["An alarm clock ringing on time", "", "It rings at the set time: a fixed rule."],
      ["A chatbot writing an essay", "Content", "From your request, it generates a piece of text."],
      ["Email sorting spam automatically", "Decision", "From the email's content, it works out whether it's spam and files it."],
      ["A lift stopping at floors", "", "It stops where the buttons say: a fixed rule."],
      ["Automatic translation", "Content", "From the original, it generates text in another language."],
      ["A camera's automatic beauty filter", "Content", "Debatable: if the effect was learned from lots of photos, it's AI; if it's just a fixed smoothing filter, it isn't."],
    ],
    heroWho: "Is this AI? (Demo)",
    isAI: (kind) => `AI · output: <b>${kind}</b>`, notAIusually: "Usually not called AI",
    opts: ["Not AI", "Prediction", "Recommendation", "Content", "Decision"], notAI: "Not AI",
    suggest: (w) => `✗ Suggested: ${w}. `,
    score: (n, total, ok) => `Answered ${n} / ${total}; ${ok} match the suggestion`,
    // Guess the rule: the "machine" answers from a hidden rule card. The rule only counts letters,
    // so a computer can "follow the rule" too. (The Chinese edition counts characters instead.)
    rules: [["If the word is an animal, say “yes”", false], ["If the word has four letters, say “yes”", true], ["If you can eat it, say “yes”", false]],
    rule: (w) => w.trim().replace(/[^a-z]/gi, "").length === 4,
    yes: "yes", no: "no",
    guessIntro: "Type a word and see how the “machine” answers. Try a few, then guess its rule card.",
    word: "Word", firstWord: "lion", ask: "Ask the machine", guessQ: "Which rule card do you think it has?",
    machine: "Machine (Demo)", quote: (w) => `“${w}”`,
    right: "✓ It's the letter count. “lion” and “bear” happen to be four-letter animals, so it looks a lot like the “animal” card: the machine gets it right without knowing what an animal is.",
    wrong: "✗ Try a few more words, such as “elephant”, “desk” and “apple”.",
  },
};
const T = L10N[typeof PAGE_LANG === "string" ? PAGE_LANG : "zh"];
const ITEMS = T.items;

// 首页：轮播几张分类卡（东西 → 是不是 AI → 输出类型）。
function heroIsAI(el) {
  let k = 0, phase = 0;
  const draw = () => {
    const [name, kind, why] = ITEMS[k];
    el.innerHTML = `<div class="aicard"><div class="who">${T.heroWho}</div><b>${escHTML(name)}</b></div>
      <p style="margin:6px 0">${phase >= 1 ? (kind ? T.isAI(kind) : T.notAIusually) : "&nbsp;"}</p>
      <p class="feedback ${kind ? "ok" : "no"}">${phase >= 2 ? escHTML(why) : "&nbsp;"}</p>`;
  };
  draw();
  setInterval(() => {
    phase += 1;
    if (phase > 2) { phase = 0; k = (k + 1) % ITEMS.length; }
    draw();
  }, 1800);
}

function isAI(el) {
  const opts = T.opts;
  el.innerHTML = ITEMS.map(([name], i) => `<div style="margin:10px 0"><div>${i + 1}. ${escHTML(name)}</div>
    <div class="choices" data-i="${i}">${opts.map((o) => `<button>${o}</button>`).join("")}</div>
    <div class="feedback" id="af${i}"></div></div>`).join("") + `<p class="counter" id="ascore"></p>`;
  const got = {};
  el.querySelectorAll(".choices").forEach((row) => {
    row.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const i = +row.dataset.i, [, kind, why] = ITEMS[i];
        const want = kind || T.notAI;
        row.querySelectorAll("button").forEach((x) => x.classList.remove("on", "bad"));
        const right = b.textContent === want || (i === ITEMS.length - 1 && b.textContent === T.notAI);
        b.classList.add(right ? "on" : "bad");
        const fb = el.querySelector(`#af${i}`);
        fb.className = `feedback ${right ? "ok" : "no"}`;
        fb.textContent = `${right ? "✓ " : T.suggest(want)}${why}`;
        got[i] = right;
        el.querySelector("#ascore").textContent = T.score(Object.keys(got).length, ITEMS.length, Object.values(got).filter(Boolean).length);
      };
    });
  });
}

const RULES = T.rules;

function guessRule(el) {
  const answer = (w) => (T.rule(w) ? T.yes : T.no);
  el.innerHTML = `<p>${T.guessIntro}</p>
    <div class="calc"><label>${T.word} <input id="gw" value="${T.firstWord}" maxlength="12"></label><button class="cbtn" id="gask">${T.ask}</button></div>
    <div id="glog"></div>
    <p><b>${T.guessQ}</b></p>
    <div class="choices" id="gopts">${RULES.map(([r]) => `<button>${r}</button>`).join("")}</div>
    <p class="feedback" id="gfb"></p>`;
  const log = [];
  const ask = () => {
    const w = el.querySelector("#gw").value.trim();
    if (!w) return;
    log.unshift(`<div class="aicard"><div class="who">${T.machine}</div>${T.quote(escHTML(w))} → <b>${answer(w)}</b></div>`);
    el.querySelector("#glog").innerHTML = log.slice(0, 6).join("");
  };
  el.querySelector("#gask").onclick = ask;
  el.querySelector("#gw").onkeydown = (e) => { if (e.key === "Enter") ask(); };
  el.querySelectorAll("#gopts button").forEach((b, i) => {
    b.onclick = () => {
      el.querySelectorAll("#gopts button").forEach((x) => x.classList.remove("on", "bad"));
      const right = RULES[i][1];
      b.classList.add(right ? "on" : "bad");
      el.querySelector("#gfb").className = `feedback ${right ? "ok" : "no"}`;
      el.querySelector("#gfb").textContent = right ? T.right : T.wrong;
    };
  });
  ask();
}

const DEMOS = { heroIsAI, isAI, guessRule };
