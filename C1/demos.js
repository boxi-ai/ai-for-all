// C1 的互动演示。分类卡、规则卡和词语都是构造的演示材料（见 notes/C1-what-is-ai.md 第 4 节）。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 「这是不是 AI？」：同讲义第 4 节的分类卡。kind 为空表示按固定规则运行，一般不叫 AI。
const ITEMS = [
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
];

// 首页：轮播几张分类卡（东西 → 是不是 AI → 输出类型）。
function heroIsAI(el) {
  let k = 0, phase = 0;
  const draw = () => {
    const [name, kind, why] = ITEMS[k];
    el.innerHTML = `<div class="aicard"><div class="who">这是 AI 吗？（演示）</div><b>${escHTML(name)}</b></div>
      <p style="margin:6px 0">${phase >= 1 ? (kind ? `是 AI · 输出：<b>${kind}</b>` : "一般不叫 AI") : "&nbsp;"}</p>
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
  const opts = ["不是 AI", "预测", "推荐", "内容", "决定"];
  el.innerHTML = ITEMS.map(([name], i) => `<div style="margin:10px 0"><div>${i + 1}. ${escHTML(name)}</div>
    <div class="choices" data-i="${i}">${opts.map((o) => `<button>${o}</button>`).join("")}</div>
    <div class="feedback" id="af${i}"></div></div>`).join("") + `<p class="counter" id="ascore"></p>`;
  const got = {};
  el.querySelectorAll(".choices").forEach((row) => {
    row.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const i = +row.dataset.i, [, kind, why] = ITEMS[i];
        const want = kind || "不是 AI";
        row.querySelectorAll("button").forEach((x) => x.classList.remove("on", "bad"));
        const right = b.textContent === want || (i === ITEMS.length - 1 && b.textContent === "不是 AI");
        b.classList.add(right ? "on" : "bad");
        const fb = el.querySelector(`#af${i}`);
        fb.className = `feedback ${right ? "ok" : "no"}`;
        fb.textContent = `${right ? "✓ " : `✗ 建议：${want}。`}${why}`;
        got[i] = right;
        el.querySelector("#ascore").textContent = `已答 ${Object.keys(got).length} / ${ITEMS.length}，和建议一致 ${Object.values(got).filter(Boolean).length} 个`;
      };
    });
  });
}

// 猜规则：「机器」按一张藏起来的规则卡回答。规则只看字数，所以电脑也能「照规则办事」。
const RULES = [
  ["词语里有动物，就说「是」", false],
  ["词语是两个字，就说「是」", true],
  ["词语能吃，就说「是」", false],
];

function guessRule(el) {
  const answer = (w) => ([...w.trim()].length === 2 ? "是" : "不是");
  el.innerHTML = `<p>输入一个词，看「机器」怎么答。多试几个，再猜它的规则卡。</p>
    <div class="calc"><label>词语 <input id="gw" value="小猫" maxlength="8"></label><button class="cbtn" id="gask">问机器</button></div>
    <div id="glog"></div>
    <p><b>你猜规则卡是哪一张？</b></p>
    <div class="choices" id="gopts">${RULES.map(([r]) => `<button>${r}</button>`).join("")}</div>
    <p class="feedback" id="gfb"></p>`;
  const log = [];
  const ask = () => {
    const w = el.querySelector("#gw").value.trim();
    if (!w) return;
    log.unshift(`<div class="aicard"><div class="who">机器（演示）</div>「${escHTML(w)}」→ <b>${answer(w)}</b></div>`);
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
      el.querySelector("#gfb").textContent = right
        ? "✓ 就是字数。「小猫」「老虎」碰巧是两个字的动物，很像「有动物」那张卡：机器做得对，却根本不知道什么是动物。"
        : "✗ 再试几个词，比如「大熊猫」「桌子」「苹果」。";
    };
  });
  ask();
}

const DEMOS = { heroIsAI, isAI, guessRule };
