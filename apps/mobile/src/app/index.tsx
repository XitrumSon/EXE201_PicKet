import { useTranslation } from "react-i18next";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { formatMoney, localeFor } from "@/core/i18n/formatters";
import { useAppTheme } from "@/features/settings/appearance-provider";
import { summarizeCurrencies, transactionMonthAt } from "@/features/cashflow/currency-summary";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { routes } from "@/core/navigation/routes";
import { BrandLogo } from "@/core/ui/brand-logo";
import { HomeReceiptCalendar } from "@/core/ui/home-receipt-calendar";
import { AppIcon } from "@/core/ui/app-icon";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { ConnectionNotice, EmptyState, FloatingAction, IconButton, MenuRow, PicketScreen, SectionTitle, Surface } from "@/core/ui/picket-ui";
import { useAccounts } from "@/features/accounts/accounts-context";
import { useAuth } from "@/features/auth/auth-context";
import { useProfile } from "@/features/profile/profile-context";
import { PartnerNotice } from "@/features/partners/partner-notice";
import { useSync } from "@/features/sync/sync-context";
import { useTransactions } from "@/features/transactions/transactions-context";

export default function HomeScreen() {
  const { receiptMonth } = useLocalSearchParams<{ receiptMonth?: string }>();
  const initialMonth = typeof receiptMonth === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(receiptMonth) ? receiptMonth : undefined;
  return <HomeContent key={initialMonth ?? "current"} initialMonth={initialMonth} />;
}

