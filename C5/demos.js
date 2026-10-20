// C5 的互动演示。来电、情景卡都是为教学构造的演示材料，示意图只用简笔画，不出现任何真实人物的脸或声音（见 notes/C5-safety-privacy-deepfake.md）。

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// 首页：一通「熟人」视频来电（演示），四个信号依次亮起。
const CALL_LINES = [
  ["视频接通，画面里是「孙子」的脸，声音也像。", ""],
  ["「奶奶，我出车祸了，医院要先交 2 万块，你马上转过来！」", "要钱，而且要得急"],
  ["「我手机摔坏了，就用这个号码，别打我原来的。」", "只走一个渠道"],
  ["「千万别告诉我爸妈。」", "要你保密"],
  ["「用支付软件直接转到这个账户。」", "要难追回的付款方式"],
  ["怎么办？先问家庭暗号；不管答不答得上，都挂断，用自己存的号码打回去。拿不准，打 96110。", "ok"],
];

function heroCall(el) {
  let k = 0;
  const face = `<svg viewBox="0 0 120 120" width="96" height="96" aria-label="简笔画头像（示意）"><circle cx="60" cy="60" r="56" fill="none" stroke="#5b6b7a" stroke-width="4" stroke-dasharray="10 7"/><circle cx="60" cy="48" r="18" fill="#c9d3dc"/><path d="M28 98c6-20 58-20 64 0" fill="#c9d3dc"/></svg><div class="hint" style="text-align:center;margin:4px 0 0">简笔示意</div>`;
  const draw = () => {
    const shown = CALL_LINES.slice(Math.max(0, k - 2), k + 1);
    el.innerHTML = `<div style="display:flex;gap:16px;align-items:flex-start"><div>${face}</div><div style="flex:1">
      ${shown.map(([t, f]) => f === "ok" ? `<p class="feedback ok">${escHTML(t)}</p>`
        : `<div class="aicard"><div class="who">来电（演示）</div>${escHTML(t)}${f ? `<p class="feedback no" style="margin:6px 0 0">${escHTML(f)}</p>` : ""}</div>`).join("")}
      </div></div>`;
    k = (k + 1) % CALL_LINES.length;
  };
  draw();
  setInterval(draw, 3000);
}

// 情景卡：同讲义第 6 节的六张卡（演示），选项同讲义 (a)(b)(c)，参考答案同讲义。
const OPTS = ["照做", "挂断，用自己存的号码打回去", "问家人或打 96110"];
const SCENES = [
  { s: "视频里「孙子」哭着说出了车祸，要你马上转 2 万元给「医院」，还说别告诉他爸妈。", a: [1, 2],
    why: "要钱、要急、要保密、只走一个渠道，四条全占。先挂断打回去，需要的话再问家人或打 96110。" },
  { s: "「领导」用新号码发语音，让财务马上给一个新供应商打款。", a: [1, 2],
    why: "新号码、要钱、要急。通过原有联系方式或当面二次核实，财务流程不因「急」而跳过。" },
  { s: "「网店客服」说你买的东西有问题，要你开屏幕共享、报验证码办退款。", a: [2],
    why: "问家人或打 96110，并且绝不共享屏幕、不报验证码。金融监管总局把「共享屏幕」列为一类诈骗。" },
  { s: "女儿在家庭群里发语音，说晚上不回来吃饭。", a: [0],
    why: "日常消息，不涉及钱，正常回复即可。不用什么都怀疑。" },
  { s: "一段「专家」视频推荐一种「稳赚不赔」的理财产品，下面附了链接。", a: [2],
    why: "不点链接。合成的「专家」视频是监管部门点名的手法；拿不准就问家人或打 96110。" },
  { s: "一个做兼职的网站，要你先录一段读数字的语音、拍一段转头的视频「做认证」。", a: [2],
    why: "不录。这是在采集你的声音和面部信息。" },
];

