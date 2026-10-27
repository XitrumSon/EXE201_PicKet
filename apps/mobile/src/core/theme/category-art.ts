import type { PaperAssetId } from "./paper-assets";

/** Illustration is decoration only; the category's actual name remains visible. */
export function categoryArt(icon: string | null, name = ""): PaperAssetId {
  const key = `${icon ?? ""} ${name}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/food|restaurant|coffee|an uong|ca phe/.test(key)) return "food";
  if (/bus|car|bike|train|transport|di chuyen/.test(key)) return "transport";
  if (/medical|health|hospital|suc khoe/.test(key)) return "health";
  if (/gift|qua tang/.test(key)) return "gift";
  if (/home|house|nha cua|tien nha/.test(key)) return "home";
  if (/movie|game|leisure|giai tri|du lich/.test(key)) return "leisure";
  if (/salary|cash|wallet|thu nhap|luong/.test(key)) return "bloom";
  return "shopping";
}
