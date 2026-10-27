import { PicketText as Text } from "@/core/ui/picket-text";
import { PaperArt } from "@/core/ui/paper-art";
import { categoryArt } from "@/core/theme/category-art";
import { useManagementCopy } from "@/core/i18n/use-management-copy";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { routes } from "@/core/navigation/routes";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { EmptyState, IconButton, PicketScreen, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { useAuth } from "@/features/auth/auth-context";
import { useTransactions } from "@/features/transactions/transactions-context";

const kindLabels = { expense: "Khoản chi", income: "Khoản thu", both: "Thu và chi" } as const;

export default function CategoriesScreen() {
  const tx=useManagementCopy();
  const { styles } = useMobileStyles(createStyles);
  const { session, localMode } = useAuth();
  const { categories } = useTransactions();
  if (!session && !localMode) return <Redirect href={routes.login} />;
  return <PicketScreen>
    <TopAppBar illustration="shopping" title={tx("Danh mục")} subtitle={tx("Phân loại các khoản thu và chi theo cách của bạn.")} action={<IconButton icon="plus" label={tx("Thêm danh mục")} onPress={() => router.push(routes.newCategory)} />} />
    {categories.length === 0 ? <EmptyState action={tx("Tạo danh mục")} description={tx("Thêm danh mục đầu tiên để phân loại giao dịch.")} onAction={() => router.push(routes.newCategory)} symbol="◌" title={tx("Chưa có danh mục")} /> : <Surface style={styles.list}>{categories.map((category,index)=><Pressable accessibilityHint={category.custom?tx("Mở để chỉnh sửa"):tx("Danh mục mặc định không thể chỉnh sửa")} accessibilityRole="button" disabled={!category.custom} key={category.id} onPress={()=>router.push(routes.category(category.id))} style={[styles.row,index>0&&styles.border]}><PaperArt id={categoryArt(category.icon, category.name)} style={{ width: 40, height: 40 }} /><View style={styles.copy}><Text style={styles.name}>{category.name}</Text><Text style={styles.hint}>{tx(kindLabels[category.kind])} · {category.custom?tx("Tùy chỉnh"):tx("Mặc định")}</Text></View>{category.custom?<Text style={styles.chevron}>›</Text>:<Text style={styles.lock}>●</Text>}</Pressable>)}</Surface>}
  </PicketScreen>;
}

const createStyles = (colors: MobileThemeColors) => StyleSheet.create({appBar:{alignItems:"center",flexDirection:"row",justifyContent:"space-between",minHeight:52},link:{color:colors.link,fontSize:15,fontWeight:"700"},heading:{color:colors.ink,fontSize:26,fontWeight:"800",letterSpacing:-.8,marginTop:18},subtitle:{color:colors.muted,fontSize:15,lineHeight:22,marginBottom:22,marginTop:7},list:{padding:8},row:{alignItems:"center",flexDirection:"row",gap:13,minHeight:68,paddingHorizontal:10},border:{borderTopColor:colors.line,borderTopWidth:1},dot:{borderRadius:10,height:20,width:20},copy:{flex:1},name:{color:colors.ink,fontSize:16,fontWeight:"700"},hint:{color:colors.muted,fontSize:12,marginTop:4},chevron:{color:colors.link,fontSize:26},lock:{color:colors.peach,fontSize:10}});
