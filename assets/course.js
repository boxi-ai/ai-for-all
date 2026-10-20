// 「AI 通识课」课程信息和页脚。每页在 app.js 之前加载。
// 照 peiyuUniversity/csc4801/site/assets/course.js 的做法：课程信息集中在这里，app.js 不写死课程名。

const COURSE = {
  code: "AI 通识课",
  name: "AI 通识课 · AI Literacy for Everyone",
  short: "AI 通识课",
  credit: "培玉智能 · Boxi Yu",
  motto: "人人会用、人人会验、人人知道何时不用",
  checked: "讲义里的每个事实都有出处链接；标「演示」的例子是为教学构造的。",
  themeKey: "aiforall-theme",
};

// 每个模块的视频（tools/videos.py 生成到 CN/video/，不进源仓库，发布时复制）。dur 给总览卡片和播放器标题用。
const VIDEOS = {
  C1: { title: "C1 AI 是什么：会说话不等于会思考", dur: "3:49" },
  C2: { title: "C2 数据、模型与幻觉：AI 的答案从哪来", dur: "4:48" },
  C3: { title: "C3 怎样把事情交代清楚：描述与委托", dur: "4:27" },
  C4: { title: "C4 核验：AI 说的，怎么知道对不对", dur: "5:02" },
  C5: { title: "C5 安全、隐私与防诈骗：换脸假声音怎么防", dur: "4:34" },
  C6: { title: "C6 公平、伦理与工作：偏见、版权和我的工作", dur: "4:23" },
  C7: { title: "C7 智能体时代：委托与监督：确认点和监督日志", dur: "4:04" },
  C8: { title: "C8 何时不用 AI：关闭 AI 的检查点和系列小结", dur: "4:03" },
};

// 模块首页顶部的播放器：中文字幕默认打开，英文可选；文件不在（本地预览没生成视频）就整块不显示。
function videoBlock(code) {
  const v = VIDEOS[code];
  if (!v) return "";
  const base = `video/${code}`;
  return `<section class="lecture-video" id="video" aria-label="本讲视频">
    <video controls preload="metadata" playsinline poster="${base}.jpg">
      <source src="${base}.mp4" type="video/mp4">
      <track kind="subtitles" srclang="zh" label="中文" src="${base}.zh.vtt" default>
      <track kind="subtitles" srclang="en" label="English" src="${base}.en.vtt">
      你的浏览器不能播放这个视频，可以 <a href="${base}.mp4" download>下载 mp4</a>。
    </video>
    <p class="vmeta"><b>本讲视频</b> · ${v.title} · ${v.dur} · 中文字幕（可切换英文）</p>
    <div class="vacts">
      <a class="vbtn watch" href="${base}.mp4" download="${code}.mp4">▶ 下载视频（mp4）</a>
      <a class="vbtn cbtn-csc" href="${base}.zh.vtt" download>中文字幕</a>
      <a class="vbtn cbtn-csc" href="${base}.en.vtt" download>English subtitles</a>
    </div>
  </section>`;
}

// 这是培玉自己的课，页脚放培玉品牌；署名固定为「培玉智能 · Boxi Yu」（用户 2026-10-19 定）。内容 CC BY-SA 4.0，培玉 logo 和商标除外（见 LICENSE-NOTE.md）。
function renderFooter(root = "") {
  const f = document.querySelector("footer");
  if (!f) return;
  f.innerHTML = `<div class="wrap">
    <p>${COURSE.name} · ${COURSE.motto}</p>
    <p class="credit">
      <img class="logo-light" src="${root}assets/peiyu-logo.svg" alt="培玉智能 logo" width="18" height="18">
      <img class="logo-dark" src="${root}assets/peiyu-logo-white.svg" alt="培玉智能 logo" width="18" height="18">
      <span><b>${COURSE.credit}</b> · 内容采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans" target="_blank" rel="noopener license">CC BY-SA 4.0</a>（培玉 logo 和商标除外，保留所有权利）</span>
    </p>
    <p class="fine">${COURSE.checked}</p>
  </div>`;
}
