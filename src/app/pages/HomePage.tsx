import { useEffect, useState } from 'react';

import { storefrontApi } from '../api';
import { CategorySection } from '../components/CategorySection';
import { EditorialSection } from '../components/EditorialSection';
import { HeroCarousel } from '../components/HeroCarousel';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import { SubBannerSection } from '../components/SubBannerSection';
import type { CollectionSummary, HomeResponse, ProductCardItem } from '../lib/types';

function formatVndCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function pickRandomProducts(products: ProductCardItem[], count: number) {
  return [...products].sort(() => Math.random() - 0.5).slice(0, count);
}

function sortLatestCollections(collections: CollectionSummary[]) {
  return [...collections].sort((left, right) => {
    const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;

    if (rightTime !== leftTime) {
      return rightTime - leftTime;
    }

    return right.displayOrder - left.displayOrder;
  });
}

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [latestCollectionProducts, setLatestCollectionProducts] = useState<ProductCardItem[]>([]);
  const [latestCollectionName, setLatestCollectionName] = useState('Bộ sưu tập mới nhất');
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([storefrontApi.getHome(), storefrontApi.getProducts(), storefrontApi.getCollections()])
      .then(async ([homeResponse, productsResponse, collectionsResponse]) => {
        setHomeData(homeResponse);

        const featuredSource =
          homeResponse.featuredProducts.length > 0 ? homeResponse.featuredProducts : productsResponse.items;
        setFeaturedProducts(pickRandomProducts(featuredSource, 4));

        const collectionSource =
          collectionsResponse.length > 0
            ? collectionsResponse
            : homeResponse.featuredCollections.length > 0
              ? homeResponse.featuredCollections
              : [];

        const latestCollection = sortLatestCollections(collectionSource)[0];

        if (latestCollection) {
          try {
            const collectionDetail = await storefrontApi.getCollectionBySlug(latestCollection.slug);
            setLatestCollectionProducts(collectionDetail.products.slice(0, 4));
            setLatestCollectionName(collectionDetail.name || 'Bộ sưu tập mới nhất');
            return;
          } catch {
            setLatestCollectionName(latestCollection.name || 'Bộ sưu tập mới nhất');
          }
        }

        const fallbackProducts =
          homeResponse.newArrivals.length > 0
            ? homeResponse.newArrivals
            : productsResponse.items.length > 0
              ? productsResponse.items
              : homeResponse.featuredProducts;

        setLatestCollectionProducts(fallbackProducts.slice(0, 4));
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <PageTransition>
      <HeroCarousel banners={homeData?.mainBanners ?? []} />
      {error ? (
        <div className="mx-auto max-w-4xl px-6 py-10 text-center text-sm text-red-600">
          Failed to load storefront data: {error}
        </div>
      ) : null}
      <ProductGrid
        products={latestCollectionProducts}
        eyebrow="Bộ sưu tập mới nhất"
        title={latestCollectionName}
        priceFormatter={formatVndCurrency}
      />
      {/* <SubBannerSection banners={homeData?.subBanners ?? []} /> */}
      <ProductGrid
        products={featuredProducts}
        eyebrow="Sản phẩm nổi bật"
        title="Sản phẩm nổi bật"
        description="Khám phá những thiết kế nổi bật đang đại diện cho tinh thần thẩm mỹ hiện tại của Oriven Jewelry."
        priceFormatter={formatVndCurrency}
      />
      <CategorySection categories={homeData?.categories ?? []} />
      <EditorialSection editorials={homeData?.latestEditorials ?? []} />
    </PageTransition>
  );
}
