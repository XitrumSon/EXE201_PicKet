import { useTranslation } from "react-i18next";
import { formatMoney, localeFor, normalizeLanguage } from "@/core/i18n/formatters";
import { colors } from "@picket/design-tokens";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { routes } from "@/core/navigation/routes";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { ConnectionNotice, EmptyState, IconButton, PicketScreen, SectionTitle, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { AppIcon } from "@/core/ui/app-icon";
import { useAuth } from "@/features/auth/auth-context";
import { useBills } from "@/features/bills/bills-context";


export default function BillsScreen() {
  const { t, i18n } = useTranslation("bills");
  const { session, localMode } = useAuth();
  const { bills, error, loading, refresh } = useBills();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [renderedAt] = useState(() => Date.now());
  if (!session && !localMode) return <Redirect href={routes.login} />;
  const activeBills = bills.filter((bill) => bill.status !== "cancelled");

  return <PicketScreen>
    <TopAppBar title={t("title")} subtitle={t("subtitle")} action={<IconButton icon="plus" label={t("add")} onPress={() => router.push(routes.newBill)} />} />
    {error ? <ConnectionNotice hasData={bills.length > 0} onRetry={() => void refresh()} /> : null}
    {loading ? <ActivityIndicator accessibilityLabel={t("loading")} color={colors.mauve} /> : null}
    {!loading && activeBills.length === 0 ? <EmptyState action={t("emptyAction")} description={t("emptyDescription")} onAction={() => router.push(routes.newBill)} symbol="▤" title={t("emptyTitle")} /> : null}
    {activeBills.length > 0 ? <><SectionTitle action={t("refresh")} onAction={() => void refresh()} title={t("upcoming")} /><View style={styles.stack}>{activeBills.map((bill) => {
      const overdue = bill.status === "overdue" || (bill.status === "pending" && new Date(bill.dueAt).getTime() < renderedAt);
      return <Pressable accessibilityRole="button" key={bill.id} onPress={() => router.push(routes.bill(bill.id))}><Surface style={styles.card}><View style={[styles.icon, overdue && styles.iconOverdue]}><AppIcon name="calendar-check-outline" color={overdue ? colors.expense : colors.mauve} size={22} /></View><View style={styles.copy}><Text style={styles.name}>{bill.title}</Text><Text style={[styles.meta, overdue && styles.overdue]}>{t(overdue ? "overdue" : bill.status)} · {new Date(bill.dueAt).toLocaleDateString(localeFor(language))}</Text></View><Text style={styles.amount}>{formatMoney(bill.amount, language, "VND")}</Text></Surface></Pressable>;
    })}</View></> : null}
  </PicketScreen>;
}

const styles = StyleSheet.create({
  appBar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 52 }, back: { color: colors.mauve, fontSize: 15, fontWeight: "700" }, add: { color: colors.mauve, fontSize: 15, fontWeight: "700" }, heading: { color: colors.ink, fontSize: 29, fontWeight: "700", letterSpacing: -0.8, marginTop: 18 }, subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: 10, marginTop: 7 }, stack: { gap: 10 }, card: { alignItems: "center", flexDirection: "row", gap: 12, padding: 15 }, icon: { alignItems: "center", backgroundColor: colors.peach, borderRadius: 18, height: 42, justifyContent: "center", width: 42 }, iconOverdue: { backgroundColor: colors.dangerSurface }, iconText: { color: colors.mauve, fontSize: 20, fontWeight: "700" }, copy: { flex: 1 }, name: { color: colors.ink, fontSize: 15, fontWeight: "700" }, meta: { color: colors.muted, fontSize: 12, marginTop: 4 }, overdue: { color: colors.expense, fontWeight: "700" }, amount: { color: colors.ink, fontSize: 14, fontWeight: "700" }, error: { color: colors.expense, fontSize: 13, marginVertical: 10 },
});
