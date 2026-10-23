import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { formatCalendarDate, formatMoney } from "@/core/i18n/formatters";
import { useAppTheme } from "@/features/settings/appearance-provider";
import type { LanguageMode, ThemeMode } from "@/features/settings/device-settings";

/** Development acceptance surface for SET-01..03; production entry follows screen migration. */
export default function SettingsPreview() {
  const { t } = useTranslation();
  const { colors: c, theme, language, settings, update, ready, error, retry, saving } = useAppTheme();
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"saved" | "failed" | null>(null);
  if (!__DEV__) return <Redirect href="/" />;
  async function select(patch: { themeMode?: ThemeMode; languageMode?: LanguageMode }) {
    setStatus(null);
    try { await update(patch); setStatus("saved"); } catch { setStatus("failed"); }
  }
  const choiceStyle = (selected: boolean) => ({ backgroundColor: selected ? c.primary : c.surface, borderColor: c.border, borderWidth: 1, borderRadius: 12, minHeight: 48, padding: 14 });
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.canvas }}>
    <StatusBar style={theme === "dark" ? "light" : "dark"} />
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 50 }}>
      <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={{ color: c.primary }}>{t("back")}</Text></Pressable>
      <Text accessibilityRole="header" style={{ color: c.text, fontSize: 26, fontWeight: "800" }}>{t("title")}</Text>
      {!ready && <ActivityIndicator accessibilityLabel={t("loading")} color={c.primary} />}
      {error && <View><Text accessibilityRole="alert" style={{ color: c.expense }}>{t("loadError")}</Text><Pressable accessibilityRole="button" onPress={retry}><Text style={{ color: c.primary }}>{t("retry")}</Text></Pressable></View>}
      <Text accessibilityRole="header" style={{ color: c.text, fontWeight: "700" }}>{t("theme")}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={t("sectionLabel", { section: t("theme") })} style={{ gap: 8 }}>
        {(["system", "light", "dark"] as const).map(mode => <Pressable key={mode} accessibilityRole="radio" accessibilityState={{ checked: (settings.themeMode ?? "system") === mode, disabled: !ready || error || saving }} disabled={!ready || error || saving} onPress={() => void select({ themeMode: mode })} style={choiceStyle((settings.themeMode ?? "system") === mode)}><Text style={{ color: (settings.themeMode ?? "system") === mode ? c.onPrimary : c.text }}>{t(mode)}</Text></Pressable>)}
      </View>
      <Text accessibilityRole="header" style={{ color: c.text, fontWeight: "700" }}>{t("language")}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={t("sectionLabel", { section: t("language") })} style={{ gap: 8 }}>
        {(["system", "vi", "en"] as const).map(mode => <Pressable key={mode} accessibilityRole="radio" accessibilityState={{ checked: (settings.languageMode ?? "system") === mode, disabled: !ready || error || saving }} disabled={!ready || error || saving} onPress={() => void select({ languageMode: mode })} style={choiceStyle((settings.languageMode ?? "system") === mode)}><Text style={{ color: (settings.languageMode ?? "system") === mode ? c.onPrimary : c.text }}>{t(mode)}</Text></Pressable>)}
      </View>
      <Text accessibilityLiveRegion="polite" style={{ color: status === "failed" ? c.expense : c.muted }}>{saving ? t("saving") : status ? t(status) : ""}</Text>
      <View style={{ backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: 16, padding: 20, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: c.text, fontSize: 20 }}>{t("preview")}</Text>
        <Text style={{ color: c.muted }}>{t("caption")}</Text>
        <Text style={{ color: c.text }}>{t("balance")}: {formatMoney(1234567, language, "VND")}</Text>
        <Text style={{ color: c.income }}>{t("income")}: {formatMoney(2000000, language, "VND")}</Text>
        <Text style={{ color: c.expense }}>{t("expense")}: {formatMoney(765433, language, "VND")}</Text>
        <Text style={{ color: c.text }}>{t("date")}: {formatCalendarDate("2026-10-23", language)}</Text>
        <Text style={{ color: c.text }}>{t("items", { count: 3 })}</Text>
        <TextInput accessibilityLabel={t("exampleName")} value={draft} onChangeText={setDraft} placeholder={t("exampleName")} placeholderTextColor={c.muted} keyboardAppearance={theme} selectionColor={c.primary} style={{ minHeight: 56, borderColor: c.border, borderWidth: 1, borderRadius: 12, padding: 14, color: c.text }} />
        <Text style={{ color: c.expense, backgroundColor: c.dangerSurface, padding: 12 }}>{t("exampleError")}</Text>
        <Text style={{ color: c.income, backgroundColor: c.successSurface, padding: 12 }}>{t("exampleSuccess")}</Text>
        <Pressable disabled accessibilityRole="button" accessibilityState={{ disabled: true }} style={{ backgroundColor: c.disabledSurface, padding: 16, borderRadius: 12 }}><Text style={{ color: c.disabledText }}>{t("disabled")}</Text></Pressable>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
