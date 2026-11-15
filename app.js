const modules = [
  {
    slug: "module-1", label: "Module I", title: "Marketing + strategic planning",
    deck: "From needs to value capture, then into SWOT, BCG, Ansoff and competitive advantage.",
    topics: ["Marketing meaning + exchange", "The four Ps, 4Cs + 7Ps", "Orientations + marketing plan", "SWOT, BCG + Ansoff", "Competitive advantage"],
    guide: "Marketing is the loop: find value, build it, communicate it, deliver it, then capture value back. The strategy tools are how a firm chooses where to play and how to grow.",
    hook: "Create → communicate → deliver → capture.",
    caseName: "Eternal",
    search: "Introduction to Marketing four Ps SWOT BCG Ansoff strategic planning"
  },
  {
    slug: "module-2", label: "Module II", title: "Segmentation, targeting + positioning",
    deck: "Cut the market cleanly, choose who to serve, then earn a place in their mind.",
    topics: ["Why segment", "Consumer, business + international bases", "Targeting strategies", "Perceptual maps + value propositions", "Positioning errors + repositioning"],
    guide: "STP is a decision chain: divide the market, choose the group, then make the offer mean something specific to that group.",
    hook: "Segment → target → position.",
    caseName: "Titan",
    search: "marketing segmentation targeting positioning perceptual map value proposition"
  },
  {
    slug: "module-3", label: "Module III", title: "Marketing environment",
    deck: "Read the forces around the firm — from suppliers and publics to the full PESTEL frame.",
    topics: ["Internal + microenvironment", "Suppliers, intermediaries + publics", "PESTEL forces", "Culture, demographics + technology", "Environmental response + competition"],
    guide: "The firm controls its mix, but it does not control the environment. Scan close forces first, then use PESTEL to spot pressure, timing and opportunity.",
    hook: "Inside control, outside response.",
    caseName: "India’s real-money gaming industry",
    search: "marketing environment micro macro PESTEL analysis"
  },
  {
    slug: "module-4", label: "Module IV", title: "Consumer decision-making",
    deck: "Track the buyer from cultural influence and motivation to post-purchase feeling.",
    topics: ["Cultural, social + personal factors", "Motivation, perception + attitudes", "Buying behaviour + involvement", "Five-stage buyer process", "Adoption stages + adopter categories"],
    guide: "Buyers move from need recognition to search, evaluation, purchase and post-purchase behaviour. Culture, people around them and their own psychology shape every step.",
    hook: "Need → search → compare → buy → feel.",
    caseName: "A student buying a first laptop",
    search: "consumer behaviour Maslow buyer decision process adoption process marketing"
  },
  {
    slug: "module-5", label: "Module V", title: "Product + brand management",
    deck: "Build the offer, shape the brand, develop the next product and manage its life cycle.",
    topics: ["Three product levels", "Consumer + industrial products", "Product item, line + mix", "Brand equity, sponsorship + co-branding", "New products + PLC"],
    guide: "A product is more than the object: it is core value, the real offer and the added experience. Brands then make that bundle easier to recognise, trust and choose.",
    hook: "Core → actual → augmented.",
    caseName: "A new protein snack",
    search: "product brand management product life cycle new product development marketing"
  },
  {
    slug: "module-6", label: "Module VI", title: "Marketing channels",
    deck: "Understand who moves the product, how channels are structured and where conflict starts.",
    topics: ["Why intermediaries exist", "Channel members + functions", "Consumer + business channel levels", "Distribution intensity + VMS", "Power, conflict + partnering"],
    guide: "Removing an intermediary never removes the work. Information, promotion, contact, matching, logistics, financing and risk still have to be handled.",
    hook: "Functions stay; members can change.",
    caseName: "A premium juice startup",
    search: "marketing channels intermediaries vertical marketing systems channel conflict"
  },
  {
    slug: "module-7", label: "Module VII", title: "Pricing concepts",
    deck: "Find the price between the cost floor, value ceiling and the pressure of competitors.",
    topics: ["Pricing meaning + objectives", "The three Cs", "Cost, value + competition approaches", "Skimming + penetration", "PLC, competition + adjustment"],
    guide: "Price lives between what the product costs to support and what the customer believes it is worth. Competition, objectives and timing decide the exact point.",
    hook: "Floor = cost. Ceiling = value.",
    caseName: "New-product pricing choices",
    search: "pricing concepts three Cs skimming penetration cost value competition marketing"
  }
];

const questionData = window.questionData || [];
const state = { moduleIndex: 0, questionIndex: 0, mode: "quiz", score: 0, streak: 0, answered: {}, flipped: false, timer: null, timeLeft: 30 };
const $ = (selector) => document.querySelector(selector);
const moduleBySlug = (slug) => modules.find((item) => item.slug === slug);
const dataBySlug = (slug) => questionData.find((item) => item.slug === slug);
const youtube = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
const currentModule = () => modules[state.moduleIndex];
const currentQuestions = () => dataBySlug(currentModule().slug)?.questions || [];
const currentQuestion = () => currentQuestions()[state.questionIndex % currentQuestions().length];

