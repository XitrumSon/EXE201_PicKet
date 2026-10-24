type PreferenceKeys={reminders:string;reminderRead:string;budgetDelivered:string;deviceLock:string};
export type PreferenceRetirementSource={
  isRetired(owner:string):Promise<boolean>;
  scheduled():Promise<string[]>;presented():Promise<string[]>;
  cancel(id:string):Promise<void>;dismiss(id:string):Promise<void>;
  removeKey(key:string):Promise<void>;forgetBudget(owner:string):void;
};
export function ownerPreferenceKeys(_owner:string):PreferenceKeys{return {reminders:"",reminderRead:"",budgetDelivered:"",deviceLock:""};}
export function isOwnerReminder(_identifier:string,_owner:string):boolean{return false;}
export async function purgeOwnerPreferences(_owner:string,_source:PreferenceRetirementSource):Promise<void>{}
