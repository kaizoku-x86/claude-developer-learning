/* Browser-only timed and untimed practice. No API keys or server-side results. */
(function () {
  "use strict";
  const core = window.CourseTestCore;
  if (!core) return;
  const root = document.querySelector(".course-test-root");
  if (!root) return;
  const view = root.dataset.view;
  const bankPath = root.dataset.bank;
  const storageKey = "claude-developer-learning:practice:" + view;
  let bank = [], questions = [], session = null, index = 0, clock = null, finished = false;

  const el = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };
  function button(label, onClick, className = "") {
    const b = el("button", "ct-btn " + className, label);
    b.type = "button"; b.addEventListener("click", onClick); return b;
  }
  function save() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(session)); } catch (_e) {}
  }
  function load() {
    try { return JSON.parse(window.localStorage.getItem(storageKey) || "null"); } catch (_e) { return null; }
  }
  function clear() {
    try { window.localStorage.removeItem(storageKey); } catch (_e) {}
  }
  function orderedQuestion(q, seed) {
    let h = seed >>> 0;
    for (const char of q.id) h = (((h * 33) >>> 0) ^ char.charCodeAt(0)) >>> 0;
    const order = core.seedShuffle([0, 1, 2, 3], h);
    return {
      ...q,
      options: order.map(i => q.options[i]),
      correct: q.correct.map(i => order.indexOf(i)).sort((a, b) => a - b)
    };
  }
  function prepare(loaded) {
    if (!loaded || !Number.isInteger(loaded.seed) || !Array.isArray(loaded.ids) || loaded.ids.length < 1 ||
      !loaded.ids.every(id => bank.some(q => q.id === id))) return false;
    if (loaded.kind === "exam") {
      if (!core.EXAMS[loaded.version] || loaded.ids.length !== core.EXAMS[loaded.version].count ||
        !Number.isFinite(loaded.deadline)) return false;
    } else if (loaded.kind !== "module" || !Number.isInteger(loaded.module)) return false;
    session = loaded;
    questions = loaded.ids.map(id => orderedQuestion(bank.find(q => q.id === id), loaded.seed || 0));
    index = Math.min(Math.max(Number(loaded.index) || 0, 0), questions.length - 1);
    finished = Boolean(loaded.completed);
    return true;
  }
  function start(kind, value) {
    const seed = Math.floor(Math.random() * 4294967295);
    const selected = kind === "exam" ? core.selectExam(bank, value, seed) : core.selectModule(bank, Number(value), seed);
    questions = selected.map(q => orderedQuestion(q, seed));
    session = {
      kind, version: kind === "exam" ? value : null,
      module: kind === "module" ? Number(value) : null,
      ids: questions.map(q => q.id), seed, index: 0, answers: {},
      flagged: [], started: Date.now(),
      deadline: kind === "exam" ? Date.now() + core.EXAMS[value].minutes * 60000 : null,
      completed: false, finishedReason: null
    };
    index = 0; finished = false; save(); showQuestion();
  }
  function overview() {
    window.clearInterval(clock);
    root.replaceChildren();
    root.append(el("p", "ct-intro", view === "exams"
      ? "Full-length timed practice. Answers and explanations appear only after you submit."
      : "Untimed practice organized by course module. Review your answers at the end."));
    const grid = el("div", "ct-grid");
    if (view === "exams") {
      for (const [key, spec] of Object.entries(core.EXAMS)) {
        const card = el("section", "ct-card");
        card.append(el("h3", "", spec.label));
        card.append(el("p", "", spec.count + " original questions · " + spec.minutes + " minutes · one or multiple answers"));
        card.append(el("p", "ct-small", key === "legacy"
          ? "Matches the published item count through 6 December 2026."
          : "Matches the new item count effective 7 December 2026."));
        card.append(button("Start full mock", () => start("exam", key), "ct-primary"));
        grid.append(card);
      }
    } else {
      for (let module = 1; module <= 5; module++) {
        const count = bank.filter(q => q.module === module).length;
        const topics = ["API and Models", "Prompting and Agents", "Claude Code and MCP", "Production", "Reuse and Architecture"];
        const card = el("section", "ct-card");
        card.append(el("h3", "", "Module " + module + " — " + topics[module - 1]));
        card.append(el("p", "", count + " questions · no time limit"));
        card.append(button("Practice module " + module, () => start("module", module), "ct-primary"));
        grid.append(card);
      }
    }
    root.append(grid);
    if (session && !session.completed && session.kind === (view === "exams" ? "exam" : "module")) {
      const resume = el("div", "ct-resume");
      resume.append(el("p", "", "An unfinished attempt is saved in this browser."));
      resume.append(button("Resume attempt", () => { if (prepare(load())) showQuestion(); }, "ct-primary"));
      root.prepend(resume);
    }
  }
  function timeLabel(ms) {
    const total = Math.ceil(ms / 1000), minutes = Math.floor(total / 60);
    return String(minutes).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
  }
  function updateTimer() {
    const display = root.querySelector(".ct-timer");
    if (!display || !session || session.completed) return;
    const ms = core.remainingMs(session.deadline, Date.now());
    display.textContent = "Time remaining: " + timeLabel(ms);
    display.classList.toggle("ct-warning", ms <= 10 * 60 * 1000);
    if (ms === 0) finish("time");
  }
  function showQuestion() {
    window.clearInterval(clock);
    if (finished || session.completed) { showResults(); return; }
    if (session.kind === "exam" && core.remainingMs(session.deadline, Date.now()) === 0) {
      finish("time"); return;
    }
    const q = questions[index], given = session.answers[q.id] || [];
    const answeredCount = questions.filter(item => (session.answers[item.id] || []).length === item.correct.length).length;
    root.replaceChildren();
    const toolbar = el("div", "ct-toolbar");
    toolbar.append(el("strong", "", session.kind === "exam" ? core.EXAMS[session.version].label : "Module " + session.module));
    toolbar.append(el("span", "", "Answered " + answeredCount + "/" + questions.length));
    if (session.kind === "exam") toolbar.append(el("span", "ct-timer", ""));
    root.append(toolbar);
    root.append(el("div", "ct-progress", "Question " + (index + 1) + " of " + questions.length + " · Domain " + q.domain + ": " + core.DOMAIN_NAMES[q.domain - 1]));
    const navigator = el("div", "ct-navigator");
    questions.forEach((item, i) => {
      const selected = session.answers[item.id] || [];
      const state = (i === index ? " ct-active" : "") +
        (selected.length === item.correct.length ? " ct-answered" : "") +
        (session.flagged.includes(item.id) ? " ct-flagged" : "");
      navigator.append(button(String(i + 1), () => { index = i; session.index = i; save(); showQuestion(); }, "ct-nav-button" + state));
    });
    root.append(navigator);
    root.append(el("h2", "ct-question", q.question));
    root.append(el("p", "ct-small", "Select " + q.correct.length + " answer" + (q.correct.length > 1 ? "s" : "") + "."));
    const options = el("fieldset", "ct-options");
    const legend = el("legend", "ct-sr-only", "Answer options");
    options.append(legend);
    q.options.forEach((label, optionIndex) => {
      const item = el("label", "ct-option");
      const input = el("input"); input.type = q.correct.length > 1 ? "checkbox" : "radio";
      input.name = "answer"; input.value = String(optionIndex); input.checked = given.includes(optionIndex);
      input.addEventListener("change", () => {
        let next = [...(session.answers[q.id] || [])];
        if (q.correct.length === 1) next = [optionIndex];
        else if (input.checked && next.length < q.correct.length) next.push(optionIndex);
        else if (input.checked) { input.checked = false; return; }
        else next = next.filter(i => i !== optionIndex);
        session.answers[q.id] = next; save(); showQuestion();
      });
      item.append(input, el("span", "", String.fromCharCode(65 + optionIndex) + ". " + label));
      options.append(item);
    });
    root.append(options);
    const actions = el("div", "ct-actions");
    actions.append(button(session.flagged.includes(q.id) ? "Unflag" : "Flag for review", () => {
      session.flagged = session.flagged.includes(q.id) ? session.flagged.filter(id => id !== q.id) : [...session.flagged, q.id];
      save(); showQuestion();
    }));
    actions.append(button("Previous", () => { index--; session.index = index; save(); showQuestion(); }, "", ));
    actions.lastChild.disabled = index === 0;
    actions.append(button("Next", () => { index++; session.index = index; save(); showQuestion(); }, "ct-primary"));
    actions.lastChild.disabled = index === questions.length - 1;
    actions.append(button("Submit test", () => {
      const left = questions.filter(item => (session.answers[item.id] || []).length !== item.correct.length).length;
      if (window.confirm("Submit this test? " + left + " question(s) are unanswered or incomplete.")) finish("submitted");
    }, "ct-finish"));
    root.append(actions);
    if (session.kind === "exam") { updateTimer(); clock = window.setInterval(updateTimer, 1000); }
  }
  function finish(reason) {
    window.clearInterval(clock);
    if (!session || session.completed) return;
    session.completed = true; session.finishedReason = reason; session.finishedAt = Date.now();
    finished = true; save(); showResults();
  }
  function showResults() {
    window.clearInterval(clock);
    root.replaceChildren();
    const result = core.grade(questions, session.answers || {});
    root.append(el("h2", "", session.finishedReason === "time" ? "Time's up — attempt submitted" : "Practice results"));
    root.append(el("p", "ct-score", result.correct + " / " + result.total + " correct · " + result.percent + "%"));
    root.append(el("p", "", result.answered + " answered · " + (result.total - result.answered) + " unanswered or incomplete"));
    root.append(el("p", "ct-small", "This practice percentage is NOT Anthropic's scaled certification score and cannot establish pass/fail status."));
    const breakdown = el("div", "ct-card");
    breakdown.append(el("h3", "", "Review by official exam domain"));
    Object.entries(result.byDomain).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([domain, counts]) => {
      breakdown.append(el("p", "", core.DOMAIN_NAMES[Number(domain) - 1] + ": " + counts.correct + " / " + counts.total));
    });
    root.append(breakdown);
    const review = el("div", "ct-review");
    review.append(el("h3", "", "Question-by-question explanations"));
    questions.forEach((q, i) => {
      const answer = result.details[i];
      const details = el("details", "ct-review-item");
      const summary = el("summary", "", (answer.isCorrect ? "✓ " : "✗ ") + (i + 1) + ". " + q.question);
      details.append(summary);
      const options = el("ol", "ct-review-options");
      q.options.forEach((option, optionIndex) => {
        const label = el("li", answer.correct.includes(optionIndex) ? "ct-key-option" : "", option);
        if (answer.selected.includes(optionIndex)) {
          label.append(el("strong", "ct-your-choice", " · Your selection"));
        }
        if (answer.correct.includes(optionIndex)) {
          label.append(el("strong", "ct-correct-choice", " · Correct"));
        }
        options.append(label);
      });
      details.append(options);
      details.append(el("p", "", "Correct answer: " + answer.correct.map(x => String.fromCharCode(65 + x)).join(", ")));
      details.append(el("p", "", q.explanation));
      review.append(details);
    });
    root.append(review);
    const actions = el("div", "ct-actions");
    actions.append(button("Try another test", () => {
      if (window.confirm("Start a new attempt? Your last attempt will be replaced.")) {
        session = null; questions = []; finished = false; clear(); overview();
      }
    }, "ct-primary"));
    root.append(actions);
  }
  fetch(bankPath, { cache: "no-cache" }).then(response => {
    if (!response.ok) throw new Error("Unable to load question bank (" + response.status + ")");
    return response.json();
  }).then(data => {
    core.validateBank(data.questions);
    bank = data.questions;
    const old = load();
    if (prepare(old)) {
      if (session.completed) showResults();
      else showQuestion();
    } else overview();
  }).catch(err => {
    root.replaceChildren(el("p", "ct-error", "Practice tests could not be loaded: " + err.message));
  });
})();
