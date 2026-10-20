// C4 chapters, English edition. Adapted from notes/en/C4-verify.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C4/chapters.js, plus ftc-voice).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19, ftc-voice 2026-10-20).
const SOURCES = [
  ["bard", "James Vincent, “Google’s AI chatbot Bard makes factual error in first demo”, The Verge, 2023-02-08", "https://www.theverge.com/2023/2/8/23590864/google-ai-chatbot-bard-mistake-error-exoplanet-demo"],
  ["mata", "“Mata v. Avianca, Inc.”, Wikipedia", "https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc."],
  ["aircanada", "“Moffatt v. Air Canada” (2024 BCCRT 149), Wikipedia", "https://en.wikipedia.org/wiki/Moffatt_v._Air_Canada"],
  ["baotou", "《AI诈骗上热搜！长相声音都对，“换脸”的“朋友”骗了他430万…》 “AI fraud trends: a face-swapped ‘friend’ took 4.3 million”, The Paper (in Chinese), 2023-05-24", "https://www.thepaper.cn/newsDetail_forward_23206576"],
  ["baotou-tip", "《10分钟被骗走430万！小心AI换脸新型诈骗手段》 “4.3 million gone in 10 minutes! Beware the AI face-swap scam”, Baotou police, 2023-05-20 (reposted by secrss.com; in Chinese)", "https://www.secrss.com/articles/54863"],
  ["everest", "《8848.86米 珠峰新高程》 “8,848.86 metres: Everest’s new elevation”, People’s Daily, reposted by Xinhua (in Chinese), 2020-12-09", "https://www.xinhuanet.com/politics/2020-12/09/c_1126837804.htm"],
  ["everest-gov", "《习近平同尼泊尔总统班达里互致信函 共同宣布珠穆朗玛峰高程》 “China and Nepal jointly announce the elevation of Mount Everest”, Xinhua, Chinese government website (in Chinese), 2020-12-08", "https://www.gov.cn/xinwen/2020-12/08/content_5568012.htm"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学生成式人工智能使用指南（2025年版）》 Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["plan2026", "Ministry of Education (China) and four other departments, 《“人工智能+教育”行动计划》 “AI + Education” Action Plan (教科信〔2026〕1号), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/202604/content_7065138.htm"],
  ["4d", "Anthropic, “AI Fluency: Framework & Foundations”", "https://anthropic.skilljar.com/ai-fluency-framework-foundations"],
  ["ftc-voice", "Alvaro Puig, “Scammers use AI to enhance their family emergency schemes”, US Federal Trade Commission, Consumer Advice, 2023-03-20", "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const LECTURE = {
  code: "C4",
  badge: "Core module",
  title: "Checking",
  tagline: "How do you know if what AI says is right?",
  lead: "AI is very good at talking: fluent, confident, neatly formatted. But sounding good is not the same as being right. This module teaches you to spend a few minutes judging whether an AI answer is reliable: check what needs checking, and know whom to ask when you can’t settle it.",
  heroDemo: "heroCheck",
  heroLabel: "Checking in three steps: AI says → which move → conclusion (Demo)",
  heroCaption: "These “AI answers” are demos made up for teaching.",
  whyTitle: "Why learn to check",
  whySub: "Everyone can use it, everyone can check it, everyone knows when not to use it: this module is the middle one, “check”",
  why: [
    ["AI can be wrong with a straight face", "Its errors don’t look like errors, and often hide in details like years, numbers and sources."],
    ["The user is responsible", "Lawyers were fined and an airline was ordered to pay: neither could blame the AI."],
    ["Five moves are enough", "Ask for the source, cross-check, do the sums, find a counterexample, ask a person. Pick them by risk."],
  ],
  ctaTitle: "Ready to put AI’s answers to the test?",
  minutes: "About 60–90 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-why", nav: "Why it’s wrong", title: "Why AI can be wrong with a straight face",
    subtitle: "Four real examples, and the reason in one line",
    abstract: "Sounding good isn’t the same as being right. First, some times it really went wrong; then why it happens.",
    tags: ["Real cases", "Hallucination", "Responsibility"],
    hero: "toc",
    sections: [
      { id: "cases", title: "Four real examples", html: `
        <p><b>Example 1: the first photo of an exoplanet.</b> In February 2023, when Google launched its chatbot Bard, it released a demo: someone asked what new discoveries from the James Webb Space Telescope they could tell a 9-year-old about, and Bard’s answer said Webb “took the very first pictures of a planet outside of our own solar system”. Astronomers pointed out that the first picture of an exoplanet was taken in 2004.${cite("bard")}</p>
        <p><b>Example 2: made-up court cases.</b> In the US case Mata v. Avianca, the plaintiff’s lawyers used ChatGPT to help write a legal brief, and several of the cases it cited didn’t exist. When a lawyer asked ChatGPT again, it “assured” him the cases were real. In June 2023, the judge fined the lawyers involved $5,000.${cite("mata")}</p>
        <p><b>Example 3: the refund a chatbot promised.</b> Air Canada’s website chatbot told a passenger whose grandmother had just died that he could buy a full-price ticket and claim the bereavement discount afterwards. The airline refused the refund and argued the chatbot was “responsible for its own actions”. In February 2024, a Canadian tribunal rejected that argument and ordered the airline to pay.${cite("aircanada")}</p>
        <p><b>Example 4: the “friend” on video.</b> In April 2023, the head of a technology company in Fuzhou, China, got a WeChat video call from a “friend”. Having “confirmed the face and the voice”, he transferred 4.3 million yuan. Only when he phoned the friend himself did he find the caller had been faked with AI face-swapping and voice cloning. Police made an emergency stop-payment and blocked most of the money.${cite("baotou")}</p>
        ${callout("pitfall", "AI saying “I’m sure” doesn’t make it sure", "<p>In example 2 the lawyer asked ChatGPT “are these cases real?” and it said “yes”. <b>Using the same AI to check its own words is not checking.</b> Always step outside the conversation and find evidence from outside it.</p>")}` },
      { id: "why", title: "Why this happens", html: `
        <p>In one line: <b>a chat AI’s job is “to continue with the most plausible words”, not “to verify first and then answer”.</b> Most of the time the most plausible words happen to be right; but where it has seen nothing, mixed things up or fallen out of date, it still writes fluently and confidently. This kind of error is often called a <b>hallucination</b> (C2 goes deeper).</p>
        <ul><li><b>It doesn’t look like an error:</b> the tone is exactly the same as a right answer.</li>
        <li><b>The error is in the details:</b> years, numbers, names, sources, “the first”, “all”.</li>
        <li><b>The user is responsible:</b> in examples 2 and 3, nobody could blame the AI.</li></ul>
        ${predict("How would you handle AI’s answer in each of these? (a) ten names for a puppy; (b) a summary of a news story you’re about to forward to the family group chat; (c) whether a medicine can be taken with blood-pressure tablets.", "<p>(a) Green: no need to check. (b) Amber: before forwarding, find the original story and check it. (c) Red: ask a doctor or pharmacist. The next chapter shows how to judge.</p>")}` },
    ],
    takeaways: ["AI’s errors don’t look like errors, and are often in the details.", "Using the same AI to check itself is not checking.", "When it goes wrong, the people and organisations using AI are responsible."],
  },
  {
    slug: "2-lights", nav: "Traffic lights", title: "First judge: how far does this need checking?",
    subtitle: "If the AI is wrong, what happens?",
    abstract: "Not every sentence needs checking. Sort by “the consequence of an error” into green, amber and red, and decide how much effort to spend.",
    tags: ["Green", "Amber", "Red"],
    sections: [
      { id: "table", title: "Three traffic lights", html: `
        <table><thead><tr><th>Light</th><th>Consequence of an error</th><th>Examples</th><th>What to do</th></tr></thead><tbody>
        <tr><td><span class="lamp g"></span>Green</td><td>Nothing much lost</td><td>Names, greetings, ideas</td><td>No need to check</td></tr>
        <tr><td><span class="lamp y"></span>Amber</td><td>Embarrassment, misleading others, holding things up</td><td>Study notes, work reports, messages to forward</td><td>Check the key facts with at least one move</td></tr>
        <tr><td><span class="lamp r"></span>Red</td><td>Harm to money, health, legal liability or safety</td><td>Money transfers, medicines, contracts, official documents</td><td>Must be checked, and always ask a person</td></tr>
        </tbody></table>
        ${callout("pattern", "In one line", "<p>The more it matters, the more you check; when it matters most, always ask a person.</p>")}` },
      { id: "try", title: "Try it: grade 8 tasks", html: demo("lights", "Traffic lights", "Pick a light for each task", "These are suggestions, not the only right answers: the same task can be graded differently if the consequences differ.") },
    ],
    takeaways: ["First ask “what happens if it’s wrong?”, then decide whether to check.", "Amber: check at least the key numbers, dates and sources.", "Red: money, health, law, safety. Always ask a person."],
  },
  {
    slug: "3-five", nav: "Five moves", title: "The five checking moves",
    subtitle: "Ask for the source · Cross-check · Do the sums · Find a counterexample · Ask a person",
    abstract: "You don’t need all five every time. For amber, pick one or two; for red, use several, and always the fifth.",
    tags: ["Source", "Cross-check", "Sums", "Counterexample", "Ask a person"],
    sections: [
      { id: "source", title: "Move 1: ask for the source", html: `<p>Have the AI state its basis, then <b>open the source yourself</b> and see whether it exists and really says that. If it won’t open or can’t be found, <b>that doesn’t mean it’s wrong, but you can’t use it</b>: record it as “unverified”. Sources can also be made up (example 2).</p>` },
      { id: "cross", title: "Move 2: cross-check", html: `<p>Find <b>at least two independent, reliable sources</b>, starting with the origin: the original document on a government website, an organisation’s announcement, a textbook, a reputable outlet’s original report.</p><p>Two kinds of fake cross-checking: asking another AI the same question (they may be wrong together); articles copying each other (that still counts as one source).</p>` },
      { id: "calc", title: "Move 3: do the sums yourself", html: `<p>Whenever there are <b>numbers, dates, units, percentages or prices</b>, work them out yourself with a calculator or calendar. Get the rules clear first (discount first, or voucher first?); if the rules aren’t clear, that in itself is something to ask about.</p>` },
      { id: "counter", title: "Move 4: find a counterexample", html: `<p>When you see <b>“the first”, “the only”, “all”, “never” or “always”</b>, look for one counterexample; one is enough to make the claim false. Example 1’s “first picture” is exactly the kind of claim a counterexample knocks down.${cite("bard")}</p>` },
      { id: "ask", title: "Move 5: ask a person", html: `<p>Ask someone who knows: a doctor, pharmacist, lawyer, teacher, the bank counter. And <b>switch channels</b>: if a “friend” said it on video, hang up and call back on the number you saved yourself. The Chinese police advice after example 4 says the same: before transferring money, verify identity through several channels such as a phone call or meeting in person, and if you’ve been scammed, call 96110 at once.${cite("baotou-tip")}</p>
        <p class="note"><i>96110 is China’s national anti-fraud hotline. Elsewhere, call your local police or national anti-fraud line. For example, the US Federal Trade Commission advises: don’t trust the voice; call the person back on a number you know is theirs, and report scams at ReportFraud.ftc.gov.</i>${cite("ftc-voice")}</p>
        ${callout("pattern", "The five moves in one line", "<p><b>Source, cross-check, sums, counterexample, and ask a person.</b> For red-light things, the fifth move is a must.</p>")}
        ${predict("Which move could the passenger in example 3 have used to spot the problem in advance?", `<p>Cross-checking: another page on the airline’s website set out the official bereavement policy, which didn’t match what the chatbot said. Or move 5: ring customer service and ask.${cite("aircanada")}</p>`)}` },
    ],
    takeaways: ["Can’t find it = unverified: don’t use it, but it isn’t proven wrong.", "Asking another AI is not cross-checking.", "For red-light things, move 5 “ask a person” is a must, through a different channel."],
  },
  {
    slug: "4-demo", nav: "Walk-through", title: "Walk-throughs: two complete checks",
    subtitle: "An out-of-date number, a sum done wrong (both demos)",
    abstract: "Two made-up examples: the AI answers were invented to show types of error; the material used to check them is real.",
    tags: ["Demo", "Out of date", "Do the sums"],
    sections: [
      { id: "everest", title: "Demo 1: an out-of-date number", html: callout("demo", "Demo", `<p>Suppose you ask an AI “How tall is Mount Everest?” and it answers “8,844.43 metres” (a made-up answer).</p>
        <ol><li><b>Grade it:</b> for homework, so amber.</li>
        <li><b>Cross-check:</b> a People’s Daily report (reposted by Xinhua) says: in 1975 the height was measured at 8,848.13 metres; in 2005 the summit’s rock surface was measured at 8,844.43 metres; and on 8 December 2020 China and Nepal jointly announced the latest elevation, 8,848.86 metres.${cite("everest")} The Xinhua dispatch on the Chinese government website also states that “the latest elevation is 8,848.86 metres”.${cite("everest-gov")}</li>
        <li><b>Conclusion:</b> not wildly wrong, but <b>out of date</b>. Write “8,848.86 metres (jointly announced by China and Nepal in 2020)”.</li>
        <li><b>Lesson:</b> questions about “the latest”, “now” or “this year” especially need checking.</li></ol>`) },
      { id: "price", title: "Demo 2: a sum done wrong", html: callout("demo", "Demo", `<p>Suppose you ask an AI “A $260 coat is 20% off, and I have a ‘$30 off when you spend $200’ voucher. What do I pay?” and it answers “$182” (a made-up answer). The tool below works it out under both rules, and you can change the numbers.</p>`) + demo("calc", "Do the sums yourself", "Change the price, discount or voucher and see the result") },
    ],
    takeaways: ["AI’s knowledge has a cut-off date, so it can give out-of-date numbers.", "Before you calculate, get the rules clear.", "A checking conclusion should say which material you used."],
  },
  {
    slug: "5-log", nav: "Checking log", title: "The checking log",
    subtitle: "What you checked, where, and what you concluded",
    abstract: "Once you’ve checked, keep a record: you can re-check it, others can follow it, and in the university and working-adult tracks it’s assessed work.",
    tags: ["Record", "Four conclusions"],
    sections: [
      { id: "fill", title: "Fill it in here (stored only in your browser)", html: demo("logSheet", "Checking log", "Add rows and download a CSV") + callout("pitfall", "Can’t find it? Write “unverified”, not “wrong”", "<p>There are only four conclusions: right, wrong, out of date, unverified.</p>") },
    ],
    takeaways: ["Each row says: the AI’s words, the light, the move, the evidence, the conclusion.", "Evidence others can find: a link, book and page, whom you asked.", "Only four conclusions: right, wrong, out of date, unverified."],
  },
  {
    slug: "6-challenge", nav: "Spot the error", title: "Spot-the-error challenge",
    subtitle: "Six AI answer cards: how many errors can you catch?",
    abstract: "All six cards are made-up demos, and every problem can be found by doing the sums, finding a counterexample or checking for consistency. No internet needed.",
    tags: ["Classroom activity", "Unplugged"],
    sections: [
      { id: "play", title: "The challenge", html: callout("activity", "How to play", "<p>In class, groups of 3–4: 10 minutes to decide and write evidence on the log, 10 minutes to challenge each other, 5 minutes for the answers. A correct conclusion scores 1 point, clear evidence adds 1, saying how to guard against it in future adds 1 more.</p>") + demo("challenge", "Six cards (Demo)", "Pick a conclusion for each card") },
      { id: "unplugged", title: "Unplugged version", html: callout("unplugged", "No internet or devices needed", `<p>Prepare 12 “AI says” cards (about a third hide an error) and 5 kinds of “evidence” card: calculator, calendar, dictionary / textbook, find a counterexample, ask the expert (the teacher, who only answers “yes / no / I need to see the original”). Each group draws 3 cards, sets the light first, then decides which evidence card to play; each evidence card can be used once per round, and each group has only one “ask the expert”. It practises “grade first, then choose the move”.</p>`) },
    ],
    takeaways: ["Checking is about reasons, not luck.", "Some cards are right: checking doesn’t mean assuming AI is always wrong.", "Evidence cards are limited, just as time is in real life."],
  },
  {
    slug: "7-tracks", nav: "For each group", title: "Versions for different learners",
    subtitle: "Children, older adults, working adults, teachers",
    abstract: "The core method is the same for everyone; examples, depth and emphasis change.",
    tags: ["K–12", "Older adults", "Working adults", "Teachers"],
    sections: [
      { id: "kids", title: "Children / K–12: AI detectives", html: callout("track", "Three moves are enough", `<p>Ask “how do you know?”, work it out, ask a grown-up. China’s <i>Guidelines for the Use of Generative AI in Primary and Secondary Schools (2025 edition)</i> say primary pupils must not use open-ended content-generation features on their own, though teachers may use them appropriately in class, and remind pupils not to rush to AI for information before consulting textbooks or authoritative sources.${cite("moe-genai")} So the primary version uses printed AI answer cards: the teacher operates the AI and the children are the detectives.</p><p class="note"><i>China-specific rule. Elsewhere, follow your school’s policy and the age limits in each AI service’s terms.</i></p>`) },
      { id: "seniors", title: "Older adults: three red lines, one phone call", html: callout("track", "Three red lines", `<p>Money, health, personal information. Whenever one of these comes up, whether AI said it, a “friend” on video said it, or it was forwarded in a group, check first.</p><p><b>One phone call:</b> hang up and call back on the number you saved yourself; if unsure, ask your children or community centre; if it seems suspicious, call the anti-fraud line (in China, 96110).${cite("baotou-tip")} <i>Elsewhere: your local police or national anti-fraud line; in the US, for example, report at ReportFraud.ftc.gov.</i>${cite("ftc-voice")} For health questions, treat AI’s answer only as a list of questions to ask the doctor.</p>`) },
      { id: "workers", title: "Working adults: five checks before you hand it over", html: callout("track", "Five checks", `<ol><li>Numbers: you can point to a source, and you’ve re-calculated.</li><li>Citations: you’ve opened and checked the original of every one.${cite("mata")}</li><li>Names and dates: check each one.</li><li>Anything that runs: code and formulas have actually been run.</li><li>Promises to outsiders: follow the company’s official documents; an organisation answers for its own chatbot.${cite("aircanada")}</li></ol>`) },
      { id: "teachers", title: "Teachers: teach checking, and assess it", html: callout("track", "Rubric (checking log)", `<p>Four dimensions, three levels each: picked the right sentences to check; used the right moves; evidence can be traced; the conclusion is worded precisely.</p><p>China’s guidelines say teachers must not use generative AI as a substitute for teaching, must not use AI to answer students’ questions directly, should avoid assessing students directly with AI-generated content, and must never enter sensitive data such as personal information or exam questions into AI tools.${cite("moe-genai")} China’s <i>“AI + Education” Action Plan</i> (教科信〔2026〕1号) proposes standards for teachers’ AI literacy and including AI in teacher qualification exams and certification.${cite("plan2026")}</p><p class="note"><i>China-specific policy. Elsewhere, check your school or education authority’s guidance.</i></p>`) },
    ],
    takeaways: ["Children: the teacher operates the AI, the children are the detectives.", "Older adults: money, health, personal information. Hang up and call back.", "Working adults and teachers: leave a trail, so “how it was checked” is visible."],
  },
  {
    slug: "8-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three lines, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "selftest", title: "Self-test", html: [
        predict("A link the AI gives you opens to an empty page. What does the conclusion say?", "<p>Unverified: you can’t use it, but you can’t conclude it’s wrong.</p>"),
        predict("You ask two different AIs the same question and get the same answer. Is that cross-checking?", "<p>No. They may have learned from the same wrong material; find independent sources outside the conversation.</p>"),
        predict("“So-and-so was the first in the country to…”: which move suits this best to start with?", "<p>Find a counterexample, then cross-check.</p>"),
        predict("An older relative gets a video call from their “grandson” saying he urgently needs money. What’s the first step?", "<p>Hang up and call the grandson or the family on a number you saved yourself to confirm. Don’t transfer money first.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li>Find an “apparently true” message you saw recently in a family group chat or on social media, and fill in one line of the checking log.</li><li>Ask an AI a question from your subject or job, pick 3 key facts, and check them with at least two moves.</li><li>Think of a time you believed something and later found it wasn’t true: which move might have caught it earlier?</li></ol>` },
      { id: "frameworks", title: "How this maps to international frameworks", html: `<p>The AI Fluency course developed by Anthropic with academics from University College Cork and Ringling College divides the skills into 4Ds: Delegation, Description, Discernment and Diligence.${cite("4d")} This module’s five checking moves correspond to Discernment; the checking log and “the user is responsible” correspond to Diligence.</p>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19 (the FTC page on 2026-10-20).</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["AI can be wrong with a straight face; checking it with itself doesn’t count.", "Set the light first; for red, always ask a person.", "Five moves + the log; conclusions are right, wrong, out of date or unverified."],
  },
];
