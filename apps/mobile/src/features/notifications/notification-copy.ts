import type { AppLanguage } from "../../core/i18n/formatters";
export type ReminderKind="bill"|"subscription"|"return"|"warranty"|"budget";
export function reminderLabel(kind:ReminderKind,title:string,dueAt:string,language:AppLanguage="vi"):string{
 void kind;void title;void dueAt;void language;throw new Error("Reminder translation missing");
}
export function privateReminderCopy(kind:"budget"|"reminder",language:AppLanguage="vi"):{title:string;body:string;channel:string}{
 void kind;void language;throw new Error("Private reminder translation missing");
}