function renderChapters() {
  $("#chapterGrid").innerHTML = modules.map((item, index) => `
    <article class="chapter-card">
      <div class="chapter-number"><span>${item.label}</span><span>${String(index + 1).padStart(2, "0")}</span></div>
      <h3>${item.title}</h3>
      <p>${item.deck}</p>
      <button type="button" data-open-module="${index}">Open guide ↗</button>
      <a href="${youtube(item.search)}" target="_blank" rel="noreferrer">Watch topic ↗</a>
    </article>
  `).join("");
  document.querySelectorAll("[data-open-module]").forEach((button) => {
    button.addEventListener("click", () => {
      state.moduleIndex = Number(button.dataset.openModule);
      state.questionIndex = 0;
      $("#moduleSelect").value = currentModule().slug;
      renderPractice();
      $("#practice").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderSelect() {
  $("#moduleSelect").innerHTML = modules.map((item) => `<option value="${item.slug}">${item.label} · ${item.title}</option>`).join("");
  $("#moduleSelect").value = currentModule().slug;
  $("#moduleSelect").addEventListener("change", (event) => {
    state.moduleIndex = modules.findIndex((item) => item.slug === event.target.value);
    state.questionIndex = 0;
    state.score = 0;
    state.streak = 0;
    renderPractice();
  });
}

function questionLink(question) {
  return youtube(`${currentModule().title} ${question.question}`);
}

function guideMarkup() {
  const item = currentModule();
  return `
    <div class="guide-panel">
      <div class="guide-copy"><p class="eyebrow">QUICK GUIDE · CASE LENS: ${item.caseName}</p><p>${item.guide}</p></div>
      <div class="memory-hook"><span>Memory hook</span><strong>${item.hook}</strong></div>
      <div class="topic-links">${item.topics.map((topic) => `<a href="${youtube(`${item.title} ${topic}`)}" target="_blank" rel="noreferrer">${topic} ↗</a>`).join("")}</div>
    </div>
  `;
}

function renderQuiz() {
  const question = currentQuestion();
  const key = question.id;
  const answered = state.answered[key];
  $("#practiceCard").innerHTML = `
    ${guideMarkup()}
    <span class="card-kicker">${currentModule().label} · exact source question ${String(state.questionIndex + 1).padStart(2, "0")}</span>
    <h3 class="question-text">${question.question}</h3>
    <div class="options">
      ${question.options.map((option, index) => `<button class="option-button ${answered?.selected === index ? (answered.correct ? "correct" : "wrong") : ""} ${answered && index === question.answer ? "correct" : ""}" data-option="${index}" type="button">${option}</button>`).join("")}
    </div>
    ${answered ? `<div class="answer-note"><span>${answered.correct ? "<strong>Nice.</strong> That one is in the bank." : `<strong>Review it once.</strong> Correct answer: ${question.options[question.answer]}`}</span><a href="${questionLink(question)}" target="_blank" rel="noreferrer">Watch explanation ↗</a><button class="next-button" data-next type="button">Next question</button></div>` : `<div class="answer-note"><span>Pick an answer to reveal the reasoning path.</span><a href="${questionLink(question)}" target="_blank" rel="noreferrer">Search this exact concept ↗</a></div>`}
  `;
  document.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => answerQuiz(Number(button.dataset.option))));
  const next = $("[data-next]");
  if (next) next.addEventListener("click", nextQuestion);
}

function renderFlashcard() {
  const question = currentQuestion();
  const answer = question.options[question.answer];
  $("#practiceCard").innerHTML = `
    ${guideMarkup()}
    <span class="card-kicker">${currentModule().label} · swipe card ${String(state.questionIndex + 1).padStart(2, "0")}</span>
    <div class="flashcard-shell">
      <div class="flashcard ${state.flipped ? "flipped" : ""}" id="flashcard">
        <div class="flash-front"><p class="question-text">${question.question}</p><p class="flash-hint">Tap to reveal · then choose your call.</p></div>
        <div class="flash-back"><p class="card-kicker">Answer</p><p class="question-text">${answer}</p><p class="flash-hint">Tap again to flip back.</p></div>
      </div>
    </div>
    ${state.flipped ? `<div class="answer-note"><span>Did it stick?</span><span><button class="next-button" data-review type="button">Review again</button> <button class="next-button" data-got type="button">Got it</button></span></div>` : `<div class="answer-note"><span>Exact question · source term preserved</span><a href="${questionLink(question)}" target="_blank" rel="noreferrer">Watch explanation ↗</a></div>`}
  `;
  $("#flashcard").addEventListener("click", () => { state.flipped = !state.flipped; renderPractice(); });
  const review = $("[data-review]"); const got = $("[data-got]");
  if (review) review.addEventListener("click", () => { state.flipped = false; nextQuestion(false); });
  if (got) got.addEventListener("click", () => { state.flipped = false; state.score += 1; state.streak += 1; nextQuestion(false); });
}

function renderSpeed() {
  const question = currentQuestion();
  $("#practiceCard").innerHTML = `
    ${guideMarkup()}
    <span class="card-kicker">Speed match · ${state.timeLeft}s left</span>
    <h3 class="question-text">${question.question}</h3>
    <div class="options">${question.options.map((option, index) => `<button class="option-button" data-option="${index}" type="button">${option}</button>`).join("")}</div>
    <div class="answer-note"><span>Fast recall only. No overthinking.</span><a href="${questionLink(question)}" target="_blank" rel="noreferrer">Watch explanation ↗</a></div>
  `;
  document.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => {
    const correct = Number(button.dataset.option) === question.answer;
    if (correct) { state.score += 1; state.streak += 1; } else state.streak = 0;
    state.answered[question.id] = { selected: Number(button.dataset.option), correct };
    nextQuestion(false);
  }));
}

function renderFill() {
  const question = currentQuestion();
  const answer = question.options[question.answer];
  const key = question.id;
  const answered = state.answered[key];
  const firstTerm = answer.split(/\s+/)[0];
  const blanked = question.question.includes(firstTerm)
    ? question.question.replace(firstTerm, "________")
    : `${question.question} The best answer is ________.`;
  $("#practiceCard").innerHTML = `
    ${guideMarkup()}
    <span class="card-kicker">Fill the blank · source term hunt</span>
    <h3 class="question-text">${blanked}</h3>
    <p class="flash-hint">Type the answer phrase you remember, then check it.</p>
    <input class="fill-input" id="fillInput" autocomplete="off" placeholder="Your answer">
    ${answered ? `<div class="answer-note"><span><strong>Source answer:</strong> ${answer}</span><button class="next-button" data-next type="button">Next question</button></div>` : `<div class="answer-note"><span>Hint: the options are still hidden.</span><button class="next-button" id="checkFill" type="button">Check answer</button></div>`}
  `;
  const check = $("#checkFill");
  if (check) check.addEventListener("click", () => {
    const typed = $("#fillInput").value.trim().toLowerCase();
    const correct = typed && (typed === answer.toLowerCase() || answer.toLowerCase().includes(typed));
    state.answered[key] = { selected: null, correct: Boolean(correct) };
    if (correct) { state.score += 1; state.streak += 1; } else state.streak = 0;
    renderPractice();
  });
  const next = $("[data-next]");
  if (next) next.addEventListener("click", nextQuestion);
}

function answerQuiz(index) {
  const question = currentQuestion();
  if (state.answered[question.id]) return;
  const correct = index === question.answer;
  state.answered[question.id] = { selected: index, correct };
  if (correct) { state.score += 1; state.streak += 1; } else state.streak = 0;
  renderPractice();
}

function nextQuestion(keepScore = true) {
  state.questionIndex = (state.questionIndex + 1) % currentQuestions().length;
  state.flipped = false;
  renderPractice();
  if (!keepScore) updateProgress();
}

function renderPractice() {
  const questions = currentQuestions();
  if (!questions.length) {
    $("#practiceCard").innerHTML = `<p class="empty-state">Question bank loading…</p>`;
    return;
  }
  $("#roundCount").textContent = `Question ${state.questionIndex + 1} / ${questions.length}`;
  $("#roundScore").textContent = `${state.score} correct`;
  if (state.mode === "flashcards") renderFlashcard();
  else if (state.mode === "speed") renderSpeed();
  else if (state.mode === "fill") renderFill();
  else renderQuiz();
  updateProgress();
}

function updateProgress() {
  const answers = Object.values(state.answered);
  const correct = answers.filter((item) => item.correct).length;
  const percent = Math.round((answers.length / 140) * 100);
  $("#overallMeter").style.width = `${percent}%`;
  $("#progressLabel").textContent = `${answers.length} / 140 questions answered`;
  $("#accuracyLabel").textContent = answers.length ? `${Math.round((correct / answers.length) * 100)}% accuracy` : "Accuracy —";
  $("#streakValue").textContent = state.streak;
  $("#progressTitle").textContent = answers.length ? (state.streak > 2 ? "That streak is doing the work." : "Keep the next answer clean.") : "Start with one clean win.";
  localStorage.setItem("marketmodeProgress", JSON.stringify({ answered: state.answered }));
}

function startSpeedTimer() {
  clearInterval(state.timer);
  state.timeLeft = 30;
  if (state.mode !== "speed") return;
  state.timer = setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) { state.streak = 0; nextQuestion(false); state.timeLeft = 30; }
    else renderPractice();
  }, 1000);
}

document.querySelectorAll(".mode-button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".mode-button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  state.mode = button.dataset.mode;
  state.questionIndex = 0;
  state.score = 0;
  state.flipped = false;
  startSpeedTimer();
  renderPractice();
}));

$("#startButton").addEventListener("click", () => $("#practice").scrollIntoView({ behavior: "smooth" }));
$("#resetProgress").addEventListener("click", () => {
  state.answered = {}; state.score = 0; state.streak = 0; state.questionIndex = 0;
  localStorage.removeItem("marketmodeProgress");
  renderPractice();
});

try {
  const saved = JSON.parse(localStorage.getItem("marketmodeProgress"));
  if (saved?.answered) state.answered = saved.answered;
} catch { /* local progress is optional */ }

renderChapters();
renderSelect();
renderPractice();
