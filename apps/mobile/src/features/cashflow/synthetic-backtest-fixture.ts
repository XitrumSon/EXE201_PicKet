import type {BacktestOrigin,BacktestSplit} from "./forecast-backtest";
/** Generated synthetic records only; these are not user history or quality evidence. */
export function syntheticBacktestOrigin(options:{id?:string;startDay?:string;days?:7|30;currency?:string;split?:BacktestSplit;subjectId?:string;family?:string;cohort?:string;dailySpend?:number}={}):BacktestOrigin{
 const startDay=options.startDay??"2026-10-01",origin=Date.parse(startDay+"T00:00:00Z"),asOf=new Date(origin).toISOString(),daily=options.dailySpend??1000;
 const entries=Array.from({length:28},(_,index)=>{const at=new Date(origin-(28-index)*86400000+12*3600000).toISOString();return {id:`expense-${index}`,accountId:"cash",destinationAccountId:null,kind:"expense",amount:daily,occurredAt:at,updatedAt:at,deletedAt:null};}).filter(row=>daily>0);
 const days=options.days??7,currency=options.currency??"VND";
 return {id:options.id??"origin-one",subjectId:options.subjectId??"synthetic-subject",family:options.family??"synthetic-regular",cohort:options.cohort??"regular",split:options.split??"development",days,
  input:{startDay,currency,accounts:["cash"],pendingCount:0,completeScope:{accounts:["cash"],currency},snapshot:{asOf,wallets:[{id:"cash",name:"Synthetic cash",currencyCode:currency,openingBalance:10000+28*daily,archived:false,deletedAt:null,updatedAt:new Date(origin-29*86400000).toISOString()}],entries,confirmations:entries.map(row=>({transactionId:row.id,source:"cloud-verified",confirmedAt:asOf}))},
   completeDays:Array.from({length:28},(_,index)=>({day:new Date(origin-(28-index)*86400000).toISOString().slice(0,10),confirmedAt:asOf})),reviews:entries.map(row=>({transactionId:row.id,kind:"variable",reviewedAt:asOf}))},
  schedules:{capturedAt:asOf,rows:[]},settlements:{capturedAt:asOf,links:[]},truth:Array.from({length:days},(_,index)=>({day:new Date(origin+index*86400000).toISOString().slice(0,10),balance:10000-(index+1)*daily,currency,complete:true,observedAt:new Date(origin+(index+1)*86400000).toISOString()}))};
}
