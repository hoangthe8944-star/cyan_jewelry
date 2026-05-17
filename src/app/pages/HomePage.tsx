import { useEffect, useState } from 'react';

import { storefrontApi } from '../api';
import { CategorySection } from '../components/CategorySection';
import { EditorialSection } from '../components/EditorialSection';
import { HeroCarousel } from '../components/HeroCarousel';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import { SubBannerSection } from '../components/SubBannerSection';
import type { HomeResponse, ProductCardItem } from '../lib/types';

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [newCollectionProducts, setNewCollectionProducts] = useState<ProductCardItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([storefrontApi.getHome(), storefrontApi.getCollections(), storefrontApi.getProducts()])
      .then(async ([homeResponse, collectionsResponse, productsResponse]) => {
        setHomeData(homeResponse);
        setFeaturedProducts(
          (productsResponse.items.length > 0 ? productsResponse.items : homeResponse.featuredProducts).slice(0, 4)
        );

        const firstCollection = collectionsResponse[0];
        if (!firstCollection) {
          setNewCollectionProducts([]);
          return;
        }

        const collectionDetail = await storefrontApi.getCollectionBySlug(firstCollection.slug);
        setNewCollectionProducts(collectionDetail.products.slice(0, 4));
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
        products={newCollectionProducts}
        eyebrow="Bộ sưu tập mới"
        title="Bộ sưu tập mới"
      />
      <SubBannerSection banners={homeData?.subBanners ?? []} />
      <ProductGrid
        products={featuredProducts}
        eyebrow="Sản phẩm nổi bật"
        title="Sản phẩm nổi bật"
      />
      <CategorySection categories={homeData?.categories ?? []} />
      <EditorialSection editorials={homeData?.latestEditorials ?? []} />
    </PageTransition>
  );
}
