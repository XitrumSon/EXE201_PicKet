import type { LearningActivityEvent,LearningActivityDocument,CloudLearningProgress } from "@picket/domain";
import type { LearningProgress } from "./progress";
import type { PracticeEvent } from "./practice";

export function pendingLearningActivity(progress:LearningProgress,practice:PracticeEvent[],verified:CloudLearningProgress[],cloud:LearningActivityDocument,today:string):LearningActivityEvent[]{
  void progress;void practice;void verified;void cloud;void today;
  return [];
}
