import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Filter, RefreshCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { ProductCard } from '../components/ProductCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import type { CategoryNode, ProductCardItem } from '../lib/types';

function flattenCategories(categories: CategoryNode[]) {
  return categories.flatMap((category) => [category, ...category.children]);
}

const COLOR_RULES = [
  { label: 'Vàng', keywords: ['gold', 'yellow gold'] },
  { label: 'Bạc', keywords: ['silver', 'white gold', 'platinum'] },
  { label: 'Vàng hồng', keywords: ['rose gold', 'pink gold'] },
  { label: 'Đen', keywords: ['black', 'onyx'] },
  { label: 'Xanh dương', keywords: ['blue', 'sapphire', 'topaz', 'aquamarine'] },
  { label: 'Xanh lá', keywords: ['green', 'emerald'] },
  { label: 'Đỏ', keywords: ['red', 'ruby', 'garnet'] },
  { label: 'Tím', keywords: ['purple', 'amethyst'] },
  { label: 'Trắng', keywords: ['white', 'diamond', 'pearl', 'crystal'] },
] as const;

const PRODUCTS_PER_PAGE = 8;

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
  const navigate = useNavigate();
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
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);

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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

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

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      const nextParams = new URLSearchParams(searchParams);

      if (safeCurrentPage <= 1) {
        nextParams.delete('page');
      } else {
        nextParams.set('page', String(safeCurrentPage));
      }

      setSearchParams(nextParams, { replace: true });
    }
  }, [currentPage, safeCurrentPage, searchParams, setSearchParams]);

  const updateFilter = (key: string, value?: string | boolean) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === undefined || value === '' || value === false) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }

    if (key !== 'page') {
      nextParams.delete('page');
    }

    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeCategoryLabel = selectedCategorySlug ? categoryLookup.get(selectedCategorySlug) : null;

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (safeCurrentPage >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
    }

    return [safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1];
  }, [safeCurrentPage, totalPages]);

  const goToPage = (page: number) => {
    updateFilter('page', page <= 1 ? undefined : String(page));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-24 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Cửa hàng</p>
              <h1 className="font-sterling text-[36px] lg:text-[48px]">
                {activeCategoryLabel ? activeCategoryLabel : 'Tất cả sản phẩm'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm tracking-wide text-muted-foreground">
                Khám phá các bộ sưu tập Oriven Jewelry với bộ lọc trực tiếp theo danh mục, giá và sản phẩm nổi bật.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center gap-3 border border-border px-4 py-2 text-sm uppercase tracking-[0.22em] transition-colors hover:border-primary hover:text-primary"
              >
                <Filter className="h-4 w-4" />
                Lọc
              </button>
              <button
                type="button"
                onClick={() => navigate('/customize')}
                className="inline-flex items-center gap-3 border border-[#A36B31] text-[#A36B31] px-4 py-2 text-sm uppercase tracking-[0.22em] transition-colors hover:bg-[#A36B31]/5"
              >
                Tự thiết kế
              </button>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Đang tải sản phẩm...' : `${filteredProducts.length} sản phẩm`}
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Mua sắm theo danh mục</h2>
              {selectedCategorySlug ? (
                <button
                  type="button"
                  onClick={() => updateFilter('category')}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                >
                  Xem tất cả
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
              <button
                type="button"
                onClick={() => updateFilter('category')}
                className={`group relative aspect-[4/5] overflow-hidden text-left transition-all duration-300 ${
                  !selectedCategorySlug ? 'ring-2 ring-primary' : 'hover:-translate-y-1'
                }`}
              >
                <div className="absolute inset-0 bg-primary" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 text-white sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">Tất cả</p>
                  <h3 className="mt-1.5 font-sterling text-[16px] sm:mt-3 sm:text-[22px]">Tất cả sản phẩm</h3>
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
                      isActive ? 'ring-2 ring-primary' : 'hover:-translate-y-1'
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
                    <div className="absolute inset-0 flex flex-col justify-end p-3 text-white sm:p-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">Danh mục</p>
                      <h3 className="mt-1.5 font-sterling text-[16px] leading-tight sm:mt-3 sm:text-[22px]">{category.name}</h3>
                      <p className="mt-1.5 text-xs text-white/80 sm:mt-3 sm:text-sm">
                        {category.children.length > 0
                          ? `${category.children.length} bộ sưu tập`
                          : 'Khám phá danh mục'}
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
                  aria-label="Đóng bộ lọc"
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
                      <h2 className="text-sm uppercase tracking-[0.25em]">Bộ lọc</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="transition-colors hover:text-primary"
                      aria-label="Đóng bộ lọc"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tinh chỉnh lựa chọn</span>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                      >
                        Đặt lại
                      </button>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Danh mục</h3>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => updateFilter('category')}
                          className={`block w-full text-left text-sm transition-colors ${
                            !selectedCategorySlug ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                          }`}
                        >
                          Tất cả sản phẩm
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
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Màu sắc</h3>
                      <select
                        value={selectedColor}
                        onChange={(event) => updateFilter('color', event.target.value)}
                        className="w-full border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      >
                        <option value="">Tất cả màu sắc</option>
                        {colorOptions.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Khoảng giá</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Tối thiểu
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
                          Tối đa
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
                      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-foreground">Loại hiển thị</h3>
                      <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(event) => updateFilter('featured', event.target.checked)}
                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                        />
                        Chỉ hiện sản phẩm nổi bật
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-2 border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Xóa toàn bộ bộ lọc
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="bg-primary px-5 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-secondary"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </>
            ) : null}
          </AnimatePresence>

          <section id="products">
            {error ? (
              <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                Không thể tải sản phẩm: {error}
              </div>
            ) : null}

            {!error && loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted" />
                    <div className="mt-3 h-2.5 w-16 bg-muted sm:mt-4 sm:h-3 sm:w-24" />
                    <div className="mt-2 h-3 w-3/4 bg-muted sm:mt-3 sm:h-4" />
                    <div className="mt-2 h-3 w-14 bg-muted sm:mt-3 sm:h-4 sm:w-20" />
                  </div>
                ))}
              </div>
            ) : null}

            {!error && !loading && filteredProducts.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-border bg-muted/20 px-6 text-center">
                <h2 className="font-sterling text-[28px]">Không tìm thấy sản phẩm</h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  Hãy thử điều chỉnh danh mục hoặc bộ lọc giá để khám phá thêm sản phẩm phù hợp.
                </p>
              </div>
            ) : null}

            {!error && !loading && filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      image={resolveMediaUrl(product.gallery[0])}
                      name={product.name}
                      collection={product.brand || 'Oriven Jewelry'}
                      price={product.minPrice}
                      badge={product.featured ? 'Nổi bật' : undefined}
                      index={index}
                    />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-12 space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                      Trang {safeCurrentPage} / {totalPages}
                    </p>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#products"
                            onClick={(event) => {
                              event.preventDefault();
                              if (safeCurrentPage > 1) {
                                goToPage(safeCurrentPage - 1);
                              }
                            }}
                            className={safeCurrentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>

                        {visiblePageNumbers[0] > 1 ? (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                href="#products"
                                onClick={(event) => {
                                  event.preventDefault();
                                  goToPage(1);
                                }}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {visiblePageNumbers[0] > 2 ? (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : null}
                          </>
                        ) : null}

                        {visiblePageNumbers.map((pageNumber) => (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#products"
                              isActive={pageNumber === safeCurrentPage}
                              onClick={(event) => {
                                event.preventDefault();
                                goToPage(pageNumber);
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages ? (
                          <>
                            {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 ? (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : null}
                            <PaginationItem>
                              <PaginationLink
                                href="#products"
                                onClick={(event) => {
                                  event.preventDefault();
                                  goToPage(totalPages);
                                }}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        ) : null}

                        <PaginationItem>
                          <PaginationNext
                            href="#products"
                            onClick={(event) => {
                              event.preventDefault();
                              if (safeCurrentPage < totalPages) {
                                goToPage(safeCurrentPage + 1);
                              }
                            }}
                            className={safeCurrentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                ) : null}
              </>
            ) : null}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
