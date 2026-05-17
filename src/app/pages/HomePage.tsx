import { useEffect, useState } from 'react';

import { storefrontApi } from '../api';
import { CategorySection } from '../components/CategorySection';
import { EditorialSection } from '../components/EditorialSection';
import { FeaturedCollectionsSection } from '../components/FeaturedCollectionsSection';
import { HeroCarousel } from '../components/HeroCarousel';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import { SubBannerSection } from '../components/SubBannerSection';
import type { CollectionSummary, HomeResponse, ProductCardItem } from '../lib/types';

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      storefrontApi.getHome(),
      storefrontApi.getCollections(),
      storefrontApi.getProducts({ featured: true }),
    ])
      .then(([homeResponse, collectionsResponse, featuredProductsResponse]) => {
        setHomeData(homeResponse);
        setCollections(collectionsResponse.slice(0, 4));
        setFeaturedProducts(featuredProductsResponse.items.slice(0, 4));
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
      <FeaturedCollectionsSection
        collections={collections}
        eyebrow="Bộ sưu tập mới"
        title="Bộ sưu tập mới"
        description="Khám phá 4 bộ sưu tập mới đang được đồng bộ trực tiếp từ API collection."
      />
      <SubBannerSection banners={homeData?.subBanners ?? []} />
      <ProductGrid
        products={featuredProducts}
        eyebrow="Sản phẩm nổi bật"
        title="Sản phẩm nổi bật"
        description="4 sản phẩm nổi bật được gọi trực tiếp từ API product như storefront đang publish."
      />
      <CategorySection categories={homeData?.categories ?? []} />
      <EditorialSection editorials={homeData?.latestEditorials ?? []} />
    </PageTransition>
  );
}
