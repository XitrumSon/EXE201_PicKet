import { PicketText as Text } from "@/core/ui/picket-text";
import { useTranslation } from "react-i18next";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { formatMoney } from "@/core/i18n/formatters";
import { useAppTheme } from "@/features/settings/appearance-provider";
import { summarizeCurrencies } from "@/features/cashflow/currency-summary";
import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { routes } from "@/core/navigation/routes";
import { AppIcon } from "@/core/ui/app-icon";
import { ConnectionNotice, EmptyState, FloatingAction, MenuRow, PicketScreen, SectionTitle, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { useAccounts } from "@/features/accounts/accounts-context";
import { useAuth } from "@/features/auth/auth-context";
import { useProfile } from "@/features/profile/profile-context";
import { useTransactions } from "@/features/transactions/transactions-context";

export default function AccountsScreen() {
  const { styles } = useMobileStyles(createStyles);
  const { language } = useAppTheme();
  const { t } = useTranslation("overview");
  const { session, localMode } = useAuth();
  const { accounts, error, refresh } = useAccounts();
  const { transactions } = useTransactions();
  const { profile } = useProfile();
  if (!session && !localMode) return <Redirect href={routes.login} />;
  const now=new Date();
  let summary: ReturnType<typeof summarizeCurrencies>|null=null;
  try { summary=summarizeCurrencies(accounts,transactions,`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`,profile?.timezone ?? "Asia/Ho_Chi_Minh"); } catch { /* Do not display invalid financial totals. */ }
  const balances=accounts.map(account=>({...account,balance:summary?.walletBalances[account.id]}));
  const money = (value: number|undefined,currency:string) => profile?.hideBalance ? "••••••" : value===undefined ? "—" : formatMoney(value,language,currency);
  const totalText=summary ? (summary.totals.length ? summary.totals.map(row=>money(row.balance,row.currency)).join("\n") : money(0,profile?.currencyCode ?? "VND")) : "—";
  return <View style={styles.root}><PicketScreen><TopAppBar illustration="home" title={t("walletTitle")} subtitle={t("walletSubtitle")} back={false} /><Surface peach><Text style={styles.meta}>{t("balance")}</Text><Text adjustsFontSizeToFit numberOfLines={Math.max(1,summary?.totals.length ?? 1)} style={styles.total}>{totalText}</Text><Text style={styles.meta}>{t("activeWallets",{count:accounts.length})}</Text></Surface>
    <SectionTitle title={t("accounts")} />{error && <ConnectionNotice hasData={accounts.length > 0} onRetry={() => void refresh()} />}
    {accounts.length === 0 ? <EmptyState title={t("firstWallet")} description={t("firstWalletBody")} action={t("addWallet")} onAction={() => router.push(routes.newAccount)} /> : <Surface style={styles.list}>{balances.map((a) => <MenuRow key={a.id} title={a.name} description={money(a.balance,a.currencyCode)} icon="wallet-outline" onPress={() => router.push(routes.account(a.id))} />)}</Surface>}
    <SectionTitle title={t("manageCashflow")} /><Surface style={styles.list}><MenuRow icon="swap-horizontal" title={t("transfer")} onPress={() => router.push(routes.newTransfer)} /><MenuRow icon="scale-balance" title={t("reconcile")} onPress={() => router.push(routes.reconcile)} /><MenuRow icon="history" title={t("history")} onPress={() => router.push(routes.transactions)} /></Surface><View style={styles.note}><AppIcon name="shield-check-outline" size={18} /><Text style={styles.meta}>{t("private")}</Text></View>
  </PicketScreen><FloatingAction label={t("addWallet")} onPress={() => router.push(routes.newAccount)} /></View>;
}
const createStyles = (colors: MobileThemeColors) => StyleSheet.create({ root: { flex: 1, backgroundColor: colors.cream }, meta: { color: colors.muted, fontSize: 13, lineHeight: 20 }, total: { color: colors.ink, fontSize: 36, lineHeight: 48, fontWeight: "700", fontVariant: ["tabular-nums"], marginVertical: 10 }, list: { paddingVertical: 4 }, note: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 } });
