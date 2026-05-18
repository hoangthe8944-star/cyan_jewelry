import { useEffect, useState } from 'react';

import { storefrontApi } from '../api';
import { CategorySection } from '../components/CategorySection';
import { EditorialSection } from '../components/EditorialSection';
import { HeroCarousel } from '../components/HeroCarousel';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import { SubBannerSection } from '../components/SubBannerSection';
import type { HomeResponse, ProductCardItem } from '../lib/types';

function formatVndCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function pickRandomProducts(products: ProductCardItem[], count: number) {
  return [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [bestSellingProducts, setBestSellingProducts] = useState<ProductCardItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([storefrontApi.getHome(), storefrontApi.getProducts({ featured: true }), storefrontApi.getProducts()])
      .then(([homeResponse, featuredProductsResponse, productsResponse]) => {
        setHomeData(homeResponse);
        const randomSource = productsResponse.items.length > 0 ? productsResponse.items : homeResponse.featuredProducts;
        setFeaturedProducts(
          pickRandomProducts(randomSource, 4)
        );

        const fallbackProducts =
          featuredProductsResponse.items.length > 0
            ? featuredProductsResponse.items
            : homeResponse.featuredProducts.length > 0
              ? homeResponse.featuredProducts
              : productsResponse.items;

        setBestSellingProducts(fallbackProducts.slice(0, 4));
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
        products={bestSellingProducts}
        eyebrow="Sản phẩm bán chạy"
        title="Sản phẩm bán chạy"
        description="Những thiết kế được yêu thích nhiều nhất và được chọn mua thường xuyên tại Cyan."
        priceFormatter={formatVndCurrency}
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
