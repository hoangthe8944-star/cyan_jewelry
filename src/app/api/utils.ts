import { API_ORIGIN, FALLBACK_API_ORIGIN } from "./client";
import type { MediaAsset } from "../lib/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeMediaUrl(value?: string | null) {
  if (!value) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);

    if (parsedUrl.origin === FALLBACK_API_ORIGIN && API_ORIGIN !== FALLBACK_API_ORIGIN) {
      return `${API_ORIGIN}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }

    return parsedUrl.toString();
  } catch {
    if (value.startsWith("/")) {
      return `${API_ORIGIN}${value}`;
    }

    return value;
  }
}

export function resolveMediaUrl(media?: MediaAsset | null) {
  return (
    normalizeMediaUrl(media?.thumbnailUrl) ||
    normalizeMediaUrl(media?.url) ||
    "https://placehold.co/800x1000?text=Cyan"
  );
}
