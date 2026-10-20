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
