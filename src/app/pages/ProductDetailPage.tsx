import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Check, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import { useShop } from '../context/ShopContext';
import type { CategoryNode, ProductCardItem, ProductDetail } from '../lib/types';

function buildSelectionMap(product: ProductDetail, variantCode?: string | null) {
  const variant = product.variants.find((item) => item.variantCode === variantCode) ?? product.variants[0];

  return Object.fromEntries(
    variant?.selections.map((selection) => [selection.optionType, selection.valueCode]) ?? []
  ) as Record<string, string>;
}

function formatVndCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function hasMeaningfulText(value?: string | null) {
  return Boolean(value && /\S/.test(value));
}

function getStyleLabel(product: ProductDetail, styleCode?: string | null) {
  if (!styleCode) {
    return null;
  }

  const normalizedStyleCode = styleCode.trim().toUpperCase();
  const styleOption = product.options.find((option) => option.type === 'STYLE');
  const matchingStyleValue = styleOption?.values.find((value) => value.code.trim().toUpperCase() === normalizedStyleCode);

  return matchingStyleValue?.label ?? null;
}

function pickRandomSuggestedProducts(products: ProductCardItem[], currentProductId?: string, count = 4) {
  return [...products]
    .filter((item) => item.id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function findCategorySlugById(categories: CategoryNode[], categoryId?: string | null): string | null {
  if (!categoryId) {
    return null;
  }

  for (const category of categories) {
    if (category.id === categoryId) {
      return category.slug;
    }

    const childMatch = findCategorySlugById(category.children, categoryId);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductCardItem[]>([]);
  const [selectedVariantCode, setSelectedVariantCode] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    storefrontApi
      .getProductBySlug(slug)
      .then(async (value) => {
        setProduct(value);
        setSelectedVariantCode(value.variants[0]?.variantCode ?? null);
        setSelectedOptions(buildSelectionMap(value, value.variants[0]?.variantCode));

        try {
          const categories = await storefrontApi.getCategories();
          const primaryCategoryId = value.primaryCategoryId ?? value.categoryIds?.[0] ?? null;
          const categorySlug = findCategorySlugById(categories, primaryCategoryId);

          if (categorySlug) {
            const response = await storefrontApi.getCategoryProducts(categorySlug);
            setSuggestedProducts(pickRandomSuggestedProducts(response.items, value.id, 4));
            return;
          }
        } catch {
          // Fall through to the generic product fallback below.
        }

        storefrontApi
          .getProducts()
          .then((response) => {
            setSuggestedProducts(pickRandomSuggestedProducts(response.items, value.id, 4));
          })
          .catch(() => setSuggestedProducts([]));
      })
      .catch(() => {
        setSuggestedProducts([]);
      });
  }, [slug]);

  const selectedVariant = useMemo(
    () => product?.variants.find((variant) => variant.variantCode === selectedVariantCode) ?? product?.variants[0],
    [product, selectedVariantCode]
  );

  const availableVariant = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      product.variants.find((variant) =>
        product.options.every((option) => {
          const selectedValue = selectedOptions[option.type];
          if (!selectedValue) {
            return true;
          }

          return variant.selections.some(
            (selection) => selection.optionType === option.type && selection.valueCode === selectedValue
          );
        })
      ) ?? null
    );
  }, [product, selectedOptions]);

  const activeVariant = availableVariant ?? selectedVariant;
  const tags = product?.tags?.filter(Boolean) ?? [];
  const visibleOptions = product?.options.filter((option) => option.type !== 'MODEL' && option.type !== 'STYLE') ?? [];
  const modelSelection = activeVariant?.selections.find((selection) => selection.optionType === 'MODEL') ?? null;
  const styleSelection = activeVariant?.selections.find((selection) => selection.optionType === 'STYLE') ?? null;
  const activeStyleLabel =
    (product && getStyleLabel(product, activeVariant?.styleCode)) ??
    styleSelection?.valueLabel ??
    activeVariant?.styleCode ??
    null;
  const activeProductName = activeVariant?.productName ?? product?.name ?? 'San pham';
  const activeVariantLabel =
    activeVariant?.selections.map((selection) => selection.valueLabel).join(' / ') ?? null;
  const activeMedia = activeVariant?.media?.length ? activeVariant.media : product?.gallery ?? [];
  const activePrimaryMedia = activeMedia[0] ?? product?.gallery[0];
  const resolvedSelectedMediaUrl = selectedMediaUrl ?? resolveMediaUrl(activePrimaryMedia);
  const productSku = product?.sku ?? null;
  const productTypeOptions = useMemo(() => {
    if (!product) {
      return [];
    }

    return Array.from(
      new Map(
        product.variants.map((variant) => {
          const styleValue = variant.selections.find((selection) => selection.optionType === 'STYLE');
          return [
            variant.styleCode,
            {
              code: variant.styleCode,
              label: styleValue?.valueLabel ?? variant.styleCode,
            },
          ];
        })
      ).values()
    );
  }, [product]);
  const variantPreviewItems =
    product?.variants.map((variant) => ({
      variantCode: variant.variantCode,
      label: variant.selections.filter((selection) => selection.optionType !== 'MODEL').map((selection) => selection.valueLabel).join(' / '),
      media: variant.media[0] ?? product.gallery[0],
    })) ?? [];
  const activeDescription = hasMeaningfulText(activeVariant?.fullDescription)
    ? activeVariant.fullDescription
    : hasMeaningfulText(product?.description)
      ? product.description
      : null;
  const shortDescription = hasMeaningfulText(product?.shortDescription)
    ? product.shortDescription
    : hasMeaningfulText(activeVariant?.fullDescription)
      ? activeVariant.fullDescription
      : hasMeaningfulText(product?.description)
        ? product.description
        : 'Dang cap nhat';
  useEffect(() => {
    if (!product || !availableVariant) {
      return;
    }

    if (availableVariant.variantCode !== selectedVariantCode) {
      setSelectedVariantCode(availableVariant.variantCode);
    }
  }, [availableVariant, product, selectedVariantCode]);

  useEffect(() => {
    if (!activePrimaryMedia) {
      setSelectedMediaUrl(null);
      return;
    }

    setSelectedMediaUrl(resolveMediaUrl(activePrimaryMedia));
  }, [activePrimaryMedia]);

  const isValueAvailable = (optionType: string, valueCode: string) => {
    if (!product) {
      return false;
    }

    return product.variants.some((variant) => {
      const matchesOtherOptions = Object.entries(selectedOptions).every(([selectedType, selectedValue]) => {
        if (selectedType === optionType) {
          return true;
        }

        return variant.selections.some(
          (selection) => selection.optionType === selectedType && selection.valueCode === selectedValue
        );
      });

      if (!matchesOtherOptions) {
        return false;
      }

      return variant.selections.some(
        (selection) => selection.optionType === optionType && selection.valueCode === valueCode
      );
    });
  };

  const handleOptionSelect = (optionType: string, valueCode: string) => {
    if (!product) {
      return;
    }

    const nextOptions = {
      ...selectedOptions,
      [optionType]: valueCode,
    };

    setSelectedOptions(nextOptions);

    const nextVariant = product.variants.find((variant) =>
      product.options.every((option) => {
        const selectedValue = nextOptions[option.type];
        if (!selectedValue) {
          return true;
        }

        return variant.selections.some(
          (selection) => selection.optionType === option.type && selection.valueCode === selectedValue
        );
      })
    );

    if (nextVariant) {
      setSelectedVariantCode(nextVariant.variantCode);
      setSelectedMediaUrl(resolveMediaUrl(nextVariant.media[0] ?? product.gallery[0]));
    }
  };

  const handleVariantSelect = (variantCode: string) => {
    if (!product) {
      return;
    }

    const nextVariant = product.variants.find((variant) => variant.variantCode === variantCode);

    setSelectedVariantCode(variantCode);
    setSelectedOptions(buildSelectionMap(product, variantCode));

    if (nextVariant) {
      setSelectedMediaUrl(resolveMediaUrl(nextVariant.media[0] ?? product.gallery[0]));
    }
  };

  const handleProductTypeSelect = (styleCode: string) => {
    if (!product) {
      return;
    }

    const nextVariant =
      product.variants.find((variant) => {
        if (variant.styleCode !== styleCode) {
          return false;
        }

        return Object.entries(selectedOptions).every(([selectedType, selectedValue]) => {
          if (selectedType === 'STYLE' || selectedType === 'MODEL') {
            return true;
          }

          return variant.selections.some(
            (selection) => selection.optionType === selectedType && selection.valueCode === selectedValue
          );
        });
      }) ?? product.variants.find((variant) => variant.styleCode === styleCode);

    if (!nextVariant) {
      return;
    }

    setSelectedVariantCode(nextVariant.variantCode);
    setSelectedOptions(buildSelectionMap(product, nextVariant.variantCode));
    setSelectedMediaUrl(resolveMediaUrl(nextVariant.media[0] ?? product.gallery[0]));
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart({
      id: product.id,
      slug: product.slug,
      name: activeProductName,
      collection: product.brand || 'Oriven Jewelry',
      price: activeVariant?.price ?? product.minPrice,
      image: resolveMediaUrl(activePrimaryMedia),
      productType: activeStyleLabel,
      productTypeCode: styleSelection?.valueCode ?? activeVariant?.styleCode ?? null,
      variantId: modelSelection?.valueCode ?? activeVariant?.modelCode ?? activeVariant?.variantCode ?? null,
      variantCode: activeVariant?.variantCode ?? null,
      variantLabel: activeVariantLabel,
      variantStyleCode: activeVariant?.styleCode ?? null,
      variantModelCode: activeVariant?.modelCode ?? null,
    });

    toast.success('Đã thêm vào giỏ hàng', {
      description: activeVariantLabel ? `${activeProductName} - ${activeVariantLabel}` : activeProductName,
      action: {
        label: 'Xem giỏ',
        onClick: () => navigate('/cart'),
      },
    });
  };

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-[24px]">Đang tải sản phẩm...</h2>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-24">
        <div className="mx-auto max-w-7xl px-6">
          <button
            onClick={() => navigate('/home')}
            className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <motion.div
                className="relative aspect-square overflow-hidden bg-muted"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} className="h-full w-full">
                  <ImageWithFallback
                    src={resolvedSelectedMediaUrl}
                    alt={activeProductName}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                {product.featured ? (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute left-8 top-8 bg-accent px-5 py-2 text-sm tracking-wider text-white"
                  >
                    Nổi bật
                  </motion.span>
                ) : null}
              </motion.div>

              {activeMedia.length > 1 ? (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {activeMedia.map((media, index) => {
                    const mediaUrl = resolveMediaUrl(media);
                    const isActive = mediaUrl === resolvedSelectedMediaUrl;

                    return (
                      <button
                        key={`${media.url}-${index}`}
                        type="button"
                        onClick={() => setSelectedMediaUrl(mediaUrl)}
                        className={`overflow-hidden border bg-muted transition-all ${
                          isActive ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary'
                        }`}
                      >
                        <ImageWithFallback
                          src={mediaUrl}
                          alt={media.altText ?? `${activeProductName} ${index + 1}`}
                          className="aspect-square h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {variantPreviewItems.length > 1 ? (
                <div className="space-y-3 border-t border-border pt-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Hình ảnh phiên bản</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {variantPreviewItems.map((variant) => {
                      const isActive = variant.variantCode === activeVariant?.variantCode;

                      return (
                        <button
                          key={variant.variantCode}
                          type="button"
                          onClick={() => handleVariantSelect(variant.variantCode)}
                          className={`flex items-center gap-4 border p-3 text-left transition-all ${
                            isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                          }`}
                        >
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-muted">
                            <ImageWithFallback
                              src={resolveMediaUrl(variant.media)}
                              alt={variant.label || activeProductName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{variant.label || activeProductName}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              {isActive ? 'Đang chọn' : 'Chọn phiên bản'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-3 text-sm uppercase tracking-wider text-muted-foreground"
                >
                  {product.brand || 'Oriven Jewelry'}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 font-sterling text-[40px] leading-tight lg:text-[48px]"
                >
                  {activeProductName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 text-[32px] font-medium text-accent"
                >
                  {formatVndCurrency(activeVariant?.price ?? product.minPrice)}
                </motion.p>

                <div className="mb-10 border-b border-border pb-8">
                  <p className="whitespace-pre-wrap text-[15px] leading-8 text-slate-700">
                    {activeDescription ??
                      'Sản phẩm được hoàn thiện từ chất liệu cao cấp, mang lại vẻ đẹp tinh tế và phong cách đặc trưng của bộ sưu tập.'}
                  </p>
                </div>

                <div className="mb-10 text-sm">
                  <div className="border border-primary/18 bg-white">
                    <p className="bg-primary px-5 py-3 text-xs uppercase tracking-[0.24em] text-white">Mã sản phẩm</p>
                    <p className="px-5 py-4 text-base font-medium tracking-[0.04em] text-foreground">
                      {productSku ?? 'Đang cập nhật'}
                    </p>
                  </div>
                </div>

                {productTypeOptions.length > 0 || visibleOptions.length > 0 ? (
                  <div className="mb-10 space-y-8">
                    {productTypeOptions.length > 0 ? (
                      <div>
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <label className="block text-sm tracking-wide">Loại sản phẩm</label>
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {productTypeOptions.find((option) => option.code === activeVariant?.styleCode)?.label ?? 'Chọn'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {productTypeOptions.map((option) => {
                            const isSelected = activeVariant?.styleCode === option.code;

                            return (
                              <button
                                key={option.code}
                                type="button"
                                onClick={() => handleProductTypeSelect(option.code)}
                                className={`min-w-[92px] border px-4 py-3 text-sm transition-all duration-200 ${
                                  isSelected
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-border bg-white text-foreground hover:border-primary'
                                } ${productTypeOptions.length === 1 ? 'cursor-default' : ''}`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {visibleOptions.map((option) => (
                      <div key={option.type}>
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <label className="block text-sm tracking-wide">{option.name}</label>
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {option.values.find((value) => value.code === selectedOptions[option.type])?.label ??
                              'Chọn'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {option.values.map((value) => {
                            const isSelected = selectedOptions[option.type] === value.code;
                            const isAvailable = isValueAvailable(option.type, value.code);

                            return (
                              <button
                                key={value.code}
                                type="button"
                                onClick={() => handleOptionSelect(option.type, value.code)}
                                disabled={!isAvailable}
                                className={`min-w-[92px] border px-4 py-3 text-sm transition-all duration-200 ${
                                  isSelected
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-border bg-white text-foreground hover:border-primary'
                                } ${!isAvailable ? 'cursor-not-allowed opacity-35' : ''}`}
                              >
                                {value.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : product.variants.length > 1 ? (
                  <div className="mb-10">
                    <label className="mb-4 block text-sm tracking-wide">Chọn phân loại</label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.variantCode}
                          onClick={() => handleVariantSelect(variant.variantCode)}
                          className={`border px-4 py-4 transition-all duration-200 ${
                            selectedVariantCode === variant.variantCode
                              ? 'border-primary bg-primary text-white'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <span className="text-sm">
                            {variant.selections.map((selection) => selection.valueLabel).join(' / ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mb-10 flex flex-col gap-3 border-y border-border py-5 text-sm">
                  <span className="text-muted-foreground">{tags.length > 0 ? tags.join(', ') : 'Đang cập nhật'}</span>
                  <span className="whitespace-pre-wrap text-muted-foreground">{shortDescription}</span>
                  <span className="text-muted-foreground">
                    Tình trạng:{' '}
                    {activeVariant && activeVariant.stockQuantity > 0
                      ? `Còn ${activeVariant.stockQuantity} sản phẩm`
                      : 'Hết hàng'}
                  </span>
                </div>

                <motion.div
                  className="mb-10 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-3 bg-primary py-5 tracking-wide text-white transition-all duration-300 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!activeVariant || activeVariant.stockQuantity <= 0}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Thêm vào giỏ hàng
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        collection: product.brand || 'Oriven Jewelry',
                        price: product.minPrice,
                        image: resolveMediaUrl(product.gallery[0]),
                      })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center justify-center gap-3 border py-5 tracking-wide transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? 'border-accent bg-accent text-white'
                        : 'border-primary text-primary hover:bg-muted'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                    {isInWishlist(product.id) ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                  </motion.button>
                </motion.div>

                <div className="space-y-5 border-t border-border pt-8 text-sm">
                  <div className="flex items-start gap-4">
                    <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-accent" />
                    <div>
                      <p className="mb-1 font-medium">Miễn phí vận chuyển</p>
                      <p className="text-muted-foreground">Miễn phí giao hàng cho đơn từ 500.000đ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-accent" />
                    <div>
                      <p className="mb-1 font-medium">Bảo hành trọn đời</p>
                      <p className="text-muted-foreground">Hỗ trợ chăm sóc sản phẩm và bảo hành trọn đời</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-accent" />
                    <div>
                      <p className="mb-1 font-medium">Hộp quà tặng</p>
                      <p className="text-muted-foreground">Đóng gói chỉn chu với hộp quà đặc trưng của thương hiệu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {suggestedProducts.length > 0 ? (
            <div className="mt-20">
              <ProductGrid
                products={suggestedProducts}
                eyebrow="Gợi ý cho bạn"
                title="Có thể bạn sẽ thích"
                description="Những sản phẩm cùng danh mục được chọn ngẫu nhiên để bạn tiếp tục khám phá ngay từ trang chi tiết."
                priceFormatter={formatVndCurrency}
              />
            </div>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}





