// C1 chapters, English edition. Adapted from notes/en/C1-what-is-ai.md (the notes are the master; keep in sync).
// Sources match the notes' footnotes one to one (same keys as site/C1/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["eliza", "“ELIZA”, Wikipedia (cites Weizenbaum’s 1966 paper and 1976 book)", "https://en.wikipedia.org/wiki/ELIZA"],
  ["oecd", "Stuart Russell, Karine Perset, Marko Grobelnik, “Updates to the OECD’s definition of an AI system explained”, OECD.AI, 2023-11-29", "https://oecd.ai/en/wonk/ai-system-definition-update"],
  ["bard", "James Vincent, “Google’s AI chatbot Bard makes factual error in first demo”, The Verge, 2023-02-08", "https://www.theverge.com/2023/2/8/23590864/google-ai-chatbot-bard-mistake-error-exoplanet-demo"],
  ["aircanada", "“Moffatt v. Air Canada” (2024 BCCRT 149), Wikipedia", "https://en.wikipedia.org/wiki/Moffatt_v._Air_Canada"],
  ["moe-tongshi", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学人工智能通识教育指南（2025年版）》 Guidelines for General AI Education in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35042.html"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学生成式人工智能使用指南（2025年版）》 Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["unesco", "UNESCO, “AI competency framework for students”, 2024", "https://www.unesco.org/en/articles/ai-competency-framework-students"],
  ["ailit", "European Commission & OECD, “AILit Framework”", "https://ailiteracyframework.org/"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C1",
  badge: "Shared core module",
  title: "What AI is, and what it isn't",
  tagline: "Talking isn't thinking, and it isn't taking responsibility",
  lead: "Phone maps, video feeds, face unlock and chatbots are all called AI. This module helps you tell the difference: AI works out outputs from inputs and is very capable, but talking is not understanding, answering is not knowing, and doing a job is not taking responsibility.",
  heroDemo: "heroIsAI",
  heroLabel: "Is this AI? What kind of output? (Demo)",
  heroCaption: "The sorting cards are a demo made up for teaching.",
  whyTitle: "Why start here",
  whySub: "Know what AI is, and checking and scam-spotting have something to stand on",
  why: [
    ["People easily take “sounds right” for “understands”", "ELIZA, a chat program from 1966, only followed rules, yet many people felt it understood them."],
    ["AI is useful", "Predicting, recommending, generating content, making decisions: it's all around us."],
    ["People stay responsible", "Whatever a machine does, the person using it and the organisation that deployed it answer for it."],
  ],
  ctaTitle: "Ready to get to know AI?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-eliza", nav: "ELIZA", title: "An old program that could chat",
    subtitle: "It only followed rules. Why did people feel it understood them?",
    abstract: "ELIZA (1966) and the “ELIZA effect”.",
    tags: ["Real case", "ELIZA effect"],
    hero: "toc",
    sections: [
      { id: "story", title: "The story of ELIZA", html: `
        <p>In 1966, Joseph Weizenbaum at MIT published a program that could “chat”, called ELIZA. Its best-known script played a psychotherapist: it picked out keywords from what you typed and, following rules written in advance, turned your words back into a question. Type “You are very helpful” and it might reply “What makes you think I am very helpful?”. It did not understand anything you said.${cite("eliza")}</p>
        <p>Yet many people felt, after a few lines, that it understood them. According to the record, Weizenbaum’s secretary, while chatting with ELIZA, asked him to leave the room so she could talk to it in private. The tendency to believe a program “understands” us came to be called the <b>ELIZA effect</b>.${cite("eliza")}</p>
        ${predict("Today’s chat AI is far stronger than ELIZA. Does “it sounds right” prove “it understands”?", "<p>No. Sounding right is one thing; understanding and caring are another. Chapter 3 explains.</p>")}` },
    ],
    takeaways: ["ELIZA only followed rules, and people still felt it understood them.", "“Sounds right” doesn’t prove “understands”."],
  },
  {
    slug: "2-what", nav: "What it is", title: "What AI is",
    subtitle: "It works out an output from its input",
    abstract: "A one-sentence definition, four kinds of output, and rules written by people versus rules learned from data.",
    tags: ["Definition", "Prediction", "Recommendation", "Content", "Decision"],
    sections: [
      { id: "define", title: "A one-sentence definition", html: `
        <p>The OECD updated its definition in 2023. In outline: an AI system is a machine-based system that, for explicit or implicit objectives, infers from the input it receives how to generate outputs such as predictions, content, recommendations or decisions that can influence physical or virtual environments.${cite("oecd")}</p>
        ${callout("pattern", "In plain words", "<p><b>AI works out an output from the input it gets.</b></p>")}
        <table><thead><tr><th>Output</th><th>What it is</th><th>Everyday example</th></tr></thead><tbody>
        <tr><td>Prediction</td><td>A guess at something not yet known</td><td>A map app estimating your arrival time</td></tr>
        <tr><td>Recommendation</td><td>Picking, from many options, what you might want</td><td>The next short video in your feed</td></tr>
        <tr><td>Content</td><td>Generating text, images, sound or video</td><td>A paragraph written by a chatbot</td></tr>
        <tr><td>Decision</td><td>Making a choice or taking an action directly</td><td>A door that unlocks when it recognises your face</td></tr></tbody></table>` },
      { id: "learned", title: "Rules written by people, and rules learned from data", html: `<p>Everything ELIZA could do was in rules people wrote. Most of today’s AI <b>learns its rules from large amounts of data</b>: it can handle cases nobody could write out, and its faults are harder to predict (more in C2). The OECD explanation notes that the objectives of a large language model such as ChatGPT are learned partly by imitating human-written text and partly from human feedback, and that a recommender system keeps adjusting to users’ preferences after it goes live.${cite("oecd")}</p>` },
      { id: "sort", title: "Try it: is this AI?", html: demo("isAI", "Sorting cards (Demo)", "Pick one answer for each card", "Use the debatable card (the beauty filter, say) for discussion.") },
    ],
    takeaways: ["AI works out outputs from inputs.", "Four kinds of output: prediction, recommendation, content, decision.", "Today’s AI learned most of what it can do from data."],
  },
  {
    slug: "3-nots", nav: "What it isn't", title: "What AI is not: three “is not”s",
    subtitle: "Talking ≠ understanding · Answering ≠ knowing · Doing ≠ being responsible",
    abstract: "Use it as a tool, check it like a tool, and people answer for what happens.",
    tags: ["Is not", "Responsibility"],
    sections: [
      { id: "talk", title: "Talking is not understanding", html: `<p>People easily take “sounds right” for “understands”.${cite("eliza")} When a chat AI says “I understand how you feel”, that doesn’t mean it really understands or really cares. It can be a useful tool; it is not a friend who looks out for you.</p>` },
      { id: "know", title: "Answering is not knowing", html: `<p>In February 2023, in its launch demo, Google’s chatbot Bard said the James Webb Space Telescope took “the very first pictures of a planet outside of our own solar system”, when the first picture of an exoplanet had in fact been taken in 2004.${cite("bard")} For why this happens, see <a href="../C2/index.html">C2</a>; for what to do about it, see <a href="../C4/index.html">C4 Checking</a>.</p>` },
      { id: "duty", title: "Doing a job is not taking responsibility", html: `<p>A passenger in Canada bought tickets based on what the chatbot on an airline’s website told him, and was refused the discount when he applied afterwards. The airline argued the chatbot was “responsible for its own actions”; in February 2024 the tribunal rejected that and ordered the airline to pay compensation.${cite("aircanada")}</p>
        ${callout("pitfall", "Avoid both extremes", "<p>Don’t treat AI as a person, and don’t treat it as nothing. <b>Use it as a tool, check it like a tool, and people answer for what happens.</b></p>")}
        <table><thead><tr><th>AI is good at</th><th>AI is bad at / can’t replace</th></tr></thead><tbody>
        <tr><td>Finding patterns in huge amounts of data, quickly and at scale</td><td>Truly understanding meaning, caring about consequences</td></tr>
        <tr><td>Drafting, rewriting, translating, summarising, brainstorming</td><td>Guaranteeing facts are right, especially obscure or recent ones</td></tr>
        <tr><td>Predicting, recommending and sorting by pattern</td><td>Taking responsibility, making value judgements, deciding for you</td></tr></tbody></table>` },
    ],
    takeaways: ["Talking is not understanding.", "Answering is not knowing.", "Doing a job is not taking responsibility: people are responsible."],
  },
  {
    slug: "4-game", nav: "Guess the rule", title: "The guess-the-rule game",
    subtitle: "Getting it right is not understanding it",
    abstract: "An unplugged game, with a computer version you can play here. The rule cards and words are a made-up demo.",
    tags: ["Unplugged", "Game"],
    sections: [
      { id: "online", title: "Computer version", html: demo("guessRule", "Guess the rule (Demo)", "Type words, then guess the rule card") },
      { id: "unplugged", title: "Unplugged version", html: callout("unplugged", "No devices needed", `<p>One person is the “machine”. They hold a rule card (for example “if the word is an animal, raise your left hand”) and may only act on the rule. Everyone else takes turns saying words; whoever guesses the rule first is the next “machine”. After each round, ask three questions: Did the “machine” get it right? Does it know kittens are cute and tigers are dangerous? What will it do with a word the rule card never thought of?</p><p>ELIZA’s rules were written by people; today’s AI learns its rules from huge numbers of examples, so it copes with many more words it has never seen. But the principle is the same: <b>getting it right is not understanding it</b>.</p>`) },
    ],
    takeaways: ["The “machine” follows its rule quickly and accurately, but doesn’t understand.", "Today’s AI learns its rules from data; the principle is the same."],
  },
  {
    slug: "5-tracks", nav: "For whom", title: "Versions for different learners",
    subtitle: "Children, older adults, working adults, teachers",
    abstract: "The core message is the same for everyone; the examples and emphasis change.",
    tags: ["K–12", "Older adults", "Work", "Teachers"],
    sections: [
      { id: "kids", title: "Children / K–12: it can do it, but does it understand?", html: callout("track", "Compare people and machines", `<p>In China, the <i>Guidelines for General AI Education in Primary and Secondary Schools (2025 edition)</i> ask primary pupils to learn about basic AI technologies such as speech recognition and image classification, and to build a basic habit of questioning by comparing how AI and humans behave.${cite("moe-tongshi")} The companion <i>Guidelines for the Use of Generative AI in Primary and Secondary Schools (2025 edition)</i> say primary pupils must not use open-ended content-generation features on their own, so the primary version uses the guess-the-rule game and the sorting cards.${cite("moe-genai")}</p><p><b>Outside China:</b> these are Chinese national guidelines. Check your own country’s or school’s policy and the age limits in each AI service’s terms; UNESCO’s student framework (below) is an international reference.</p>`) },
      { id: "seniors", title: "Older adults: something that talks isn’t necessarily a person", html: callout("track", "Recognise the machine", `<p>Whatever is talking to you on the phone, in a video or in a group chat could be AI. Don’t hand your money, ID number, one-time codes or private feelings to a chatbot. It’s handy for the weather or bus times; for anything about money or health, ask your children or your doctor.</p>`) },
      { id: "workers", title: "Working adults: the tool doesn’t sign; you do", html: callout("track", "Be clear who is responsible", `<p>In the Air Canada case, the company tried to shift responsibility onto its chatbot and failed.${cite("aircanada")} The reports, emails and contracts you draft with AI carry your name.</p>`) },
      { id: "teachers", title: "Teachers: clear up misconceptions first, then teach use", html: callout("track", "International frameworks", `<p>UNESCO’s <i>AI competency framework for students</i> sets out 12 competencies across four dimensions, the first being a human-centred mindset, at three levels: understand, apply and create.${cite("unesco")} The AILit framework from the European Commission and the OECD divides AI literacy into four domains: Engage, Create, Manage and Design (Shape).${cite("ailit")} This module is the starting point of the “understand” level and the Engage domain.</p>`) },
    ],
    takeaways: ["Children: use games to compare people and machines.", "Older adults: something that talks isn’t necessarily a person.", "Working adults and teachers: the tool doesn’t sign; people do."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three sentences, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li>AI works out an output from its input: a prediction, a recommendation, content or a decision. Today’s AI learned most of what it can do from data.</li><li>Talking is not understanding, answering is not knowing, doing a job is not taking responsibility.</li><li>Use it as a tool, check it like a tool, and people answer for what happens.</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("A calculator works out 23 × 47 quickly and correctly. Is it AI?", "<p>Usually not: it follows fixed arithmetic rules; it isn’t inferring from patterns learned from data.</p>"),
        predict("A chatbot says “Don’t be sad, I’m always here for you”. Does that show it cares about you?", "<p>No. Sounding right isn’t understanding or caring (the ELIZA effect).</p>"),
        predict("A company’s chatbot promises you a refund, and then the company won’t honour it. Who should you go to?", "<p>The company: the organisation that put the chatbot to work is responsible.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li>Count how many times you use AI today. Each time, was it predicting, recommending, generating content or making a decision?</li><li>Play a round of the guess-the-rule game with your family, then ask: did the “machine” understand the words?</li><li>Think of a question you suspect AI might get wrong. Come back to it after <a href="../C2/index.html">C2</a> to see why.</li></ol>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["AI works out outputs from inputs.", "Three “is not”s.", "People are responsible."],
  },
];
