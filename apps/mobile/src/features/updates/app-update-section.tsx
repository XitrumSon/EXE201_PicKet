import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import { useAppTheme } from "@/features/settings/appearance-provider";
import { useTranslation } from "react-i18next";
import { localeFor } from "@/core/i18n/formatters";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, AppState, StyleSheet, Text, View } from "react-native";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { AppIcon } from "@/core/ui/app-icon";
import { SectionTitle, Surface } from "@/core/ui/picket-ui";
import { androidAppUpdates, getInstalledAppInfo } from "./android-app-updates";
import { createAppUpdateController, type UpdateSnapshot } from "./app-update-controller";
import { installedVersionLabel } from "./app-update-policy";

export function InstalledVersion() {
  const {language}=useAppTheme();
  const { styles } = useMobileStyles(createStyles);
  const [installed] = useState(getInstalledAppInfo);
  return <Text selectable style={styles.footer}>{installedVersionLabel(installed,language)}</Text>;
}
export function AppUpdateSection() {
  const {t}=useTranslation("updates");
  const {language}=useAppTheme();
  const { colors, styles } = useMobileStyles(createStyles);
  const [state, setState] = useState<UpdateSnapshot>({ phase: "idle", progress: 0 });
  const [controller] = useState(() => createAppUpdateController(androidAppUpdates, setState));
  useEffect(() => {
    controller.activate();
    const listener = AppState.addEventListener("change", next => { if (next === "active") controller.refreshPermission(); });
    return () => { listener.remove(); controller.dispose(); };
  }, [controller]);
  const busy = state.phase === "checking" || state.phase === "downloading" || state.phase === "opening-installer";
  const description=t(state.phase,{version:state.release?.version??"",size:new Intl.NumberFormat(localeFor(language),{minimumFractionDigits:1,maximumFractionDigits:1}).format((state.release?.bytes??0)/1_000_000)});
  const permissions = () => Alert.alert(t("permissionTitle"),t("permissionBody"), [
    { text: t("later"), style: "cancel" }, { text: t("settings"), onPress: () => void controller.openSettings() },
  ]);
  return <>
    <SectionTitle title={t("section")} />
    <Surface>
      <View style={styles.heading}><AppIcon name="cellphone-arrow-down" /><Text accessibilityRole="header" style={styles.title}>{t("title")}</Text></View>
      <Text accessibilityLiveRegion="polite" style={styles.description}>{description}</Text>
      {busy && <ActivityIndicator color={colors.mauve} accessibilityLabel={t(state.phase === "checking" ? "checkingLabel" : state.phase === "opening-installer" ? "installerLabel" : "downloadingLabel")} />}
      {state.phase === "downloading" && <View accessibilityRole="progressbar" accessibilityLabel={t("progress")} accessibilityValue={{ min: 0, max: 100, now: state.progress }}><Text style={styles.percent}>{state.progress}%</Text></View>}
      {state.phase === "available" && <Action label={t("download")} onPress={() => void controller.download()} />}
      {state.phase === "downloading" && <Action label={t("cancel")} secondary onPress={() => controller.cancel()} />}
      {state.phase === "permission" && <Action label={t("allow")} onPress={permissions} />}
      {["ready", "installer-opened"].includes(state.phase) && <Action label={t(state.phase === "ready" ? "install" : "reopen")} onPress={() => void controller.install()} />}
      {state.phase === "play-store" && <Action label={t("store")} onPress={() => void controller.openStore()} />}
      <Action label={t(state.phase === "idle" ? "check" : "recheck")} secondary disabled={busy} onPress={() => void controller.check()} />
    </Surface>
  </>;
}
function Action({ label, onPress, secondary = false, disabled = false }: { label: string; onPress(): void; secondary?: boolean; disabled?: boolean }) {
  const { styles } = useMobileStyles(createStyles);
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text></Pressable>;
}
const createStyles = (colors: MobileThemeColors) => StyleSheet.create({
  heading: { flexDirection: "row", alignItems: "center", gap: 10 }, title: { flex: 1, color: colors.ink, fontSize: 17, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22, marginVertical: 12 }, percent: { textAlign: "center", color: colors.mauve, fontSize: 14, marginBottom: 8 },
  button: { backgroundColor: colors.mauve, borderRadius: 28, paddingHorizontal: 18, paddingVertical: 14, minHeight: 52, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonText: { color: colors.onPrimary, fontSize: 15, fontWeight: "700", textAlign: "center" }, secondary: { backgroundColor: colors.cream }, secondaryText: { color: colors.mauve }, disabled: { opacity: 0.5 },
  footer: { color: colors.muted, fontSize: 13, textAlign: "center", paddingVertical: 20, paddingHorizontal: 16 },
});
