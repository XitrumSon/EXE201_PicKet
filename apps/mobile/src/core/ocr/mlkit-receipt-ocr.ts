import { File, Paths } from "expo-file-system";
import { parseReceiptLines, type ReceiptDraft, type ReceiptTextLine } from "./receipt-parser";
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
  const draft = await recognizeReceiptOrientations({
    prepare: async (angle) => {
      const context = ImageManipulator.manipulate(imageUri);
      let rendered: Awaited<ReturnType<typeof context.renderAsync>> | undefined;
      try {
        if (angle) context.rotate(angle);
        rendered = await context.renderAsync();
        const output = await rendered.saveAsync({ format: SaveFormat.PNG });
        return { uri: output.uri, dispose: () => {
          if (output.uri !== imageUri && output.uri.startsWith(Paths.cache.uri.replace(/\/$/, "") + "/")) {
            const file = new File(output.uri); if (file.exists) file.delete();
          }
        }};
      } finally {
        try { rendered?.release(); } finally { context.release(); }
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
      return parseReceiptLines(lines);
    },
  });
  return { draft, durationMs: Date.now() - startedAt };
}
