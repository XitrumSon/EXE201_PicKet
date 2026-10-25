import { useTranslation } from "react-i18next";
import type { billingVi } from "@/core/i18n/billing-resources";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { radii } from "@/core/ui/mobile-palette";
import {
  PICKET_SUBSCRIPTION_IDS,
  type Entitlements,
  type PicketSubscriptionId,
} from "@picket/domain";
import * as Crypto from "expo-crypto";
import {
  deepLinkToSubscriptions,
  getAvailablePurchases,
  type ProductSubscription,
  type Purchase,
} from "expo-iap";
import { Redirect, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { picketApi } from "@/core/api/client";
import { routes } from "@/core/navigation/routes";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { useAuth } from "@/features/auth/auth-context";
import { verifyRestoredPurchases } from "@/features/billing/restore-results";
import { usePlayBilling } from "@/features/billing/play-billing-provider";
import {
  isPicketSubscriptionId,
  canStartPlayPurchase,
  verifyAndFinishPurchase,
} from "@/features/billing/billing-policy";

const planKeys: Record<
  PicketSubscriptionId,
  { name: string; cadence: string; summary: string }
> = {
  picket_plus_monthly: {
    name: "Picket Plus",
    cadence: "monthly",
    summary: "plusMonthly",
  },
  picket_plus_yearly: {
    name: "Picket Plus",
    cadence: "yearly",
    summary: "plusYearly",
  },
  picket_pro_monthly: {
    name: "Picket Pro",
    cadence: "monthly",
    summary: "proMonthly",
  },
  picket_pro_yearly: {
    name: "Picket Pro",
    cadence: "yearly",
    summary: "proYearly",
  },
};

export default function BillingScreen() {
  const { session } = useAuth();
  if (Platform.OS !== "android") return <Redirect href="/profile" />;
  if (!session) return <Redirect href={routes.login} />;
  return <BillingContent key={session.user.id} accessToken={session.access_token} userId={session.user.id} />;
}

function BillingContent({ accessToken, userId }: { accessToken: string; userId: string }) {
  const { colors, styles } = useMobileStyles(createStyles);
  const { t } = useTranslation("billing");
  const [busyProduct, setBusyProduct] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{key:keyof typeof billingVi;tier?:string} | null>(null);
  const [success, setSuccess] = useState(false);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [availability, setAvailability] = useState<{ token: string; ready: boolean } | null>(null);
  const storeReady = availability?.token === accessToken && availability.ready;
  const checkingStore = Boolean(picketApi) && availability?.token !== accessToken;
  const processingTokens = useRef(new Set<string>());
  const fetchedProducts = useRef(false);
  const entitlementRead = useRef(0);
  const operationScope = useRef({active:true,token:accessToken,restoring:false,purchasing:false,controller:new AbortController()});
  useEffect(()=>{
    const scope={active:true,token:accessToken,restoring:false,purchasing:false,controller:new AbortController()};
    operationScope.current=scope;
    void Promise.resolve().then(()=>{
      if(!scope.active)return;
      if(!scope.restoring)setRestoring(false);
      if(!scope.purchasing)setBusyProduct(null);
    });
    return()=>{scope.active=false;scope.controller.abort();};
  },[accessToken]);

  const {
    connected,
    subscriptions,
    fetchProducts,
    finishTransaction,
    requestPurchase,
    revision,
  } = usePlayBilling({
    onPurchaseSuccess: (purchase) => {
      void verifyStorePurchase(purchase);
    },
    onPurchaseError: (error) => {
      if(!operationScope.current.active||operationScope.current.token!==accessToken)return;
      operationScope.current.purchasing=false;
      setBusyProduct(null);
      setSuccess(false);
      setMessage(
        error.code === "user-cancelled"
          ? {key:"cancelled"}
          : {key:"purchaseError"},
      );
    },
    onError: () => {
      setMessage({key:"connectionError"});
    },
  });

  useEffect(() => {
    const controller=new AbortController();
    let active=true;
    if (!picketApi) return () => controller.abort();
    void picketApi.billingAvailability(accessToken, controller.signal)
      .then(status => {
        if (active) setAvailability({ token: accessToken, ready: canStartPlayPurchase("android", true, status) });
      })
      .catch(() => {
        if (active) setAvailability({ token: accessToken, ready: false });
      });
    return ()=>{active=false;controller.abort();};
  },[accessToken]);

  useEffect(() => {
    if (!connected || Platform.OS !== "android" || fetchedProducts.current) return;
    fetchedProducts.current = true;
    void fetchProducts({ skus: [...PICKET_SUBSCRIPTION_IDS], type: "subs" });
  }, [connected, fetchProducts]);

  useEffect(() => {
    if (!picketApi) return;
    let active = true;
    const request=++entitlementRead.current;
    void picketApi
      .currentEntitlements(accessToken)
      .then((value) => {
        if (active&&request===entitlementRead.current) setEntitlements(value);
      })
      .catch(() => {
        if (active&&request===entitlementRead.current) setEntitlements(null);
      });
    return () => {
      active = false;
    };
  }, [accessToken,revision]);

  async function refreshEntitlements(current:()=>boolean) {
    if (!picketApi) return;
    const request=++entitlementRead.current;
    const value=await picketApi.currentEntitlements(accessToken);
    if(current()&&request===entitlementRead.current)setEntitlements(value);
  }

  async function verifyStorePurchase(purchase: Purchase) {
    const scope=operationScope.current;
    const current=()=>scope.active&&operationScope.current===scope&&scope.token===accessToken;
    if(!current())return false;
    const token = purchase.purchaseToken;
    if (!token || processingTokens.current.has(token)) return false;
    processingTokens.current.add(token);
    setBusyProduct(purchase.productId);
    setSuccess(false);
    setMessage({key:"verifying"});
    try {
      const api = picketApi;
      if (!api) throw new Error("Chưa kích hoạt được gói. Hãy thử lại sau.");
      const result = await verifyAndFinishPurchase(
        purchase,
        (request) => {
          if(!current())throw new Error("Billing session changed");
          return api.verifyPlayPurchase(accessToken, request,scope.controller.signal);
        },
        () => {
          if(!current())throw new Error("Billing session changed");
          return finishTransaction({ purchase, isConsumable: false });
        },
      );
      if(!current())return false;
      try {
        await refreshEntitlements(current);
      } catch {
        if(current()){setSuccess(false);setMessage({key:"refreshError"});}
        return true;
      }
      if(!current())return false;
      setSuccess(true);
      setMessage(
        result.active
          ? {key:"activated",tier:result.tier.toUpperCase()}
          : {key:"expired"},
      );
      return true;
    } catch {
      if(!current())return false;
      setSuccess(false);
      setMessage(
        {key:"verifyError"},
      );
      return false;
    } finally {
      processingTokens.current.delete(token);
      if(current()){scope.purchasing=false;setBusyProduct(null);}
    }
  }

  async function purchase(product: ProductSubscription) {
    if (Platform.OS !== "android" || product.platform !== "android") return;
    const scope=operationScope.current;
    const current=()=>scope.active&&operationScope.current===scope&&scope.token===accessToken;
    if(!current()||scope.purchasing||scope.restoring||processingTokens.current.size>0)return;
    if(!canStartPlayPurchase(Platform.OS,connected,{newPurchasesEnabled:storeReady})) {
      setSuccess(false);setMessage({key:"notReady"});return;
    }
    const offerToken = product.subscriptionOffers.find(
      (offer) => typeof offer.offerTokenAndroid === "string",
    )?.offerTokenAndroid;
    if (!offerToken) {
      setSuccess(false);
      return setMessage({key:"offerMissing"});
    }
    scope.purchasing=true;
    setBusyProduct(product.id);
    setSuccess(false);
    setMessage(null);
    try {
      const obfuscatedAccountId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        userId,
      );
      if(!current())return;
      await requestPurchase({
        request: {
          google: {
            skus: [product.id],
            subscriptionOffers: [{ sku: product.id, offerToken }],
            obfuscatedAccountId,
          },
        },
        type: "subs",
      });
    } catch {
      if(current()){scope.purchasing=false;setBusyProduct(null);setMessage({key:"openError"});}
    }
  }

  async function restore() {
    if (!connected || Platform.OS !== "android") return;
    const scope=operationScope.current;
    const current=()=>scope.active&&operationScope.current===scope&&scope.token===accessToken;
    if(!current()||scope.restoring||scope.purchasing||processingTokens.current.size>0)return;
    scope.restoring=true;
    setRestoring(true);
    setSuccess(false);
    setMessage(null);
    let purchasesVerified=false;
    try {
      const purchases = await getAvailablePurchases({
        includeSuspendedAndroid: false,
      });
      if(!current())return;
      const eligible = purchases.filter(
        (item) => isPicketSubscriptionId(item.productId) && item.purchaseToken,
      );
      if (eligible.length === 0) {
        setMessage({key:"restoreEmpty"});
        return;
      }
      const restored = await verifyRestoredPurchases(eligible, item=>current()?verifyStorePurchase(item):Promise.resolve(false));
      if(!current())return;
      purchasesVerified=restored.verified>0;
      await refreshEntitlements(current);
      if(!current())return;
      setSuccess(restored.failed === 0 && restored.verified > 0);
      setMessage(restored.failed === 0
        ? {key:"restoreSuccess"}
        : restored.verified > 0
          ? {key:"restorePartial"}
          : {key:"restoreFailed"});
    } catch {
      if(current())setMessage({key:purchasesVerified?"refreshError":"restoreError"});
    } finally {
      scope.restoring=false;
      if(current())setRestoring(false);
    }
  }

  async function manageSubscription() {
    try {
      await deepLinkToSubscriptions({
        packageNameAndroid: "com.picket.mobile",
        skuAndroid: subscriptions[0]?.id ?? PICKET_SUBSCRIPTION_IDS[0],
      });
    } catch {
      setSuccess(false);
      setMessage({key:"manageError"});
    }
  }

  const orderedProducts = [...subscriptions].sort(
    (left, right) =>
      PICKET_SUBSCRIPTION_IDS.indexOf(left.id as PicketSubscriptionId) -
      PICKET_SUBSCRIPTION_IDS.indexOf(right.id as PicketSubscriptionId),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {!storeReady && <Text accessibilityLiveRegion="polite" style={{color:colors.muted}}>{t(checkingStore ? "checking" : "notReady")}</Text>}
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>{t("back")}</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.title}>{t("title")}</Text>
        <Text style={styles.description}>
          {t("description")}
        </Text>

        {entitlements && (
          <View style={styles.currentPlan}>
            <Text style={styles.currentPlanTitle}>{t("current",{tier:entitlements.tier.toUpperCase()})}</Text>
            <Text style={styles.currentPlanText}>
              {t("quota",{remaining:entitlements.ocrFallbackRemaining,limit:entitlements.ocrFallbackDailyLimit})}
            </Text>
          </View>
        )}

        {Platform.OS !== "android" ? (
          <Text style={styles.notice}>{t("androidOnly")}</Text>
        ) : !connected ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator accessibilityLabel={t("connecting")} color={colors.mauve} />
            <Text style={styles.notice}>{t("connecting")}</Text>
          </View>
        ) : orderedProducts.length === 0 ? (
          <Text style={styles.notice}>
            {t("pricesUnavailable")}
          </Text>
        ) : (
          orderedProducts.map((product) => {
            if (!isPicketSubscriptionId(product.id)) return null;
            const keys = planKeys[product.id];
            const copy = {name:keys.name,cadence:t(keys.cadence),summary:t(keys.summary)};
            const displayPrice =
              product.subscriptionOffers?.find((offer) => offer.offerTokenAndroid)?.displayPrice ??
              product.displayPrice;
            return (
              <View key={product.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <View style={styles.planNameBlock}>
                    <Text style={styles.planName}>{copy.name}</Text>
                    <Text style={styles.cadence}>{copy.cadence}</Text>
                  </View>
                  <Text style={styles.price}>{displayPrice}</Text>
                </View>
                <Text style={styles.planSummary}>{copy.summary}</Text>
                <Pressable
                  accessibilityLabel={t("chooseLabel",{name:copy.name,cadence:copy.cadence})}
                  disabled={!storeReady || !connected || busyProduct !== null || restoring}
                  onPress={() => void purchase(product)}
                  style={styles.primary}
                >
                  {busyProduct === product.id ? (
                    <ActivityIndicator accessibilityLabel={t("buyingLabel",{name:copy.name,cadence:copy.cadence})} color={colors.onPrimary} />
                  ) : (
                    <Text style={styles.primaryText}>{t("choose")}</Text>
                  )}
                </Pressable>
              </View>
            );
          })
        )}

        {message && (
          <Text accessibilityLiveRegion="polite" style={success ? styles.success : styles.error}>
            {t(message.key,{tier:message.tier})}
          </Text>
        )}
        <Pressable
          disabled={!connected || restoring || busyProduct !== null}
          onPress={() => void restore()}
          style={styles.secondary}
        >
          {restoring ? <ActivityIndicator accessibilityLabel={t("restoring")} color={colors.mauve} /> : <Text style={styles.secondaryText}>{t("restore")}</Text>}
        </Pressable>
        <Pressable
          disabled={Platform.OS !== "android"}
          onPress={() => void manageSubscription()}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>{t("manage")}</Text>
        </Pressable>
        <Text style={styles.footnote}>
          {t("footnote")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: MobileThemeColors) => StyleSheet.create({
  safeArea: { backgroundColor: colors.cream, flex: 1 },
  content: { gap: 14, padding: 24, paddingBottom: 48 },
  back: { color: colors.mauve, fontSize: 15, fontWeight: "700" },
  title: { color: colors.ink, fontSize: 32, fontWeight: "700", lineHeight: 38 },
  description: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  currentPlan: { backgroundColor: colors.white, borderColor: colors.peach, borderRadius: radii.medium, borderWidth: 1, gap: 6, padding: 16 },
  currentPlanTitle: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  currentPlanText: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  loadingRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  notice: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  planCard: { backgroundColor: colors.white, borderColor: colors.peach, borderRadius: radii.large, borderWidth: 1, gap: 14, padding: 18 },
  planHeader: { alignItems: "flex-start", flexDirection: "row", gap: 12, justifyContent: "space-between" },
  planNameBlock: { flex: 1 },
  planName: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  cadence: { color: colors.muted, fontSize: 13, marginTop: 3 },
  price: { color: colors.mauve, fontSize: 17, fontWeight: "700" },
  planSummary: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  primary: { alignItems: "center", backgroundColor: colors.mauve, borderRadius: radii.small, justifyContent: "center", minHeight: 50 },
  primaryText: { color: colors.onPrimary, fontSize: 15, fontWeight: "700" },
  secondary: { alignItems: "center", borderColor: colors.mauve, borderRadius: radii.small, borderWidth: 1, justifyContent: "center", minHeight: 52 },
  secondaryText: { color: colors.mauve, fontSize: 15, fontWeight: "700" },
  linkButton: { alignItems: "center", justifyContent: "center" },
  linkText: { color: colors.mauve, fontSize: 14, fontWeight: "700", textAlign: "center" },
  footnote: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
  error: { color: colors.expense, fontSize: 14, lineHeight: 20 },
  success: { color: colors.income, fontSize: 14, fontWeight: "700", lineHeight: 20 },
});
