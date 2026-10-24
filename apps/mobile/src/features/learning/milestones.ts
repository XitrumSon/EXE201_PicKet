import type { Completion } from "./curriculum";
import type { PracticeEvent } from "./practice";
export type LearningMilestone="firstLesson"|"threeLessons"|"allLessons"|"reviewedLesson"|"practicedWeek";
export function learningMilestones(owner:string,completed:Completion[],practice:PracticeEvent[]):{xp:number;badges:LearningMilestone[]}{
  void owner;void completed;void practice;
  return {xp:0,badges:[]};
}
