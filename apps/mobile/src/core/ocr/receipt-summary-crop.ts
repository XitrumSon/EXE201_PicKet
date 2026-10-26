import type { ReceiptTextLine } from "./receipt-parser";

const clean = (text:string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[|│┃]/g,"").replace(/\s+/g," ").trim();

/** Crop only an observed VAT summary; never guess a location from a contact line. */
export function receiptSummaryCrop(lines: ReceiptTextLine[], width: number, height: number): {originX:number;originY:number;width:number;height:number}|null {
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return null;
  const labels=lines.filter(line=>typeof line.top==="number"&&typeof line.bottom==="number"&&Number.isFinite(line.top)&&Number.isFinite(line.bottom)&&line.bottom>line.top&&
    /^(?:tien hang|tien thue|(?:tien|tong tien) thanh toan)\s*:?$/.test(clean(line.text)));
  const distinct=new Set(labels.map(line=>clean(line.text).replace(/\s*:$/,""))).size;
  if(distinct<2&&!labels.some(line=>/^(?:tien|tong tien) thanh toan\s*:?$/.test(clean(line.text))))return null;
  const top=Math.min(...labels.map(line=>line.top!)),bottom=Math.max(...labels.map(line=>line.bottom!));
  const rowHeight=Math.max(...labels.map(line=>line.bottom!-line.top!));
  const margin=Math.max(rowHeight*(distinct<2?6:3),(bottom-top)*0.8);
  const originY=Math.max(0,Math.floor(top-margin));
  const end=Math.min(height,Math.ceil(bottom+margin));
  if(end<=originY||end-originY>height/2)return null;
  return {originX:0,originY,width:Math.floor(width),height:end-originY};
}
