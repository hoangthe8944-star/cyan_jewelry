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
      <ProductGrid products={homeData?.newArrivals ?? []} />
      <SubBannerSection banners={homeData?.subBanners ?? []} />
      <FeaturedCollectionsSection collections={homeData?.featuredCollections ?? []} />
      <CategorySection categories={homeData?.categories ?? []} />
      <EditorialSection editorials={homeData?.latestEditorials ?? []} />
    </PageTransition>
  );
}
