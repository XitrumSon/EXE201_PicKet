import type { ReceiptDraft } from "./receipt-parser";
export type ReceiptAngle = 0 | 90 | 180 | 270;
export type ReceiptOrientationAdapter = {
 prepare(angle: ReceiptAngle): Promise<{uri: string; dispose(): void}>;
 recognize(uri: string): Promise<ReceiptDraft>;
};
export async function recognizeReceiptOrientations(adapter: ReceiptOrientationAdapter): Promise<ReceiptDraft> {
 const image=await adapter.prepare(0);
 try { return await adapter.recognize(image.uri); } finally { image.dispose(); }
}
