import { completeWeeklyPractice, weekStartForDay, type PracticeEvent } from "./practice";
type Document={schemaVersion:1;events:PracticeEvent[]};
function parse(value:unknown,owner:string):Document {
  if(value==null)return{schemaVersion:1,events:[]};
  const doc=value as Document;
  if(doc.schemaVersion!==1 || !Array.isArray(doc.events) || doc.events.length>1000)throw new Error("Invalid weekly practice storage");
  const weeks=new Set<string>();
  for(const row of doc.events) {
    if(!row||row.owner!==owner||row.action!=="review-records"||typeof row.skipped!=="boolean"||row.xp!==(row.skipped?0:10)||
        weekStartForDay(row.weekStart)!==row.weekStart||weeks.has(row.weekStart))throw new Error("Invalid weekly practice event");
    weeks.add(row.weekStart);
  }
  return {schemaVersion:1,events:doc.events.map(row=>({...row}))};
}
export function createWeeklyPracticeStore(storage:{read(owner:string):Promise<unknown>;write(owner:string,value:Document):Promise<void>}) {
  const pending=new Map<string,Promise<void>>();
  const checkOwner=(owner:string)=>{if(!/^[A-Za-z0-9_-]{1,200}$/.test(owner))throw new Error("Invalid learning owner");};
  async function load(owner:string) {
    checkOwner(owner);await pending.get(owner)?.catch(()=>undefined);
    return parse(await storage.read(owner),owner).events;
  }
  async function record(owner:string,weekStart:string,skipped:boolean) {
    checkOwner(owner);
    const operation=(pending.get(owner)??Promise.resolve()).catch(()=>undefined).then(async()=>{
      const previous=parse(await storage.read(owner),owner);
      const events=completeWeeklyPractice(previous.events,{owner,weekStart,action:"review-records"},skipped);
      const next=parse({schemaVersion:1,events},owner);
      await storage.write(owner,next);
    });
    pending.set(owner,operation);
    try{await operation;}finally{if(pending.get(owner)===operation)pending.delete(owner);}
    return load(owner);
  }
  return {load,record,
    mergeVerified:async(owner:string,value:unknown)=>{void owner;void value;throw new Error("Practice merge not implemented");},
  };
}
