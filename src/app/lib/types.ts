export interface MediaAsset {
  mediaType: "IMAGE" | "MP4";
  url: string;
  thumbnailUrl?: string | null;
  altText?: string | null;
}

export interface Banner {
  id: string;
  title: string;
  slug: string;
  placement: "MAIN" | "SUB";
  media: MediaAsset;
  redirectUrl?: string | null;
  ctaLabel?: string | null;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  level: number;
  coverMedia?: MediaAsset | null;
  children: CategoryNode[];
}

export interface ProductCardItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  brand?: string | null;
  material?: string | null;
  gemstone?: string | null;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  featured: boolean;
  gallery: MediaAsset[];
}

export interface VariantSelection {
  optionType: string;
  valueCode: string;
  valueLabel: string;
}

export interface ProductVariant {
  variantCode: string;
  modelCode: string;
  styleCode: string;
  price: number;
  stockQuantity: number;
  selections: VariantSelection[];
  media: MediaAsset[];
}

export interface ProductDetail extends ProductCardItem {
  description?: string | null;
  options: {
    type: string;
    name: string;
    values: {
      code: string;
      label: string;
      swatchMedia?: MediaAsset | null;
    }[];
  }[];
  variants: ProductVariant[];
}

export interface EditorialSummary {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  topics: string[];
  coverMedia?: MediaAsset | null;
  publishedAt?: string | null;
}

export interface EditorialSectionBlock {
  heading?: string | null;
  body?: string | null;
  media?: MediaAsset | null;
}

export interface EditorialDetail extends EditorialSummary {
  body?: string | null;
  sections: EditorialSectionBlock[];
}

export interface HomeResponse {
  mainBanners: Banner[];
  subBanners: Banner[];
  categories: CategoryNode[];
  featuredProducts: ProductCardItem[];
  newArrivals: ProductCardItem[];
  latestEditorials: EditorialSummary[];
}

export interface ProductCatalogResponse {
  total: number;
  items: ProductCardItem[];
}

export type BannerPlacement = Banner["placement"];

export interface ProductQueryParams {
  keyword?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export interface EditorialQueryParams {
  topic?: string;
  keyword?: string;
}

export interface OrderCustomer {
  fullName: string;
  email?: string | null;
  phoneNumber: string;
}

export interface OrderAddress {
  fullName?: string | null;
  phoneNumber?: string | null;
  line1: string;
  line2?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

export interface OrderItemPayload {
  productId: string;
  variantCode: string;
  productName: string;
  thumbnailUrl?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderPayload {
  orderCode: string;
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress | null;
  items: OrderItemPayload[];
  subtotal: number;
  shippingFee?: number;
  discountAmount?: number;
  totalAmount: number;
  currency?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  note?: string | null;
  momoPayment?: Record<string, unknown> | null;
}

export interface OrderLookupRequest {
  orderCode: string;
  phoneNumber: string;
}

export interface OrderResponse extends OrderPayload {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopProduct {
  id: string;
  slug: string;
  image: string;
  name: string;
  collection: string;
  price: number;
  badge?: string;
}
