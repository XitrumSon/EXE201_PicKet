import type { ImageSourcePropType } from "react-native";

/** Metro needs literal require paths. Register new art here; screens use stable IDs. */
export const paperAssets = {
  receipt: require("../../../assets/paper/receipt-envelope-v1.png") as ImageSourcePropType,
  bloom: require("../../../assets/paper/picket-money-bloom-v2.png") as ImageSourcePropType,
  food: require("../../../assets/paper/pocket-food-v2.png") as ImageSourcePropType,
  transport: require("../../../assets/paper/pocket-transport-v2.png") as ImageSourcePropType,
  leisure: require("../../../assets/paper/pocket-leisure-v2.png") as ImageSourcePropType,
  shopping: require("../../../assets/paper/category-shopping-v1.png") as ImageSourcePropType,
  home: require("../../../assets/paper/category-home-v1.png") as ImageSourcePropType,
  health: require("../../../assets/paper/category-health-v1.png") as ImageSourcePropType,
  gift: require("../../../assets/paper/category-gift-v1.png") as ImageSourcePropType,
};
export type PaperAssetId = keyof typeof paperAssets;
export function resolvePaperAsset(id: string): PaperAssetId { return Object.hasOwn(paperAssets, id) ? id as PaperAssetId : "shopping"; }
export const paperArtOptions: { id: PaperAssetId; label: string }[] = ["shopping", "home", "health", "gift", ...Object.keys(paperAssets).filter(id => !["shopping", "home", "health", "gift"].includes(id))].map(id => ({ id: id as PaperAssetId, label: `paper${id[0].toUpperCase()}${id.slice(1)}` }));
export const pocketDecorations: readonly { id: PaperAssetId; tone: "pocketCoral" | "pocketMint" | "pocketBlue" | "pocketLilac" }[] = [
  { id: "food", tone: "pocketCoral" }, { id: "transport", tone: "pocketMint" },
  { id: "leisure", tone: "pocketBlue" }, { id: "shopping", tone: "pocketLilac" },
];

export const paperFonts = {
  PicketDisplay: require("../../../assets/fonts/nunito-400.ttf"),
  PicketSemibold: require("../../../assets/fonts/nunito-600.ttf"),
  PicketBold: require("../../../assets/fonts/nunito-700.ttf"),
  PicketExtraBold: require("../../../assets/fonts/nunito-800.ttf"),
  PicketLatin: require("../../../assets/fonts/fredoka.ttf"),
  PicketHandwriting: require("../../../assets/fonts/playwrite-vn.ttf"),
};
