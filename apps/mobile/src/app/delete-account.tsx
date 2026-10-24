import { useTranslation } from "react-i18next";
import { resumeOfflineCacheOwner } from "@/core/sync/offline-cache";
import { deleteAccountWithLocalRetirement } from "@/features/auth/account-delete-flow";
import { retireAccountLocalData } from "@/features/auth/account-local-retirement";
import { colors, radii } from "@picket/design-tokens";
import { Redirect, router } from "expo-router";
import { useState,useEffect,useRef } from "react";
import { PicketTextInput as TextInput } from "@/core/ui/picket-text-input";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { picketApi } from "@/core/api/client";
import { routes } from "@/core/navigation/routes";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { useAuth } from "@/features/auth/auth-context";

export default function DeleteAccountScreen() {
  const { session, signOut } = useAuth();
  const {t}=useTranslation("accountDeletion");
  const [remoteDeleted,setRemoteDeleted]=useState(false);
  const submitting=useRef(false),mounted=useRef(true),currentOwner=useRef(session?.user.id);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  useEffect(()=>{currentOwner.current=session?.user.id;return()=>{currentOwner.current=undefined;};},[session?.user.id]);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!session&&!remoteDeleted) return <Redirect href={routes.login} />;

  async function remove() {
    if(submitting.current)return;
    if(!remoteDeleted&&confirmation!=="DELETE"){setMessage("confirmError");return;}
    if(!remoteDeleted&&(!session||!picketApi)){setMessage("unavailable");return;}
    submitting.current=true;setBusy(true);setMessage(null);
    try{
      if(remoteDeleted){await signOut();if(mounted.current)router.replace(routes.login);return;}
      const request=session!;const owner=request.user.id;
      const result=await deleteAccountWithLocalRetirement({
        retireLocal:()=>retireAccountLocalData(owner),resumeLocal:()=>resumeOfflineCacheOwner(owner),
        deleteRemote:async()=>{const result=await picketApi!.deleteAccount(request.access_token);if(result?.deleted!==true)throw new Error("Unconfirmed account deletion");},signOut,
        isCurrent:()=>mounted.current&&currentOwner.current===owner,
      });
      if(!mounted.current||(currentOwner.current&&currentOwner.current!==owner))return;
      if(result.status==="deleted"){
        setRemoteDeleted(true);if(result.signedOut)router.replace(routes.login);else setMessage("deletedSignOut");
      }else setMessage(result.status==="local-cleanup-failed"?"cleanupFailed":result.status==="remote-unconfirmed"?"remoteUnconfirmed":"sessionChanged");
    }catch{if(mounted.current)setMessage(remoteDeleted?"deletedSignOut":"remoteUnconfirmed");}
    finally{submitting.current=false;if(mounted.current)setBusy(false);}
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Pressable accessibilityRole="button" disabled={busy} accessibilityState={{disabled:busy}} onPress={() => router.back()}><Text style={styles.back}>{t("back")}</Text></Pressable>
        <Text accessibilityRole="header" style={styles.title}>{t("title")}</Text>
        <Text style={styles.description}>{t("description")}</Text>
        <Text style={styles.description}>{t("localNotice")}</Text>
        <Text style={styles.label}>{t("confirmation")}</Text>
        <TextInput accessibilityLabel={t("confirmationLabel")} editable={!busy&&!remoteDeleted} autoCapitalize="characters" autoComplete="off" onChangeText={setConfirmation} style={styles.input} value={confirmation} />
        {message && <Text accessibilityLiveRegion="polite" style={styles.error}>{t(message)}</Text>}
        <Pressable accessibilityRole="button" disabled={busy || (!remoteDeleted&&confirmation !== "DELETE")} onPress={() => void remove()} style={[styles.deleteButton, !remoteDeleted&&confirmation !== "DELETE" && styles.disabled]}>{busy ? <ActivityIndicator accessibilityLabel={t(remoteDeleted?"signingOut":"deleting")} color={colors.white} /> : <Text style={styles.deleteText}>{t(remoteDeleted?"finishSignOut":"remove")}</Text>}</Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.cream, flex: 1 }, content: { flex: 1, gap: 18, justifyContent: "center", padding: 26 }, back: { color: colors.mauve, fontSize: 15, fontWeight: "700" }, title: { color: colors.ink, fontSize: 34, fontWeight: "700" }, description: { color: colors.muted, fontSize: 15, lineHeight: 24 }, label: { color: colors.ink, fontSize: 14, fontWeight: "700" }, input: { backgroundColor: colors.white, borderColor: colors.expense, borderRadius: radii.small, borderWidth: 1, color: colors.ink, fontSize: 17, minHeight: 54, paddingHorizontal: 16 }, error: { color: colors.expense, fontSize: 14, lineHeight: 20 }, deleteButton: { alignItems: "center", backgroundColor: colors.expense, borderRadius: radii.small, justifyContent: "center", minHeight: 54 }, disabled: { opacity: 0.45 }, deleteText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
