export interface CashflowSchedule {
  id:string;startDay:string;endDay?:string;frequency:"once"|"weekly"|"monthly";
  amount:number;currency:string;active:boolean;
}
export interface CashflowScheduleDocument {
  schemaVersion:1;revision:number;schedules:CashflowSchedule[];
  /** Revision at which this idempotent mutation originally applied. */
  appliedRevision?:number;
}
