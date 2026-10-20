// C5 chapters, English edition. Adapted from notes/en/C5-safety-privacy-deepfake.md (the notes are the master).
// Sources match the notes' footnotes one to one (same keys as site/C5/chapters.js).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "Guess first", `<p>${q}</p><details class="reveal"><summary>Show answer</summary>${a}</details>`);

// Sources (same as the notes' footnotes; accessed 2026-10-19).
const SOURCES = [
  ["baotou", "《AI诈骗上热搜！长相声音都对，“换脸”的“朋友”骗了他430万…》 “AI fraud trends: a face-swapped ‘friend’ took 4.3 million”, The Paper (in Chinese), 2023-05-24 (sources include Baotou police, People’s Daily and the Xiaoshan procuratorate)", "https://www.thepaper.cn/newsDetail_forward_23206576"],
  ["baotou-tip", "《10分钟被骗走430万！小心AI换脸新型诈骗手段》 “4.3 million gone in 10 minutes! Beware the AI face-swap scam”, Baotou police, 2023-05-20 (reposted by secrss.com; in Chinese)", "https://www.secrss.com/articles/54863"],
  ["mps2026", "《AI深度伪造等新型犯罪冲击数字消费，公安部提示谨防被骗》 “New crimes such as AI deepfakes hit digital consumption; Ministry of Public Security warns against scams”, Beijing Daily app (in Chinese), 2026-03-17", "https://news.bjd.com.cn/2026/03/17/11636074.shtml"],
  ["nfra2024", "《金融监管总局：关于防范新型电信网络诈骗的风险提示》 “NFRA risk warning on new telecom and online scams”, Chinese government website (in Chinese), 2024-07-25", "https://www.gov.cn/lianbo/bumen/202407/content_6964352.htm"],
  ["nfra-bj2023", "《“AI换脸”诈骗如何防 金融监管部门提示》 “How to guard against ‘AI face-swap’ scams: advice from financial regulators”, Xinhua, Chinese government website (in Chinese), 2023-10-08", "https://www.gov.cn/lianbo/bumen/202310/content_6907773.htm"],
  ["ftc", "Alvaro Puig, “Scammers use AI to enhance their family emergency schemes”, FTC Consumer Advice, 2023-03-20", "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes"],
  ["fcc", "FCC, “‘Grandparent’ Scams Get More Sophisticated” (updated 2026-04-24)", "https://www.fcc.gov/consumers/scam-alert/grandparent-scams-get-more-sophisticated"],
  ["96110", "《走进国家反诈中心 | 预警劝阻咨询电话：96110》 “Inside the National Anti-Fraud Centre: the early-warning and advice line 96110”, CCTV.com (in Chinese), 2021-04-17", "http://news.cctv.com/2021/04/17/ARTIqeUb5AXcUStqMljxxcZg210417.shtml"],
  ["mss-ai", "《AI融入生活：这些细节要警惕！》 “AI in daily life: watch these details!”, from the WeChat account of China’s Ministry of State Security, reposted by the Guangdong Cyberspace Administration website (in Chinese), 2024-10-15", "https://www.cagd.gov.cn/v/2024/10/6006.html"],
  ["moe-genai", "Ministry of Education (China), Basic Education Teaching Steering Committee, 《中小学生成式人工智能使用指南（2025年版）》 Guidelines for the Use of Generative AI in Primary and Secondary Schools, 2025 edition (in Chinese; full text reposted on a school website)", "https://www.tcc.edu.cn/h/chancheng/zxdt/2025-05-13/35038.html"],
  ["cac-faceswap", "《网络安全AI说丨防范“AI换脸”诈骗，这些知识点要牢记》 “Guarding against ‘AI face-swap’ scams: points to remember”, Guangming Online, reposted by the Cyberspace Administration of China website (in Chinese), 2025-09-22", "https://www.cac.gov.cn/2025-09/22/c_1760258694787465.htm"],
  ["ai-label", "Cyberspace Administration of China and three other departments, 《人工智能生成合成内容标识办法》 Measures for Labelling AI-Generated and Synthesised Content (国信办通字〔2025〕2号), Chinese government website (in Chinese)", "https://www.gov.cn/zhengce/zhengceku/202503/content_7014286.htm"],
];
const cite = (key) => {
  const k = SOURCES.findIndex(([id]) => id === key);
  return `<sup class="cite"><a href="${SOURCES[k][2]}" target="_blank" rel="noopener" title="${SOURCES[k][1]}">[${k + 1}]</a></sup>`;
};

