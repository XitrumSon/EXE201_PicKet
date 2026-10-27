import { paperControl , paperShape } from "@/core/theme/paper-foundations";
import { PicketText as Text } from "@/core/ui/picket-text";
import { useTranslation } from "react-i18next";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { withLocalOwnerAccess } from "@/core/sync/offline-cache";
import { ownerPreferenceKeys } from "@/core/storage/owner-preferences";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Platform, StyleSheet, View } from "react-native";
import { biometricOptions, type BiometricCopy } from "./biometric-options";

import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { useAuth } from "@/features/auth/auth-context";

type LockContextValue = {
  enabled: boolean;
  busy: boolean;
  setEnabled(value: boolean): Promise<boolean>;
  refresh(): Promise<void>;
};
const LockContext = createContext<LockContextValue | null>(null);
const keyFor = (userId: string) => ownerPreferenceKeys(userId).deviceLock;
const LOCK_AFTER_BACKGROUND_MS = 30_000;

async function authenticate(copy?:BiometricCopy): Promise<boolean> {
  const level = await LocalAuthentication.getEnrolledLevelAsync();
  if (level === LocalAuthentication.SecurityLevel.NONE) return false;
  const result = await LocalAuthentication.authenticateAsync(biometricOptions(Number(Platform.Version),copy));
  return result.success;
}

export function DeviceLockProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  return <DeviceLockSession key={session?.user.id ?? "anonymous"}>{children}</DeviceLockSession>;
}

function DeviceLockSession({ children }: PropsWithChildren) {
  const { t } = useTranslation("security");
  const authenticateForLocale=useCallback(()=>authenticate({promptMessage:t("unlock"),promptDescription:t("description"),cancelLabel:t("cancel")}),[t]);
  const { styles } = useMobileStyles(createStyles);
  const { session } = useAuth();
  const userId = session?.user.id;
  const [enabled, setEnabledState] = useState(false);
  const [locked, setLocked] = useState(Boolean(session));
  const [busy, setBusy] = useState(Boolean(session));
  const [message, setMessage] = useState<string | null>(null);
  const backgroundAt = useRef<number | null>(null);
  const refreshPreference=useCallback(async()=>{
    if(!userId)return;
    try {
      const stored=await SecureStore.getItemAsync(keyFor(userId));
      setEnabledState(stored==="enabled");
      if(stored!=="enabled")setLocked(false);
      setMessage(null);
    } catch(error) {
      setEnabledState(true);setLocked(true);setMessage("lockReadError");throw error;
    }
  },[userId]);
  useEffect(() => {
    let active = true;
    if (!userId) return;
    void Promise.resolve().then(()=>SecureStore.getItemAsync(keyFor(userId))).then((value) => {
      if (!active) return;
      setEnabledState(value === "enabled");
      setLocked(value === "enabled");
    }).catch(() => {
      if (active) { setEnabledState(true); setLocked(true); setMessage("lockReadError"); }
    }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [userId]);
  useEffect(() => {
    if (!enabled || !userId) return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background") backgroundAt.current = Date.now();
      if (state === "active" && backgroundAt.current !== null) {
        if (Date.now() - backgroundAt.current >= LOCK_AFTER_BACKGROUND_MS) setLocked(true);
        backgroundAt.current = null;
      }
    });
    return () => subscription.remove();
  }, [enabled, userId]);
  const unlock = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (await authenticateForLocale()) setLocked(false);
      else setMessage("authFailed");
    } catch { setMessage("authUnavailable"); }
    finally { setBusy(false); }
  }, [authenticateForLocale]);
  const value = useMemo<LockContextValue>(() => ({ enabled, busy, refresh:refreshPreference,
    async setEnabled(next) {
      if (!session) return false;
      setBusy(true);
      try {
        if (!(await authenticateForLocale())) return false;
        await withLocalOwnerAccess(session.user.id,async()=>{
          if (next) await SecureStore.setItemAsync(keyFor(session.user.id), "enabled");
          else await SecureStore.deleteItemAsync(keyFor(session.user.id));
        });
        setEnabledState(next);
        setLocked(false);
        return true;
      } catch { return false; }
      finally { setBusy(false); }
    },
  }), [enabled, busy, session, refreshPreference, authenticateForLocale]);
  return <LockContext.Provider value={value}>
    <View style={{ flex: 1, display: locked ? "none" : "flex" }} importantForAccessibility={locked ? "no-hide-descendants" : "auto"}>{children}</View>
    {session && locked && <View style={styles.root}>
      <Text accessibilityRole="header" style={styles.heading}>{t("locked")}</Text>
      <Text style={styles.copy}>{t("lockedBody")}</Text>
      {message && <Text accessibilityLiveRegion="polite" style={styles.error}>{t(message)}</Text>}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => void unlock()} style={styles.button}><Text style={styles.buttonText}>{busy ? t("authenticating") : t("unlock")}</Text></Pressable>
    </View>}
  </LockContext.Provider>;
}

export function useDeviceLock() {
  const value = useContext(LockContext);
  if (!value) throw new Error("useDeviceLock must be used inside DeviceLockProvider.");
  return value;
}

const createStyles = (colors: MobileThemeColors) => StyleSheet.create({ root:{alignItems:"center",backgroundColor:colors.cream,flex:1,justifyContent:"center",padding:28},heading:{color:colors.ink,fontSize:28,fontWeight:"800"},copy:{color:colors.muted,fontSize:15,lineHeight:22,marginTop:12,textAlign:"center"},error:{color:colors.danger,fontSize:13,marginTop:16,textAlign:"center"},button:{alignItems:"center",backgroundColor:colors.mauve,borderRadius:paperShape.button,justifyContent:"center",marginTop:28,minHeight:paperControl.height,minWidth:180},buttonText:{color:colors.onPrimary,fontWeight:"700"} });
