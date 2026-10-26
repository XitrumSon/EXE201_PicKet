import {parseReceiptLines,type ReceiptDraft,type ReceiptTextLine} from "./receipt-parser";
export type OcrSample={lines:ReceiptTextLine[];width:number;height:number;durationMs?:number};
export type OcrRegion={originX:number;originY:number;width:number;height:number};
export type ReceiptOcrSession={
 open(uri:string):Promise<{id:string;width:number;height:number}>;
 inspect(id:string,timeoutMs:number):Promise<OcrSample>;
 preview(id:string,angle:number,edge:number,timeoutMs:number):Promise<OcrSample>;
 select(id:string,angle:number):Promise<{width:number;height:number}>;
 full(id:string,timeoutMs:number):Promise<OcrSample>;
 crop(id:string,region:OcrRegion,timeoutMs:number):Promise<OcrSample>;
 close(id:string):Promise<void>;
};
export type ReceiptScanResult={draft:ReceiptDraft;durationMs:number;budgetExceeded:boolean;stats:{previews:number;fullReads:number;cropReads:number}};
export async function scanReceiptSession(uri:string,native:ReceiptOcrSession,now=()=>Date.now(), _signal?:AbortSignal):Promise<ReceiptScanResult>{
 const start=now(),opened=await native.open(uri);let draft:ReceiptDraft|undefined;
 const stats={previews:0,fullReads:0,cropReads:0};
 try {for(const angle of [0,90,180,270]){await native.preview(opened.id,angle,2048,20000);stats.previews++;await native.select(opened.id,angle);draft=parseReceiptLines((await native.full(opened.id,20000)).lines);stats.fullReads++;}
 return {draft:draft!,durationMs:now()-start,budgetExceeded:false,stats};}finally{await native.close(opened.id);}
}