function HomeContent({ initialMonth }: { initialMonth?: string }) {
  const { colors, styles } = useMobileStyles(createStyles);
  const { language } = useAppTheme();
  const { t } = useTranslation("overview");
  const { configured, loading: authLoading, localMode, session } = useAuth();
  const { error: profileError, loading: profileLoading, profile, refresh, updatePreferences } = useProfile();
  const { accounts, error: accountsError, loading: accountsLoading, refresh: refreshAccounts } = useAccounts();
  const { error: transactionsError, refresh: refreshTransactions, transactions } = useTransactions();
  const { conflictCount, flush, pendingCount, syncing } = useSync();
  const [month, setMonth] = useState(() => initialMonth ? new Date(Number(initialMonth.slice(0, 4)), Number(initialMonth.slice(5)) - 1, 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const selectedMonth = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,"0")}`;
  const monthly = transactions.filter((item) => { try { return !item.deletedAt && transactionMonthAt(item.occurredAt,profile?.timezone ?? "Asia/Ho_Chi_Minh")===selectedMonth; } catch { return false; } });
  const visible = [...monthly].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  let summary: ReturnType<typeof summarizeCurrencies> | null = null;
  try { summary = summarizeCurrencies(accounts,transactions,selectedMonth,profile?.timezone ?? "Asia/Ho_Chi_Minh"); } catch { /* Show unavailable instead of a misleading total. */ }
  const totals = summary?.totals.length ? summary.totals : summary ? [{currency:profile?.currencyCode ?? "VND",balance:0,income:0,expense:0}] : [];
  const money = (value: number, currency?: string) => profile?.hideBalance ? "••••••" : currency ? formatMoney(value,language,currency) : "—";
  const totalText = (field:"balance"|"income"|"expense") => totals.map(row=>money(row[field],row.currency)).join("\n") || "—";
  if (authLoading || ((session || localMode) && !profile && (profileLoading || accountsLoading))) return <View style={styles.loading}><ActivityIndicator accessibilityLabel={t("loading")} color={colors.mauve} /></View>;
  if ((!configured || !session) && !localMode) return <Redirect href={routes.login} />;
  if (!profileError && !profile?.onboardingCompleted) return <Redirect href={routes.onboarding} />;
  return <View style={styles.root}><PicketScreen>
    <View style={styles.header}><BrandLogo size={48} /><View style={{ flex: 1 }}><Text style={styles.greeting}>{t("greeting",{name:profile?.displayName || t("friend")})}</Text><Text accessibilityRole="header" style={styles.heading}>{t("title")}</Text></View><IconButton icon="bell-outline" label={t("notifications")} onPress={() => router.push(routes.notifications)} /><Pressable accessibilityLabel={t("profile")} onPress={() => router.push(routes.profile)} style={styles.avatar}><Text style={styles.avatarText}>{(profile?.displayName || "P").slice(0, 1).toUpperCase()}</Text></Pressable></View>
    <Surface peach style={styles.balanceCard}><View style={styles.between}><Text style={styles.balanceLabel}>{t("balance")}</Text><IconButton icon={profile?.hideBalance ? "eye-off-outline" : "eye-outline"} label={profile?.hideBalance ? t("showBalance") : t("hideBalance")} onPress={() => void updatePreferences({ hide_balance: !profile?.hideBalance })} /></View><Text adjustsFontSizeToFit numberOfLines={Math.max(1,totals.length)} style={styles.balance}>{totalText("balance")}</Text><Pressable onPress={() => router.navigate(routes.accounts)} style={styles.walletLink}><AppIcon name="wallet-outline" size={18} color={colors.ink} /><Text style={styles.walletLinkText}>{t("walletCount",{count:accounts.length})}</Text><AppIcon name="chevron-right" size={18} color={colors.ink} /></Pressable></Surface>
    <View style={styles.period}><IconButton icon="chevron-left" label={t("previous")} onPress={() => setMonth((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))} /><Text style={styles.periodText}>{t("month",{month:month.getMonth()+1,year:month.getFullYear()})}</Text><IconButton icon="chevron-right" label={t("next")} onPress={() => setMonth((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))} /></View>
    <View style={styles.summary}><Surface style={styles.summaryCard}><AppIcon name="arrow-bottom-left" size={22} color={colors.income} /><Text style={styles.meta}>{t("income")}</Text><Text adjustsFontSizeToFit numberOfLines={Math.max(1,totals.length)} style={[styles.summaryAmount, { color: colors.income }]}>{totalText("income")}</Text></Surface><Surface style={styles.summaryCard}><AppIcon name="arrow-top-right" size={22} color={colors.expense} /><Text style={styles.meta}>{t("expense")}</Text><Text adjustsFontSizeToFit numberOfLines={Math.max(1,totals.length)} style={[styles.summaryAmount, { color: colors.expense }]}>{totalText("expense")}</Text></Surface></View>
    {(!summary || summary.unscopedTransactionIds.length>0) && <Text accessibilityRole="alert" style={{color:colors.expense}}>{t("summaryError")}</Text>}
    <View style={styles.quickActions}><Pressable accessibilityLabel={t("addTransaction")} onPress={() => router.push(routes.newTransaction)} style={[styles.primary, { flex: 0, width: 56, height: 56 }]}><AppIcon name="plus" color={colors.onPrimary} size={22} /></Pressable></View>
    {(profileError || accountsError || transactionsError) && <ConnectionNotice hasData={Boolean(profile || accounts.length || transactions.length)} onRetry={() => void Promise.all([refresh(), refreshAccounts(), refreshTransactions()])} />}
    {(localMode || pendingCount > 0) && <Pressable onPress={() => { if (!localMode) void flush(); }} accessibilityState={{ busy: syncing }} style={styles.status}><AppIcon name={syncing ? "sync" : localMode ? "cellphone-check" : "cloud-sync-outline"} size={17} color={colors.muted} /><Text style={styles.statusText}>{localMode ? t("local") : syncing ? t("syncing") : t("pending",{count:pendingCount})}</Text></Pressable>}
    {conflictCount > 0 && <MenuRow icon="alert-circle-outline" title={t("conflicts",{count:conflictCount})} onPress={() => router.push(routes.syncConflicts)} />}
    <HomeReceiptCalendar month={`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`} transactions={transactions} />
    <SectionTitle title={t("recent")} action={t("viewAll")} onAction={() => router.push(routes.transactions)} />
    {visible.length === 0 ? <EmptyState action={t("addTransaction")} description={t("emptyBody")} onAction={() => router.push(routes.newTransaction)} title={t("emptyTitle")} /> : <Surface style={styles.list}>{visible.slice(0, 5).map((item, index) => <Pressable key={item.id} onPress={() => router.push(routes.transaction(item.id))} style={[styles.row, index > 0 && styles.divider]}><View style={styles.transactionIcon}><AppIcon name={item.kind === "transfer" ? "swap-horizontal" : item.kind === "expense" ? "arrow-top-right" : "arrow-bottom-left"} size={22} color={item.kind === "expense" ? colors.expense : item.kind === "transfer" ? colors.mauve : colors.income} /></View><View style={styles.copy}><Text numberOfLines={2} style={styles.rowTitle}>{item.title}</Text><Text style={styles.meta}>{new Date(item.occurredAt).toLocaleDateString(localeFor(language),{timeZone:profile?.timezone ?? "Asia/Ho_Chi_Minh"})}</Text></View><Text style={[styles.rowAmount, { color: item.kind === "expense" ? colors.expense : item.kind === "transfer" ? colors.mauve : colors.income }]}>{money(item.amount,accounts.find(account=>account.id===item.accountId)?.currencyCode)}</Text></Pressable>)}</Surface>}
    <SectionTitle title={t("tracking")} /><Surface style={styles.tools}><MenuRow icon="repeat" title={t("recurring")} description={t("recurringBody")} onPress={() => router.push(routes.subscriptions)} /><MenuRow icon="chart-donut" title={t("budgets")} description={t("budgetBody")} onPress={() => router.push(routes.budgets)} /><MenuRow icon="calendar-check-outline" title={t("bills")} onPress={() => router.push(routes.bills)} /><MenuRow icon="chart-box-outline" title={t("insights")} onPress={() => router.push(routes.insights)} /></Surface>
    {!localMode && <PartnerNotice />}
  </PicketScreen><FloatingAction label={t("scan")} icon="line-scan" onPress={() => router.push(routes.capture)} /></View>;
}

const createStyles = (colors: MobileThemeColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream }, loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.cream },
  header: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 16, marginBottom: 8 }, greeting: { color: colors.muted, fontSize: 14, lineHeight: 22 }, heading: { color: colors.ink, fontSize: 25, lineHeight: 34, fontWeight: "700", letterSpacing: -0.6 },
  avatar: { alignItems: "center", justifyContent: "center", backgroundColor: colors.peach, borderRadius: 24 }, avatarText: { fontSize: 20, fontWeight: "700", color: colors.ink },
  balanceCard: { padding: 24 }, between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, balanceLabel: { fontSize: 15, color: colors.ink }, balance: { fontSize: 38, lineHeight: 48, fontWeight: "700", fontVariant: ["tabular-nums"], letterSpacing: -1, color: colors.ink }, walletLink: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 8, marginTop: 8 }, walletLinkText: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  period: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8 }, periodText: { color: colors.ink, fontSize: 14, fontWeight: "600", paddingHorizontal: 12 }, summary: { flexDirection: "row", gap: 12 }, summaryCard: { flex: 1, gap: 6, padding: 16 }, meta: { color: colors.muted, fontSize: 12, lineHeight: 18 }, summaryAmount: { fontSize: 20, lineHeight: 28, fontWeight: "700", fontVariant: ["tabular-nums"] },
  quickActions: { flexDirection: "row", gap: 12, marginTop: 16, marginBottom: 8 }, primary: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", backgroundColor: colors.mauve, paddingVertical: 14, borderRadius: 28 }, primaryText: { color: colors.onPrimary, fontSize: 14, fontWeight: "700" }, secondary: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", borderColor: colors.mauve, borderWidth: 1, borderRadius: 28 }, secondaryText: { color: colors.mauve, fontSize: 14, fontWeight: "700" },
  status: { flexDirection: "row", alignItems: "center", gap: 8 }, statusText: { color: colors.muted, fontSize: 12, flex: 1 }, list: { padding: 8 }, row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 76, padding: 8 }, divider: { borderTopWidth: 1, borderTopColor: colors.line }, transactionIcon: { backgroundColor: colors.cream, width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center" }, copy: { flex: 1, gap: 4 }, rowTitle: { color: colors.ink, fontSize: 14, fontWeight: "600", lineHeight: 20 }, rowAmount: { fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"], maxWidth: "40%" }, tools: { paddingVertical: 4 },
});
