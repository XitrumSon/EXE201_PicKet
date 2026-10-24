import type { SettlementLink } from "./settlements";
export type SettlementDocument={schemaVersion:1;revision:number;links:SettlementLink[]};
export function createSettlementStore(storage:{read(owner:string):Promise<unknown>;write(owner:string,value:SettlementDocument):Promise<void>}){
 void storage;
 return {
  load:async(owner:string):Promise<SettlementDocument>=>{void owner;throw new Error("Not implemented");},
  save:async(owner:string,revision:number,links:SettlementLink[]):Promise<SettlementDocument>=>{void owner;void revision;void links;throw new Error("Not implemented");},
 };
}
