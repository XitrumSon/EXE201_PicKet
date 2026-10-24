import type { CashflowScheduleDocument, CashflowSchedule } from "@picket/domain";
import { parseScheduleDocument } from "./schedule-store";
export type ScheduleOperation={key:string;expectedRevision:number;action:"save"|"remove";schedule:CashflowSchedule|{id:string}};
export type ScheduleConflictReview={local:CashflowScheduleDocument;remote:CashflowScheduleDocument};
type State=CashflowScheduleDocument&{owner?:string;cloud?:{baseRevision:number;pending:ScheduleOperation[]}};
const maxRevision=Number.MAX_SAFE_INTEGER;
function parse(value:unknown,owner:string):State{
  const doc=parseScheduleDocument(value);
  const raw=value as State|null|undefined;
  if(raw?.owner!==undefined&&raw.owner!==owner)throw new Error("Schedule owner mismatch");
  if(raw?.cloud===undefined)return{...doc,owner};
  const {baseRevision,pending}=raw.cloud;
  if(!Number.isSafeInteger(baseRevision)||baseRevision<0||baseRevision>maxRevision||!Array.isArray(pending)||pending.length>1000)throw new Error("Invalid schedule synchronization state");
  const seen=new Set<string>();
  const operations=pending.map((operation,index)=>{
    if(!operation||typeof operation.key!=="string"||!/^[A-Za-z0-9._:-]{8,128}$/.test(operation.key)||seen.has(operation.key)||operation.expectedRevision!==baseRevision+index||operation.expectedRevision>=maxRevision)throw new Error("Invalid schedule operation");
    seen.add(operation.key);
    if(operation.action==="save"){
      const schedule=parseScheduleDocument({schemaVersion:1,revision:0,schedules:[operation.schedule]}).schedules[0];
      return{...operation,schedule};
    }
    if(operation.action!=="remove"||!operation.schedule||!/^[A-Za-z0-9_-]{1,200}$/.test(operation.schedule.id)||Object.keys(operation.schedule).length!==1)throw new Error("Invalid schedule removal");
    return{...operation,schedule:{id:operation.schedule.id}};
  });
  return{...doc,owner,cloud:{baseRevision,pending:operations}};
}
function sameSchedules(a:CashflowSchedule[],b:CashflowSchedule[]){
  const sorted=(rows:CashflowSchedule[])=>[...rows].sort((x,y)=>x.id.localeCompare(y.id));
  return JSON.stringify(sorted(a))===JSON.stringify(sorted(b));
}
/** One durable write holds both local schedules and their stable-key outbox. */
export function createScheduleSyncStore(storage:{read(owner:string):Promise<unknown>;write(owner:string,value:State):Promise<void>},newKey:()=>string){
  const queues=new Map<string,Promise<unknown>>(),drains=new Map<string,Promise<CashflowScheduleDocument>>();
  const listeners=new Map<string,Set<()=>void>>();
  const checkOwner=(owner:string)=>{if(!/^[A-Za-z0-9_-]{1,200}$/.test(owner))throw new Error("Invalid schedule owner");};
  const read=async(owner:string)=>parse(await storage.read(owner),owner);
  async function write(owner:string,state:State){
    const next=parse(state,owner);
    await storage.write(owner,next);
    for(const listener of listeners.get(owner)??[]){try{listener();}catch{/* A UI callback cannot invalidate a committed write. */}}
    return next;
  }
  async function queue<T>(owner:string,action:()=>Promise<T>):Promise<T>{
    checkOwner(owner);
    const operation=(queues.get(owner)??Promise.resolve()).catch(()=>undefined).then(action);
    queues.set(owner,operation);
    try{return await operation;}finally{if(queues.get(owner)===operation)queues.delete(owner);}
  }
  const load=(owner:string)=>queue(owner,async()=>parseScheduleDocument(await read(owner)));
  function mutate(owner:string,revision:number,action:"save"|"remove",schedule:CashflowSchedule|{id:string}){
    return queue(owner,async()=>{
      const state=await read(owner);
      if(!Number.isSafeInteger(revision)||revision!==state.revision||revision>=maxRevision)throw new Error("Schedule changed; reload before editing");
      if(action==="remove"&&!state.schedules.some(row=>row.id===schedule.id))throw new Error("Schedule not found");
      const schedules=state.schedules.filter(row=>row.id!==schedule.id);
      if(action==="save")schedules.push(schedule as CashflowSchedule);
      const doc=parseScheduleDocument({schemaVersion:1,revision:revision+1,schedules});
      const cloud=state.cloud?{baseRevision:state.cloud.baseRevision,pending:[...state.cloud.pending,{key:newKey(),expectedRevision:state.cloud.baseRevision+state.cloud.pending.length,action,schedule}]}:undefined;
      return parseScheduleDocument(await write(owner,{...doc,owner,...(cloud?{cloud}:{})}));
    });
  }
  function sync(owner:string,fetchRemote:()=>Promise<CashflowScheduleDocument>,send:(operation:ScheduleOperation)=>Promise<CashflowScheduleDocument>,isCurrent=()=>true):Promise<CashflowScheduleDocument>{
    checkOwner(owner);
    const existing=drains.get(owner);if(existing)return existing;
    const checkActive=()=>{if(!isCurrent())throw new Error("Schedule session changed");};
    const operation=(async()=>{
      checkActive();
      const initial=await queue(owner,()=>read(owner));
      if(!initial.cloud){
        checkActive();
        const remote=parseScheduleDocument(await fetchRemote());checkActive();
        await queue(owner,async()=>{
          checkActive();const state=await read(owner);if(state.cloud)return;
          if(remote.schedules.length&&(state.schedules.length||state.revision>0)&&!sameSchedules(remote.schedules,state.schedules))throw new Error("Local and cloud schedules differ; existing local data was preserved");
          if(!remote.schedules.length&&state.schedules.length){
            const pending=state.schedules.map((schedule,index)=>({key:newKey(),expectedRevision:remote.revision+index,action:"save" as const,schedule}));
            await write(owner,{...state,cloud:{baseRevision:remote.revision,pending}});
          }else await write(owner,{...remote,owner,cloud:{baseRevision:remote.revision,pending:[]}});
        });
      }
      // Bound a foreground drain; unfinished operations stay durable for resume.
      for(let count=0;count<50;count++){
        checkActive();
        const state=await queue(owner,()=>read(owner));
        const pending=state.cloud!.pending[0];
        if(!pending){
          checkActive();
          const remote=parseScheduleDocument(await fetchRemote());checkActive();
          const adopted=await queue(owner,async()=>{
            checkActive();const current=await read(owner);
            if(current.cloud!.pending.length)return false;
            if(remote.revision<current.cloud!.baseRevision)throw new Error("Cloud schedule revision regressed");
            if(remote.revision===current.revision&&remote.revision===current.cloud!.baseRevision&&sameSchedules(remote.schedules,current.schedules))return true;
            await write(owner,{...remote,owner,cloud:{baseRevision:remote.revision,pending:[]}});return true;
          });
          if(adopted)return load(owner);
          continue;
        }
        checkActive();const response=await send(pending);checkActive();
        const remote=parseScheduleDocument(response),applied=response.appliedRevision;
        if(applied!==pending.expectedRevision+1||remote.revision<applied)throw new Error("Invalid schedule acknowledgment");
        await queue(owner,async()=>{
          checkActive();const current=await read(owner);
          if(current.cloud!.pending[0]?.key!==pending.key)throw new Error("Schedule queue changed");
          const remaining=current.cloud!.pending.slice(1);
          // A replay may include newer changes from another device. Once our
          // queue is empty, the next mutation must use that current revision.
          const cloud={baseRevision:remaining.length?applied:remote.revision,pending:remaining};
          await write(owner,{...(remaining.length?current:remote),owner,cloud});
        });
      }
      return load(owner);
    })();
    drains.set(owner,operation);
    void operation.finally(()=>{if(drains.get(owner)===operation)drains.delete(owner);}).catch(()=>undefined);
    return operation;
  }
  return{load,
    reviewConflict:async(owner:string,fetchRemote:()=>Promise<CashflowScheduleDocument>):Promise<ScheduleConflictReview>=>{void owner;void fetchRemote;throw new Error("Reconciliation not implemented");},
    resolveConflict:async(owner:string,review:ScheduleConflictReview,choices:Record<string,"local"|"cloud"|"omit">,fetchRemote:()=>Promise<CashflowScheduleDocument>):Promise<CashflowScheduleDocument>=>{void owner;void review;void choices;void fetchRemote;throw new Error("Reconciliation not implemented");},
    recovery:async(owner:string):Promise<CashflowScheduleDocument|null>=>{void owner;return null;},
    save:(owner:string,revision:number,schedule:CashflowSchedule)=>mutate(owner,revision,"save",schedule),
    remove:(owner:string,revision:number,id:string)=>mutate(owner,revision,"remove",{id}),sync,
    status:(owner:string)=>queue(owner,async()=>{const state=await read(owner);return{linked:!!state.cloud,pending:state.cloud?.pending.length??0};}),
    subscribe:(owner:string,listener:()=>void)=>{checkOwner(owner);const set=listeners.get(owner)??new Set<()=>void>();set.add(listener);listeners.set(owner,set);return()=>{set.delete(listener);if(!set.size)listeners.delete(owner);};},
  };
}
