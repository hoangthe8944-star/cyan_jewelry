import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Check, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { useShop } from '../context/ShopContext';
import type { ProductDetail } from '../lib/types';

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

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariantCode, setSelectedVariantCode] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug) {
      return;
    }

    storefrontApi.getProductBySlug(slug).then((value) => {
      setProduct(value);
      setSelectedVariantCode(value.variants[0]?.variantCode ?? null);
      setSelectedOptions(buildSelectionMap(value, value.variants[0]?.variantCode));
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
            (selection) =>
              selection.optionType === option.type && selection.valueCode === selectedValue
          );
        })
      ) ?? null
    );
  }, [product, selectedOptions]);

  const activeVariant = availableVariant ?? selectedVariant;
  const tags = product?.tags?.filter(Boolean) ?? [];
  const shortDescription = product?.shortDescription?.trim() || product?.description?.trim() || 'Đang cập nhật';

  useEffect(() => {
    if (!product || !availableVariant) {
      return;
    }

    if (availableVariant.variantCode !== selectedVariantCode) {
      setSelectedVariantCode(availableVariant.variantCode);
    }
  }, [availableVariant, product, selectedVariantCode]);

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
          (selection) =>
            selection.optionType === selectedType && selection.valueCode === selectedValue
        );
      });

      if (!matchesOtherOptions) {
        return false;
      }

      return variant.selections.some(
        (selection) =>
          selection.optionType === optionType && selection.valueCode === valueCode
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
          (selection) =>
            selection.optionType === option.type && selection.valueCode === selectedValue
        );
      })
    );

    if (nextVariant) {
      setSelectedVariantCode(nextVariant.variantCode);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-[24px]">Đang tải sản phẩm...</h2>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              className="relative aspect-square overflow-hidden bg-muted"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} className="h-full w-full">
                <ImageWithFallback
                  src={resolveMediaUrl(activeVariant?.media[0] ?? product.gallery[0])}
                  alt={product.name}
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
                  {product.name}
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
                  <p className="text-[15px] leading-8 text-slate-700">
                    {product.description ??
                      'Sản phẩm được hoàn thiện từ chất liệu cao cấp, mang lại vẻ đẹp tinh tế và phong cách đặc trưng của bộ sưu tập.'}
                  </p>
                </div>

                {product.options.length > 0 ? (
                  <div className="mb-10 space-y-8">
                    {product.options.map((option) => (
                      <div key={option.type}>
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <label className="block text-sm tracking-wide">{option.name}</label>
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {option.values.find((value) => value.code === selectedOptions[option.type])?.label ?? 'Chọn'}
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
                ) : (
                  <div className="mb-10">
                    <label className="mb-4 block text-sm tracking-wide">Chọn phân loại</label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.variantCode}
                          onClick={() => {
                            setSelectedVariantCode(variant.variantCode);
                            setSelectedOptions(buildSelectionMap(product, variant.variantCode));
                          }}
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
                )}

                <div className="mb-10 flex flex-wrap items-center gap-4 border-y border-border py-5 text-sm">
                  <span className="text-muted-foreground">{tags.length > 0 ? tags.join(', ') : 'Đang cập nhật'}</span>
                  <span className="text-muted-foreground">{shortDescription}</span>
                  <span className="text-muted-foreground">
                    Tình trạng: {activeVariant && activeVariant.stockQuantity > 0 ? `Còn ${activeVariant.stockQuantity} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>

                <motion.div
                  className="mb-10 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        collection: product.brand || 'Oriven Jewelry',
                        price: activeVariant?.price ?? product.minPrice,
                        image: resolveMediaUrl(activeVariant?.media[0] ?? product.gallery[0]),
                      })
                    }
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
        </div>
      </div>
    </PageTransition>
  );
}
