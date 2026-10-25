import { useTranslation } from "react-i18next";
import { parseBillForm, initialBillDueDate } from "@/features/bills/bill-form";
import { TopAppBar , FieldLabel, PicketScreen, PrimaryAction, Surface } from "@/core/ui/picket-ui";
import { colors, radii } from "@picket/design-tokens";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { PicketTextInput as TextInput } from "@/core/ui/picket-text-input";
import { StyleSheet, Text, View } from "react-native";

import { routes } from "@/core/navigation/routes";
import { isOfflineQueuedError } from "@/core/sync/offline-queued-error";
import { useAuth } from "@/features/auth/auth-context";
import { useBills } from "@/features/bills/bills-context";


export default function NewBillScreen() {
  const { t } = useTranslation("bills");
  const { session, localMode } = useAuth();
  const { create } = useBills();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(initialBillDueDate);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  if (!session && !localMode) return <Redirect href={routes.login} />;

  async function submit() {
    const parsed = parseBillForm({ title, amount, dueDate });
    if ("error" in parsed) return setMessage(parsed.error);
    setBusy(true); setMessage(null);
    try { await create(parsed.value); router.replace(routes.bills); }
    catch (caught) { if (isOfflineQueuedError(caught)) { router.replace(routes.bills); return; } setMessage("createFailed"); }
    finally { setBusy(false); }
  }

  return <PicketScreen>
    <TopAppBar title={t("add")} subtitle={t("createSubtitle")} backDisabled={busy} />
    <Surface peach style={styles.tip}><Text style={styles.tipSymbol}>◷</Text><Text style={styles.tipText}>{t("tip")}</Text></Surface>
    <Surface style={styles.form}>
      <FieldLabel>{t("name")}</FieldLabel><TextInput accessibilityLabel={t("name")} maxLength={160} onChangeText={setTitle} placeholder={t("namePlaceholder")} placeholderTextColor={colors.muted} style={styles.input} value={title} />
      <FieldLabel>{t("amount")}</FieldLabel><View style={styles.amountBox}><TextInput money accessibilityLabel={t("amountLabel")} keyboardType="number-pad" onChangeText={setAmount} placeholder="0" placeholderTextColor={colors.muted} style={styles.amountInput} value={amount} /><Text style={styles.currency}>VND</Text></View>
      <FieldLabel>{t("dueDate")}</FieldLabel><TextInput date accessibilityLabel={t("dueDate")} onChangeText={setDueDate} style={styles.input} value={dueDate} />
      {message ? <Text accessibilityLiveRegion="polite" role="alert" style={styles.error}>{t(message)}</Text> : null}
      <PrimaryAction busy={busy} label={t("create")} onPress={() => void submit()} />
    </Surface>
  </PicketScreen>;
}

const styles = StyleSheet.create({
  appBar: { justifyContent: "center", minHeight: 52 }, back: { color: colors.mauve, fontSize: 15, fontWeight: "700" }, heading: { color: colors.ink, fontSize: 29, fontWeight: "700", letterSpacing: -0.8, marginTop: 18 }, subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: 18, marginTop: 7 }, tip: { alignItems: "center", flexDirection: "row", gap: 12, padding: 15 }, tipSymbol: { color: colors.mauve, fontSize: 25 }, tipText: { color: colors.ink, flex: 1, fontSize: 13, lineHeight: 19 }, form: { marginTop: 14 }, input: { backgroundColor: colors.white, borderColor: colors.peach, borderRadius: radii.medium, borderWidth: 1, color: colors.ink, fontSize: 16, minHeight: 54, paddingHorizontal: 16 }, amountBox: { alignItems: "center", borderColor: colors.peach, borderRadius: radii.medium, borderWidth: 1, flexDirection: "row", minHeight: 58, paddingHorizontal: 16 }, amountInput: { color: colors.ink, flex: 1, fontSize: 24, fontWeight: "700", minHeight: 54 }, currency: { color: colors.mauve, fontSize: 14, fontWeight: "700" }, error: { color: colors.expense, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 14 },
});
