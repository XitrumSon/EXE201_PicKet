import { useEffect,useState } from "react";
import { Text,View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { formatCalendarDate } from "@/core/i18n/formatters";
import { useAppTheme } from "@/features/settings/appearance-provider";
import { cashflowSettlements } from "./settlement-storage";
import type { SettlementDocument } from "./settlement-store";
import { resolveSettlements,type SettlementLink } from "./settlements";
import { expandSchedules,type CashflowSchedule } from "./schedules";
import { ledgerOpening,type LedgerSnapshot } from "./ledger-snapshot";

type Props={owner:string;snapshot:LedgerSnapshot;accounts:string[];currency:string;schedules:CashflowSchedule[];days:number;onChange:()=>void;onUse:(ids:string[])=>void};
export function SettlementReview({owner,snapshot,accounts,currency,schedules,days,onChange,onUse}:Props){
 const {colors:c,language}=useAppTheme(),{t}=useTranslation("cashflow");
 const [doc,setDoc]=useState<SettlementDocument|null>(null),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false),[expanded,setExpanded]=useState<string|null>(null);
 const [page,setPage]=useState(0);
 useEffect(()=>{let active=true;void cashflowSettlements.load(owner).then(value=>{if(active)setDoc(value);}).catch(()=>{if(active)setFailed(true);});return()=>{active=false;};},[owner]);
 let occurrences:ReturnType<typeof expandSchedules>=[],ids:string[]|null=null,included:string[]=[];
 try{
  const start=new Date(snapshot.asOf).toISOString().slice(0,10),through=new Date(Date.parse(start+"T00:00:00Z")+(days-1)*86400000).toISOString().slice(0,10);
  occurrences=expandSchedules(schedules.filter(row=>row.currency===currency),start,through);
  included=ledgerOpening(snapshot,accounts,currency,0).includedTransactionIds;
  const occurrenceIds=new Set(occurrences.map(row=>row.id));
  if(doc)ids=resolveSettlements(snapshot,accounts,currency,occurrences,doc.links.filter(link=>occurrenceIds.has(link.occurrenceId)));
 }catch{/* Invalidated evidence requires an explicit unlink before use. */}
 async function save(links:SettlementLink[]){
  if(!doc||busy)return;setBusy(true);setFailed(false);onChange();
  try{setDoc(await cashflowSettlements.save(owner,doc.revision,links));setExpanded(null);}
  catch{setFailed(true);}finally{setBusy(false);}
 }
 const button=(label:string,action:()=>void,disabled=false)=><Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{disabled}} onPress={action} style={{minHeight:48,padding:12,backgroundColor:c.surface}}><Text style={{color:disabled?c.muted:c.primary}}>{label}</Text></Pressable>;
 const includedSet=new Set(included),used=new Set(doc?.links.map(link=>link.transactionId));
 return <View style={{gap:10}}>
  <Text accessibilityRole="header" style={{color:c.text,fontWeight:"700"}}>{t("settlementTitle")}</Text>
  <Text style={{color:c.muted,lineHeight:22}}>{t("settlementNotice")}</Text>
  {doc&&doc.links.length>0&&button(t("settlementClear",{count:doc.links.length}),()=>void save([]),busy)}
  {failed&&<Text accessibilityRole="alert" style={{color:c.expense}}>{t("settlementSaveError")}</Text>}
  {doc&&occurrences.slice(page*20,(page+1)*20).map(row=>{
   const link=doc.links.find(value=>value.occurrenceId===row.id);
   const candidates=expanded===row.id?snapshot.entries.filter(entry=>includedSet.has(entry.id)&&accounts.includes(entry.accountId)&&entry.kind!=="transfer"&&entry.amount*(entry.kind==="expense"?-1:1)===row.amount&&!used.has(entry.id)):[];
   return <View key={row.id} style={{padding:10,gap:8,borderWidth:1,borderColor:c.border,borderRadius:10}}>
    <Text style={{color:c.text}}>{formatCalendarDate(row.day,language)} · {row.amount} {row.currency}</Text>
    {link?<>
     <Text style={{color:c.muted}}>{t(ids?.includes(row.id)?"settlementVerified":"settlementChanged")}</Text>
     {button(t("settlementOpen"),()=>router.push({pathname:"/transactions/[id]",params:{id:link.transactionId}}))}
     {button(t("settlementUnlink"),()=>void save(doc.links.filter(value=>value.occurrenceId!==row.id)),busy)}
    </>:<>
     {button(t("settlementChoose"),()=>setExpanded(expanded===row.id?null:row.id),busy)}
     {expanded===row.id&&<>
      <Text style={{color:c.muted}}>{t("settlementCandidates")}</Text>
      {candidates.length===0&&<Text style={{color:c.muted}}>{t("settlementEmpty")}</Text>}
      {candidates.slice(0,20).map((entry,index)=><View key={entry.id} style={{gap:4}}>
       {button(t("settlementInspect",{count:index+1,day:formatCalendarDate(new Date(entry.occurredAt).toISOString().slice(0,10),language)}),()=>router.push({pathname:"/transactions/[id]",params:{id:entry.id}}))}
       {button(t("settlementLink",{count:index+1}),()=>void save([...doc.links,{occurrenceId:row.id,day:row.day,amount:row.amount,currency:row.currency,transactionId:entry.id,transactionUpdatedAt:entry.updatedAt}]),busy)}
      </View>)}
     </>}
    </>}
   </View>;
  })}
  {occurrences.length>20&&<View style={{gap:8}}>
   <Text style={{color:c.muted}}>{t("settlementPage",{page:page+1,count:Math.ceil(occurrences.length/20)})}</Text>
   {button(t("settlementPrevious"),()=>{setExpanded(null);setPage(value=>value-1);},page===0)}
   {button(t("settlementNext"),()=>{setExpanded(null);setPage(value=>value+1);},(page+1)*20>=occurrences.length)}
  </View>}
  {doc&&ids===null&&<Text accessibilityRole="alert" style={{color:c.expense}}>{t("settlementChanged")}</Text>}
  {button(t("ledgerUse"),()=>{if(ids)onUse(ids);},!doc||busy||ids===null)}
 </View>;
}
