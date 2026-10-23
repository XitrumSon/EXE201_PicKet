import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import ts from "typescript";
import { authEn, authVi } from "../../core/i18n/auth-resources";

test("auth screens and mapped validation errors have reviewed vi/en copy",()=>{
  const paths=["app/(auth)/login.tsx","app/(auth)/register.tsx","app/(auth)/forgot-password.tsx","app/(auth)/verify-email.tsx","app/auth/reset-password.tsx","features/auth/auth-errors.ts"];
  const missing=new Set<string>();
  for(const path of paths){
    const source=ts.createSourceFile(path,readFileSync(resolve("src",path),"utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const visit=(node:ts.Node)=>{
      if(ts.isStringLiteralLike(node)&&/[À-ỹ]/.test(node.text)&&(!authVi[node.text]||!authEn[node.text]))missing.add(node.text);
      ts.forEachChild(node,visit);
    };
    visit(source);
  }
  assert.deepEqual([...missing],[]);
});