function scenarioCards(el) {
  let i = 0;
  const draw = () => {
    const c = SCENES[i];
    el.innerHTML = `<p class="hint">第 ${i + 1} / ${SCENES.length} 张（演示）</p>
      <div class="aicard"><div class="who">情景</div>${escHTML(c.s)}</div>
      <div class="choices">${OPTS.map((o, j) => `<button data-j="${j}">(${"abc"[j]}) ${escHTML(o)}</button>`).join("")}</div>
      <p class="feedback" id="sfb"></p>
      <div class="btnrow"><button class="cbtn" id="sprev">上一张</button><button class="cbtn" id="snext">下一张</button></div>`;
    el.querySelectorAll(".choices button").forEach((b) => {
      b.onclick = () => {
        const j = Number(b.dataset.j);
        el.querySelectorAll(".choices button").forEach((x) => x.classList.toggle("on", x === b));
        const fb = el.querySelector("#sfb");
        const good = c.a.includes(j);
        fb.className = `feedback ${good ? "ok" : "no"}`;
        fb.textContent = `${good ? "可以。" : `参考：选 ${c.a.map((x) => `(${"abc"[x]})`).join("，再按需要 ")}。`}${c.why}`;
      };
    });
    el.querySelector("#sprev").onclick = () => { i = (i + SCENES.length - 1) % SCENES.length; draw(); };
    el.querySelector("#snext").onclick = () => { i = (i + 1) % SCENES.length; draw(); };
  };
  draw();
}

// 交不交：把信息放进「不要交给 AI」或「可以交（或换个说法再交）」。
// 同讲义第 4 节的表：左边不要交，右边可以换成什么。
const ITEMS = [
  ["身份证号、银行卡号、密码、验证码", "no", "一律不给，AI 不需要这些。"],
  ["自己和家人的照片、录音", "no", "只用文字描述情况。脸和声音是个人生物信息。"],
  ["病历、检查单原件", "no", "去掉姓名、编号，只说症状和指标；看病还是要问医生。"],
  ["同事、学生、客户的隐私", "no", "用化名，删掉能认出人的细节。"],
  ["单位文件、合同、考试题原文", "no", "按单位规定；拿不准就不贴原文，只描述问题。"],
  ["「帮我写一封给房东的催修信，语气客气」", "ok", "只说情况和要求，没有隐私。"],
  ["「血压 150/95 是什么意思，平时饮食注意什么」（不写姓名）", "ok", "只说指标，不带能认出你的信息；结论以医生意见为准。"],
  ["「帮我把这段话改得口语一点」（文字里没有姓名电话）", "ok", "没有个人信息。"],
];

function feedOrNot(el) {
  const ans = {};
  const draw = () => {
    el.innerHTML = `<p>每条信息，选「不要交」还是「可以交」。</p>
      ${ITEMS.map(([t, , why], i) => `<div class="aicard"><div>${escHTML(t)}</div>
        <div class="choices"><button data-i="${i}" data-v="no" class="${ans[i] === "no" ? "on" : ""}">不要交</button><button data-i="${i}" data-v="ok" class="${ans[i] === "ok" ? "on" : ""}">可以交</button></div>
        ${ans[i] ? `<p class="feedback ${ans[i] === ITEMS[i][1] ? "ok" : "no"}">${ans[i] === ITEMS[i][1] ? "对。" : "再想想。"}${escHTML(why)}</p>` : ""}</div>`).join("")}
      <p class="hint">已答 ${Object.keys(ans).length} / ${ITEMS.length}，答对 ${Object.entries(ans).filter(([i, v]) => ITEMS[i][1] === v).length}。这个页面不保存任何内容。</p>`;
    el.querySelectorAll("[data-i]").forEach((b) => { b.onclick = () => { ans[b.dataset.i] = b.dataset.v; draw(); }; });
  };
  draw();
}

const DEMOS = { heroCall, scenarioCards, feedOrNot };
