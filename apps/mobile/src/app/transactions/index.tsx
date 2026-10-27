import { paperControl , paperShape } from "@/core/theme/paper-foundations";
import { PicketScrollView as ScrollView } from "@/core/ui/picket-scroll-view";
import { PicketText as Text } from "@/core/ui/picket-text";

import { useTranslation } from "react-i18next";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { formatMoney, localeFor } from "@/core/i18n/formatters";
import { useAppTheme } from "@/features/settings/appearance-provider";
import { useProfile } from "@/features/profile/profile-context";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PicketTextInput as TextInput } from "@/core/ui/picket-text-input";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { routes } from "@/core/navigation/routes";
import { filterTransactions } from "@/core/sync/filter-transactions";
import { AppIcon } from "@/core/ui/app-icon";
import { MonthCalendar } from "@/core/ui/month-calendar";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { ChoiceChip, ConnectionNotice, EmptyState, FloatingAction, IconButton, MenuRow, PicketScreen, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { useAccounts } from "@/features/accounts/accounts-context";
import { useAuth } from "@/features/auth/auth-context";
import { useSync } from "@/features/sync/sync-context";
import { useTransactions } from "@/features/transactions/transactions-context";

type TransactionRouteParams = { accountId?: string; categoryId?: string; month?: string; day?: string; kind?: string; currency?: string };
export default function TransactionsScreen() {
  const params = useLocalSearchParams<TransactionRouteParams>();
  return <TransactionsContent key={JSON.stringify(params)} params={params} />;
}
function TransactionsContent({ params }: { params: TransactionRouteParams }) {
  const { colors, styles } = useMobileStyles(createStyles);
  const { language } = useAppTheme();
  const { t } = useTranslation("transactions");
  const { profile } = useProfile();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState(params.kind ?? "");
  const [day, setDay] = useState(params.day ?? "");
  const [currencyFilter, setCurrencyFilter] = useState(params.currency ?? "");
  const { t: homeCopy } = useTranslation("overview");
  const [accountId, setAccountId] = useState(params.accountId ?? "");
  const [categoryId, setCategoryId] = useState(params.categoryId ?? "");
  const [month, setMonth] = useState(params.month ?? "");
  const [showFilters, setShowFilters] = useState(Boolean(params.categoryId || params.accountId));
  const [showTools, setShowTools] = useState(false);
  const [showSearch, setShowSearch] = useState(Boolean(params.categoryId || params.accountId || params.month || params.day || params.kind || params.currency));
  const [calendar, setCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { session, localMode } = useAuth();
  const { accounts } = useAccounts();
  const { categories, error, loading, refresh, transactions } = useTransactions();
  const { flush, lastSyncedAt, pendingCount, syncing } = useSync();
  useEffect(() => { if (lastSyncedAt !== null) void refresh(); }, [lastSyncedAt, refresh]);
  if (!session && !localMode) return <Redirect href={routes.login} />;
  const accountNames = new Map(accounts.map((item) => [item.id, item.name]));
  const categoryNames = new Map(categories.map((item) => [item.id, item.name]));
  const filtered = filterTransactions(transactions, { query, kind, accountId, categoryId, month, day, currency: currencyFilter, timeZone:profile?.timezone ?? "Asia/Ho_Chi_Minh" }, Object.fromEntries(categoryNames), Object.fromEntries(accounts.map(account => [account.id, account.currencyCode])));
  const visible = calendar && month && selectedDay ? filtered.filter((item) => new Date(item.occurredAt).getDate() === selectedDay) : filtered;
  const changeMonth = (offset: number) => { setDay(""); const value = /^\d{4}-\d{2}$/.test(month) ? new Date(`${month}-01T12:00:00`) : new Date(); value.setMonth(value.getMonth() + offset); setMonth(`${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`); setSelectedDay(null); };
  return <View style={styles.root}><PicketScreen>
    <TopAppBar title={t("Giao dịch")} back={false} action={<View style={{ flexDirection: "row" }}><IconButton icon="magnify" expanded={showSearch} label={showSearch ? t("Ẩn tìm kiếm và bộ lọc") : t("Hiện tìm kiếm và bộ lọc")} onPress={() => setShowSearch(value => !value)} /><IconButton icon="dots-horizontal" expanded={showTools} label={t("Công cụ giao dịch")} onPress={() => setShowTools(!showTools)} /></View>} />
    {(day || currencyFilter) && <View style={styles.filters}>{day && <Pressable accessibilityLabel={homeCopy("filterClearDay")} onPress={() => setDay("")}><Text style={styles.periodText}>{homeCopy("filterDay", { day })} ×</Text></Pressable>}{currencyFilter && <Pressable accessibilityLabel={currencyFilter} onPress={() => setCurrencyFilter("")}><Text style={styles.periodText}>{currencyFilter} ×</Text></Pressable>}</View>}
    {showTools && <Surface style={styles.tools}><MenuRow icon="calendar-month-outline" title={homeCopy("receiptCalendarTitle")} onPress={() => router.push(routes.receiptCalendar)} /><MenuRow icon="inbox-arrow-down-outline" title={t("Giao dịch cần kiểm tra")} onPress={() => router.push(routes.reviewInbox)} /><MenuRow icon="checkbox-multiple-outline" title={t("Chỉnh sửa nhiều giao dịch")} onPress={() => router.push(routes.bulkTransactions)} /><MenuRow icon="scale-balance" title={t("Đối soát ví")} onPress={() => router.push(routes.reconcile)} /></Surface>}
    {showSearch && <>
    <View style={styles.searchRow}><View style={styles.searchBox}><AppIcon name="magnify" color={colors.muted} /><TextInput accessibilityLabel={t("Tìm giao dịch, danh mục hoặc ghi chú")} onChangeText={setQuery} placeholder={t("Tìm giao dịch")} placeholderTextColor={colors.muted} style={styles.search} value={query} />{query.length > 0 && <IconButton icon="close" label={t("Xóa tìm kiếm")} onPress={() => setQuery("")} />}</View><IconButton icon={showFilters ? "filter-check-outline" : "filter-variant"} label={showFilters ? t("Ẩn bộ lọc") : t("Mở bộ lọc")} onPress={() => setShowFilters(!showFilters)} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{[["", "Tất cả"], ["expense", "Chi tiêu"], ["income", "Thu nhập"], ["transfer", "Chuyển ví"], ["refund", "Hoàn tiền"]].map(([value, label]) => <ChoiceChip checked={kind === value} key={value} label={t(label)} onPress={() => setKind(value)} />)}</ScrollView>
    <View style={styles.period}><IconButton icon="chevron-left" label={t("Tháng trước")} onPress={() => changeMonth(-1)} /><Pressable onPress={() => { if (month) { setMonth(""); setDay(""); } else changeMonth(0); }} style={styles.periodButton}><AppIcon name="calendar-month-outline" size={18} /><Text style={styles.periodText}>{month ? t("monthLabel",{month:month.slice(5),year:month.slice(0,4)}) : t("Tất cả thời gian")}</Text><AppIcon name="chevron-down" size={18} /></Pressable><IconButton icon="chevron-right" label={t("Tháng sau")} onPress={() => changeMonth(1)} /></View>
    {showFilters && <Surface style={styles.filterPanel}><Text style={styles.filterLabel}>{t("Ví")}</Text><View style={styles.filters}><ChoiceChip checked={!accountId} label={t("Mọi ví")} onPress={() => setAccountId("")} />{accounts.map((item) => <ChoiceChip checked={accountId === item.id} key={item.id} label={item.name} onPress={() => setAccountId(item.id)} />)}</View><Text style={styles.filterLabel}>{t("Danh mục")}</Text><View style={styles.filters}><ChoiceChip checked={!categoryId} label={t("Mọi danh mục")} onPress={() => setCategoryId("")} />{categories.map((item) => <ChoiceChip checked={categoryId === item.id} key={item.id} label={item.name} onPress={() => setCategoryId(item.id)} />)}</View><Text style={styles.filterLabel}>{t("Tháng cụ thể")}</Text><TextInput accessibilityLabel={t("Lọc tháng YYYY-MM")} onChangeText={value => { setMonth(value); setDay(""); }} placeholder={t("YYYY-MM hoặc để trống")} placeholderTextColor={colors.muted} style={styles.monthInput} value={month} /><Pressable onPress={() => { setDay(""); setCurrencyFilter(""); setKind(""); setAccountId(""); setCategoryId(""); setMonth(""); setQuery(""); }}><Text style={styles.reset}>{t("Đặt lại bộ lọc")}</Text></Pressable></Surface>}
    </>}
    {pendingCount > 0 && <Pressable accessibilityState={{ busy: syncing }} onPress={() => void flush()} style={styles.sync}><AppIcon name="cloud-sync-outline" size={18} /><Text style={styles.hint}>{syncing ? t("Đang đồng bộ…") : t("pendingChanges",{count:pendingCount})}</Text></Pressable>}
    {error && <ConnectionNotice hasData={transactions.length > 0} onRetry={() => void refresh()} />}
    <View style={styles.listHeader}><Text style={styles.filterLabel}>{t("transactionCount",{count:visible.length})}</Text><View style={{ flexDirection: "row" }}><IconButton icon={calendar ? "format-list-bulleted" : "calendar-month-outline"} label={calendar ? t("Xem danh sách") : t("Xem lịch tháng")} onPress={() => { if (!month) changeMonth(0); setCalendar(!calendar); setSelectedDay(null); }} /><IconButton icon="line-scan" label={t("Quét hóa đơn")} onPress={() => router.push(routes.capture)} /></View></View>
    {calendar && month && <MonthCalendar month={month} activeDays={new Set(filtered.map((item) => new Date(item.occurredAt).getDate()))} selected={selectedDay} onSelect={setSelectedDay} />}
    {loading && transactions.length === 0 ? <ActivityIndicator accessibilityLabel={t("Đang tải giao dịch")} color={colors.link} style={styles.loader} /> : visible.length === 0 ? <EmptyState action={t("Thêm giao dịch")} description={t("Thử thay đổi bộ lọc hoặc ghi một khoản thu, chi mới.")} onAction={() => router.push(routes.newTransaction)} title={t("Chưa có giao dịch phù hợp")} /> : <Surface style={styles.list}>{visible.map((item, index) => <Pressable key={item.id} onPress={() => router.push(routes.transaction(item.id))} style={[styles.row, index > 0 && styles.border]}><View style={styles.badge}><AppIcon name={item.kind === "transfer" ? "swap-horizontal" : item.kind === "expense" ? "arrow-top-right" : "arrow-bottom-left"} size={22} color={item.kind === "expense" ? colors.expense : item.kind === "transfer" ? colors.mauve : colors.income} /></View><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.hint}>{categoryNames.get(item.categoryId ?? "") ?? t("Chưa phân loại")} · {accountNames.get(item.accountId) ?? t("Tài khoản")}</Text><Text style={styles.date}>{new Date(item.occurredAt).toLocaleDateString(localeFor(language),{timeZone:profile?.timezone ?? "Asia/Ho_Chi_Minh"})}</Text></View><Text style={[styles.amount, { color: item.kind === "expense" ? colors.expense : item.kind === "transfer" ? colors.mauve : colors.income }]}>{item.kind === "expense" ? "−" : item.kind === "transfer" ? "" : "+"}{accounts.find(account=>account.id===item.accountId)?.currencyCode ? formatMoney(item.amount,language,accounts.find(account=>account.id===item.accountId)!.currencyCode) : "—"}</Text></Pressable>)}</Surface>}
  </PicketScreen><FloatingAction iconOnly label={t("Thêm giao dịch")} onPress={() => router.push(routes.newTransaction)} /></View>;
}
const createStyles = (colors: MobileThemeColors) => StyleSheet.create({ root: { flex: 1, backgroundColor: colors.cream }, tools: { paddingVertical: 4, marginBottom: 16 }, searchRow: { flexDirection: "row", alignItems: "center", gap: 8 }, searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: paperShape.input, paddingLeft: 16 }, search: { flex: 1, minHeight: paperControl.height, color: colors.ink, fontSize: 15, paddingHorizontal: 10 }, chips: { gap: 8, paddingVertical: 8 }, period: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, periodButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, flex: 1 }, periodText: { color: colors.ink, fontWeight: "600", fontSize: 14 }, filterPanel: { gap: 12, marginBottom: 16 }, filterLabel: { color: colors.ink, fontSize: 14, fontWeight: "600" }, filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, monthInput: { color: colors.ink, backgroundColor: colors.cream, minHeight: paperControl.height, borderRadius: paperShape.input, paddingHorizontal: 16 }, reset: { color: colors.link, fontWeight: "700", paddingVertical: 14 }, sync: { flexDirection: "row", gap: 8, alignItems: "center" }, hint: { color: colors.muted, fontSize: 12, lineHeight: 18 }, listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, loader: { marginTop: 48 }, list: { padding: 0, borderWidth: 0, backgroundColor: "transparent" }, row: { alignItems: "center", flexDirection: "row", minHeight: 72, paddingVertical: 8, gap: 10 }, border: { borderTopColor: colors.line, borderTopWidth: 1 }, badge: { alignItems: "center", backgroundColor: colors.pocketLilac, borderRadius: 14, height: 40, justifyContent: "center", width: 40 }, copy: { flex: 1, gap: 3 }, title: { color: colors.ink, fontSize: 14, fontWeight: "600", lineHeight: 20 }, date: { color: colors.muted, fontSize: 11, lineHeight: 16 }, amount: { maxWidth: "38%", fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"] } });
