// C8 chapters, English edition. Adapted from notes/en/C8-when-not-to-use-ai.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C8/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["bastani", "Hamsa Bastani et al., “Generative AI without guardrails can harm learning: Evidence from high school mathematics”, PNAS, 2025, full text on PMC", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/"],
  ["ms-critical", "Hao-Ping (Hank) Lee et al., “The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers”, CHI 2025, Microsoft Research", "https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/"],
  ["mit-brain", "Nataliya Kosmyna et al., “Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task”, arXiv preprint 2506.08872, 2025, MIT Media Lab", "https://www.media.mit.edu/publications/your-brain-on-chatgpt/"],
  ["ailit-fw", "European Commission & OECD, “AILit Framework”, Frameworks page (competence Manage AI 1; ©2026 OECD, all rights reserved, so only the competence name is briefly paraphrased)", "https://ailiteracyframework.org/frameworks/"],
  ["unesco-genai", "Fengchun Miao and Wayne Holmes, UNESCO, “Guidance for generative AI in education and research”, 2023 (page updated 2026-01-16)", "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学生成式人工智能使用指南（2025年版）》 Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C8",
  badge: "Shared core module · final module of the core series",
  title: "When not to use AI",
  tagline: "Some abilities need to grow in you",
  lead: "The first seven modules were about using AI well. The last one asks the opposite: when shouldn’t you use it? If you hand the answers to AI while practising, next time there’s no AI, you won’t be able to do it. This module gives you two tools, AI-off checkpoints and a reflection log, and finally ties C1–C8 together on one page.",
  heroDemo: "heroDecide",
  heroLabel: "Six questions: hand this to AI or not?",
  heroCaption: "The examples are made up for teaching. If any of the six answers is “yes”, don’t hand it straight to AI.",
  whyTitle: "Why this module matters",
  whySub: "Knowing how to use it includes knowing when not to",
  why: [
    ["Answers in practice, worse in the exam", "In a high-school maths experiment, students who freely asked AI while practising scored 17% lower in a later exam without AI."],
    ["You don’t notice", "The same study found students didn’t perceive that they had learned less."],
    ["Hints only works much better", "In the group whose AI gave hints, not answers, the negative effect was largely cancelled out."],
  ],
  ctaTitle: "Ready to set your first checkpoint?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-study", nav: "An experiment", title: "A high-school maths experiment",
    subtitle: "Answers in practice, worse in the exam",
    abstract: "Practice scores up 48%, exam scores down 17%.",
    tags: ["Research", "Independent learning"],
    hero: "toc",
    sections: [
      { id: "exp", title: "The experiment and results", html: `
        ${callout("note", "About the examples", "<p>All three studies come from published papers or paper pages, and we spell out each study’s limitations. Checkpoints and logs marked “Demo” were made up for teaching. <b>This module is not “anti-AI”</b>: what matters is how you use it, and when you leave it aside for a while.</p>")}
        <p>In autumn 2023, researchers ran an experiment with nearly 1,000 students at a high school in Turkey: some could use a standard GPT-4 chat interface while practising (GPT Base), some used a restricted version (GPT Tutor, which gave hints rather than direct answers), and some used no AI.${cite("bastani")}</p>
        <ul><li><b>While practising:</b> GPT Base students improved by 48%, and GPT Tutor students by 127%.</li>
        <li><b>In the following exam, with no AI allowed:</b> students who had used GPT Base scored 17% lower than students who had never used AI; for GPT Tutor students, this negative effect was largely cancelled out.</li>
        <li><b>Why:</b> without restrictions, students used GPT-4 as a “crutch”, mainly asking for answers and copying them; and they <b>did not perceive</b> that they had learned less.</li>
        <li><b>Incidentally:</b> in the study, GPT Base gave correct answers only 51% of the time on average.${cite("bastani")}</li></ul>
        <p><b>Limitations:</b> one school, one subject (maths), soon after generative AI became widespread, and short-term effects only. The researchers say so themselves.${cite("bastani")}</p>
        ${predict("If performance improved by 48% while practising, why was it worse in the exam? If you were that student, would you have noticed?", "<p>While practising, the AI was solving the problems, so the students didn’t get the practice; and the study found they didn’t notice.</p>")}` },
    ],
    takeaways: ["Taking answers directly while practising can mean learning less.", "Hints-only use works much better."],
  },
  {
    slug: "2-read", nav: "Reading research", title: "What other studies say (read with care)",
    subtitle: "Check the sample, the conditions, and whether it’s peer reviewed",
    abstract: "Write “in this study”, not “AI makes you stupid”.",
    tags: ["Research", "Checking"],
    sections: [
      { id: "two", title: "Two studies", html: `<ul>
        <li><b>A survey of knowledge workers.</b> A study by Microsoft Research and other researchers at CHI 2025 surveyed 319 knowledge workers about 936 examples of using generative AI at work: the more confidence people had in AI, the less critical thinking they reported; the more confidence in themselves, the more they reported. The focus of critical thinking was also shifting: towards verifying information, integrating responses and taking responsibility for the task. <b>Limitation:</b> it’s self-reported.${cite("ms-critical")}</li>
        <li><b>An EEG experiment.</b> A study from the MIT Media Lab had 54 people write essays in three groups (using an LLM, a search engine, or on their own), measured with EEG. The LLM group showed the weakest brain connectivity, the lowest sense of ownership of their essays, and the most difficulty accurately quoting the essay they had just written. <b>Limitation:</b> released as an arXiv preprint, with a small sample (only 18 people completed the fourth session).${cite("mit-brain")}</li></ul>
        ${callout("pattern", "How to read this kind of research", "<p>Look at the sample size, what was measured, under what conditions, and whether it was peer reviewed. Write conclusions as “in this study…”, not “AI makes people stupid”. This is <a href=\"../C4/index.html\">C4</a>’s checking, applied to research.</p>")}` },
    ],
    takeaways: ["Every study has limitations.", "Don’t overstate the conclusions."],
  },
  {
    slug: "3-six", nav: "Six questions", title: "When not to use it: six questions",
    subtitle: "Decide whether to use AI based on the nature of the task",
    abstract: "If any of the six answers is “yes”, don’t hand it straight to AI.",
    tags: ["Six questions", "When not to use"],
    sections: [
      { id: "six", title: "Six questions", html: `
        <p>The European Commission and OECD’s AILit framework lists “<b>deciding whether to use an AI system based on the nature of the task</b>” as an AI literacy competence.${cite("ailit-fw")} UNESCO’s guidance on generative AI in education also proposes a minimum age for independent use of generative AI chat platforms, and designing use by age.${cite("unesco-genai")} For each of us, six questions:</p>
        <ol><li><b>Am I learning this skill?</b> If the practice itself is the point, do it yourself first; when you need help, have AI give hints, not answers.${cite("bastani")}</li>
        <li><b>Does it need my judgement and responsibility?</b> For decisions that affect people (<a href="../C6/index.html">C6</a>) or things you sign off on, AI can advise, but you decide.</li>
        <li><b>Is it something between people?</b> Apologies, comfort and thanks are better in your own words.</li>
        <li><b>Do the rules allow it?</b> Exams, assignment rules, workplace policies. <i>(In China,)</i> the <i>Guidelines for the Use of Generative AI in Primary and Secondary Schools (2025 edition)</i> say primary pupils must not use open-ended content-generation features on their own, and require pupils to avoid simply copying generative AI content into homework.${cite("moe-genai")} <i>(Elsewhere, follow your school’s or employer’s rules.)</i></li>
        <li><b>Does it involve privacy or confidentiality?</b> Information that mustn’t leave your hands doesn’t go to AI (<a href="../C5/index.html">C5</a>).</li>
        <li><b>Can I check the result?</b> If the result matters and you can’t check it, don’t rely on AI (<a href="../C4/index.html">C4</a>).</li></ol>
        ${callout("pitfall", "A common misunderstanding", `<p>“If I let AI do it and then read it through, that’s the same as knowing how.” Understanding and being able to do it are two different things. The students in the experiment thought they had learned it too.${cite("bastani")}</p>`)}` },
    ],
    takeaways: ["If you’re learning a skill, do it yourself first.", "If you need help, ask for hints only."],
  },
  {
    slug: "4-tools", nav: "Checkpoints and log", title: "AI-off checkpoints and the reflection log",
    subtitle: "Switch AI off every so often; write five lines after each use",
    abstract: "With AI switched off, can I still do it?",
    tags: ["Signature activity", "Checkpoints", "Reflection log"],
    sections: [
      { id: "check", title: "AI-off checkpoints", html: `<ol>
        <li><b>Pick a skill:</b> something you’ve often had AI help with lately, such as writing a work summary, solving a type of problem, or doing a calculation.</li>
        <li><b>Set the timing:</b> for example, one time in every five you do it entirely yourself; or once a week at a fixed time.</li>
        <li><b>Do it with AI off:</b> no AI, but books and notes are fine.</li>
        <li><b>Compare:</b> against the results when AI helped: where did you get stuck, where were you slower?</li>
        <li><b>Adjust how you use it:</b> where you got stuck, next time think for five minutes before asking; and when you ask, say “just give me a hint, not the answer”.</li></ol>
        ${callout("demo", "Demo: a university student’s checkpoint (a made-up example)", "<p>For several weeks she had used AI to help write the “discussion” section of her lab reports. On checkpoint day she switched AI off and wrote it herself: she could describe the data, but couldn’t write “what the results mean, and why they differ from what we expected”. <b>Adjustment:</b> from now on she writes three key points for the discussion herself first, then has AI only point out gaps in the logic, without rewriting.</p>")}` },
      { id: "log", title: "Try it: a reflection log", html: demo("reflectLog", "Reflection log", "After each use of AI, write five lines", "The demo content is a made-up example.") },
    ],
    takeaways: ["Switch AI off regularly to check yourself.", "Write five lines after each use."],
  },
  {
    slug: "5-series", nav: "Series summary", title: "Series summary: C1–C8 on one page",
    subtitle: "One thread, three badge levels",
    abstract: "Checking → supervising → not using.",
    tags: ["Series summary", "Badges"],
    sections: [
      { id: "map", title: "C1–C8", html: `
        <table><thead><tr><th>Module</th><th>In one line</th><th>What you hand in</th></tr></thead><tbody>
        <tr><td><a href="../C1/index.html">C1</a> What AI is, and what it isn’t</td><td>Talking ≠ thinking or taking responsibility</td><td>“Guess the rule” game record</td></tr>
        <tr><td><a href="../C2/index.html">C2</a> Data, models and hallucination</td><td>Answers come from data, so it can make things up</td><td>“Make AI get it wrong” record</td></tr>
        <tr><td><a href="../C3/index.html">C3</a> Describing and delegating</td><td>Four things: what to do, who it’s for, what good looks like, what to avoid</td><td>A task piece</td></tr>
        <tr><td><a href="../C4/index.html">C4</a> Checking</td><td>Grade by risk, check with five moves</td><td>Checking log</td></tr>
        <tr><td><a href="../C5/index.html">C5</a> Safety, privacy and scams</td><td>Three red lines, one phone call</td><td>Family code word drill</td></tr>
        <tr><td><a href="../C6/index.html">C6</a> Fairness, ethics and work</td><td>Bias can be tested; label AI work; break jobs into tasks</td><td>Bias audit, task table</td></tr>
        <tr><td><a href="../C7/index.html">C7</a> AI agents: delegating and supervising</td><td>Checkpoints + supervision log</td><td>Supervision log</td></tr>
        <tr><td>C8 When not to use AI</td><td>With AI off, can I still do it?</td><td>Checkpoint + reflection log</td></tr></tbody></table>
        ${callout("pattern", "One thread", "<p><b>Checking (C4) → supervising (C7) → not using (C8).</b> First learn to check one sentence, then to keep an eye on an agent, and finally to know when to do it yourself.</p>")}` },
      { id: "badges", title: "Three badge levels", html: `<ul>
        <li><b>L1 “Know”:</b> pass the practical quizzes for C1, C2 and C5 (not just multiple choice).</li>
        <li><b>L2 “Use”:</b> complete a task piece (C3).</li>
        <li><b>L3 “Check”:</b> pass the checking challenge (C4), submit a supervision log (C7), and complete an oral defence (including C8: which parts you didn’t let AI do, and why).</li></ul>
        <p>The badges are this course’s own design, all assessed by practical work; whether they can count towards China’s credit bank or university credit recognition is, as of 2026-10, still under discussion and a proposal only.</p>`
        + demo("seriesCheck", "Series self-check", "For each module, tick one thing you already do") },
    ],
    takeaways: ["Checking, supervising and not using are one thread.", "All three badge levels are assessed by practical work."],
  },
  {
    slug: "6-tracks", nav: "For each group", title: "Activities, and versions for different learners",
    subtitle: "Yourself, then a hint, then yourself; children, university, working adults, older adults, teachers",
    abstract: "Bring checkpoints to every kind of learner.",
    tags: ["Unplugged", "K–12", "University", "Working adults", "Older adults", "Teachers"],
    sections: [
      { id: "activity", title: "Activity: my first checkpoint", html: callout("activity", "20 minutes, with AI", "<ol><li>Each person writes down one thing they’ve often had AI help with lately.</li><li>Switch AI off on the spot, and spend 10 minutes doing a small task of the same kind yourself.</li><li>Compare in pairs: where did you get stuck? Using the six questions, how should you use AI for this from now on?</li><li>Write your first reflection log entry, and set the date for your next checkpoint.</li></ol>") },
      { id: "unplugged", title: "Unplugged: yourself, then a hint, then yourself", html: callout("unplugged", "Demo materials (15 minutes)", "<p>The teacher prepares one problem and three “hint cards”, each giving only a little clue; even the last one doesn’t give the answer.</p><ol><li>Work on it yourself for 3 minutes, and write down how far you got.</li><li>If you’re stuck, take a hint card and work for another 3 minutes; still stuck, take the next one.</li><li>Finally, without the cards, explain the problem from start to finish to your neighbour.</li><li>Discuss: how is a hint card different from being given the answer? This is the “hints only” idea from the study.</li></ol>") },
      { id: "kids", title: "Children / K–12: think first, then ask", html: callout("track", "For children", `<p><i>(China)</i> Primary pupils don’t use open-ended generation features on their own; in secondary school, homework doesn’t simply copy AI content.${cite("moe-genai")} <i>(Elsewhere, follow your school’s policy.)</i> Classroom rule: think first and write down your ideas, then look at hints from AI or the teacher; homework includes one line saying “which part I did myself”.</p>`) },
      { id: "uni", title: "University: AI off at midterm, explain it clearly at the end", html: callout("track", "For university students", "<p>The week 8 AI-off midterm is a checkpoint; the week 16 oral defence must explain “which parts we didn’t let AI do, and why”. The reflection log builds up over the semester and counts towards the “reflection” grade.</p>") },
      { id: "work", title: "Working adults: keep your core skills in your own hands", html: callout("track", "At work", "<p>Set checkpoints for the one or two most central skills in your job (writing proposals, reading contracts, costing), and do them yourself once a month. If AI breaks, the internet goes down, or AI isn’t allowed, your work can carry on.</p>") },
      { id: "seniors", title: "Older adults: use AI, and keep your own ways too", html: callout("track", "For older adults", "<p>AI can help with bus routes, sums and phone numbers, but keep your old ways too: write important numbers on paper, and check sums again on a calculator. For money, health and personal information, make the final decision yourself or ask family (same as C5).</p>") },
      { id: "teachers", title: "Teachers: design checkpoints into assignments", html: callout("track", "For teachers", `<p>Include an AI-off part in assignments (timed work in class, an oral explanation), and require a reflection log. When students use AI, prefer “hints, not answers”.${cite("bastani")} <i>(China)</i> Teachers must not use generative AI as a substitute for teaching, and must not use AI to answer students’ questions directly.${cite("moe-genai")}</p>`) },
    ],
    takeaways: ["Every kind of learner can set checkpoints.", "Hint cards beat answers."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "Use it, check it, keep an eye on it, and know when to do it yourself.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li><b>Taking answers directly while practising can mean you learn less, without noticing</b>; using AI for hints only works much better.</li><li><b>Use the six questions to decide whether to use AI</b>: am I learning this skill, does it need my responsibility, is it between people, do the rules allow it, does it involve privacy, can I check it?</li><li><b>Switch AI off regularly to check yourself</b>, and keep a reflection log; checking, supervising and not using are one thread.</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("In the experiment, how did GPT Base and GPT Tutor students do in the exam with no AI allowed?", `<p>GPT Base students scored 17% lower than those who had never used AI; for GPT Tutor students the negative effect was largely cancelled out.${cite("bastani")}</p>`),
        predict("What’s wrong with the claim “using AI makes your brain stupid”?", "<p>The research reports results for particular uses under particular conditions, and some of it is preprints or self-reports; it can’t be generalised into one sentence.</p>"),
        predict("Which is more of a case for not using AI at first: writing an apology letter, looking up an English word, or preparing for tomorrow’s maths quiz?", "<p>The apology letter (between people) and preparing for the maths quiz (learning a skill); looking up a word is fine, though best checked in a dictionary.</p>"),
        predict("What three things does the L3 “Check” badge require?", "<p>The checking challenge, a supervision log and an oral defence.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li><b>Checkpoint:</b> pick a skill, set your checkpoint rule, and do the first one next week.</li><li><b>Reflection log:</b> for one week, write five lines after every use of AI.</li><li><b>Series review:</b> using the table in chapter 5, score yourself: which modules are you already using, and which not yet?</li></ol><p>Related modules: <a href="../C4/index.html">C4</a> checking, <a href="../C5/index.html">C5</a> red lines, <a href="../C6/index.html">C6</a> judgements about people, <a href="../C7/index.html">C7</a> supervising. Back to <a href="../index.html">all modules</a>.</p>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["With AI off, can I still do it?", "Six questions.", "Checking, supervising, not using."],
  },
];