const ANTIFRAUD = `<i>Elsewhere: call your local police or national anti-fraud line. In the US, for example, the FTC takes reports at ReportFraud.ftc.gov.</i>${cite("ftc")}`;

const LECTURE = {
  code: "C5",
  badge: "Shared core module",
  title: "Safety, privacy and scams",
  tagline: "Fake faces and fake voices: don’t rely on your eyes and ears, follow a routine",
  lead: "AI can “swap faces” and “clone voices”, synthesising what a person looks and sounds like. Scammers use it to pose as family or bosses and get people to transfer money; and when we use AI ourselves, we may hand over information we shouldn’t. This module guards three red lines: money, health and personal information.",
  heroDemo: "heroCall",
  heroLabel: "A video call from “someone you know” (Demo)",
  heroCaption: "The call is made up for teaching; the avatar is a simple sketch, not any real person.",
  whyTitle: "Why this module matters",
  whySub: "Faces and voices can both be faked now",
  why: [
    ["Seeing it doesn’t stop the scam", "In a case reported by police in Baotou, China, the victim confirmed his “friend’s” face and voice on video, and transferred 4.3 million yuan."],
    ["The flaws will keep shrinking", "Synthesis technology keeps changing. We teach a routine, not flaw-spotting."],
    ["No need to fear AI", "Guard three red lines, remember one phone call, and you can use it with confidence."],
  ],
  ctaTitle: "Ready to guard the three red lines?",
  minutes: "About 45 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-cases", nav: "Real cases", title: "“It was clearly him on the video”",
    subtitle: "Two AI face-swap scams reported by police",
    abstract: "The victims saw it with their own eyes and heard it with their own ears. Which step did they miss?",
    tags: ["Real cases", "Police reports"],
    hero: "toc",
    sections: [
      { id: "baotou", title: "A video call worth 4.3 million yuan", html: `
        ${callout("note", "About the examples", "<p>Both cases come from information published by police and government departments in China. Content marked “Demo” (the scenario cards, the family code word, the call script) was made up for teaching. <b>No face-swapped or synthesised images of any real person appear on this site.</b> In class, don’t swap learners’ faces or clone their voices live “to show what it can do”: faces and voices are personal biometric information.</p>")}
        <p>At noon on 20 April 2023, Mr Guo, the legal representative of a technology company in Fuzhou, China, got a WeChat video call from a friend. The friend said an acquaintance needed a 4.3 million yuan deposit for a bid in another city, asked to pass the money through Mr Guo’s company account, and sent a screenshot of a “transfer receipt”. Mr Guo saw his friend’s face and heard his friend’s voice and, without checking whether the money had arrived, transferred 4.3 million yuan in two payments. When he later phoned his friend, the friend knew nothing about it. Baotou police reported that the scammer had used AI face-swapping; with the banks’ help, police intercepted 3.3684 million yuan within 10 minutes, and were pursuing the rest.${cite("baotou-tip")} Mr Guo said afterwards: “He called me on video, and I confirmed the face and the voice, so I let my guard down.” (Our translation.)${cite("baotou")}</p>` },
      { id: "2026", title: "A video plea from a “son”", html: `
        <p>In March 2026, the cybersecurity bureau of China’s Ministry of Public Security reported that Ms Wang got a video call for help from her “son”, who said he urgently needed money to buy internal company shares. The face and voice were the same as her son’s, and she transferred 500,000 yuan without checking. Only afterwards did she find that her son’s account had been stolen and the scammer had synthesised the video with AI face-swapping and voice cloning.${cite("mps2026")}</p>
        ${predict("In both cases, the victims “saw it with their own eyes and heard it with their own ears”. Which step did they miss?", "<p>Checking through a different channel: calling back on a number they had saved themselves, or asking in person. Chapter 3 goes into detail.</p>")}` },
    ],
    takeaways: ["What you see and hear can be synthesised.", "The missing step: check through a different channel."],
  },
  {
    slug: "2-how", nav: "How it’s made", title: "What face-swapping and voice cloning are",
    subtitle: "Deep synthesis: the raw material is your face and voice",
    abstract: "Where do scammers get your face and voice?",
    tags: ["Deep synthesis", "Biometric information"],
    sections: [
      { id: "deep", title: "Deep synthesis", html: `
        <p>From photos, videos and recordings of a person, AI can synthesise what they look and sound like. This is called <b>deep synthesis</b>, or deepfakes: face-swapping and voice cloning. The raw material a scammer needs is your face and your voice:</p>
        <ul><li>China’s National Financial Regulatory Administration warns that criminals contact people on WeChat or by phone under pretexts such as “online shop customer service”, “marketing”, “part-time jobs” or “dating”, collect their voice, phrases or face, then synthesise fake audio, video or images to pose as them, borrow money from family and friends, ask for “emergency help”, or trick people out of bank passwords; they may also synthesise celebrities, experts or law-enforcement officers to spread false information.${cite("nfra2024")}</li>
        <li>The US Federal Trade Commission (FTC) warns: all a scammer needs is a short audio clip of a family member’s voice, which they could get from content posted online, and a voice-cloning program; when they call, they’ll sound just like your loved one.${cite("ftc")}</li></ul>
        ${callout("pattern", "In one line", "<p>Faces and voices can both be faked now. Seeing isn’t necessarily believing, and neither is hearing.</p>")}` },
    ],
    takeaways: ["Deep synthesis can make convincing fake faces and voices.", "The raw material is your face and voice: don’t hand them out casually."],
  },
  {
    slug: "3-routine", nav: "The routine", title: "Don’t rely on your eyes and ears: follow a routine",
    subtitle: "Four common signs, one routine: hang up and call back",
    abstract: "Spotting flaws isn’t reliable; checking through a different channel is.",
    tags: ["Four signs", "Second check", "Family code word", "Anti-fraud line"],
    sections: [
      { id: "flags", title: "What these scams have in common", html: `
        <table><thead><tr><th>Common feature</th><th>What they say</th><th>Source</th></tr></thead><tbody>
        <tr><td>They want money, and fast</td><td>“I urgently need a deposit”, “I’ve been in a car accident”, “I’ve been detained”</td><td>${cite("baotou-tip")}${cite("fcc")}</td></tr>
        <tr><td>Only one channel</td><td>Only on this video call, only on this number</td><td>${cite("nfra-bj2023")}</td></tr>
        <tr><td>They want secrecy</td><td>“Don’t tell Mum and Dad”</td><td>${cite("fcc")}</td></tr>
        <tr><td>Payment that’s hard to get back</td><td>Wire transfers, cryptocurrency, gift cards, payment-app transfers</td><td>${cite("ftc")}${cite("fcc")}</td></tr></tbody></table>` },
      { id: "routine", title: "One routine: hang up and call back", html: `<ul>
        <li><b>For any transfer, verify a second time.</b> China’s Ministry of Public Security cybersecurity bureau warns: seeing isn’t necessarily believing; for any money transfer, always verify identity a second time through existing contact details or several channels, and don’t trust a single video call.${cite("mps2026")} Chinese financial regulators likewise advise checking through several channels, such as calling the person’s mobile or checking in person, rather than transferring money on the strength of a single unverified channel.${cite("nfra-bj2023")}</li>
        <li><b>Hang up and call back on a number you saved yourself.</b> The US Federal Communications Commission (FCC) advises: don’t trust the voice on the phone; note the details, hang up, and call the relative supposedly “in trouble” on the number saved in your contacts; if you can’t reach them, ask other family members or friends.${cite("fcc")}</li>
        <li><b>Agree a family code word.</b> The FCC suggests families agree in advance on a “safe word” only they know; if the caller can’t say it, it may be a scammer.${cite("fcc")}</li>
        <li><b>If unsure, call the anti-fraud line.</b> <i>In China</i>, 96110 is the national early-warning and advice line run by the Ministry of Public Security: if 96110 calls you, you or your family may be the target of a scam; you can call it for advice about a suspected scam, and report scam leads to it.${cite("96110")} Baotou police advise: if you’ve been scammed or something seems suspicious, keep the evidence and call 96110 immediately.${cite("baotou-tip")} ${ANTIFRAUD}</li></ul>
        ${callout("pitfall", "Don’t count on “spotting the flaws”", "<p>Synthesised video and voices keep getting more convincing, and telling real from fake by eye or ear isn’t reliable. What’s reliable is the routine: <b>whenever money is involved, check again through a different channel</b>, even if the person on screen looks and sounds fine.</p>")}` },
      { id: "cards", title: "Signature activity: what do you do about this call?", html: demo("scenarioCards", "Scenario cards (Demo)", "Pick a response for each card", "All six scenarios are made up. The suggested answers match section 6 of the notes.") },
    ],
    takeaways: ["Money, urgency, secrecy, a single channel: four signs.", "Hang up and call back on a number you saved yourself.", "If unsure, call the anti-fraud line (in China, 96110)."],
  },
  {
    slug: "4-feed", nav: "Don’t give AI", title: "What information not to give AI",
    subtitle: "Treat whatever you give AI as something others might see",
    abstract: "ID, bank cards, verification codes, faces and voices, other people’s privacy.",
    tags: ["Personal information", "Privacy"],
    sections: [
      { id: "rules", title: "What official advice says", html: `<ul>
        <li>Chinese state security authorities warn: AI chat and writing tools can collect and store what users type in; never enter sensitive information such as state secrets, trade secrets or personal privacy into AI tools.${cite("mss-ai")}</li>
        <li>China’s <i>Guidelines for the Use of Generative AI in Primary and Secondary Schools (2025 edition)</i> require pupils to avoid entering personal information into generative AI tools, and forbid teachers from entering sensitive data such as personal information or exam questions.${cite("moe-genai")}</li>
        <li>Advice republished by the Cyberspace Administration of China: don’t casually give your face, fingerprints or other biometric information to others; don’t casually reveal ID, bank card or verification codes; don’t store photos of your ID or bank cards on your phone for convenience.${cite("cac-faceswap")}</li></ul>
        <p class="note"><i>These are Chinese sources, but the advice applies anywhere. Elsewhere, also follow your school’s or employer’s rules on AI tools.</i></p>` },
      { id: "sort", title: "Try it: give it or not?", html: demo("feedOrNot", "Give it or not? (Demo)", "For each item, choose “don’t give” or “OK to give”")
        + callout("pattern", "In one line", "<p>Treat whatever you give AI as something others might see. If you wouldn’t want a stranger to see it, don’t give it to AI. For how to brief AI without it, see <a href=\"../C3/index.html\">C3</a>.</p>") },
    ],
    takeaways: ["Never give ID numbers, card numbers, passwords or verification codes.", "Photos, recordings, medical records, other people’s privacy: rephrase before you share."],
  },
  {
    slug: "5-label", nav: "AI labels", title: "AI-generated content should be labelled",
    subtitle: "Explicit labels and implicit labels",
    abstract: "A label means it’s synthetic; no label doesn’t mean it’s real.",
    tags: ["Labelling rules", "Regulation"],
    sections: [
      { id: "label", title: "China’s labelling measures", html: `
        <p><i>(China-specific rules.)</i> China’s <i>Measures for Labelling AI-Generated and Synthesised Content</i> (国信办通字〔2025〕2号), jointly issued by the Cyberspace Administration of China, the Ministry of Industry and Information Technology, the Ministry of Public Security and the National Radio and Television Administration, took effect on 1 September 2025. They require AI-generated or synthesised text, images, audio and video to carry <b>explicit labels</b> (notices users can clearly see or hear) and <b>implicit labels</b> (markers in the file’s data); users posting AI-generated content online should declare it and use the platform’s labelling features; and no one may maliciously remove, alter, forge or hide these labels.${cite("ai-label")} <i>Other countries and platforms have their own rules; check the ones that apply where you live and post.</i></p>
        ${callout("pitfall", "No label doesn’t mean it’s real", "<p>Scammers don’t label their fake videos. Telling real from fake still relies on the routine in chapter 3. And when you post images or videos you made with AI, label them.</p>")}` },
    ],
    takeaways: ["AI-generated and synthesised content should be labelled.", "Label AI content you post yourself."],
  },
  {
    slug: "6-tracks", nav: "For each group", title: "Activities, and versions for different learners",
    subtitle: "A family code word drill; older adults, children, working adults, teachers",
    abstract: "Older-adults version: three red lines, one phone call (same as C4).",
    tags: ["Unplugged", "Older adults", "K–12", "Working adults", "Teachers"],
    sections: [
      { id: "unplugged", title: "Unplugged: a family code word and a “hang up and call back” drill", html: callout("unplugged", "Demo materials (15 minutes)", "<ol><li><b>Agree a code word:</b> together, think of a word or question only your family knows and that can’t be found online (for example, “what was the name of the cat we had when I was little?”). Write it on a card; don’t post it online or in a group chat.</li><li><b>Act it out:</b> one person plays “a family member who urgently needs money” and “calls” using the demo script: “Grandma, I’m in trouble, send money quickly, and don’t tell Dad!”</li><li><b>The person answering follows the routine:</b> first ask for the code word; whether or not the caller gets it right, say “I’ll hang up and call you back”; hang up, and call back on the number saved in the phone.</li><li><b>Swap roles and do it again.</b> Discuss: when the caller says “there’s no time” or “don’t hang up”, how do you stand firm?</li></ol><p>The code word adds a lock, but it isn’t the only lock. <b>Hanging up and calling back</b> is the step you can never skip.</p>") },
      { id: "seniors", title: "Older adults: three red lines, one phone call", html: callout("track", "Three red lines", `<p>Money (transfers, investments, prizes), health (medicines, home remedies, supplements), personal information (ID, bank cards, verification codes). Whenever one of these comes up, whether AI said it, a “friend” on video said it, or it was forwarded in a group, check first.</p><p><b>One phone call:</b> hang up and call back on the number saved in your own phone; if unsure, ask your children or community centre; if you’ve been scammed or something seems suspicious, in China call 96110.${cite("baotou-tip")} If 96110 calls you, listen patiently: it’s the police trying to stop a scam.${cite("96110")} ${ANTIFRAUD}</p><p><b>Add a code word:</b> agree one with your children. <b>Don’t record, don’t film, don’t share:</b> if a stranger asks you to read something aloud, film yourself turning your head, or share your screen, always refuse.</p>`) },
      { id: "kids", title: "Children / K–12: my face and voice are mine", html: callout("track", "For children", `<ul><li>Don’t give photos or voices of yourself or classmates, your address or your school and class to AI or unfamiliar websites; China’s guidelines require pupils to avoid entering personal information into generative AI tools.${cite("moe-genai")} <i>(Elsewhere, follow your school’s rules.)</i></li><li>Don’t “face-swap” classmates’ photos as a joke. A prosecutor in Xiaoshan, Hangzhou, warns that AI face-swapping, even just for laughs, may infringe people’s rights to their likeness and reputation.${cite("baotou")}</li><li>Agree a code word at home too: if someone online says “your mum and dad asked me to pick you up”, ask for the code word first.</li></ul>`) },
      { id: "workers", title: "Working adults: two checks for payments, no uploading files", html: callout("track", "At work", `<ul><li>If a “boss” or “client” uses a new number or account to ask for a payment or a change of bank details, always verify a second time through existing contact details or in person; don’t skip finance procedures because something is “urgent”.${cite("mps2026")}${cite("nfra-bj2023")}</li><li>Don’t paste work documents, client data or contracts straight into AI; Chinese state security authorities warn never to enter trade secrets into AI tools.${cite("mss-ai")}</li><li>Label AI-made images and videos you publish; in China this is required by the labelling measures.${cite("ai-label")}</li></ul>`) },
      { id: "teachers", title: "Teachers: teach the routine, not the flaws", html: callout("track", "For teachers", `<ul><li>China’s guidelines forbid teachers from entering sensitive data such as personal information or exam questions into AI tools.${cite("moe-genai")} When preparing lessons with AI, remove students’ names, grades and so on.</li><li>In class, don’t swap faces live or clone students’ voices; to explain what synthesis can do, use diagrams or explanation.</li><li>Assess the routine: can students name the four signs (money, urgency, secrecy, a single channel), and say “hang up and call back”?</li></ul>`) },
    ],
    takeaways: ["Older adults: three red lines, one phone call.", "Children: my face and voice are mine.", "Working adults: two checks for payments, no uploading files."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and practice",
    subtitle: "Three takeaways, self-test, practice, sources",
    abstract: "The module in three lines, then a few questions.",
    tags: ["Self-test", "Practice", "Sources"],
    sections: [
      { id: "three", title: "Three takeaways", html: `<ol><li>Faces and voices can both be faked: seeing isn’t necessarily believing, and neither is hearing.</li><li>Whenever money is involved, hang up and call back on a number you saved yourself; if unsure, call the anti-fraud line (in China, 96110).</li><li>Treat whatever you give AI as something others might see: ID, bank cards, verification codes, faces and voices, other people’s privacy. Don’t hand them over.</li></ol>` },
      { id: "selftest", title: "Self-test", html: [
        predict("If the person on the video looks and sounds right, do you still need to check?", "<p>Yes. Faces and voices can both be synthesised; when money is involved, you must check through a different channel.</p>"),
        predict("When you “hang up and call back”, which number do you call?", "<p>The number saved in your own phone long ago, not a number the caller has just given you.</p>"),
        predict("A video online has no “AI-generated” label. Does that show it’s real?", "<p>No. Scammers don’t follow labelling rules; telling real from fake relies on the routine.</p>"),
        predict("You want AI to help you understand a health check report. What’s a safe way to do it?", "<p>Remove your name, ID number and other numbers, and give only the readings; go by your doctor’s opinion.</p>"),
      ].join("") },
      { id: "practice", title: "Practice", html: `<ol><li><b>Homework:</b> agree a family code word with your family and do one “hang up and call back” drill.</li><li><b>Check yourself:</b> look back at questions you’ve recently asked AI. Did you hand over anything you shouldn’t have? How could you phrase it next time?</li><li><b>Pass it on:</b> explain “three red lines, one phone call” to an older relative and ask them to repeat it back.</li></ol><p>Related modules: <a href="../C2/index.html">C2</a> explains why AI makes things up; <a href="../C3/index.html">C3</a> covers what not to give when you brief AI; <a href="../C4/index.html">C4</a> covers the five checking moves.</p>` },
      { id: "sources", title: "Sources", html: `<p>All pages below were opened and checked on 2026-10-19.</p><ol class="sources">${SOURCES.map(([, t, u]) => `<li>${t}. <a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("")}</ol>` },
    ],
    takeaways: ["Faces and voices can be faked.", "When money is involved, hang up and call back.", "Keep private things away from AI."],
  },
];
