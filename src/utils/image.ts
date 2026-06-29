import { BACKEND_BASE_URL } from "../config/env";

export const PRODUCT_IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
  <rect width="640" height="420" fill="#f3f4f6"/>
  <rect x="190" y="120" width="260" height="150" rx="18" fill="#ffffff" stroke="#d1d5db" stroke-width="6"/>
  <circle cx="320" cy="195" r="42" fill="#16a34a"/>
  <text x="320" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111827">Raj Sports</text>
</svg>
`)}`;

// Resolves a raw imageUrl to a browser-ready URL, or returns undefined when empty.
// Use this when you want null-safety without a placeholder fallback.
export const resolveImageUrl = (imageUrl?: string | null): string | undefined => {
  if (!imageUrl) return undefined;
  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) return imageUrl;
  if (imageUrl.startsWith("/uploads")) return `${BACKEND_BASE_URL}${imageUrl}`;
  return imageUrl;
};

// Converts backend local upload paths into browser-ready absolute URLs.
// e.g. "/uploads/products/bat.png" → "http://localhost:8080/uploads/products/bat.png"
// Full http/https URLs and data: URIs are returned as-is.
export const getProductImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }

  return imageUrl;
};
