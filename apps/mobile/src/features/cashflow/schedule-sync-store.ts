import type { CashflowScheduleDocument, CashflowSchedule } from "@picket/domain";
import { parseScheduleDocument } from "./schedule-store";
export type ScheduleOperation={key:string;expectedRevision:number;action:"save"|"remove";schedule:CashflowSchedule|{id:string}};
type State=CashflowScheduleDocument&{cloud?:{baseRevision:number;pending:ScheduleOperation[]}};
export function createScheduleSyncStore(_storage:{read(owner:string):Promise<unknown>;write(owner:string,value:State):Promise<void>},_newKey:()=>string){
  return {
    load:async(_owner:string)=>parseScheduleDocument(null),
    save:async(_owner:string,_revision:number,_schedule:CashflowSchedule)=>parseScheduleDocument(null),
    remove:async(_owner:string,_revision:number,_id:string)=>parseScheduleDocument(null),
    sync:async(_owner:string,_fetch:()=>Promise<CashflowScheduleDocument>,_send:(operation:ScheduleOperation)=>Promise<CashflowScheduleDocument>)=>parseScheduleDocument(null),
  };
}
