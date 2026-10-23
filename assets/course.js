// 「AI 通识课」课程信息、页脚和语言切换。每页在 app.js 之前加载。
// 照 peiyuUniversity/csc4801/site/assets/course.js 的做法：课程信息集中在这里，app.js 不写死课程名。
// 双语（2026-10-20 加英文版）：页面语言看 <html lang>（zh-CN / en）；英文页在 site/en/ 下，和中文页一一对应。
// 纯双语（用户 2026-10-23 定）：中文页只显示中文，英文页只显示英文；唯一例外是语言切换按钮（各用本语言写）。
// 另一种语言的原文（出处原标题等）只放进 title 悬停提示。tools/check.py 会查。
// 每页的 <html> 写 data-root（到 site/ 根的相对路径）和 data-page（本页相对 site/ 或 site/en/ 的路径），
// 语言切换按钮和页脚 logo 路径都从这两个属性算。

const PAGE_LANG = /^en/i.test(document.documentElement.lang) ? "en" : "zh";
const SITE_ROOT = document.documentElement.dataset.root ?? "../";   // 到 site/ 根，例如 "../"、"../../"

const COURSE_ZH = {
  code: "AI 通识课",
  name: "AI 通识课",
  short: "AI 通识课",
  credit: "培玉智能 · Boxi Yu",
  motto: "人人会用、人人会验、人人知道何时不用",
  checked: "讲义里的每个事实都有出处链接；标「演示」的例子是为教学构造的。",
  themeKey: "aiforall-theme",
};
// 英文版署名只写英文行 'Peiyu AI · Boxi Yu'（用户 2026-10-23 定，纯双语；中文页只写「培玉智能 · Boxi Yu」）。
const COURSE_EN = {
  code: "AI Literacy",
  name: "AI Literacy for Everyone",
  short: "AI Literacy",
  credit: "Peiyu AI · Boxi Yu",
  motto: "Everyone can use it, everyone can check it, everyone knows when not to use it",
  checked: "Every fact in the notes links to its source; examples marked “Demo” were made up for teaching.",
  themeKey: "aiforall-theme",
};
const COURSE = PAGE_LANG === "en" ? COURSE_EN : COURSE_ZH;

// 每个模块的视频（tools/videos.py 生成到 CN/video/，不进源仓库，发布时复制）。dur 给总览卡片和播放器标题用。
const VIDEOS = {
  C1: { title: "C1 AI 是什么：会说话不等于会思考", dur: "3:41" },
  C2: { title: "C2 数据、模型与幻觉：AI 的答案从哪来", dur: "4:40" },
  C3: { title: "C3 怎样把事情交代清楚：描述与委托", dur: "4:01" },
  C4: { title: "C4 核验：AI 说的，怎么知道对不对", dur: "4:51" },
  C5: { title: "C5 安全、隐私与防诈骗：换脸假声音怎么防", dur: "4:19" },
  C6: { title: "C6 公平、伦理与工作：偏见、版权和我的工作", dur: "4:24" },
  C7: { title: "C7 智能体时代：委托与监督：确认点和监督日志", dur: "3:49" },
  C8: { title: "C8 何时不用 AI：关闭 AI 的检查点和系列小结", dur: "3:55" },
};

// 英文页的视频。narration: "zh" = 暂时放中文配音的视频（site/CN/video/），英文字幕默认打开；
// 英文配音做好、放进 site/en/CN/video/CN.mp4（同名 .en.vtt / .zh.vtt / .jpg）以后，把那一行的 narration 改成 "en"、
// dur 改成英文版时长即可（一行改动）。
const VIDEOS_EN = {
  C1: { title: "C1 What AI is: talking isn't thinking", dur: "4:34", narration: "en" },
  C2: { title: "C2 Data, models and hallucination: where AI's answers come from", dur: "5:33", narration: "en" },
  C3: { title: "C3 Describing and delegating: how to explain a task clearly", dur: "5:02", narration: "en" },
  C4: { title: "C4 Checking: how do you know if AI is right?", dur: "5:51", narration: "en" },
  C5: { title: "C5 Safety, privacy and scams: face swaps and fake voices", dur: "5:01", narration: "en" },
  C6: { title: "C6 Fairness, ethics and work: bias, copyright and my job", dur: "5:09", narration: "en" },
  C7: { title: "C7 Agents: delegation and oversight — checkpoints and a supervision log", dur: "4:36", narration: "en" },
  C8: { title: "C8 When not to use AI: AI-off checkpoints and a series recap", dur: "4:41", narration: "en" },
};
const VIDEO_INDEX = PAGE_LANG === "en" ? VIDEOS_EN : VIDEOS;

// 模块首页顶部的播放器：中文页只给中文字幕，英文页只给英文字幕（纯双语，用户 2026-10-23 定）。
// 文件不在（本地预览没生成视频）就整块不显示（app.js mountLectureVideo）。
function videoBlock(code) {
  if (PAGE_LANG === "en") return videoBlockEn(code);
  const v = VIDEOS[code];
  if (!v) return "";
  const base = `video/${code}`;
  return `<section class="lecture-video" id="video" aria-label="本讲视频">
    <video controls preload="metadata" playsinline poster="${base}.jpg">
      <source src="${base}.mp4" type="video/mp4">
      <track kind="subtitles" srclang="zh" label="中文" src="${base}.zh.vtt" default>
      你的浏览器不能播放这个视频，可以 <a href="${base}.mp4" download>下载 mp4</a>。
    </video>
    <p class="vmeta"><b>本讲视频</b> · ${v.title} · ${v.dur} · 中文字幕</p>
    <div class="vacts">
      <a class="vbtn watch" href="${base}.mp4" download="${code}.mp4">▶ 下载视频（mp4）</a>
      <a class="vbtn cbtn-csc" href="${base}.zh.vtt" download>下载中文字幕</a>
    </div>
  </section>`;
}

