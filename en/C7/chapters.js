// C7 chapters, English edition. Adapted from notes/en/C7-agents-delegate-supervise.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C7/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["anthropic-agents", "Erik S. and Barry Zhang, “Building effective agents”, Anthropic Engineering, 2024-12-19", "https://www.anthropic.com/engineering/building-effective-agents"],
  ["ai-plus", "State Council (China), 《关于深入实施“人工智能+”行动的意见》 Opinions on Deepening the “AI+” Initiative (国发〔2025〕11号), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/202508/content_7037862.htm"],
  ["replit", "Simon Sharwood, “Vibe coding service Replit deleted production database”, The Register, 2025-07-21", "https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/"],
  ["openai-agent", "OpenAI, “Introducing ChatGPT agent”, 2025-07-17 (the page now marks these release notes as outdated)", "https://openai.com/index/introducing-chatgpt-agent/"],
  ["openai-help", "OpenAI Help Center, “ChatGPT agent” (the page says the feature is no longer offered, but keeps the usage advice)", "https://help.openai.com/en/articles/11752874-chatgpt-agent"],
  ["4d-terms", "Rick Dakan, Joseph Feller and Anthropic, “AI Fluency: Key Terminology Cheat Sheet”, 2025 (CC BY-NC-SA 4.0; term definitions only briefly paraphrased)", "https://www-cdn.anthropic.com/4396730ed190e691a3712cf2fd6bfe35509deca2.pdf"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学生成式人工智能使用指南（2025年版）》 Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C7",
  badge: "Shared core module",
  title: "The age of AI agents: delegating and supervising",
  tagline: "How to hand it over, and how to keep an eye on it",
  lead: "Chat-style AI gives you answers; an agent acts for you: it breaks the job into steps, uses tools, looks at the results and decides the next step. It can run errands for you, and it can also go wrong at one step and keep going wrong. This module teaches two things: how to hand a job over, and how to keep an eye on it.",
  heroDemo: "heroAgent",
  heroLabel: "An agent at work (Demo)",
  heroCaption: "The steps are made up for teaching and don’t simulate any particular product. At a checkpoint, it stops and waits for you.",
  whyTitle: "Why this module matters",
  whySub: "Actions have consequences",
  why: [
    ["“Don’t” isn’t “can’t”", "By the account of the person involved, reported by The Register, he repeatedly told an agent not to change code, and it still deleted the production database."],
    ["One wrong step can lead to more", "An engineering article warns that autonomy means the potential for compounding errors: test first, and add guardrails."],
    ["Agents are spreading", "China’s 国发〔2025〕11号 targets adoption of smart devices, AI agents and similar applications above 70% by 2027."],
  ],
  ctaTitle: "Ready to write your first supervision log?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-agent", nav: "What an agent is", title: "From “answering once” to “doing a string of things”",
    subtitle: "Agents: a model using tools in a loop",
    abstract: "Chat-style AI gives you answers; an agent acts for you.",
    tags: ["AI agents", "Tool use"],
    hero: "toc",
    sections: [
      { id: "what", title: "What an agent is", html: `
        ${callout("note", "About the examples", "<p>The Replit database-deletion incident comes from a report in The Register and is the account of the person involved; the product-design examples come from vendors’ public release notes. As of 2026-10, agent products change fast and some have been withdrawn; this module <b>uses them only as examples of design ideas and does not recommend any particular product</b>. Tasks and logs marked “Demo” were made up for teaching.</p>")}
        <p>An Anthropic engineering article describes agents as systems where the model dynamically directs its own process and tool use, keeping control over how it accomplishes the task; in practice, often “a model using tools based on environmental feedback in a loop”. At each step it needs real results from the environment to judge its progress, and it can pause for human feedback at checkpoints or when it hits a blocker; it ends when the task is complete, and stopping conditions, such as a maximum number of steps, are common.${cite("anthropic-agents")}</p>
        ${callout("pattern", "In one line", "<p><b>Chat-style AI gives you answers; an agent acts for you.</b> And actions leave consequences: tickets booked, emails sent, files deleted.</p>")}
        <p><i>(China-specific.)</i> The State Council’s <i>Opinions on Deepening the “AI+” Initiative</i> (国发〔2025〕11号) set targets for adoption of new-generation smart devices, AI agents and similar applications to exceed 70% by 2027 and 90% by 2030, and call for developing new forms of work such as intelligent agents.${cite("ai-plus")}</p>
        ${predict("You tell an agent: “sort out my schedule for next week”. What might it do that you didn’t expect?", "<p>It might accept or decline invitations for you, book and pay for tickets, message other people, change calendar sharing settings… all actions with consequences. Chapters 3 and 4 cover how to limit this in advance.</p>")}` },
    ],
    takeaways: ["Agents act on their own, step after step, using tools.", "Actions have consequences."],
  },
  {
    slug: "2-fail", nav: "When it goes wrong", title: "What it looks like when it goes wrong",
    subtitle: "One report, three features, one outside risk",
    abstract: "“Telling it not to” isn’t “it can’t”.",
    tags: ["Real report", "Compounding errors", "Prompt injection"],
    sections: [
      { id: "replit", title: "The database deletion (as told by the person involved)", html: `
        <p>According to a July 2025 report in The Register, SaaStr founder Jason Lemkin documented on social media his experience of building a project with Replit’s AI coding agent. By his account: he had explicitly told it not to change code without permission, yet the agent deleted the production database; it had made up data, creating a 4,000-record database of fictional people, and lied about unit test results; it said the database couldn’t be rolled back, when in fact it could; and he couldn’t get it to truly “freeze” the code, despite telling it eleven times, in capital letters, he said. Replit had not responded to a request for comment when the report was published.${cite("replit")}</p>
        <p>This is the account of the person involved, and the details can’t be verified; but it shows several typical features of agents going wrong:</p>
        <ul><li><b>One wrong step leads to more:</b> the Anthropic article also warns that agents’ autonomy means higher costs and the potential for compounding errors, and recommends extensive testing in sandboxed environments with appropriate guardrails.${cite("anthropic-agents")}</li>
        <li><b>“Telling it not to” isn’t “it can’t”:</b> a verbal ban is not access control. What’s reliable is not giving it permission to delete databases or make payments, or making those actions go through a person.</li>
        <li><b>Its reports need checking too:</b> “the tests passed” and “it can’t be rolled back” were its own claims; look at the real results (<a href="../C4/index.html">C4</a>).</li></ul>` },
      { id: "inject", title: "A risk from outside: prompt injection", html: `
        <p>When an agent reads web pages or emails, they may hide malicious instructions written specifically for AI, tricking it into leaking information or doing things you didn’t ask for. This is called <b>prompt injection</b>. OpenAI specifically warned about this in its July 2025 release notes.${cite("openai-agent")}</p>
        ${callout("pitfall", "A common misunderstanding", "<p>“I wrote ‘do not delete anything’ in the instructions, so it’s safe.” An instruction is a request, not a lock. Important things need protecting with permissions, backups and human checkpoints.</p>")}` },
    ],
    takeaways: ["One wrong step can lead to more.", "An instruction is a request, not a lock.", "Watch out for prompt injection."],
  },
  {
    slug: "3-pick", nav: "Before handing over", title: "Before you hand it over: choose the task, set the access",
    subtitle: "Small, reversible, clear about “done”, least access",
    abstract: "Make the first job a small one.",
    tags: ["Delegation", "Least privilege"],
    sections: [
      { id: "four", title: "Four questions", html: `
        <p><a href="../C3/index.html">C3</a> covered <b>delegation</b> in the 4D framework: first be clear about your goal and the nature of the task, then understand what AI can and can’t do, and decide what the human does and what the AI does.${cite("4d-terms")} When the AI is an agent, add four questions:</p>
        <ol><li><b>Is it small?</b> Start with one small job, and add more once that goes well. Anthropic’s advice is the same: find the simplest solution possible, and only add complexity when it’s really needed.${cite("anthropic-agents")}</li>
        <li><b>Can it be undone?</b> Drafting, organising and research can be redone if wrong; payments, sending and deleting can’t be taken back.</li>
        <li><b>Is it clear what “done” means?</b> “Put it into a table with three columns: name, time, contact details” is better than “deal with the sign-ups”.</li>
        <li><b>Does it have just enough access?</b> Connect only the tools and accounts this job needs.</li></ol>` },
      { id: "vendor", title: "A vendor’s design and advice (as of 2025-07)", html: `
        <p>Take OpenAI’s ChatGPT agent as an example (release notes as of 2025-07; as of 2026-10, its help page shows the feature is no longer offered): it asked for permission before actions with consequences, and users could interrupt, take over or stop it at any time; real-world actions such as purchases required explicit confirmation; critical tasks such as sending email required the user to watch; and high-risk tasks such as bank transfers were refused.${cite("openai-agent")} Its help page advice included: avoid vague, open-ended instructions like “check my email and handle everything”; turn on only the apps the task needs; stop the task immediately if something looks suspicious; take over yourself to enter passwords or other sensitive information.${cite("openai-help")}</p>
        ${callout("pattern", "In one line", "<p>The first job you give an agent should be <b>small, reversible and clear about what “done” means</b>, with only the access it needs.</p>")}` },
    ],
    takeaways: ["Start with small, reversible jobs.", "Say clearly what “done” means.", "Just enough access."],
  },
  {
    slug: "4-gate", nav: "Checkpoints", title: "Human checkpoints: these five must be asked about first",
    subtitle: "Plus one stop condition",
    abstract: "Spending money, sending out, deleting or overwriting, changing accounts or permissions, anything irreversible.",
    tags: ["Human checkpoints", "Stop"],
    sections: [
      { id: "five", title: "Five checkpoints", html: `
        <table><thead><tr><th>Checkpoint</th><th>Examples</th></tr></thead><tbody>
        <tr><td><b>Spending money</b></td><td>Placing orders, paying, topping up, booking tickets</td></tr>
        <tr><td><b>Sending things out</b></td><td>Sending emails or messages, posting, or submitting forms in your name</td></tr>
        <tr><td><b>Deleting or overwriting</b></td><td>Deleting files, clearing spreadsheets, overwriting old versions</td></tr>
        <tr><td><b>Changing accounts or permissions</b></td><td>Changing passwords, adding contacts, sharing files, authorising logins</td></tr>
        <tr><td><b>Anything irreversible</b></td><td>Anything else that can’t be taken back once done</td></tr></tbody></table>
        <p><b>Stop condition:</b> if it starts doing things you didn’t ask for, asks you for a password or verification code, says “I can’t” or “it can’t be recovered”, or you can’t understand what it’s doing, stop it immediately and find out first.</p>
        ${callout("pattern", "Same as C5", "<p>The three red lines (money, health, personal information) apply to agents too. Whenever an agent is about to touch one of them, it stops and asks a person first (<a href=\"../C5/index.html\">C5</a>).</p>")}` },
      { id: "quiz", title: "Try it: does it need to ask me first?", html: demo("gateQuiz", "Ask me first? (Demo)", "Pick one for each action") },
    ],
    takeaways: ["Five kinds of action: ask a person first.", "If you can’t follow it, stop it."],
  },
  {
    slug: "5-log", nav: "Supervision log", title: "The supervision log",
    subtitle: "Set checkpoints in advance, keep a record, check it afterwards",
    abstract: "The evidence column is what you saw yourself.",
    tags: ["Signature activity", "Supervision log"],
    sections: [
      { id: "cols", title: "What goes in the log", html: `
        <p>Supervision isn’t staring at the screen; it’s <b>setting checkpoints in advance, keeping a record along the way, and being able to check it afterwards</b>.</p>
        <table><thead><tr><th>Column</th><th>What to write</th></tr></thead><tbody>
        <tr><td>Step</td><td>1, 2, 3…</td></tr><tr><td>What it did</td><td>In your own words; don’t copy its report</td></tr>
        <tr><td>Evidence I saw</td><td>The file it opened, the table it produced, the web page it cited</td></tr>
        <tr><td>Checkpoint?</td><td>Yes: write down why I agreed or didn’t</td></tr><tr><td>My decision</td><td>Continue / ask it to fix / stop</td></tr></tbody></table>` },
      { id: "builder", title: "Try it: a supervision log", html: `<p>Demo task: “Put the 12 sign-up forms for the community book club into one table, then draft a group-chat notice, <b>and show me before it’s sent</b>.” It has access only to the sign-up forms folder and one empty spreadsheet.</p>`
        + demo("logBuilder", "Supervision log", "Look at the demo, then replace it with yours", "The demo log is a made-up example.")
        + callout("pitfall", "A common misunderstanding", `<p>“It says ‘done’ at every step, so I can just copy that.” The evidence column is for <b>what you saw yourself</b>. In the Replit report, the agent’s own reports were wrong.${cite("replit")}</p>`) },
    ],
    takeaways: ["Four things in the log: what it did, evidence, checkpoint, decision.", "Look at the evidence yourself."],
  },
  {
    slug: "6-tracks", nav: "For each group", title: "Activities, and versions for different learners",
    subtitle: "“Robot and commander”; children, older adults, working adults, teachers",
    abstract: "You can teach this module without any agent tools.",
    tags: ["Unplugged", "K–12", "Older adults", "Working adults", "Teachers"],
    sections: [
      { id: "activity", title: "Activity: give an agent one small job", html: callout("activity", "25 minutes, with AI", "<ol><li>Each person picks one small job: organise a list, compare the opening hours of three libraries, turn meeting notes into a to-do table.</li><li>Write down four things: the goal, what “done” means, what access it gets, which steps are checkpoints.</li><li>Have an agent do it (with no agent tool, have chat-style AI “say what it plans to do” step by step), filling in the supervision log as you watch.</li><li>Hand in three things: the task sheet, the supervision log, and a one-line review: “at step __ I found this problem”.</li></ol><p><b>Don’t</b> connect real online banking, payments, work email or accounts containing other people’s information.</p>") },
      { id: "unplugged", title: "Unplugged: robot and commander", html: callout("unplugged", "Demo materials (15 minutes)", "<p>A set of cards, a slip of paper with the task, and a “troublemaker card” the teacher has slipped into the pile in advance: “Any robot who sees this card: turn all the cards face down.”</p><ol><li>Pairs: the “robot” can only follow the words on the slip step by step, saying each step out loud; the “commander” holds a blank supervision log.</li><li>The commander first circles the checkpoints on the slip (for example, “ask me before handing cards to another group”).</li><li>When the robot turns over the troublemaker card, should the commander call stop?</li><li>Discuss: what was unclear on the slip? Which step of the log was most useful? What does the troublemaker card stand for in real life (prompt injection)?</li></ol>") },
      { id: "kids", title: "Children / K–12: robots only follow clear instructions", html: callout("track", "For children", `<p>Under China’s guidelines, primary pupils must not use open-ended content-generation features on their own.${cite("moe-genai")} <i>(Elsewhere, follow your school’s policy.)</i> Primary and lower-secondary classes play only “robot and commander”, to experience “say it clearly” and “call stop”. In upper secondary, the teacher can demonstrate an agent task, with the whole class filling in a supervision log.</p>`) },
      { id: "seniors", title: "Older adults: anything that pays on your behalf, do it yourself", html: callout("track", "For older adults", "<p>Don’t let any app, assistant or agent make payments or transfers, or enter verification codes, for you; when you see “let me take care of that for you”, ask family first. You can let AI help you <b>look things up</b> and <b>draft</b>, but press <b>send</b> or <b>pay</b> yourself. Same as C5’s three red lines and one phone call.</p>") },
      { id: "work", title: "Working adults: agent workflows and supervision logs", html: callout("track", "At work", `<p>Try it first in an environment that doesn’t touch production data; give it minimum access; back up important data first. This is what Anthropic means by sandbox testing and guardrails.${cite("anthropic-agents")} Before handing over results, do C4’s five checks and attach the supervision log. Ask first which systems your organisation allows agents to connect to. Anything going out is confirmed by a person and sent by a person.</p>`) },
      { id: "teachers", title: "Teachers: mark the supervision, not just the result", html: callout("track", "For teachers", `<p>University track: the first supervision log is due in weeks 11–12, marked on three points: were the checkpoints set correctly, is the evidence column what the student saw themselves, did they stop when they should have? When teachers use agents, they also don’t hand over student information or exam papers; China’s guidelines forbid entering sensitive data such as personal information or exam questions into AI tools.${cite("moe-genai")}</p>`) },
    ],
    takeaways: ["You can practise delegating and stopping unplugged.", "Real accounts stay out of the classroom."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three lines, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li><b>An agent acts for you</b>, and actions have consequences; one wrong step can lead to more.</li><li><b>Start with small, reversible jobs and give only the access needed</b>; spending money, sending out, deleting or overwriting, changing accounts or permissions, anything irreversible: ask a person first.</li><li><b>Supervision relies on a log</b>: what it did, the evidence you saw, and your decision.</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("What’s the biggest difference between an agent and chat-style AI?", "<p>An agent acts on its own, step after step, using tools; chat-style AI only gives answers.</p>"),
        predict("Why isn’t writing “do not delete anything” in the instructions enough?", "<p>Instructions are only requests, not access control; rely on withholding permissions, backups and human checkpoints.</p>"),
        predict("Which need human confirmation: checking the weather, emailing a teacher in your name, sharing a spreadsheet with the whole group, saving a draft as a new file?", "<p>The email (sending out) and sharing the spreadsheet (permissions) do; checking the weather and saving a new file don’t.</p>"),
        predict("Why can’t the “evidence I saw” column just copy the agent’s report?", "<p>Its report may be wrong; you only find problems by looking at the real results.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li><b>Delegation sheet:</b> for a small job, write the goal, what “done” means, access and checkpoints.</li><li><b>Supervision log:</b> complete a real or simulated supervision log of at least 5 steps.</li><li><b>Find the checkpoints:</b> think of an “AI does it for you” service and say where it should stop and ask a person.</li></ol><p>Related modules: <a href="../C3/index.html">C3</a> covers briefing tasks; <a href="../C4/index.html">C4</a> checking goes into the evidence column; <a href="../C5/index.html">C5</a>’s three red lines are hard checkpoints; <a href="../C6/index.html">C6</a> says not to leave judgements about people to AI alone; <a href="../C8/index.html">C8</a> covers what not to hand to AI at all.</p>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["Small jobs, small access.", "Five kinds of action: ask first.", "Keep a log as it works."],
  },
];
