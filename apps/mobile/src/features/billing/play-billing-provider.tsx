import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { getAvailablePurchases, useIAP, type UseIAPOptions } from "expo-iap";
import { useAuth } from "@/features/auth/auth-context";
import { picketApi } from "@/core/api/client";
import { refreshOwnedPurchases } from "./refresh-purchases";
import { verifyAndFinishPurchase } from "./billing-policy";

type BillingContext=ReturnType<typeof useIAP>&{revision:number;register:(options:UseIAPOptions)=>()=>void};
const Context=createContext<BillingContext|null>(null);

/** One native Billing connection for the authenticated application tree. */
export function PlayBillingProvider({children}:{children:React.ReactNode}){
  const {session,localMode}=useAuth();
  if(Platform.OS!=="android"||!session||localMode)return children;
  return <ConnectedBilling key={session.user.id} accessToken={session.access_token}>{children}</ConnectedBilling>;
}

function ConnectedBilling({children,accessToken}:{children:React.ReactNode;accessToken:string}){
  const listeners=useRef<UseIAPOptions|null>(null);
  const register=useCallback((options:UseIAPOptions)=>{
    listeners.current=options;
    return()=>{if(listeners.current===options)listeners.current=null;};
  },[]);
  const [revision,setRevision]=useState(0);
  const active=useRef(true);
  const purchaseRequests=useRef(new AbortController());
  const api=useIAP({
    onPurchaseSuccess:purchase=>{
      if(!active.current)return;
      if(listeners.current?.onPurchaseSuccess){listeners.current.onPurchaseSuccess(purchase);return;}
      const backend=picketApi;
      if(!backend)return;
      void verifyAndFinishPurchase(purchase,request=>backend.verifyPlayPurchase(accessToken,request,purchaseRequests.current.signal),async()=>{
        if(active.current)await api.finishTransaction({purchase,isConsumable:false});
      }).then(()=>{if(active.current)setRevision(value=>value+1);}).catch(()=>undefined);
    },
    onPurchaseError:error=>listeners.current?.onPurchaseError?.(error),
    onError:error=>listeners.current?.onError?.(error),
  });
  useEffect(()=>{
    active.current=true;
    if(purchaseRequests.current.signal.aborted)purchaseRequests.current=new AbortController();
    return()=>{active.current=false;purchaseRequests.current.abort();};
  },[]);
  useEffect(()=>{
    const backend=picketApi;
    if(!api.connected||!backend)return;
    let current=true,running=false,lastSuccess=0;
    const controller=new AbortController();
    const refresh=async()=>{
      if(!current||running||Date.now()-lastSuccess<12*60*60*1000)return;
      running=true;
      try{
        const purchases=await getAvailablePurchases({includeSuspendedAndroid:false});
        if(!current)return;
        const result=await refreshOwnedPurchases(purchases,request=>backend.verifyPlayPurchase(accessToken,request,controller.signal),()=>current);
        if(current){
          if(result.failed===0)lastSuccess=Date.now();
          if(result.verified>0)setRevision(value=>value+1);
        }
      }catch{/* Retain the authoritative server state; retry on the next resume. */}
      finally{running=false;}
    };
    void refresh();
    const listener=AppState.addEventListener("change",state=>{if(state==="active")void refresh();});
    const timer=setInterval(()=>{if(AppState.currentState==="active")void refresh();},60*60*1000);
    return()=>{current=false;controller.abort();listener.remove();clearInterval(timer);};
  },[accessToken,api.connected]);
  return <Context.Provider value={{...api,revision,register}}>{children}</Context.Provider>;
}

export function usePlayBilling(options:UseIAPOptions){
  const value=useContext(Context);
  if(!value)throw new Error("Google Play Billing is unavailable");
  const {register}=value;
  useEffect(()=>register(options),[register,options]);
  return value;
}
