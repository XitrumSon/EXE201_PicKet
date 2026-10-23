import { readOfflineCache, writeOfflineCache } from "@/core/sync/offline-cache";
import { createScheduleStore } from "./schedule-store";
export const cashflowSchedules=createScheduleStore({
  read:async owner=>(await readOfflineCache(owner,"cashflow-schedules"))?.value,
  write:(owner,value)=>writeOfflineCache(owner,"cashflow-schedules",value),
});
