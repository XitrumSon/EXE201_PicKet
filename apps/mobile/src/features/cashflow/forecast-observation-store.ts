import type {CaptureInput,FrozenForecastCase} from "./forecast-observations";
export type ObservationDocument={schemaVersion:1;owner:string;revision:number;cases:FrozenForecastCase[]};
export function createObservationStore(storage:{read(owner:string):Promise<unknown>;write(owner:string,value:ObservationDocument):Promise<void>;newId():string;now():string}){
 void storage;return {
  load:async(_owner:string):Promise<ObservationDocument>=>{throw new Error("Not implemented");},
  capture:async(_owner:string,_input:CaptureInput,_current:()=>boolean=()=>true):Promise<FrozenForecastCase>=>{throw new Error("Not implemented");},
  observe:async(_owner:string,_id:string,_revision:number,_day:string,_balance:number,_current:()=>boolean=()=>true):Promise<FrozenForecastCase>=>{throw new Error("Not implemented");},
  remove:async(_owner:string,_id:string,_revision:number):Promise<void>=>{throw new Error("Not implemented");},
  clear:async(_owner:string,_revision:number):Promise<void>=>{throw new Error("Not implemented");},
 };
}
