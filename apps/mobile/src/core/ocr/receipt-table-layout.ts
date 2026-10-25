import type {ReceiptTextLine} from "./receipt-parser";

const clean=(value:string)=>value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").trim();
function positioned(line:ReceiptTextLine):line is ReceiptTextLine&{left:number;right:number;top:number;bottom:number}{
 return [line.left,line.right,line.top,line.bottom].every(value=>typeof value==="number"&&Number.isFinite(value))&&line.right!>line.left!&&line.bottom!>line.top!;
}
function sameRow(a:ReceiptTextLine,b:ReceiptTextLine){
 if(!positioned(a)||!positioned(b))return false;
 return Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>=Math.min(a.bottom-a.top,b.bottom-b.top)*0.5;
}

/** Join only tables whose quantity, unit-price and total columns are identified. */
export function receiptTableRows(lines:ReceiptTextLine[]):ReceiptTextLine[]{
 const used=new Set<ReceiptTextLine>(),replacements=new Map<ReceiptTextLine,ReceiptTextLine>();
 const headers=lines.filter(line=>positioned(line)&&/^(ten\s*(san pham|hang hoa)|san pham|mat hang|item|description)$/.test(clean(line.text)));
 for(const nameHeader of headers){
  if(!positioned(nameHeader))continue;
  const row=lines.filter(line=>sameRow(nameHeader,line)&&positioned(line)&&line.left>nameHeader.left);
  const quantityHeader=row.find(line=>/^(sl|s\.l\.?|so luong|qty|quantity)$/.test(clean(line.text)));
  const unitHeader=row.find(line=>/^(don gia|unit price|price)$/.test(clean(line.text)));
  const totalHeader=row.find(line=>/^(thanh tien|amount|total)$/.test(clean(line.text)));
  if(!quantityHeader||!unitHeader||!totalHeader||!positioned(quantityHeader)||!positioned(unitHeader)||!positioned(totalHeader)||
    !(nameHeader.left<quantityHeader.left&&quantityHeader.left<unitHeader.left&&unitHeader.left<totalHeader.left))continue;
  for(const name of lines){
   if(!positioned(name)||used.has(name)||name.top<=nameHeader.bottom||name.left<nameHeader.left-10||name.left>=quantityHeader.left||
     !/[A-Za-zÀ-ỹ]/.test(name.text)||/^(tong|total|phi|giam|thue|vat|subtotal|ngay|date|khach|dia chi)\b/.test(clean(name.text)))continue;
   const cells=lines.filter(line=>line!==name&&sameRow(name,line)&&positioned(line)&&line.left>=quantityHeader.left);
   const inColumn=(header:ReceiptTextLine&{left:number;right:number},nextLeft:number)=>cells.filter(line=>positioned(line)&&line.left>=header.left-10&&line.left<nextLeft);
   const quantities=inColumn(quantityHeader,unitHeader.left-10);
   // A warranty/discount column may sit between unit price and line total.
   const nextHeader=row.filter(positioned).filter(line=>line.left>unitHeader.left).sort((a,b)=>a.left-b.left)[0];
   const units=inColumn(unitHeader,nextHeader?.left??totalHeader.left);
   const totals=inColumn(totalHeader,Infinity);
   if(quantities.length!==1||units.length!==1||totals.length!==1)continue;
   if(!/^\d+(?:[.,]\d+)?$/.test(quantities[0].text.trim())||
     !units.concat(totals).every(line=>/^\d[\d.,\s]*(?:vnd|đ|d|₫)?$/i.test(line.text.trim())))continue;
   const unit=units[0].text.replace(/\s*(vnd|đ|d|₫)\s*$/i,"");
   replacements.set(name,{...name,text:`${name.text} ${quantities[0].text} x ${unit} | ${totals[0].text}`,right:totals[0].right});
   cells.forEach(cell=>used.add(cell));
  }
 }
 return lines.filter(line=>!used.has(line)).map(line=>replacements.get(line)??line);
}
