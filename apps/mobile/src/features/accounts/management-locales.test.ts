import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import ts from "typescript";
import { managementVi,managementEn } from "../../core/i18n/management-resources";
import { createAppI18n } from "../../core/i18n/instance";
const files=["accounts/new.tsx","accounts/[id].tsx","categories/index.tsx","categories/new.tsx","categories/[id].tsx"];
test("account and category management have complete vi/en controlled copy",()=>{
 const keys=new Set<string>();
 for(const file of files){
  const path=resolve(process.cwd(),"src/app",file),source=ts.createSourceFile(path,readFileSync(path,"utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function visit(node:ts.Node){
   if(ts.isStringLiteral(node)&&/[À-ỹĐđ]/.test(node.text))keys.add(node.text);
   if(ts.isJsxText(node)&&/[À-ỹĐđ]/.test(node.text.trim()))keys.add(node.text.trim().replace(/\s+/g," "));
   ts.forEachChild(node,visit);
  }visit(source);
 }
 for(const key of keys){assert.ok(managementVi[key],`Missing vi: ${key}`);assert.ok(managementEn[key],`Missing en: ${key}`);}
});
test("management labels switch language while category names remain supplied data",async()=>{
 const i18n=createAppI18n("vi");
 assert.equal(i18n.t("Ví dụ: Ví hàng ngày",{ns:"management",nsSeparator:false}),"Ví dụ: Ví hàng ngày");
 await i18n.changeLanguage("en");
 assert.equal(i18n.t("Ví dụ: Ví hàng ngày",{ns:"management",nsSeparator:false}),"Example: Everyday wallet");
 assert.equal(i18n.t("colorOption",{ns:"management",color:"#8C6A7D"}),"Color #8C6A7D");
});
