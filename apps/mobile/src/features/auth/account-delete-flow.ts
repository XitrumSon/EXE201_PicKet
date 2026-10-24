type DeletionSteps={retireLocal():Promise<void>;resumeLocal():Promise<void>;deleteRemote():Promise<void>;signOut():Promise<void>;isCurrent():boolean};
export type DeletionOutcome={status:"deleted";signedOut:boolean}|{status:"local-cleanup-failed"|"remote-unconfirmed"|"session-changed"};
export async function deleteAccountWithLocalRetirement(steps:DeletionSteps):Promise<DeletionOutcome>{void steps;throw new Error("Not implemented");}
