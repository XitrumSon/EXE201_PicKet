import type { SettlementLink } from "./settlements";
export type SettlementDocument={schemaVersion:1;revision:number;links:SettlementLink[]};
export type SettlementReview={local:SettlementDocument;remote:SettlementDocument};
export type SettlementSend=(revision:number,links:SettlementLink[],key:string)=>Promise<unknown>;
function parse(value:unknown):SettlementDocument{
 if(value==null)return {schemaVersion:1,revision:0,links:[]};
 const doc=value as SettlementDocument;
 if(doc.schemaVersion!==1||!Number.isSafeInteger(doc.revision)||doc.revision<0||!Array.isArray(doc.links)||doc.links.length>1000)throw new Error("Invalid settlement storage");
 const occurrences=new Set<string>(),transactions=new Set<string>();
 const links=doc.links.map(link=>{
  if(!link||![link.occurrenceId,link.transactionId].every(id=>typeof id==="string"&&id.length>0&&id.length<=250)||
     !/^\d{4}-\d{2}-\d{2}$/.test(link.day)||!Number.isFinite(Date.parse(link.day+"T00:00:00Z"))||new Date(link.day+"T00:00:00Z").toISOString().slice(0,10)!==link.day||
     !Number.isSafeInteger(link.amount)||link.amount===0||Math.abs(link.amount)>9e12||!/^[A-Z]{3}$/.test(link.currency)||
     typeof link.transactionUpdatedAt!=="string"||!Number.isFinite(Date.parse(link.transactionUpdatedAt))||
     occurrences.has(link.occurrenceId)||transactions.has(link.transactionId))throw new Error("Invalid settlement link");
  occurrences.add(link.occurrenceId);transactions.add(link.transactionId);
  return {occurrenceId:link.occurrenceId,day:link.day,amount:link.amount,currency:link.currency,transactionId:link.transactionId,transactionUpdatedAt:link.transactionUpdatedAt};
 });
 return {schemaVersion:1,revision:doc.revision,links};
}
export function createSettlementStore(storage:{read(owner:string):Promise<unknown>;write(owner:string,value:SettlementDocument):Promise<void>}){
 const queues=new Map<string,Promise<unknown>>();
 const ownerKey=(owner:string)=>{if(!/^[A-Za-z0-9_-]{1,200}$/.test(owner))throw new Error("Invalid settlement owner");};
 return {
  review:async(_owner:string,_fetch:()=>Promise<unknown>,_current:()=>boolean=()=>true):Promise<SettlementReview>=>{throw new Error("Not implemented");},
  publish:async(_owner:string,_review:SettlementReview|null,_fetch:()=>Promise<unknown>,_send:SettlementSend,_key:()=>string,_current:()=>boolean=()=>true):Promise<SettlementDocument>=>{throw new Error("Not implemented");},
  adopt:async(_owner:string,_review:SettlementReview,_fetch:()=>Promise<unknown>,_current:()=>boolean=()=>true):Promise<SettlementDocument>=>{throw new Error("Not implemented");},
  status:async(_owner:string):Promise<{pending:boolean;recovery?:SettlementDocument}>=>({pending:false}),
  load:async(owner:string):Promise<SettlementDocument>=>{ownerKey(owner);await queues.get(owner)?.catch(()=>undefined);return parse(await storage.read(owner));},
  save:async(owner:string,revision:number,links:SettlementLink[]):Promise<SettlementDocument>=>{
   ownerKey(owner);
   const operation=(queues.get(owner)??Promise.resolve()).catch(()=>undefined).then(async()=>{
    const current=parse(await storage.read(owner));
    if(revision!==current.revision||!Number.isSafeInteger(revision)||revision===Number.MAX_SAFE_INTEGER)throw new Error("Settlement changed; reload first");
    const next=parse({schemaVersion:1,revision:revision+1,links});await storage.write(owner,next);return next;
   });
   queues.set(owner,operation);
   try{return await operation;}finally{if(queues.get(owner)===operation)queues.delete(owner);}
  },
 };
}
