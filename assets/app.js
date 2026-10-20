// 每个模块网页共用的路由和渲染。路由：#/（模块首页）和 #/<章节 slug>。
// 照 peiyuUniversity/aie1001/site/assets/app.js 改成中文：课程名从 course.js 的 COURSE 读，
// 每个模块提供 LECTURE、CHAPTERS（chapters.js）和 DEMOS（demos.js）；说明见 ../README.md。
// 界面文字按页面语言（course.js 的 PAGE_LANG）从 UI 表里取；英文页在 site/en/CN/，内容用自己的 chapters.js。

const main = document.getElementById("main");
const pad = (k) => String(k + 1).padStart(2, "0");
const CN_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
let cleanups = [];
const ROOT = typeof SITE_ROOT === "string" ? SITE_ROOT : "../";
const UI = {
  zh: {
    missingVideo: (src) => `这份网页没有附带视频文件。<br>把视频放到 <code>${src}</code> 就能在这里播放。`,
    start: (t) => `开始 → 第 1 章 · ${t}`, outline: "本讲目录 ↓", allModules: "全部模块",
    pause: "暂停", play: "播放",
    nChapters: (n) => `${CN_NUM[n] || n}章`, outlineSub: "按讲义的顺序排列，建议从头读。", open: "打开 →",
    howTitle: "怎么用这份讲义", howSub: "读 · 猜 · 试 · 记",
    steps: [["第 1 步", "读", "每节一个要点，配一个真实或标明「演示」的例子。"],
      ["第 2 步", "先猜", "看到金色的<b>先猜一猜</b>，先想好再点开答案。"],
      ["第 3 步", "动手", "互动小工具可以改数字、点选项，看结果怎么变。"],
      ["第 4 步", "记下来", "用核验记录表把你查过的东西记下来，最后做找错挑战。"]],
    ctaBtn: (t) => `第 1 章 · ${t} →`,
    ctaMeta: (m) => `${m} · 手机和电脑都能看 · 没有网络也能打开本页（视频除外）`,
    tocHead: "本讲一览", chapter: (n) => `第 ${n} 章`, inChapter: "本章", chapterNav: "本章目录",
    three: (n) => `第 ${n} 章 · 三句话`, prev: "← 上一章", next: "下一章", back: "← 返回", lectureHome: "本讲首页",
    done: "读完了 →", backHome: "回到本讲首页",
  },
  en: {
    missingVideo: (src) => `This copy of the page has no video file.<br>Put the video at <code>${src}</code> to play it here.`,
    start: (t) => `Start → Chapter 1 · ${t}`, outline: "Contents ↓", allModules: "All modules",
    pause: "Pause", play: "Play",
    nChapters: (n) => `${n} chapters`, outlineSub: "In the same order as the notes. Best read from the start.", open: "Open →",
    howTitle: "How to use these notes", howSub: "Read · Guess · Try · Record",
    steps: [["Step 1", "Read", "One key idea per section, each with a real example or one clearly marked “Demo”."],
      ["Step 2", "Guess first", "When you see a gold <b>Guess first</b> box, decide on your answer before you open it."],
      ["Step 3", "Try it", "Change the numbers and click the options in the interactive tools to see what happens."],
      ["Step 4", "Write it down", "Record what you checked in the checking log, then take the spot-the-error challenge."]],
    ctaBtn: (t) => `Chapter 1 · ${t} →`,
    ctaMeta: (m) => `${m} · Works on phones and computers · This page opens offline (except the video)`,
    tocHead: "In this module", chapter: (n) => `Chapter ${n}`, inChapter: "This chapter", chapterNav: "Chapter contents",
    three: (n) => `Chapter ${n} · Three takeaways`, prev: "← Previous", next: "Next", back: "← Back", lectureHome: "Module home",
    done: "Finished →", backHome: "Back to module home",
  },
}[typeof PAGE_LANG === "string" ? PAGE_LANG : "zh"];

function mountDemos(root) {
  root.querySelectorAll("[data-demo]").forEach((d) => {
    const body = d.querySelector(".demo-body") || d;
    DEMOS[d.dataset.demo](body);
  });
  root.querySelectorAll("[data-video]").forEach((v) => {
    const src = v.dataset.video;
    v.innerHTML = `<video controls preload="metadata" src="${src}"></video>
      <div class="vcap">${(LECTURE.videos || {})[src] || ""}</div>`;
    v.querySelector("video").addEventListener("error", () => {
      v.innerHTML = `<div class="missing">${UI.missingVideo(src)}</div>`;
    });
  });
}

