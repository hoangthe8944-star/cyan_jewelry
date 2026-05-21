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
  displayOrder?: number;
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
  status?: string;
  coverMedia?: MediaAsset | null;
  children: CategoryNode[];
}

export interface ProductCardItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  tags?: string[];
  brand?: string | null;
  material?: string | null;
  gemstone?: string | null;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  featured: boolean;
  status?: string;
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
  compareAtPrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  weightInGram?: number | null;
  active?: boolean;
  selections: VariantSelection[];
  media: MediaAsset[];
}

export interface ProductDetail extends ProductCardItem {
  description?: string | null;
  primaryCategoryId?: string | null;
  categoryIds?: string[];
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
  displayOrder?: number;
  heading?: string | null;
  body?: string | null;
  content?: string | null;
  media?: MediaAsset | MediaAsset[] | null;
}

export interface EditorialDetail extends EditorialSummary {
  body?: string | null;
  sections: EditorialSectionBlock[];
}

export interface CollectionSummary {
  id: string;
  name: string;
  slug: string;
  summary?: string | null;
  coverMedia?: MediaAsset | null;
  featured: boolean;
  displayOrder: number;
  publishedAt?: string | null;
  productCount: number;
}

export interface CollectionDetail extends CollectionSummary {
  description?: string | null;
  products: ProductCardItem[];
}

export interface SearchSuggestionResponse {
  keyword: string;
  keywordSuggestions: string[];
  productSuggestions: ProductCardItem[];
}

export interface HomeResponse {
  mainBanners: Banner[];
  subBanners: Banner[];
  categories: CategoryNode[];
  featuredCollections: CollectionSummary[];
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
  quantity: number;
  productId: string;
  variantCode: string;
}

export interface OrderPayload {
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress | null;
  items: OrderItemPayload[];
  shippingFee?: number;
  discountAmount?: number;
  paymentMethod?: "COD" | "MOMO";
  orderStatus?: string;
  note?: string | null;
  momoPayment?: {
    orderInfo?: string;
    redirectUrl?: string;
    ipnUrl?: string;
    extraData?: string;
    requestType?: string;
    lang?: string;
  } | null;
}

export interface OrderLookupRequest {
  orderCode: string;
  phoneNumber: string;
}

export interface OrderResponse extends OrderPayload {
  id?: string;
  orderCode?: string;
  subtotal?: number;
  totalAmount?: number;
  currency?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckoutOrderResponse {
  order: OrderResponse;
  paymentRequired: boolean;
  payUrl?: string | null;
  deeplink?: string | null;
  qrCodeUrl?: string | null;
}

export interface ShopProduct {
  id: string;
  slug: string;
  image: string;
  name: string;
  collection: string;
  price: number;
  badge?: string;
  variantCode?: string | null;
  variantLabel?: string | null;
}
