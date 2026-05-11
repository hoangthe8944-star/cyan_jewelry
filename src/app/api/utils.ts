import type { MediaAsset } from "../lib/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function resolveMediaUrl(media?: MediaAsset | null) {
  return media?.thumbnailUrl || media?.url || "https://placehold.co/800x1000?text=Cyan";
}
