import { File, Paths } from "expo-file-system";
import { parseReceiptLines, type ReceiptDraft, type ReceiptTextLine } from "./receipt-parser";
import { receiptTableCrop } from "./receipt-table-crop";
import { recognizeReceiptOrientations } from "./receipt-orientation";

export type ReceiptOcrResult = {
  draft: ReceiptDraft;
  durationMs: number;
};

/** Normalize source orientation, then try cardinal rotations locally when needed. */
export async function recognizeReceipt(imageUri: string): Promise<ReceiptOcrResult> {
  const startedAt = Date.now();
  const { default: MlkitOcr } = await import("rn-mlkit-ocr");
  const { ImageManipulator, SaveFormat } = await import("expo-image-manipulator");
  const sizes = new Map<string, {width:number; height:number}>();
  const draft = await recognizeReceiptOrientations({
    prepare: async (angle) => {
      const context = ImageManipulator.manipulate(imageUri);
      let rendered: Awaited<ReturnType<typeof context.renderAsync>> | undefined;
      try {
        if (angle) context.rotate(angle);
        rendered = await context.renderAsync();
        const output = await rendered.saveAsync({ format: SaveFormat.PNG });
        sizes.set(output.uri,{width:rendered.width,height:rendered.height});
        return { uri: output.uri, dispose: () => {
          sizes.delete(output.uri);
          if (output.uri !== imageUri && output.uri.startsWith(Paths.cache.uri.replace(/\/$/, "") + "/")) {
            const file = new File(output.uri); if (file.exists) file.delete();
          }
        }};
      } finally {
        try { rendered?.release(); } catch { /* Keep the saved OCR image usable. */ }
        try { context.release(); } catch { /* Do not replace the OCR result. */ }
      }
    },
    recognize: async (uri) => {
      const result = await MlkitOcr.recognizeText(uri, "latin");
      const lines: ReceiptTextLine[] = result.blocks.flatMap((block) =>
        block.lines.map((line) => ({
          text: line.text,
          top: line.frame.y,
          bottom: line.frame.y + line.frame.height,
          left: line.frame.x,
          right: line.frame.x + line.frame.width,
        })),
      );
      const original = parseReceiptLines(lines);
      const region = receiptTableCrop(lines), size = sizes.get(uri);
      if (!region || !size) return original;
      const crop = {...region, originX:0, width:size.width, height:Math.min(region.height,size.height-region.originY)};
      if(crop.width<=0||crop.height<=0)return original;
      const context=ImageManipulator.manipulate(uri);
      let rendered:Awaited<ReturnType<typeof context.renderAsync>>|undefined;
      let output:string|undefined;
      try {
        context.crop(crop); rendered=await context.renderAsync();
        output=(await rendered.saveAsync({format:SaveFormat.PNG})).uri;
        const detail=await MlkitOcr.recognizeText(output,"latin");
        const detailLines:ReceiptTextLine[]=detail.blocks.flatMap(block=>block.lines.map(line=>({text:line.text,
          left:line.frame.x+crop.originX,right:line.frame.x+line.frame.width+crop.originX,
          top:line.frame.y+crop.originY,bottom:line.frame.y+line.frame.height+crop.originY})));
        const outside=lines.filter(line=>{
          const x=(line.left!+line.right!)/2,y=(line.top!+line.bottom!)/2;
          return x<crop.originX||x>=crop.originX+crop.width||y<crop.originY||y>=crop.originY+crop.height;
        });
        const refined=parseReceiptLines([...outside,...detailLines]);
        return refined.amount===original.amount&&refined.lineItems.length>original.lineItems.length?refined:original;
      } catch { return original; }
      finally {
        try { rendered?.release(); } catch { /* Retain the original OCR result. */ }
        try { context.release(); } catch { /* Retain the original OCR result. */ }
        if(output&&output!==uri&&output.startsWith(Paths.cache.uri.replace(/\/$/, "")+"/")){
          try { const file=new File(output);if(file.exists)file.delete(); } catch { /* Cache cleanup can retry later. */ }
        }
      }
    },
  });
  return { draft, durationMs: Date.now() - startedAt };
}
