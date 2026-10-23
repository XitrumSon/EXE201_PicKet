import assert from "node:assert/strict";
import { test } from "node:test";
import source from "./content/curriculum.vi.v1.json";
import { validateCurriculum, gradeQuiz, recordCompletion } from "./curriculum";
test("twelve lessons have complete scenarios, references and publication status", () => {
  const curriculum = validateCurriculum(source);
  assert.equal(curriculum.lessons.length, 12);
  assert.equal(curriculum.publicationGate.publishable, false);
  assert.throws(() => validateCurriculum({ ...source, lessons: [{ ...source.lessons[0], sources: [] }] }));
});
test("unanswered quizzes do not become failing scores", () => {
  const lesson = validateCurriculum(source).lessons[0];
  assert.throws(() => gradeQuiz(lesson, []));
  const result = gradeQuiz(lesson, lesson.questions.map(q => q.correctIndex));
  assert.equal(result.correct, 3);
  assert.equal(result.explanations.length, 3);
});
test("replays do not grant duplicate XP and owner histories stay isolated", () => {
  const a = recordCompletion([], "guest", "lesson1", 1);
  assert.deepEqual(recordCompletion(a, "guest", "lesson1", 1), a);
  assert.equal(recordCompletion(a, "userB", "lesson1", 1).length, 2);
});
