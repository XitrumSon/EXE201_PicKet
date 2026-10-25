import { canAttachReceipt } from "./receipt-eligibility";
import type { ReceiptDraft } from "./receipt-parser";
export type ReceiptAngle = 0 | 90 | 180 | 270;
export type ReceiptOrientationAdapter = {
 prepare(angle: ReceiptAngle): Promise<{uri: string; dispose(): void}>;
 recognize(uri: string): Promise<ReceiptDraft>;
};
/** Sequential attempts bound native memory and never combine evidence across angles. */
export async function recognizeReceiptOrientations(adapter: ReceiptOrientationAdapter): Promise<ReceiptDraft> {
 let best: ReceiptDraft | undefined;
 let firstError: unknown;
 for(const angle of [0,90,180,270] as const) {
  let image: Awaited<ReturnType<ReceiptOrientationAdapter['prepare']>> | undefined;
  try {
   image=await adapter.prepare(angle);
   const draft=await adapter.recognize(image.uri);
   if(canAttachReceipt(draft)) return draft;
   if(!best || draft.recognizedLineCount>best.recognizedLineCount) best=draft;
  } catch(error) { firstError ??= error; }
  finally { try { image?.dispose(); } catch { /* Cleanup must not replace recognition results. */ } }
 }
 if(best) return best;
 throw firstError ?? new Error("Receipt recognition failed");
}
