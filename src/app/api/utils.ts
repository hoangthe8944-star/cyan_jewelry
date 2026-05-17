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

type CloudinaryCardImageMode = "cover" | "contain";

function injectCloudinaryTransform(url: string, transform: string) {
  const marker = "/upload/";

  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) {
    return url;
  }

  const [prefix, suffix] = url.split(marker);

  if (!suffix) {
    return url;
  }

  return `${prefix}${marker}${transform}/${suffix}`;
}

export function optimizeProductCardImageUrl(
  value?: string | null,
  mode: CloudinaryCardImageMode = "cover"
) {
  const normalized = normalizeMediaUrl(value);

  if (!normalized) {
    return "https://placehold.co/800x1000?text=Oriven";
  }

  if (!normalized.includes("res.cloudinary.com")) {
    return normalized;
  }

  const transform =
    mode === "contain"
      ? "c_pad,ar_3:4,b_white,f_auto,q_auto,w_900,h_1200"
      : "c_fill,ar_3:4,g_auto,f_auto,q_auto,w_900,h_1200";

  return injectCloudinaryTransform(normalized, transform);
}

export function resolveMediaUrl(media?: MediaAsset | null) {
  if (media?.mediaType === "MP4") {
    return (
      normalizeMediaUrl(media.url) ||
      normalizeMediaUrl(media.thumbnailUrl) ||
      "https://placehold.co/800x1000?text=Oriven"
    );
  }

  return (
    normalizeMediaUrl(media?.thumbnailUrl) ||
    normalizeMediaUrl(media?.url) ||
    "https://placehold.co/800x1000?text=Oriven"
  );
}

export function resolveMediaPosterUrl(media?: MediaAsset | null) {
  return (
    normalizeMediaUrl(media?.thumbnailUrl) ||
    normalizeMediaUrl(media?.url) ||
    "https://placehold.co/800x1000?text=Oriven"
  );
}
