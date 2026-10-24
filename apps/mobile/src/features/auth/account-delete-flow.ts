type DeletionSteps={retireLocal():Promise<void>;resumeLocal():Promise<void>;deleteRemote():Promise<void>;signOut():Promise<void>;isCurrent():boolean};
export type DeletionOutcome={status:"deleted";signedOut:boolean}|{status:"local-cleanup-failed"|"remote-unconfirmed"|"session-changed"};
export async function deleteAccountWithLocalRetirement(steps:DeletionSteps):Promise<DeletionOutcome>{if(!steps.isCurrent())return {status:"session-changed"};
 try{await steps.retireLocal();}catch{return {status:"local-cleanup-failed"};}
 if(!steps.isCurrent()){await steps.resumeLocal().catch(()=>undefined);return {status:"session-changed"};}
 try{await steps.deleteRemote();}catch{await steps.resumeLocal().catch(()=>undefined);return {status:"remote-unconfirmed"};}
 if(!steps.isCurrent())return {status:"deleted",signedOut:true};
 try{await steps.signOut();return {status:"deleted",signedOut:true};}catch{return {status:"deleted",signedOut:false};}}
