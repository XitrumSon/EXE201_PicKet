import { useEffect } from "react";
import { AppState } from "react-native";
import { picketApi } from "@/core/api/client";
import { useAuth } from "@/features/auth/auth-context";
import { curriculum } from "./curriculum";
import { learningAttempts, learningProgress } from "./progress-storage";
import { submitPendingLearningAttempt } from "./cloud-sync";

export function LearningSync() {
  const { session, localMode }=useAuth();
  useEffect(()=>{
    const api=picketApi;
    if (!session || localMode || !api || !curriculum.publicationGate.publishable ||
        process.env.EXPO_PUBLIC_LEARNING_CLOUD_ENABLED!=="true") return;
    let active=true;
    const controller=new AbortController();
    const sync=()=>{
      if (!active) return;
      void learningAttempts.drain(session.user.id,async(row)=>{
        if (!active) throw new Error("Learning session changed");
        await submitPendingLearningAttempt(row,(request,key)=>api.submitLearningAttempt(session.access_token,request,key,controller.signal));
      }).then(async()=>{
        if(!active)return;
        const result=await api.learningProgress(session.access_token,controller.signal);
        if(active)await learningProgress.mergeVerified(session.user.id,result.progress);
      }).catch(()=>undefined); // Retain durable attempts; core learning stays usable.
    };
    sync();
    const listener=AppState.addEventListener("change",state=>{if(state==="active")sync();});
    return ()=>{active=false;controller.abort();listener.remove();};
  },[session,localMode]);
  return null;
}
