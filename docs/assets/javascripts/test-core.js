/* Pure question selection, validation and scoring; also importable in Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CourseTestCore = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const DOMAIN_NAMES = [
    "Agents and Workflows",
    "Applications and Integration",
    "Claude Code",
    "Eval, Testing, and Debugging",
    "Model Selection and Optimization",
    "Prompt and Context Engineering",
    "Security and Safety",
    "Tools and MCP"
  ];
  const EXAMS = {
    legacy: {
      label: "CCDV-F · Through 6 Dec 2026", count: 53, minutes: 120,
      domainCounts: [8, 17, 2, 1, 9, 6, 4, 6]
    },
    updated: {
      label: "CCDV-F · From 7 Dec 2026", count: 70, minutes: 120,
      domainCounts: [12, 14, 6, 7, 8, 11, 5, 7]
    }
  };
  function seedShuffle(items, seed) {
    const out = [...items];
    let state = (seed >>> 0) || 0x9e3779b9;
    for (let i = out.length - 1; i > 0; i--) {
      state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
      const j = (state >>> 0) % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function validateBank(items) {
    if (!Array.isArray(items)) throw new Error("Question bank is not a list");
    const ids = new Set();
    for (const item of items) {
      if (!/^[a-z0-9-]+$/.test(item.id || "") || ids.has(item.id))
        throw new Error("Invalid or duplicate question ID");
      ids.add(item.id);
      if (!Number.isInteger(item.domain) || item.domain < 1 || item.domain > 8)
        throw new Error("Unknown exam domain for " + item.id);
      if (!Number.isInteger(item.module) || item.module < 1 || item.module > 5)
        throw new Error("Unknown course module for " + item.id);
      if (!item.question || !Array.isArray(item.options) || item.options.length !== 4 ||
        item.options.some(value => typeof value !== "string" || !value.trim()))
        throw new Error("Invalid question/options for " + item.id);
      if (!Array.isArray(item.correct) || item.correct.length < 1 || item.correct.length > 3 ||
        new Set(item.correct).size !== item.correct.length ||
        item.correct.some(i => !Number.isInteger(i) || i < 0 || i >= 4) ||
        typeof item.explanation !== "string" || !item.explanation.trim())
        throw new Error("Invalid key/explanation for " + item.id);
    }
    for (const spec of Object.values(EXAMS)) {
      DOMAIN_NAMES.forEach((_, i) => {
        if (items.filter(q => q.domain === i + 1).length < spec.domainCounts[i])
          throw new Error("Insufficient questions in domain " + (i + 1));
      });
    }
    for (let module = 1; module <= 5; module++) {
      if (!items.some(q => q.module === module)) throw new Error("Empty module " + module);
    }
    return true;
  }
  function selectExam(items, version, seed) {
    const spec = EXAMS[version];
    if (!spec) throw new Error("Unknown exam version");
    const selected = [];
    spec.domainCounts.forEach((count, i) => {
      const group = seedShuffle(items.filter(q => q.domain === i + 1), (seed + i * 9973) >>> 0);
      if (group.length < count) throw new Error("Insufficient questions");
      selected.push(...group.slice(0, count));
    });
    if (selected.length !== spec.count || new Set(selected.map(q => q.id)).size !== spec.count)
      throw new Error("Incorrect exam question count");
    return seedShuffle(selected, (seed ^ 0x75d0a8) >>> 0);
  }
  function selectModule(items, module, seed) {
    const selected = items.filter(q => q.module === module);
    if (!selected.length) throw new Error("Module has no questions");
    return seedShuffle(selected, seed);
  }
  function normalizedAnswers(value) {
    return Array.isArray(value) ? [...new Set(value.filter(Number.isInteger))].sort((a, b) => a - b) : [];
  }
  function grade(questions, answers) {
    let correct = 0, answered = 0;
    const byDomain = {};
    const details = questions.map(q => {
      const selected = normalizedAnswers(answers[q.id]);
      const expected = normalizedAnswers(q.correct);
      const isAnswered = selected.length === expected.length;
      const isCorrect = isAnswered && selected.every((x, i) => x === expected[i]);
      if (isAnswered) answered++;
      if (isCorrect) correct++;
      if (!byDomain[q.domain]) byDomain[q.domain] = { correct: 0, total: 0 };
      byDomain[q.domain].total++;
      if (isCorrect) byDomain[q.domain].correct++;
      return { id: q.id, domain: q.domain, selected, correct: expected, isAnswered, isCorrect };
    });
    return {
      total: questions.length, correct, answered,
      percent: questions.length ? Math.round(correct / questions.length * 100) : 0,
      byDomain, details
    };
  }
  function remainingMs(deadline, now) {
    return Math.max(0, deadline - now);
  }
  return { DOMAIN_NAMES, EXAMS, seedShuffle, validateBank, selectExam, selectModule, grade, remainingMs };
});
