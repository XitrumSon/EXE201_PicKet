export interface SubmitLearningAttempt {
  lessonId: string;
  contentVersion: number;
  answers: number[];
}
export interface LearningAttemptResult {
  correct: number;
  total: number;
  awardedXp: 0 | 20;
  replayed: boolean;
}
export interface CloudLearningProgress {
  lesson_id: string;
  content_version: number;
  xp: 20;
  completed_at: string;
}
export interface LearningProgressResponse { progress: CloudLearningProgress[] }
