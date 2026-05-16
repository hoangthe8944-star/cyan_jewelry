import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Filter, RefreshCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { PageTransition } from '../components/PageTransition';
import type { CategoryNode, ProductCardItem } from '../lib/types';

function flattenCategories(categories: CategoryNode[]) {
  return categories.flatMap((category) => [category, ...category.children]);
}

const COLOR_RULES = [
  { label: 'Gold', keywords: ['gold', 'yellow gold'] },
  { label: 'Silver', keywords: ['silver', 'white gold', 'platinum'] },
  { label: 'Rose Gold', keywords: ['rose gold', 'pink gold'] },
  { label: 'Black', keywords: ['black', 'onyx'] },
  { label: 'Blue', keywords: ['blue', 'sapphire', 'topaz', 'aquamarine'] },
  { label: 'Green', keywords: ['green', 'emerald'] },
  { label: 'Red', keywords: ['red', 'ruby', 'garnet'] },
  { label: 'Purple', keywords: ['purple', 'amethyst'] },
  { label: 'White', keywords: ['white', 'diamond', 'pearl', 'crystal'] },
] as const;

function detectProductColors(product: ProductCardItem) {
  const haystack = [product.name, product.material, product.gemstone]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return COLOR_RULES.filter((rule) => rule.keywords.some((keyword) => haystack.includes(keyword))).map(
    (rule) => rule.label
  );
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const selectedCategorySlug = searchParams.get('category') ?? '';
  const selectedColor = searchParams.get('color') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const featured = searchParams.get('featured') === 'true';

  const categoryLookup = useMemo(() => {
    const entries = flattenCategories(categories).map((category) => [category.slug, category.name] as const);
    return new Map(entries);
  }, [categories]);

  const colorOptions = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) => {
      detectProductColors(product).forEach((color) => values.add(color));
    });
    return Array.from(values);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!selectedColor) {
      return products;
    }

    return products.filter((product) => detectProductColors(product).includes(selectedColor));
  }, [products, selectedColor]);

  useEffect(() => {
    storefrontApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = {
      featured: featured || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    setLoading(true);
    setError(null);

    const request = selectedCategorySlug
      ? storefrontApi.getCategoryProducts(selectedCategorySlug, params)
      : storefrontApi.getProducts({
          categorySlug: undefined,
          ...params,
        });

    request
      .then((response) => setProducts(response.items))
      .catch((err: Error) => {
        setProducts([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [featured, maxPrice, minPrice, selectedCategorySlug]);

  const updateFilter = (key: string, value?: string | boolean) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === undefined || value === '' || value === false) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }

    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeCategoryLabel = selectedCategorySlug ? categoryLookup.get(selectedCategorySlug) : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="mb-10 flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Storefront</p>
              <h1 className="font-sterling text-[36px] lg:text-[48px]">
                {activeCategoryLabel ? activeCategoryLabel : 'All Products'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm tracking-wide text-muted-foreground">
                Explore Oriven Jewelry collections with live filters by category, price, and featured pieces.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center gap-3 border border-border px-4 py-2 text-sm uppercase tracking-[0.22em] transition-colors hover:border-primary hover:text-primary"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading products...' : `${filteredProducts.length} products found`}
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Shop By Category</h2>
              {selectedCategorySlug ? (
                <button
                  type="button"
                  onClick={() => updateFilter('category')}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                >
                  View All
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <button
                type="button"
                onClick={() => updateFilter('category')}
                className={`group relative aspect-[4/5] overflow-hidden text-left transition-all duration-300 ${
                  !selectedCategorySlug
                    ? 'ring-2 ring-primary'
                    : 'hover:-translate-y-1'
                }`}
              >
                <div className="absolute inset-0 bg-primary" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">All</p>
                  <h3 className="mt-3 font-sterling text-[22px]">All Products</h3>
                </div>
              </button>

              {categories.map((category) => {
                const isActive = selectedCategorySlug === category.slug;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => updateFilter('category', category.slug)}
                    className={`group relative aspect-[4/5] overflow-hidden text-left transition-all duration-300 ${
                      isActive
                        ? 'ring-2 ring-primary'
                        : 'hover:-translate-y-1'
                    }`}
                  >
                    <div className="absolute inset-0">
                      <ImageWithFallback
                        src={resolveMediaUrl(category.coverMedia)}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/70">Category</p>
                      <h3 className="mt-3 font-sterling text-[22px] leading-tight">{category.name}</h3>
                      <p className="mt-3 text-sm text-white/80">
                        {category.children.length > 0
                          ? `${category.children.length} collections`
                          : 'Explore collection'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {isFilterOpen ? (
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 z-40 bg-black/35"
                  aria-label="Close filters"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                  className="fixed left-0 top-0 z-50 h-full w-full max-w-[380px] overflow-y-auto border-r border-border bg-white p-6 shadow-2xl"
                >
                  <div className="mb-6 flex items-center justify-between border-b border-border pb-5">
                    <div className="flex items-center gap-3">
                      <Filter className="h-4 w-4" />
                      <h2 className="text-sm uppercase tracking-[0.25em]">Filters</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="transition-colors hover:text-primary"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Refine selection
                      </span>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                      >
                        Reset
                      </button>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Categories</h3>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => updateFilter('category')}
                          className={`block w-full text-left text-sm transition-colors ${
                            !selectedCategorySlug ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                          }`}
                        >
                          All Products
                        </button>
                        {categories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <button
                              type="button"
                              onClick={() => updateFilter('category', category.slug)}
                              className={`block w-full text-left text-sm transition-colors ${
                                selectedCategorySlug === category.slug
                                  ? 'text-primary'
                                  : 'text-muted-foreground hover:text-primary'
                              }`}
                            >
                              {category.name}
                            </button>
                            {category.children.length > 0 ? (
                              <div className="space-y-2 pl-4">
                                {category.children.map((child) => (
                                  <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => updateFilter('category', child.slug)}
                                    className={`block w-full text-left text-sm transition-colors ${
                                      selectedCategorySlug === child.slug
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-primary'
                                    }`}
                                  >
                                    {child.name}
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Color</h3>
                      <select
                        value={selectedColor}
                        onChange={(event) => updateFilter('color', event.target.value)}
                        className="w-full border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      >
                        <option value="">All Colors</option>
                        {colorOptions.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Price Range</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Min
                          <input
                            type="number"
                            min="0"
                            value={minPrice}
                            onChange={(event) => updateFilter('minPrice', event.target.value)}
                            className="mt-2 w-full border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                            placeholder="0"
                          />
                        </label>
                        <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Max
                          <input
                            type="number"
                            min="0"
                            value={maxPrice}
                            onChange={(event) => updateFilter('maxPrice', event.target.value)}
                            className="mt-2 w-full border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                            placeholder="5000"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Collection Type</h3>
                      <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(event) => updateFilter('featured', event.target.checked)}
                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                        />
                        Featured products only
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-2 border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Clear all filters
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="bg-primary px-5 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-secondary"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </>
            ) : null}
          </AnimatePresence>

          <section>
              {error ? (
                <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                  Failed to load products: {error}
                </div>
              ) : null}

              {!error && loading ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[3/4] bg-muted" />
                      <div className="mt-4 h-3 w-24 bg-muted" />
                      <div className="mt-3 h-4 w-3/4 bg-muted" />
                      <div className="mt-3 h-4 w-20 bg-muted" />
                    </div>
                  ))}
                </div>
              ) : null}

              {!error && !loading && filteredProducts.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-border bg-muted/20 px-6 text-center">
                  <h2 className="font-sterling text-[28px]">No products found</h2>
                  <p className="mt-3 max-w-md text-sm text-muted-foreground">
                    Try adjusting the category or price filters to explore more of the collection.
                  </p>
                </div>
              ) : null}

              {!error && !loading && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      image={resolveMediaUrl(product.gallery[0])}
                      name={product.name}
                      collection={product.brand || 'Oriven Jewelry'}
                      price={product.minPrice}
                      badge={product.featured ? 'Featured' : undefined}
                      index={index}
                    />
                  ))}
                </div>
              ) : null}
            </section>
        </div>
      </div>
    </PageTransition>
  );
}
