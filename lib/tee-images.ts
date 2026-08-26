/** Placeholder image paths — furniture catalog uses category/product uploads instead. */
export const FURNITURE_IMAGES = {
  roomFallback: '/heroes/hero-categories.png',
} as const;

/** @deprecated tee branding removed — kept for any residual imports */
export const TEE_IMAGES = {
  heroFlatLay: FURNITURE_IMAGES.roomFallback,
  heroGraphic: FURNITURE_IMAGES.roomFallback,
  heroPolo: FURNITURE_IMAGES.roomFallback,
} as const;