function stopTimers() {
  // 演示用了 setInterval；换页时全部清掉。
  const max = setInterval(() => {}, 1000);
  for (let k = 0; k <= max; k++) clearInterval(k);
  cleanups.forEach((f) => f());
  cleanups = [];
}

function mountLectureVideo() {
  const box = main.querySelector(".lecture-video");
  if (!box) return;
  const src = box.querySelector("source");
  src.addEventListener("error", () => box.remove());
}

function renderHome() {
  const L = LECTURE;
  document.title = `${L.code} ${L.title} · ${COURSE.short}`;
  main.innerHTML = `<div class="wrap">
    ${typeof videoBlock === "function" ? videoBlock(L.code) : ""}
    <section class="hero">
      <div>
        <span class="pill">${COURSE.short} · ${L.code}${L.badge ? ` · ${L.badge}` : ""}</span>
        <h1>${L.title}<small>${L.tagline}</small></h1>
        <p class="lead">${L.lead}</p>
        <div class="btnrow">
          <a class="btn primary" href="#/${CHAPTERS[0].slug}">${UI.start(CHAPTERS[0].title)}</a>
          <a class="btn" href="#outline">${UI.outline}</a>
        </div>
        <p class="meta">${COURSE.checked} · <a href="../index.html">${UI.allModules}</a></p>
      </div>
      <div class="card hero-demo">
        <div class="head"><span>${L.heroLabel}</span><button class="cbtn hero-pause">${UI.pause}</button></div>
        <div data-demo="${L.heroDemo}"><div class="demo-body"></div></div>
        <div class="caption">${L.heroCaption}</div>
      </div>
    </section>

    <h2 class="section-title">${L.whyTitle}</h2>
    <p class="section-sub">${L.whySub}</p>
    <div class="why">${L.why.map(([h, p]) => `<div class="card"><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>

    <h2 class="section-title" id="outline">${UI.nChapters(CHAPTERS.length)}</h2>
    <p class="section-sub">${UI.outlineSub}</p>
    <div class="chapters">${CHAPTERS.map((c, k) => `
      <a class="card chapcard" href="#/${c.slug}">
        <span class="num">${pad(k)}</span><h3>${c.title}</h3><p>${c.subtitle}</p>
        <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <span class="go">${UI.open}</span></a>`).join("")}
    </div>

    <h2 class="section-title">${UI.howTitle}</h2>
    <p class="section-sub">${UI.howSub}</p>
    <div class="steps">${UI.steps.map(([b, h, p]) => `
      <div class="card"><b>${b}</b><h3>${h}</h3><p>${p}</p></div>`).join("")}
    </div>

    <section class="cta">
      <h2>${L.ctaTitle}</h2>
      <a class="btn primary" href="#/${CHAPTERS[0].slug}">${UI.ctaBtn(CHAPTERS[0].title)}</a>
      <p class="meta" style="margin-top:16px">${UI.ctaMeta(L.minutes)}</p>
    </section>
  </div>`;
  mountDemos(main);
  mountLectureVideo();
  const btn = main.querySelector(".hero-pause");
  btn.onclick = () => {
    const holder = main.querySelector(`[data-demo="${L.heroDemo}"]`);
    if (btn.textContent === UI.pause) { stopTimers(); btn.textContent = UI.play; }
    else { DEMOS[L.heroDemo](holder.querySelector(".demo-body")); btn.textContent = UI.pause; }
  };
}

function heroHTML(c) {
  if (!c.hero) return "";
  if (c.hero === "toc") {
    return `<div class="card hero-demo"><div class="head"><span>${UI.tocHead}</span></div>
      ${CHAPTERS.slice(0, -1).map((x, k) => `<a href="#/${x.slug}" style="display:flex;gap:10px;padding:7px 4px;text-decoration:none;color:var(--ink);border-bottom:1px solid var(--line)"><b class="mono" style="color:var(--amber)">${pad(k)}</b><span>${x.title}</span></a>`).join("")}</div>`;
  }
  return `<div class="card hero-demo"><div data-demo="${c.hero}"><div class="demo-body"></div></div><div class="caption">${c.heroCaption}</div></div>`;
}

function renderChapter(k) {
  const c = CHAPTERS[k];
  document.title = `${c.title} · ${LECTURE.code} ${LECTURE.title} · ${COURSE.short}`;
  const prev = CHAPTERS[k - 1], next = CHAPTERS[k + 1];
  main.innerHTML = `<div class="wrap">
    <section class="chap-hero">
      <div>
        <span class="pill">${UI.chapter(k + 1)} · ${c.nav}</span>
        <h1>${c.title}</h1>
        <p class="subtitle">${c.subtitle}</p>
        <p class="abstract">${c.abstract}</p>
      </div>
      ${heroHTML(c)}
    </section>
    <div class="chap-body">
      <nav class="toc" aria-label="${UI.chapterNav}"><b>${UI.inChapter}</b>
        ${c.sections.map((s, j) => `<a href="#/${c.slug}/${s.id}" data-sec="${s.id}">§${k + 1}.${j + 1} ${s.title}</a>`).join("")}
      </nav>
      <article>
        ${c.sections.map((s, j) => `<section id="${s.id}"><h2><span class="sec">§${k + 1}.${j + 1}</span>${s.title}</h2>${s.html}</section>`).join("")}
        <h2 style="font-size:20px">${UI.three(k + 1)}</h2>
        <div class="takeaways">${c.takeaways.map((t, j) => `<div class="card"><b>${j + 1}</b>${t}</div>`).join("")}</div>
        <div class="pager" style="margin-top:28px">
          ${prev ? `<a class="card" href="#/${prev.slug}"><small>${UI.prev} · ${pad(k - 1)}</small><b>${prev.title}</b></a>` : `<a class="card" href="#/"><small>${UI.back}</small><b>${UI.lectureHome}</b></a>`}
          ${next ? `<a class="card next" href="#/${next.slug}"><small>${UI.next} · ${pad(k + 1)} →</small><b>${next.title}</b></a>` : `<a class="card next" href="#/"><small>${UI.done}</small><b>${UI.backHome}</b></a>`}
        </div>
      </article>
    </div>
  </div>`;
  mountDemos(main);
  const links = [...main.querySelectorAll(".toc a")];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.dataset.sec === e.target.id));
    });
  }, { rootMargin: "-80px 0px -65% 0px" });
  main.querySelectorAll("article section").forEach((s) => obs.observe(s));
  cleanups.push(() => obs.disconnect());
}

function route() {
  stopTimers();
  const [slug, sec] = location.hash.replace(/^#\/?/, "").split("/");
  const k = CHAPTERS.findIndex((c) => c.slug === slug);
  if (k >= 0) renderChapter(k); else renderHome();
  document.querySelectorAll(".chapnav a").forEach((a) => a.classList.toggle("active", a.dataset.slug === slug));
  const target = sec ? document.getElementById(sec) : null;
  if (target) target.scrollIntoView();
  else if (!location.hash.includes("outline")) window.scrollTo(0, 0);
}

// 页内锚点（#outline、目录链接）不重新渲染。
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  const href = a.getAttribute("href");
  if (href === "#outline") { e.preventDefault(); document.getElementById("outline").scrollIntoView(); return; }
  const m = href.match(/^#\/([^/]+)\/(.+)$/);
  if (m && location.hash.startsWith(`#/${m[1]}`)) {
    e.preventDefault();
    document.getElementById(m[2])?.scrollIntoView();
    history.replaceState(null, "", href);
  }
});

