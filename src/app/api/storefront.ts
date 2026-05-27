import { buildQuery, request } from "./client";
import type {
  Banner,
  BannerPlacement,
  CheckoutOrderResponse,
  CollectionDetail,
  CollectionSummary,
  CategoryNode,
  EditorialDetail,
  EditorialQueryParams,
  EditorialSummary,
  HomeResponse,
  OrderLookupRequest,
  OrderPayload,
  OrderResponse,
  ProductCatalogResponse,
  ProductDetail,
  ProductQueryParams,
  SearchSuggestionResponse,
  ShopProduct,
} from "../lib/types";
import { resolveMediaUrl } from "./utils";

const STOREFRONT_PREFIX = "/api/public";

export const storefrontApi = {
  getHome() {
    return request<HomeResponse>(`${STOREFRONT_PREFIX}/home`);
  },

  getBanners(placement: BannerPlacement) {
    return request<Banner[]>(`${STOREFRONT_PREFIX}/banners${buildQuery({ placement })}`);
  },

  getCategories() {
    return request<CategoryNode[]>(`${STOREFRONT_PREFIX}/categories`);
  },

  getCollections(featured?: boolean) {
    return request<CollectionSummary[]>(`${STOREFRONT_PREFIX}/collections${buildQuery({ featured })}`);
  },

  getCollectionBySlug(slug: string) {
    return request<CollectionDetail>(`${STOREFRONT_PREFIX}/collections/${slug}`);
  },

  getCategoryBySlug(slug: string) {
    return request<CategoryNode>(`${STOREFRONT_PREFIX}/categories/${slug}`);
  },

  getCategoryProducts(slug: string, params: Omit<ProductQueryParams, "categorySlug"> = {}) {
    return request<ProductCatalogResponse>(
      `${STOREFRONT_PREFIX}/categories/${slug}/products${buildQuery(params)}`
    );
  },

  getProducts(params: ProductQueryParams = {}) {
    return request<ProductCatalogResponse>(`${STOREFRONT_PREFIX}/products${buildQuery(params)}`);
  },

  searchProducts(keyword: string, categorySlug?: string) {
    return request<ProductCatalogResponse>(
      `${STOREFRONT_PREFIX}/search${buildQuery({ keyword, categorySlug })}`
    );
  },

  getSearchSuggestions(keyword: string, keywordLimit?: number, productLimit?: number) {
    return request<SearchSuggestionResponse>(
      `${STOREFRONT_PREFIX}/search/suggestions${buildQuery({ keyword, keywordLimit, productLimit })}`
    );
  },

  getProductBySlug(slug: string) {
    return request<ProductDetail>(`${STOREFRONT_PREFIX}/products/${slug}`);
  },

  getRelatedProducts(slug: string, limit = 4) {
    return request<ProductCatalogResponse["items"]>(
      `${STOREFRONT_PREFIX}/products/${slug}/related${buildQuery({ limit })}`
    );
  },

  getEditorials(params: EditorialQueryParams = {}) {
    return request<EditorialSummary[]>(`${STOREFRONT_PREFIX}/editorials${buildQuery(params)}`);
  },

  getEditorialBySlug(slug: string) {
    return request<EditorialDetail>(`${STOREFRONT_PREFIX}/editorials/${slug}`);
  },

  createOrder(payload: OrderPayload) {
    return request<CheckoutOrderResponse>(`${STOREFRONT_PREFIX}/orders`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  lookupOrder(payload: OrderLookupRequest) {
    return request<OrderResponse>(`${STOREFRONT_PREFIX}/orders/lookup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export function toShopProduct(product: ProductDetail | ProductCatalogResponse["items"][number]): ShopProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    collection: product.brand || "Oriven Jewelry",
    price: product.minPrice,
    image: resolveMediaUrl(product.gallery[0]),
    badge: product.featured ? "Nổi bật" : undefined,
  };
}
