import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const root = path.resolve(import.meta.dirname, "../../../../..");
const read = (locale: string) => JSON.parse(readFileSync(
  path.join(import.meta.dirname, `content/curriculum.${locale}.v1.json`), "utf8",
));
const answerKeys = [[1,1,2],[0,1,2],[1,0,2],[1,2,0],[1,0,2],[1,2,0],
  [1,0,2],[0,1,2],[1,0,2],[1,2,0],[1,0,2],[1,1,2]];

test("every VI/EN lesson has original takeaways and a fully worked fictional practice", () => {
  for (const locale of ["vi", "en"]) {
    const course = read(locale);
    assert.equal(course.editorialRevision, 2);
    assert.equal(course.lessons.length, 12);
    for (const lesson of course.lessons) {
      const support = lesson.studySupport;
      assert.ok(support, `${locale}/${lesson.lessonId} is missing learning support`);
      assert.equal(support.synthetic, true);
      assert.equal(support.keyTakeaways.length, 3);
      assert.ok(support.solutionSteps.length >= 3);
      for (const text of [...support.keyTakeaways, ...support.solutionSteps,
        support.misconception, support.practicePrompt, support.answer]) {
        assert.equal(typeof text, "string");
        assert.ok(text.trim().length > 15);
        assert.ok(lesson.workedExample.description.includes(text));
      }
    }
  }
});

test("editorial enrichment preserves existing quiz identities, grading and local source parity", () => {
  for (const locale of ["vi", "en"]) {
    const course = read(locale);
    const docs = JSON.parse(readFileSync(path.join(root, "docs/learning",
      `PICKET_FINANCIAL_CURRICULUM_${locale.toUpperCase()}_V1.json`), "utf8"));
    assert.deepEqual(course, docs);
    assert.equal(course.publicationGate.publishable, false);
    for (let i = 0; i < course.lessons.length; i++) {
      const lesson = course.lessons[i];
      assert.equal(lesson.lessonId, `picket.vi.financial.v1.${String(i + 1).padStart(2, "0")}`);
      assert.equal(lesson.version, 1);
      assert.deepEqual(lesson.questions.map((q: {correctIndex: number}) => q.correctIndex), answerKeys[i]);
      assert.equal(lesson.optionalAction.requiresSpending, false);
      assert.equal(lesson.optionalAction.maySkip, true);
      assert.equal(lesson.independentReviewedAt, null);
    }
  }
});

test("all authored worked calculations are correct and identical across translations", () => {
  const vi = read("vi"), en = read("en");
  let count = 0;
  for (let i = 0; i < vi.lessons.length; i++) {
    const checks = vi.lessons[i].workedExample.arithmeticChecks;
    assert.deepEqual(checks, en.lessons[i].workedExample.arithmeticChecks);
    for (const check of checks) {
      assert.match(check.expression, /^[0-9+*/(). -]+$/);
      assert.equal(runInNewContext(check.expression, Object.create(null), { timeout: 100 }), check.expected);
      count++;
    }
  }
  assert.ok(count > 30, "new practice calculations must also be verified");
});
