import type {ReceiptDraft} from "./receipt-parser";
import {scanReceiptSession,type ReceiptOcrSession,type OcrSample} from "./receipt-scan-session";
export type ReceiptOcrResult={draft:ReceiptDraft;durationMs:number;budgetExceeded?:boolean};
type NativeSession={
 open(uri:string):Promise<{id:string;width:number;height:number}>;
 direction(id:string,timeoutMs:number):Promise<OcrSample>;
 inspect(id:string,timeoutMs:number):Promise<OcrSample>;
 select(id:string,angle:number):Promise<{width:number;height:number}>;
 crop(id:string,x:number,y:number,width:number,height:number,timeoutMs:number):Promise<OcrSample>;
 close(id:string):Promise<void>;
};
let scanning=false;
/** Native owns decoded pixels and the recognizer; no PNG files cross the bridge. */
export async function recognizeReceipt(imageUri:string,signal?:AbortSignal):Promise<ReceiptOcrResult>{
 if(scanning)throw new Error("OCR_BUSY");
 scanning=true;
 try{
  const {requireNativeModule}=await import("expo");
  const module=requireNativeModule<NativeSession>("PicketReceiptOcr");
  const native:ReceiptOcrSession={open:uri=>module.open(uri),direction:(...args)=>module.direction(...args),inspect:(...args)=>module.inspect(...args),select:(...args)=>module.select(...args),
   crop:(id,region,timeout)=>module.crop(id,region.originX,region.originY,region.width,region.height,timeout),close:id=>module.close(id)};
  const result=await scanReceiptSession(imageUri,native,()=>Date.now(),signal);
  console.info("PICKET_OCR_PERF",JSON.stringify({durationMs:result.durationMs,budgetExceeded:result.budgetExceeded,...result.stats}));
  return result;
 }finally{scanning=false;}
}