document.querySelector(".brand-text").innerHTML = `<b>${LECTURE.code} · ${LECTURE.title}</b><span>${COURSE.short}</span>`;
document.getElementById("chapnav").innerHTML = CHAPTERS.map((c, k) =>
  `<a href="#/${c.slug}" data-slug="${c.slug}"><span>${pad(k)}</span>${c.nav}</a>`).join("");
if (typeof renderFooter === "function") renderFooter(ROOT);

// 明暗主题：能存就记住选择。
const themeBtn = document.getElementById("theme");
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  themeBtn.textContent = dark ? "☀" : "☾";
}
try { applyTheme(localStorage.getItem(COURSE.themeKey)); } catch { applyTheme(null); }
themeBtn.onclick = () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const t = dark ? "light" : "dark";
  applyTheme(t);
  try { localStorage.setItem(COURSE.themeKey, t); } catch { /* storage unavailable */ }
};

// 阅读进度条。
const bar = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = h > 0 ? `${(100 * scrollY) / h}%` : "0";
}, { passive: true });

// 回到全部模块：每个模块页顶栏最左边。
const homeLink = document.createElement("a");
homeLink.className = "homelink";
homeLink.href = "../index.html";
homeLink.title = UI.allModules;
homeLink.innerHTML = `<span aria-hidden="true">←</span><span class="homelink-text">${UI.allModules}</span>`;
document.querySelector(".topbar").prepend(homeLink);

addEventListener("hashchange", route);
route();