function videoBlockEn(code) {
  const v = VIDEOS_EN[code];
  if (!v) return "";
  const english = v.narration === "en";
  const base = english ? `video/${code}` : `${SITE_ROOT}${code}/video/${code}`;
  const note = english
    ? "English narration · English subtitles"
    : "English subtitles · <b>English narration coming soon</b>";
  return `<section class="lecture-video" id="video" aria-label="Video for this module">
    <video controls preload="metadata" playsinline poster="${base}.jpg">
      <source src="${base}.mp4" type="video/mp4">
      <track kind="subtitles" srclang="en" label="English" src="${base}.en.vtt" default>
      Your browser can't play this video. You can <a href="${base}.mp4" download>download the mp4</a>.
    </video>
    <p class="vmeta"><b>Video</b> · ${v.title} · ${v.dur} · ${note}</p>
    <div class="vacts">
      <a class="vbtn watch" href="${base}.mp4" download="${code}${english ? "-en" : ""}.mp4">▶ Download video (mp4)</a>
      <a class="vbtn cbtn-csc" href="${base}.en.vtt" download>Download English subtitles</a>
    </div>
  </section>`;
}

// 这是培玉自己的课，页脚放培玉品牌；署名中文页「培玉智能 · Boxi Yu」、英文页「Peiyu AI · Boxi Yu」（用户 2026-10-23 定）。内容 CC BY-SA 4.0，培玉 logo 和商标除外（见 LICENSE-NOTE.md）。
// root 是到 site/ 根的相对路径；不传就用 <html data-root>。
function renderFooter(root = SITE_ROOT) {
  const f = document.querySelector("footer");
  if (!f) return;
  const alt = PAGE_LANG === "en" ? "Peiyu AI logo" : "培玉智能 logo";
  const logos = `<img class="logo-light" src="${root}assets/peiyu-logo.svg" alt="${alt}" width="18" height="18">
      <img class="logo-dark" src="${root}assets/peiyu-logo-white.svg" alt="${alt}" width="18" height="18">`;
  f.innerHTML = PAGE_LANG === "en" ? `<div class="wrap">
    <p>${COURSE.name} · ${COURSE.motto}</p>
    <p class="credit">
      ${logos}
      <span><b>${COURSE.credit}</b> · Content licensed <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener license">CC BY-SA 4.0</a> (except the Peiyu name, logo and trademarks; all rights reserved) · Code MIT</span>
    </p>
    <p class="fine">${COURSE.checked}</p>
  </div>` : `<div class="wrap">
    <p>${COURSE.name} · ${COURSE.motto}</p>
    <p class="credit">
      ${logos}
      <span><b>${COURSE.credit}</b> · 内容采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans" target="_blank" rel="noopener license">CC BY-SA 4.0</a>（培玉 logo 和商标除外，保留所有权利）</span>
    </p>
    <p class="fine">${COURSE.checked}</p>
  </div>`;
}

// 顶栏的「中文 / English」切换：链接到另一种语言的同一页，模块页的 #/章节 也带过去（两种语言的章节 slug 相同）。
// 点了就记住（localStorage LANG_KEY）；只有中文总览页（默认入口）按记住的语言跳到英文总览，
// 模块页和分享出去的链接不跳，第一次来的人也不按浏览器语言跳。
function langHref(lang) {
  const page = document.documentElement.dataset.page || "index.html";
  return `${SITE_ROOT}${lang === "en" ? "en/" : ""}${page}${location.hash}`;
}

const LANG_KEY = "aiforall-lang";
function rememberLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* storage unavailable */ }
}
(function followRememberedLang() {
  if (PAGE_LANG !== "zh" || (document.documentElement.dataset.page || "index.html") !== "index.html") return;
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch { /* storage unavailable */ }
  if (saved === "en") location.replace(langHref("en"));
})();

function renderLangSwitch() {
  const bar = document.querySelector(".topbar");
  if (!bar || bar.querySelector(".langsw")) return;
  const nav = document.createElement("nav");
  nav.className = "langsw";
  nav.setAttribute("aria-label", PAGE_LANG === "en" ? "Language" : "语言");
  nav.innerHTML = ["zh", "en"].map((l) => `<a data-lang="${l}" lang="${l === "en" ? "en" : "zh-CN"}" hreflang="${l === "en" ? "en" : "zh-CN"}"
    ${l === PAGE_LANG ? 'aria-current="true" class="on"' : ""}>${l === "en" ? "English" : "中文"}</a>`).join("");
  const update = () => nav.querySelectorAll("a").forEach((a) => { a.href = langHref(a.dataset.lang); });
  update();
  addEventListener("hashchange", update);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => rememberLang(a.dataset.lang)));
  const theme = bar.querySelector("#theme");
  bar.insertBefore(nav, theme || null);
}
renderLangSwitch();
