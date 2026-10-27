import { PicketText as Text } from "@/core/ui/picket-text";
import { formatMoney, localeFor, normalizeLanguage } from "@/core/i18n/formatters";
import { useTranslation } from "react-i18next";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { routes } from "@/core/navigation/routes";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { ConnectionNotice, EmptyState, IconButton, PicketScreen, SectionTitle, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { AppIcon } from "@/core/ui/app-icon";
import { useAuth } from "@/features/auth/auth-context";
import { useSubscriptions } from "@/features/subscriptions/subscriptions-context";
import { partitionSubscriptions } from "@/features/subscriptions/subscription-list";

export default function SubscriptionsScreen() {
  const {t,i18n}=useTranslation("subscriptions");
  const language=normalizeLanguage(i18n.resolvedLanguage??i18n.language);
  const { colors, styles } = useMobileStyles(createStyles);
  const { session, localMode } = useAuth(); const { subscriptions, loading, error, refresh } = useSubscriptions();
  if (!session && !localMode) return <Redirect href={routes.login} />;
  const { active, paused } = partitionSubscriptions(subscriptions);
  const renderSubscription = (item: (typeof subscriptions)[number]) => <Pressable accessibilityRole="button" key={item.id} onPress={() => router.push(routes.subscription(item.id))}><Surface style={styles.card}><View style={styles.icon}><AppIcon name="repeat" size={22} /></View><View style={styles.copy}><Text style={styles.name}>{item.title}</Text><Text style={styles.meta}>{t(item.cadence)} · {new Date(item.nextDueAt).toLocaleDateString(localeFor(language))}</Text></View><Text style={styles.amount}>{formatMoney(item.amount,language,"VND")}</Text></Surface></Pressable>;
  return <PicketScreen>
    <TopAppBar illustration="home" title={t("title")} subtitle={t("subtitle")} action={<IconButton icon="plus" label={t("add")} onPress={() => router.push(routes.newSubscription)} />} />
    {error ? <ConnectionNotice hasData={subscriptions.length > 0} onRetry={() => void refresh()} /> : null}{loading ? <ActivityIndicator accessibilityLabel={t("loading")} color={colors.link} /> : null}
    {!loading && active.length === 0 && paused.length === 0 ? <EmptyState action={t("emptyAction")} description={t("emptyDescription")} onAction={() => router.push(routes.newSubscription)} symbol="↻" title={t("emptyTitle")} /> : null}
    {active.length ? <><SectionTitle action={t("refresh")} onAction={() => void refresh()} title={t("upcoming")} /><View style={styles.stack}>{active.map(renderSubscription)}</View></> : null}
    {paused.length ? <><SectionTitle title={t("paused")} /><View style={styles.stack}>{paused.map(renderSubscription)}</View></> : null}
  </PicketScreen>;
}
const createStyles = (colors: MobileThemeColors) => StyleSheet.create({appBar:{alignItems:"center",flexDirection:"row",justifyContent:"space-between",minHeight:52},action:{color:colors.link,fontSize:15,fontWeight:"700"},heading:{color:colors.ink,fontSize:26,fontWeight:"800",letterSpacing:-.8,marginTop:18},subtitle:{color:colors.muted,fontSize:15,lineHeight:22,marginBottom:10,marginTop:7},error:{color:colors.danger,fontSize:13,marginVertical:10},stack:{gap:10},card:{alignItems:"center",flexDirection:"row",gap:12,padding:15},icon:{alignItems:"center",backgroundColor:colors.peach,borderRadius:18,height:42,justifyContent:"center",width:42},iconText:{color:colors.link,fontSize:22,fontWeight:"700"},copy:{flex:1},name:{color:colors.ink,fontSize:15,fontWeight:"700"},meta:{color:colors.muted,fontSize:12,marginTop:4},amount:{color:colors.ink,fontSize:14,fontWeight:"800"}});
