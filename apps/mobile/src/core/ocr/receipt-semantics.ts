import type {ReceiptTextLine} from "./receipt-parser";

/** Normalize labels only; never rewrite the displayed merchant/product name. */
export const normalizeReceiptLabel = (value: string) => value.toLowerCase().normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();

export function merchantDisplayName(value:string):string {
  return value.replace(/^(?:đơn vị bán hàng|tên cửa hàng|seller|merchant)\s*:\s*/iu,'')
    .replace(/^((?:cà\s+phê|nhà\s+hàng|cửa\s+hàng|siêu\s+thị|nhà\s+thuốc))(?=\p{L})/iu,'$1 ').trim();
}

export function isReceiptMetadata(text: string): boolean {
  const value = normalizeReceiptLabel(text);
  return /^store\s*:|^thu\s+n?c?gan\b|^thu\s+ncan\b/.test(value)
    || /^(?:[:|]\s*)?(?:s[. ]?d[. ]?t|dt|dien thoai|phone|hotline|tel|fax|mst|ma so thue|tax id|stk|so tai khoan|account|iban|website|email|thu\s*ngan|cashier|nhan vien|nv|khach hang|customer|nguoi mua|nguoi ban|dia chi|address|ma\s*(?:the|hd|hoa don|phieu|cqt|thanh vien|giao dich)|so\s*(?:hd|hoa don|phieu|chung tu)|invoice\s*(?:no|number)|receipt\s*(?:no|number)|ban\s*\d|table\s*\d|in luc|gio\s*(?:vao|ra|in)|gia vao|thoi gian|cam on|hen gap|thank|uu dai|khuyen mai|chuong trinh|diem tich|tich diem)\b/.test(value)
    || /^(?:www\.|https?:)/.test(value)
    || /^(?:so|no|ngay|date|time)\s*[:.#-]/.test(value)
    || /\b\d{1,2}[/-]\d{1,2}[/-]/.test(value)
    || /\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(value)
    || /^(?:duong\b|dc\s*[:.]|q[.]|p[.]|tp[.]|tinh\b|huyen\b|quan\b|phuong\b|no[.]?\s*\d|\d+\s+[^|]*\b(?:duong|nguyen|tran|le|pham|hoang|street|road|avenue|kdc|phuong|quan)\b)/.test(value)
    || /\b(?:q[.]\s*\d|p[.]\s*\d|tp[.]\s|kdc\b|jalan\b|district\b)/.test(value)
    || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(value)
    || /^(?:[:|]\s*)?[^\d]*\b0\d{8,10}\b/.test(value);
}

export function isReceiptSummary(text: string): boolean {
  return /^(?:tong\b|tng\b|teng cong\b|total\b|grand total\b|sub[ -]?total\b|tam tinh\b|thanh toan\b|so tien\b|tien\s*(?:hang|thue|khach|thua|thanh toan)\b|phai tra\b|can thanh toan\b|vat\b|thue\b|tax\b|giam gia\b|discount\b|service\b|phi dich vu\b|cash\b|change\b|tendered\b|amount due\b|due\b)/.test(normalizeReceiptLabel(text));
}

export function isReceiptDocumentLabel(text: string): boolean {
  return /^(?:hoa\s*(?:don|dn|bn)\b|h[do]a\s*don\b|phieu\b|bien lai\b|bin lai\b|receipt\b|sales\s*invo|invoice\b|cash\s*bill\b|gia ban\b|don gia\b|thanh tien\b|mat hang\b|ten hang\b|sl\b|so luong\b|qty\b|bao hanh\b|thong tin\b|hinh thuc\b|phuong thuc\b)/.test(normalizeReceiptLabel(text));
}

/** A header is positive evidence of a body boundary; a document title is a fallback. */
export function receiptBodyStart(lines: ReceiptTextLine[]): {index:number;top:number|null;hasTable:boolean} {
  const labels=lines.map(line=>normalizeReceiptLabel(line.text));
  let index=labels.findIndex(text=>/^(?:mat hang|ten (?:san pham|hang hoa)|description|item)(?:\b|$)/.test(text));
  const quantity=/^(?:sl|s[.]l[.]?|so luong|qty|quantity)$/;
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    if(!quantity.test(labels[i])||line.top===undefined||line.bottom===undefined)continue;
    const cy=(line.top+line.bottom)/2,height=line.bottom-line.top;
    if(lines.some((other,j)=>j!==i&&/^(?:don gia|gia|d[.]?g[.]?|unit price|price|thanh tien|t[. ]?tien|t tren|amount|total)$/.test(labels[j])&&other.top!==undefined&&other.bottom!==undefined&&Math.abs((other.top+other.bottom)/2-cy)<=Math.max(height,other.bottom-other.top)*1.5)){
      if(index<0||line.top>(lines[index].top??Infinity))index=i;
    }
  }
  const hasTable=index>=0;
  if(index<0)index=labels.findIndex(text=>/^(?:hoa\s*(?:don|dn|bn)\b|phieu\s*(?:tinh|thanh|ban|mua)\b|sales\s*invo|invoice\b|receipt\b)/.test(text));
  return {index,top:index>=0?lines[index].bottom??null:null,hasTable};
}
