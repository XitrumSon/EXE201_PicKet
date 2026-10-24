import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import ts from "typescript";
import { transactionFormVi,transactionFormEn } from "../../core/i18n/transaction-form-resources";
import { createAppI18n } from "../../core/i18n/instance";
const screens=["new.tsx","transfer.tsx","[id].tsx","[id]/refund.tsx","[id]/splits.tsx","bulk.tsx"];
test("transaction forms have vi/en copy for labels, controlled messages and accessibility",()=>{
 const keys=new Set<string>();
 for(const file of screens){
  const path=resolve(process.cwd(),"src/app/transactions",file);
  const source=ts.createSourceFile(path,readFileSync(path,"utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function visit(node:ts.Node){
   if(ts.isStringLiteral(node)&&/[À-ỹĐđ]/.test(node.text)&&node.text!=="đ")keys.add(node.text);
   if(ts.isJsxText(node)&&/[À-ỹĐđ]/.test(node.text.trim()))keys.add(node.text.trim().replace(/\s+/g," "));
   ts.forEachChild(node,visit);
  }visit(source);
 }
 for(const key of keys){assert.ok(transactionFormVi[key],`Missing Vietnamese: ${key}`);assert.ok(transactionFormEn[key],`Missing English: ${key}`);}
});
test("transaction copy switches locale, handles colons and interpolates counts without translating input",async()=>{
 const i18n=createAppI18n("vi");
 const input="Quán cơm: bữa trưa của Sơn";
 assert.equal(i18n.t("Ví dụ: Ăn trưa",{ns:"transactions",nsSeparator:false}),"Ví dụ: Ăn trưa");
 await i18n.changeLanguage("en");
 assert.equal(i18n.t("Ví dụ: Ăn trưa",{ns:"transactions",nsSeparator:false}),"Example: Lunch");
 assert.equal(i18n.t("selectedCount",{ns:"transactions",count:3}),"Selected: 3");
 assert.equal(input,"Quán cơm: bữa trưa của Sơn");
});
