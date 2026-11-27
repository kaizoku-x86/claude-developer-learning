const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../docs/assets/javascripts/test-core.js");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../docs/assets/data/exam-bank.json"), "utf8"));
const bank = data.questions;

test("bank validates all original questions and has no duplicates", () => {
  assert.equal(core.validateBank(bank), true);
  assert(bank.length >= 74);
  const normalize = value => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
  assert.equal(new Set(bank.map(q => normalize(q.question))).size, bank.length);
  for (const q of bank) {
    assert.equal(typeof q.question, "string");
    assert(q.question.trim());
    assert.equal(new Set(q.options.map(normalize)).size, 4, q.id);
  }
});

for (const [version, spec] of Object.entries(core.EXAMS)) {
  test(version + " mock selects exact official item count and domain mix", () => {
    for (const seed of [1, 42, 2026, 0xffffffff]) {
      const selected = core.selectExam(bank, version, seed);
      assert.equal(selected.length, spec.count);
      assert.equal(new Set(selected.map(q => q.id)).size, spec.count);
      for (let i = 1; i <= 8; i++) {
        assert.equal(selected.filter(q => q.domain === i).length, spec.domainCounts[i - 1]);
      }
      assert.equal(spec.minutes, 120);
    }
  });
}

test("all five course modules have a practice test", () => {
  for (let module = 1; module <= 5; module++) {
    const selected = core.selectModule(bank, module, 412);
    assert(selected.length >= 5);
    assert(selected.every(q => q.module === module));
  }
});

test("deadline countdown uses wall clock and stops at zero", () => {
  assert.equal(core.remainingMs(7500, 2500), 5000);
  assert.equal(core.remainingMs(7500, 7500), 0);
  assert.equal(core.remainingMs(7500, 15000), 0);
});

test("grading handles exact multi-select, missing answers, and domains", () => {
  const q = [
    { id: "a", domain: 1, correct: [0, 2] },
    { id: "b", domain: 2, correct: [1] },
    { id: "c", domain: 2, correct: [3] }
  ];
  const result = core.grade(q, { a: [2, 0], b: [0] });
  assert.equal(result.total, 3);
  assert.equal(result.correct, 1);
  assert.equal(result.answered, 2);
  assert.equal(result.percent, 33);
  assert.deepEqual(result.byDomain["1"], { correct: 1, total: 1 });
  assert.deepEqual(result.byDomain["2"], { correct: 0, total: 2 });
  assert.equal(result.details[2].isAnswered, false);
});
