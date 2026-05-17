import { useEffect, useState } from 'react';

import { storefrontApi } from '../api';
import { CategorySection } from '../components/CategorySection';
import { EditorialSection } from '../components/EditorialSection';
import { FeaturedCollectionsSection } from '../components/FeaturedCollectionsSection';
import { HeroCarousel } from '../components/HeroCarousel';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import { SubBannerSection } from '../components/SubBannerSection';
import type { HomeResponse } from '../lib/types';

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storefrontApi
      .getHome()
      .then(setHomeData)
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
        products={homeData?.newArrivals ?? []}
        eyebrow="New Collection"
        title="New Collection"
        description="Khám phá những thiết kế mới nhất vừa xuất hiện trong bộ sưu tập mới của Oriven."
      />
      <SubBannerSection banners={homeData?.subBanners ?? []} />
      <FeaturedCollectionsSection
        collections={homeData?.featuredCollections ?? []}
        eyebrow="Sản phẩm nổi bật"
        title="Sản phẩm nổi bật"
        description="Những bộ sưu tập và thiết kế nổi bật đang được storefront ưu tiên giới thiệu trên trang chủ."
      />
      <CategorySection categories={homeData?.categories ?? []} />
      <EditorialSection editorials={homeData?.latestEditorials ?? []} />
    </PageTransition>
  );
}
