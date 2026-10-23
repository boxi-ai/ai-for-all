// C2 chapters, English edition. Adapted from notes/en/C2-data-models-hallucination.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C2/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["glue", "Kylie Robison, “Google promised a better search experience — now it’s telling us to put glue on our pizza”, The Verge, 2024-05-23", "https://www.theverge.com/2024/5/23/24162896/google-ai-overview-hallucinations-glue-in-pizza"],
  ["openai-hall", "OpenAI, “Why language models hallucinate”, 2025-09-05", "https://openai.com/index/why-language-models-hallucinate/"],
  ["moe-tongshi", "Ministry of Education (China), Basic Education Teaching Steering Committee, Guidelines for General AI Education in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35042.html", "《中小学人工智能通识教育指南（2025年版）》"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html", "《中小学生成式人工智能使用指南（2025年版）》"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C2",
  badge: "Shared core module",
  title: "Data, models and hallucination",
  tagline: "Where AI’s answers come from, and why it makes things up with a straight face",
  lead: "AI learns what it can do from data. This module looks one layer deeper: how data, training, model and answer connect, why a chat AI works like a word chain, and why it can take a joke seriously or invent an obscure fact.",
  heroDemo: "heroChain",
  heroLabel: "A word-chain model: what happens when a joke gets into the data? (Demo)",
  heroCaption: "A tiny demo model, only to show the idea; it is nothing like a real large model.",
  whyTitle: "Why understand a bit of how it works",
  whySub: "Know why it goes wrong, and you know which answers most need checking",
  why: [
    ["It learns to “sound right”", "A chat AI continues word by word, picking the most plausible next word; it isn’t looking an answer up."],
    ["Errors have three sources", "The data was wrong, the data had little or nothing, or the data is out of date."],
    ["Obscure, recent, important: check it", "The mechanism becomes a habit: check these three kinds of answer with C4’s five moves."],
  ],
  ctaTitle: "Ready to look inside AI’s “head”?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-glue", nav: "Pizza glue", title: "The AI that took a joke seriously",
    subtitle: "A mistake by Google’s AI Overviews",
    abstract: "Why would AI pass off a joke as advice?",
    tags: ["Real case"],
    hero: "toc",
    sections: [
      { id: "story", title: "Glue on pizza", html: `
        <p>In May 2024, Google rolled out “AI Overviews” widely in its search. Someone asked what to do when cheese keeps sliding off pizza, and AI Overviews suggested adding some glue to the sauce, “non-toxic glue” would do. Reporters traced the idea to what was very probably a joke comment posted on Reddit more than ten years earlier. Around the same time it also said former US president James Madison graduated from the University of Wisconsin 21 times. Google responded that these errors came from “very uncommon queries”.${cite("glue")}</p>
        ${predict("Why would AI pass off a joke as advice?", "<p>Its answers come from data and from patterns learned from data; if the data contains a joke, it may repeat the joke. The next two chapters explain.</p>")}` },
    ],
    takeaways: ["AI can repeat the jokes and errors in its data."],
  },
  {
    slug: "2-where", nav: "Where from", title: "Where AI’s answers come from",
    subtitle: "Data → training → model → answer; a chat AI is one giant word chain",
    abstract: "A model learns patterns, not an answer book it can look things up in.",
    tags: ["Data", "Training", "Model", "Word chain"],
    sections: [
      { id: "four", title: "Four words", html: `
        <table><thead><tr><th>Step</th><th>What it is</th><th>Comparison</th></tr></thead><tbody>
        <tr><td>Data</td><td>Large amounts of text, images and sound</td><td>The books and exercises a student has read</td></tr>
        <tr><td>Training</td><td>Finding patterns in the data, adjusting again and again</td><td>Doing exercises, checking answers, fixing mistakes</td></tr>
        <tr><td>Model</td><td>The result of training</td><td>The habits the student has picked up</td></tr>
        <tr><td>Answer</td><td>Working out an output from the patterns</td><td>Meeting a new question and answering by habit</td></tr></tbody></table>
        <p>China’s <i>Guidelines for General AI Education in Primary and Secondary Schools (2025 edition)</i> ask lower-secondary pupils to “master the basic workflow of machine learning and the concept of supervised learning, and understand the relationship between data features and the choice of algorithm”: that is exactly this chain.${cite("moe-tongshi")}</p>` },
      { id: "chain", title: "A chat AI: one giant word chain", html: `<p>A large language model first goes through “pre-training”: across a vast amount of text, it practises <b>guessing the next word</b>, over and over.${cite("openai-hall")} When you ask a question, it continues word by word, each time picking the “most plausible” word. At each step several words are about equally plausible, so the same question asked twice may get different answers.</p>
        ${callout("pattern", "In one line", "<p>It learns to “sound right”, not to “be right”. Most of the time what sounds right is right, but not always.</p>")}
        ${demo("nextWord", "Word-chain model (Demo)", "Pick a start word, then try adding a joke", "This model only counts “which word followed which”. Real large models are far more complex, but the idea “whatever is in the data may come out” is the same.")}` },
    ],
    takeaways: ["Data → training → model → answer.", "A chat AI continues word by word.", "A model learns patterns, not an answer book."],
  },
  {
    slug: "3-why", nav: "Why it invents", title: "Why it makes things up",
    subtitle: "Hallucination: a statement that sounds plausible but is false",
    abstract: "OpenAI researchers’ explanation, and the three sources of error.",
    tags: ["Hallucination", "Obscure facts", "Out of date"],
    sections: [
      { id: "reasons", title: "The researchers’ explanation", html: `
        <p>In an article in September 2025, OpenAI researchers defined hallucinations as “plausible but false statements generated by language models”, and explained several causes.${cite("openai-hall")}</p>
        <ul><li><b>The data isn’t labelled true or false:</b> pre-training text carries no truth labels, so the model learns “what sounds right”. Things with patterns, like spelling, get more accurate; arbitrary obscure facts (an ordinary person’s birthday, say) can’t be predicted from patterns alone.</li>
        <li><b>An example:</b> the researchers asked a widely used chatbot for the title of the PhD thesis of Adam Tauman Kalai, one of the authors. It confidently gave three different answers, none of them correct.</li>
        <li><b>Tests reward guessing:</b> many tests only count the share of right answers. A blank scores zero for sure, a guess might score, so a model that “guesses even when it doesn’t know” looks better. The researchers propose that a confident wrong answer should cost more than saying “I don’t know”.</li></ul>` },
      { id: "three", title: "Three sources", html: `
        <table><thead><tr><th>Source</th><th>Example</th></tr></thead><tbody>
        <tr><td>The data was wrong (errors, jokes, rumours)</td><td>Glue on pizza${cite("glue")}</td></tr>
        <tr><td>The data had little or nothing (obscure names, dates, references)</td><td>Three different thesis titles, all wrong${cite("openai-hall")}</td></tr>
        <tr><td>The data is out of date (the world changed after training)</td><td>The height of Mount Everest (<a href="../C4/index.html#/4-demo">C4 Demo 1</a>; the AI answer is made up)</td></tr></tbody></table>
        ${callout("pitfall", "“Search first, then answer” isn’t safe either", `<p>Google’s AI Overviews searched the web before writing its answer, and still took a joke seriously.${cite("glue")} That’s why C4’s first move says: ask for the source, and open it yourself.</p>`)}
        ${predict("Which question is most likely to make AI invent something? (a) the boiling point of water; (b) the year the old noodle shop in your town opened; (c) today’s petrol price.", "<p>(b) is most likely to be made up: an obscure fact. (c) easily goes out of date. (a) is stated consistently in the data and least likely to be wrong, but watch the condition (at standard atmospheric pressure).</p>")}` },
    ],
    takeaways: ["Hallucination: sounds plausible, but is false.", "Obscure facts with no pattern are the easiest to make up.", "Wrong, thin or out-of-date data can all come out in the answer."],
  },
  {
    slug: "4-activities", nav: "Activities", title: "Activities",
    subtitle: "The card classifier · Make the AI get it wrong",
    abstract: "Two activities: one without a computer, one with AI. The cards and questions are a made-up demo.",
    tags: ["Unplugged", "Challenge"],
    sections: [
      { id: "cards", title: "The card classifier", html: demo("cardClassifier", "Card classifier (Demo)", "Look at the training cards, then pick a rule") + callout("unplugged", "Unplugged version", "<p>With a pack of playing cards: the teacher shows the learning group 10 cards labelled “good” or “bad” (chosen so that the good ones are all red). The group writes down a rule, then takes an exam on 10 new cards. Discuss: why did it go wrong? The training cards were chosen with a bias. Whatever the data contains or lacks, the model will know or lack (C6 continues with bias in data).</p>") },
      { id: "challenge", title: "Make the AI get it wrong", html: callout("activity", "Challenge (Demo)", "<ol><li>Think of a question that is obscure but has a findable answer: the year a local school was founded, the origin of a small bridge’s name, the publisher of an old book at home.</li><li>Ask the AI and write down exactly what it says.</li><li>Check it yourself: the school’s website, local history records, the book’s copyright page, or ask an older relative.</li><li>Fill in one line of C4’s checking log.</li></ol><p>Catching a fabrication scores 2 points; if the AI honestly says “I don’t know”, record it for 1 point; if it’s right, record that too. <b>The aim isn’t to prove AI is useless, but to see which kinds of question it tends to get wrong.</b></p>") },
    ],
    takeaways: ["Biased data teaches a biased rule.", "Making AI get it wrong shows you where its limits are."],
  },
  {
    slug: "5-tracks", nav: "For whom", title: "Versions for different learners",
    subtitle: "Children, older adults, working adults, teachers",
    abstract: "The mechanism is the same for everyone; the habit it turns into changes.",
    tags: ["K–12", "Older adults", "Work", "Teachers"],
    sections: [
      { id: "kids", title: "Children / K–12: it’s guessing, not looking it up", html: callout("track", "By school stage", `<p><b>Primary:</b> China’s <i>Guidelines for the Use of Generative AI in Primary and Secondary Schools (2025 edition)</i> say primary pupils must not use open-ended content-generation features on their own.${cite("moe-genai")} The primary version plays the card classifier and a word-chain game between pupils; the teacher runs “make the AI get it wrong” and the whole class checks together. <i>(Outside China, follow your school’s policy and each service’s age limits.)</i></p><p><b>Lower secondary:</b> this matches the <i>Guidelines for General AI Education (2025 edition)</i> on the basic workflow of machine learning, the concept of supervised learning, and telling apart the risks of false information.${cite("moe-tongshi")} Have the AI answer the same question twice and compare.</p>`) },
      { id: "seniors", title: "Older adults: sounding right doesn’t make it true", html: callout("track", "Three kinds to be careful with", "<p>Home remedies and supplements (the data is full of rumours), “the latest policy” (easily out of date), and specific local information (little data on it). For these three, ask your doctor, ring the official phone line, or ask your local community centre.</p>") },
      { id: "workers", title: "Working adults: obscure, recent, precise — always check", html: callout("track", "Always check these three", "<p>Obscure (client names, regulation section numbers, literature references), recent (prices, policies, version numbers), precise (word-for-word quotations, numbers, dates). When you set the task, write “if you’re not sure, say so; don’t guess”, and ask it to mark what a person needs to verify.</p>") },
      { id: "teachers", title: "Teachers: turn the mechanism into a habit", html: callout("track", "Teaching tips", "<p>Make one sentence stick: “it learns to sound right, not to be right”. The card classifier and word-chain game beat talking about parameters. Set a “make the AI get it wrong” assignment with a checking log; assess whether the question belongs to an error-prone category and whether the evidence can be traced.</p>") },
    ],
    takeaways: ["Children: it’s guessing, not looking it up.", "Older adults: ask a person about remedies, the latest policy and local information.", "Working adults: obscure, recent, precise — always check."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three sentences, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li>AI’s answers come from data and a model trained on it; a chat AI continues word by word.</li><li>It learns to “sound right”, not to “be right”; when its data is wrong, thin or out of date, it can make things up with a straight face.</li><li>Anything obscure, recent or important: always check it (with <a href="../C4/index.html">C4</a>’s five moves).</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("“AI’s answers are searched from the web and copied.” Is that right?", "<p>No. A chat AI by default generates from learned patterns; some products search first and then write, but the writing step is still generation and can go wrong.</p>"),
        predict("The same question asked twice gets different answers. Why?", "<p>At each step several words are about equally plausible; different choices lead to different sentences.</p>"),
        predict("Why does AI rarely misspell words, yet make up a person’s birthday?", "<p>Spelling follows fixed patterns and gets more accurate with learning; birthdays follow no pattern and can’t be guessed from patterns alone.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li>Complete one “make the AI get it wrong” challenge and fill in a line of the checking log.</li><li>Ask an AI the same question twice, find where the answers disagree, and check which is right.</li><li>Think back to ELIZA in <a href="../C1/index.html">C1</a>: its rules were written by people; today’s AI learns its rules from data. Where does that make AI stronger, and where does it make its mistakes harder to predict?</li></ol>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u, o]) => `<li${o ? ` title="${o}"` : ""}>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["Answers come from data and a model.", "Sounding right ≠ being right.", "Obscure, recent, important: always check."],
  },
];
