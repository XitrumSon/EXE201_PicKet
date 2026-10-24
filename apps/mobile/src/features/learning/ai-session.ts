import type { LearningAiConsent, LearningAiJob, LearningAiRequest } from "@picket/domain";

export interface LearningAiApi {
  learningAiConsent(token:string,signal?:AbortSignal):Promise<unknown>;
  setLearningAiConsent(token:string,accepted:boolean,signal?:AbortSignal):Promise<unknown>;
  enqueueLearningAi(token:string,request:LearningAiRequest,key:string,signal?:AbortSignal):Promise<unknown>;
  learningAiJob(token:string,id:string,signal?:AbortSignal):Promise<unknown>;
  deleteLearningAiHistory(token:string,signal?:AbortSignal):Promise<unknown>;
}
export interface LearningAiState {
  consent:LearningAiConsent|null;
  job:LearningAiJob|null;
  busy:boolean;
  error:"unavailable"|"quota"|null;
}

// RED checkpoint: the behavior is specified in ai-session.test.ts.
export function createLearningAiSession(api:LearningAiApi,token:string,newKey:()=>string) {
  void api;void token;void newKey;
  const state:LearningAiState={consent:null,job:null,busy:false,error:null};
  return {
    snapshot:()=>state,
    load:async()=>undefined,
    generate:async(locale:"vi"|"en")=>{void locale;},
    poll:async()=>undefined,
    setConsent:async(accepted:boolean)=>{void accepted;},
    clearHistory:async()=>undefined,
    dispose:()=>undefined,
  };
}
