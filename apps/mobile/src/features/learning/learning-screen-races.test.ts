import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import ts from "typescript";
type Element={type:unknown;props:Record<string,unknown>};
function nodes(value:unknown):Element[]{if(Array.isArray(value))return value.flatMap(nodes);if(!value||typeof value!=="object"||!("props" in value))return [];const n=value as Element;return [n,...nodes(n.props.children)];}
function text(value:unknown):string{if(typeof value==="string")return value;if(Array.isArray(value))return value.map(text).join("");if(value&&typeof value==="object"&&"props" in value)return text((value as Element).props.children);return "";}
function harness(){
 const slots:unknown[]=[];let cursor=0,completions=0,clears=0,release!:(value:unknown)=>void;const pending=new Promise(done=>{release=done;});
 const state=(initial:unknown)=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],(v:unknown)=>{slots[i]=typeof v==="function"?v(slots[i]):v;}];};
 const ref=(initial:unknown)=>{const i=cursor++;return slots[i]??(slots[i]={current:initial});};
 const effect=(fn:()=>unknown,deps:unknown[])=>{const i=cursor++,old=slots[i] as {deps:unknown[];cleanup?:()=>void}|undefined;if(!old||deps.some((v,j)=>!Object.is(v,old.deps[j]))){old?.cleanup?.();slots[i]={deps,cleanup:fn()};}};
 const lesson={lessonId:"lesson",version:1,title:"Lesson",objective:"Objective",body:"Body",workedExample:{description:"Example"},questions:[{prompt:"Q",choices:[{text:"Answer",explanation:"Why"}]}],optionalAction:{text:"Action"},sources:[]};
 const progress={version:1,completed:[]};const adapters:Record<string,unknown>={
 react:{useState:state,useRef:ref,useEffect:effect},"react/jsx-runtime":{jsx:(type:unknown,props:unknown)=>({type,props}),jsxs:(type:unknown,props:unknown)=>({type,props})},
 "react-native":{Text:"Text",View:"View",ScrollView:"ScrollView",AppState:{addEventListener:()=>({remove:()=>{}})}},"react-native-safe-area-context":{SafeAreaView:"SafeAreaView"},
 "@/core/ui/accessible-pressable":{AccessiblePressable:"Pressable"},"@/features/settings/appearance-provider":{useAppTheme:()=>({colors:{},language:"en"})},"react-i18next":{useTranslation:()=>({t:(key:string)=>key})},"@/features/auth/auth-context":{useAuth:()=>({session:null,localMode:true})},
 "@/features/learning/curriculum":{curriculumForLanguage:()=>({lessons:[lesson],publicationGate:{publishable:false}}),gradeQuiz:()=>({correct:1,total:1})},
 "@/features/learning/progress-storage":{learningProgress:{subscribe:()=>()=>{},load:async()=>progress,dueReviews:async()=>[],complete:async()=>{completions++;return pending;}},learningDrafts:{load:async()=>null,save:async()=>{},clearIfUnchanged:async()=>{clears++;}}},
 };
 const exports:{Session?:(props:{owner:string})=>unknown}={};vm.runInNewContext(ts.transpileModule(readFileSync("src/app/learning-preview.tsx","utf8")+'\nexports.Session=LearningSession;',{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:(key:string)=>adapters[key]??{},Date,setInterval:()=>1,clearInterval:()=>{}});
 const render=()=>{cursor=0;return exports.Session!({owner:"guest"});};
 const button=(label:string)=>{const node=nodes(render()).find(n=>n.type==="Pressable"&&text(n.props.children).includes(label));assert.ok(node,label);return node;};
 return {render,button,release:()=>release(progress),counts:()=>({completions,clears}),stop:()=>{for(const slot of slots)(slot as {cleanup?:()=>void})?.cleanup?.();}};
}
async function settle(){for(let i=0;i<5;i++)await new Promise(done=>setImmediate(done));}
async function ready(){const app=harness();app.render();await settle();(app.button("Lesson").props.onPress as ()=>void)();(app.button("Answer").props.onPress as ()=>void)();(app.button("explanations").props.onPress as ()=>void)();return app;}
test("rapid lesson save callbacks persist completion once",async()=>{const app=await ready();const save=app.button("saveCompletion").props.onPress as ()=>void;save();save();assert.equal(app.counts().completions,1);app.release();await settle();});
test("lesson navigation and retry remain blocked until completion settles",async()=>{const app=await ready();const back=app.button("back").props.onPress as ()=>void,retry=app.button("retry").props.onPress as ()=>void;(app.button("saveCompletion").props.onPress as ()=>void)();back();retry();assert.ok(app.button("saveCompletion"));app.release();await settle();});
test("unmounted lesson completion does not clear a draft after returning",async()=>{const app=await ready();(app.button("saveCompletion").props.onPress as ()=>void)();app.stop();app.release();await settle();assert.equal(app.counts().clears,0);});

test("lesson selection waits for stored draft hydration",async()=>{
 const app=harness();app.render();(app.button("Lesson").props.onPress as ()=>void)();assert.throws(()=>app.button("Answer"));
 await settle();(app.button("Lesson").props.onPress as ()=>void)();assert.ok(app.button("Answer"));
});
