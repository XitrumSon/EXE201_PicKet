import type {ReceiptTextLine} from "./receipt-parser";
export function inferReceiptRotation(_lines:ReceiptTextLine[]):0|90|180|270|null{return null;}
export function orientReceiptLines(lines:ReceiptTextLine[],_width:number,_height:number,_angle:0|90|180|270):ReceiptTextLine[]{return lines;}
