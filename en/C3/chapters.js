// C3 chapters, English edition. Adapted from notes/en/C3-describe-delegate.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C3/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["anthropic-clear", "Anthropic, “Prompting best practices · Be clear and direct” (official Claude prompting documentation)", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct"],
  ["openai-tips", "OpenAI Help Center, “Best practices for prompt engineering with the OpenAI API”", "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api"],
  ["4d-academy", "Anthropic Academy, “The 4D Framework” (AI Fluency: Framework & Foundations, lesson 3)", "https://academy.claude.com/courses/ai-fluency-framework-foundations/the-4d-framework"],
  ["4d-terms", "Rick Dakan, Joseph Feller, Anthropic, “AI Fluency: Key Terminology Cheat Sheet”, 2025 (CC BY-NC-SA 4.0; briefly paraphrased only)", "https://www-cdn.anthropic.com/4396730ed190e691a3712cf2fd6bfe35509deca2.pdf"],
  ["4d-course", "Anthropic, “AI Fluency: Framework & Foundations” course outline (includes “The Description-Discernment loop”)", "https://anthropic.skilljar.com/ai-fluency-framework-foundations"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html", "《中小学生成式人工智能使用指南（2025年版）》"],
  ["mss-ai", "“AI in daily life: watch these details!”, from the WeChat account of China’s Ministry of State Security, reposted by the Guangdong Cyberspace Administration website (in Chinese), 2024-10-15", "https://www.cagd.gov.cn/v/2024/10/6006.html", "《AI融入生活：这些细节要警惕！》"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C3",
  badge: "Shared core module",
  title: "How to explain a task clearly",
  tagline: "Describing and delegating: decide whether to hand it over, then explain it clearly",
  lead: "The same task, explained vaguely or explained clearly, can bring back very different results. This module teaches two things: before handing a task over, decide whether to and which part; when you do, make four things clear: what to do, who it’s for, what good looks like, what to avoid.",
  heroDemo: "heroBrief",
  heroLabel: "One task, three ways of writing it (Demo)",
  heroCaption: "The briefs and AI replies are illustrations made up for teaching.",
  whyTitle: "Why learn to brief",
  whySub: "AI is clever, but it doesn’t know what’s in your head",
  why: [
    ["Like a new colleague", "Brilliant, but doesn’t know your norms or how you work. The more precisely you explain, the better the result."],
    ["What you don’t give, it fills in", "And it fills it in convincingly. So write “don’t make up anything I haven’t told you”."],
    ["A clear brief still needs checking", "A clear brief makes errors fewer and easier to spot, but can’t eliminate them."],
  ],
  ctaTitle: "Ready to explain a task clearly?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-colleague", nav: "New colleague", title: "A brilliant but new colleague",
    subtitle: "Briefing AI is like briefing a new colleague",
    abstract: "Just say “write a notice for me”, and what will a new colleague do?",
    tags: ["Comparison", "A simple test"],
    hero: "toc",
    sections: [
      { id: "story", title: "Think of AI as a new employee", html: `
        <p>In its official documentation on prompting Claude, Anthropic offers a comparison: think of it as <b>a brilliant but new employee</b> who doesn’t know your norms or workflows. The more precisely you explain what you want, the better the result. It also gives a “golden rule”: show your prompt to a colleague who knows little about the task and ask them to follow it; if they would be confused, the AI probably will be too.${cite("anthropic-clear")}</p>
        ${predict("You ask a new colleague to “write a notice for me”. What questions are they most likely to come back with?", "<p>Who is it for? What is it about? When and where? How long? Formal or casual? Those questions are the “four things” in chapter 3.</p>")}` },
    ],
    takeaways: ["AI is like a brilliant but new colleague.", "A brief a colleague can’t follow, the AI probably can’t either."],
  },
  {
    slug: "2-delegate", nav: "Hand it over?", title: "First decide: should AI do this?",
    subtitle: "Delegating: what goes to AI, and what you do yourself",
    abstract: "Four questions to ask before you hand anything over.",
    tags: ["Delegation", "4D framework"],
    sections: [
      { id: "4d", title: "“Delegation” in the 4D framework", html: `
        <p>The 4D framework for AI fluency divides the skill of working with AI into four parts: Delegation, Description, Discernment and Diligence.${cite("4d-academy")} Its glossary explains <b>delegation</b> as deciding which work humans do, which AI does, and how to divide it, including first being clear about your goals and the nature of the task, then understanding what different AI systems can and can’t do.${cite("4d-terms")}</p>` },
      { id: "four-q", title: "Four questions", html: `
        <table><thead><tr><th>Question</th><th>Why ask it</th><th>Module</th></tr></thead><tbody>
        <tr><td>Do I know what I want?</td><td>If you can’t say it, AI can only guess</td><td>This one</td></tr>
        <tr><td>Is this something AI is good at?</td><td>Good at drafting, rewriting, organising, brainstorming; easily wrong on obscure facts and recent news</td><td><a href="../C1/index.html">C1</a>, <a href="../C2/index.html">C2</a></td></tr>
        <tr><td>How costly would a mistake be?</td><td>For costly tasks, check more strictly, or do it yourself</td><td><a href="../C4/index.html">C4</a> traffic lights</td></tr>
        <tr><td>Is there information in it that mustn’t leave my hands?</td><td>ID numbers, medical records, work documents, other people’s private details: don’t give them to AI</td><td><a href="../C5/index.html">C5</a></td></tr></tbody></table>
        ${callout("pattern", "In one line", "<p>First decide whether to hand it over, and which part; then work out how to explain it. Some tasks go whole, some only in part (say, just adjusting the tone), some you do yourself (C8).</p>")}` },
    ],
    takeaways: ["Decide whether to hand it over before deciding how to brief it.", "Take extra care with costly tasks and private information."],
  },
  {
    slug: "3-four", nav: "Four things", title: "Explain four things clearly",
    subtitle: "What to do, who it’s for, what good looks like, what to avoid",
    abstract: "Get what’s in your head into words; there are no magic phrases.",
    tags: ["Description", "Writing a brief"],
    sections: [
      { id: "four", title: "The four things", html: `
        <p>In the 4D framework, <b>description</b> means communicating effectively with AI: being clear about the product you want (content, format, audience, style), the process (for example, step-by-step requirements), and how it should behave while you work together (for example, concise or detailed).${cite("4d-terms")} For everyday use, we group this into four things:</p>
        <table><thead><tr><th>The four things</th><th>What to make clear</th><th>Example</th></tr></thead><tbody>
        <tr><td><b>What to do</b></td><td>The task and the finished product</td><td>“Write a notice for our building’s residents’ group chat”</td></tr>
        <tr><td><b>Who it’s for</b></td><td>Readers, purpose, background material</td><td>“Most readers are in their sixties and seventies and read on their phones”</td></tr>
        <tr><td><b>What good looks like</b></td><td>Length, format, tone; ideally an example</td><td>“Under 60 words, 3 lines, plain and friendly”</td></tr>
        <tr><td><b>What to avoid</b></td><td>Limits and red lines</td><td>“Don’t make up anything I haven’t told you; mark anything uncertain [TO CHECK]”</td></tr></tbody></table>` },
      { id: "docs", title: "It matches the AI companies’ own advice", html: `<ul>
        <li>OpenAI’s help documentation advises being specific and detailed about the context, outcome, length, format and style you want; showing the format through examples; replacing vague wording like “fairly short” with “use a 3 to 5 sentence paragraph”; and, instead of only saying what not to do, saying what to do.${cite("openai-tips")}</li>
        <li>Anthropic’s documentation advises stating the output format and constraints; numbering steps when order matters; explaining why, which works better than a bare command; and giving a few relevant examples.${cite("anthropic-clear")}</li></ul>
        ${callout("pitfall", "“What to avoid” is the easiest to forget and the most important", "<p>As <a href=\"../C2/index.html\">C2</a> explained, AI continues by “sounding right”: information you didn’t give, it often fills in with something plausible. Writing “don’t make up anything I haven’t told you” and “if you’re not sure, say so” makes fabrication less frequent and easier to spot, but can’t guarantee there is none. You still have to check.</p>")}
        ${demo("briefBuilder", "Briefing sheet", "Fill in the four things and see what’s missing")}` },
    ],
    takeaways: ["What to do, who it’s for, what good looks like, what to avoid.", "Be specific: “3 to 5 sentences” beats “make it shorter”."],
  },
  {
    slug: "4-compare", nav: "Three versions", title: "Signature activity: one task, three ways of writing it",
    subtitle: "A notice for a community talk (Demo)",
    abstract: "Compare them, and see which of the four things pulls the scores apart.",
    tags: ["Demo", "Compare", "Score"],
    sections: [
      { id: "three", title: "Score the three versions", html: demo("compareThree", "Three versions (Demo)", "Read each brief and reply, then score each row 0–2", "The three briefs and three AI replies are illustrations made up for teaching, not real transcripts.")
        + callout("activity", "Then", "<p>Switch to a real task of your own (a message to family, a reply to a customer, instructions for students). Write the one-line version first, then build it up step by step into the four-things version, ask an AI once at each stage, and compare the replies.</p>") },
    ],
    takeaways: ["With a one-line brief, AI can only guess.", "With all four things, it’s almost usable as is, but still needs checking."],
  },
  {
    slug: "5-loop", nav: "Iterate", title: "Iterate: say exactly what’s wrong",
    subtitle: "The Description–Discernment loop",
    abstract: "It’s normal for the first draft to disappoint; the key is saying exactly what’s wrong.",
    tags: ["Revising", "Drawing game"],
    sections: [
      { id: "loop", title: "Describe → look → point it out → describe again", html: `
        <p>The 4D course has a lesson called “the Description–Discernment loop”: describe, look at the result, judge it, describe again.${cite("4d-course")}</p>
        <ul><li>Not “that’s no good, redo it”, but “the second line is too long, make it one sentence; drop stiff phrases like ‘the honour of your attendance is requested’”.</li>
        <li>Not “make it more professional”, but “the readers are accountants, so you can use terms like ‘accounts receivable’ without explaining them”.</li>
        <li>If it has made something up, say so directly: “You added the speaker’s name. Delete it.”</li></ul>
        ${callout("pattern", "In one line", "<p>Once you’re happy, check anything factual the <a href=\"../C4/index.html\">C4</a> way before you send it. What you send is your responsibility.</p>")}` },
      { id: "unplugged", title: "Unplugged: the drawing-instructions game", html: callout("unplugged", "Demo materials", "<p>In pairs: the speaker looks at a card with a simple drawing (say, a large circle with a small triangle in its upper left, and a horizontal line below the circle), with their back to the drawer. Round 1: one sentence only. Round 2: more sentences, but no questions. Round 3: brief with the four things, and the drawer may ask questions. Compare the three drawings: which round came closest? Which sentence helped most?</p><p>The drawer is like the AI: whatever you don’t say, they can only guess. Round 3 matches the technique “if anything is unclear, ask me first”.</p>") },
    ],
    takeaways: ["Say exactly what’s wrong, then brief it again.", "Check it after you’ve finished revising."],
  },
  {
    slug: "6-tracks", nav: "For whom", title: "Versions for different learners",
    subtitle: "Children, older adults, working adults, teachers",
    abstract: "The four things are the same for everyone; how you practise them changes.",
    tags: ["K–12", "Older adults", "Work", "Teachers"],
    sections: [
      { id: "kids", title: "Children / K–12: explain it to a classmate first", html: callout("track", "By school stage", `<p><b>Primary:</b> China’s <i>Guidelines for the Use of Generative AI in Primary and Secondary Schools (2025 edition)</i> say primary pupils must not use open-ended content-generation features on their own.${cite("moe-genai")} The primary version plays the drawing game; then the teacher gives the AI the four things the class wrote together, and everyone looks at the result and finds fault with it.</p><p><b>Secondary:</b> the same guidelines ask students to avoid simply copying generative-AI content into homework and to avoid entering personal information.${cite("moe-genai")} Students hand in three things: their brief, the AI’s reply, and what they changed and why.</p><p><i>Outside China: follow your school’s policy and the age limits in each AI service’s terms.</i></p>`) },
      { id: "seniors", title: "Older adults: say it clearly out loud", html: callout("track", "Asking by voice", "<p>When asking about buses, say it all: where you are, where you’re going, when you’re leaving, whether you want a bus or the underground. Describing your situation is enough; never say your ID number, bank card number or one-time codes (<a href=\"../C5/index.html\">C5</a>). For answers about money or health, verify again with “three red lines, one phone call”.</p>") },
      { id: "workers", title: "Working adults: a briefing sheet for your job", html: callout("track", "Briefing sheet", `<p>Turn tasks you do often into a standing briefing sheet, and just fill it in next time. China’s national security authorities warn never to enter sensitive information such as state secrets, trade secrets or personal private information into AI tools.${cite("mss-ai")} <i>(A China-specific source; the same rule applies everywhere: follow your employer’s data policy and your country’s data-protection rules.)</i> Use pseudonyms and redact, or describe the situation without pasting the original. Run through C4’s five checks before handing it on.</p>`) },
      { id: "teachers", title: "Teachers: teach the writing, and assess it", html: callout("track", "Teaching and assessment", `<p>China’s <i>Guidelines for the Use of Generative AI (2025 edition)</i> say teachers must not use generative AI as a substitute for teaching or to answer students’ questions directly, and strictly prohibit entering sensitive data such as personal information or exam questions into AI tools.${cite("moe-genai")} <i>(Check your own school or education authority’s guidance.)</i> When assessing the “three versions” assignment, look at three things: did they cover all four things; can they point out where the AI filled in information by itself; can they explain why they made each change?</p>`) },
    ],
    takeaways: ["Children: explain it to a classmate first.", "Older adults: say it clearly, and keep private details private.", "Working adults: a briefing sheet, and never paste sensitive originals."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three sentences, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li>First decide whether to hand it over: do you know what you want, is AI good at it, how costly is a mistake, is there information that mustn’t be shared?</li><li>Explain four things: what to do, who it’s for, what good looks like, what to avoid.</li><li>Iterate and say exactly what’s wrong; however clear your brief, you still need to check (<a href="../C4/index.html">C4</a>).</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("“Write a notice about a talk”: which of the four things is this brief missing?", "<p>Who it’s for, what good looks like and what to avoid are all missing, and “what to do” is only half there (posted where? what talk?).</p>"),
        predict("“Make it shorter” or “write 3 to 5 sentences”: which is better?", "<p>The second: it’s specific, so the AI doesn’t have to guess.</p>"),
        predict("Does writing “don’t add anything I haven’t told you” guarantee the AI won’t make things up?", "<p>No: it only reduces fabrication and makes it easier to spot; you still have to check.</p>"),
        predict("You want AI to help you reply to a customer’s complaint email. What should you think about first?", "<p>Whether the email contains the customer’s personal information or anything your organisation mustn’t share; remove or redact it first (C5).</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li>Take a real task of your own, write three briefs, ask an AI once with each, and score them with the table in chapter 4.</li><li>Think of a time an AI answer disappointed you; write down specifically what was wrong, and brief it again.</li><li>What task in your life takes more effort to explain than to just do? Is it still worth handing to AI?</li></ol>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u, o]) => `<li${o ? ` title="${o}"` : ""}>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["Decide whether to hand it over.", "Explain four things.", "Iterate, then check."],
  },
];
