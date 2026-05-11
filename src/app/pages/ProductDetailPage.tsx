import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Check, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

import { formatCurrency, resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { useShop } from '../context/ShopContext';
import type { ProductDetail } from '../lib/types';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariantCode, setSelectedVariantCode] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    storefrontApi.getProductBySlug(slug).then((value) => {
      setProduct(value);
      setSelectedVariantCode(value.variants[0]?.variantCode ?? null);
    });
  }, [slug]);

  const selectedVariant = useMemo(
    () => product?.variants.find((variant) => variant.variantCode === selectedVariantCode) ?? product?.variants[0],
    [product, selectedVariantCode]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[24px] mb-4">Loading product...</h2>
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
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              className="relative aspect-square bg-muted overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} className="w-full h-full">
                <ImageWithFallback
                  src={resolveMediaUrl(selectedVariant?.media[0] ?? product.gallery[0])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {product.featured ? (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-8 left-8 bg-accent text-white px-5 py-2 text-sm tracking-wider"
                >
                  Featured
                </motion.span>
              ) : null}
            </motion.div>

            <div className="flex flex-col">
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm tracking-wider text-muted-foreground mb-3 uppercase"
                >
                  {product.brand || 'Cyan Jewelry'}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-sterling text-[40px] lg:text-[48px] mb-4 leading-tight"
                >
                  {product.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-accent text-[32px] font-medium mb-8"
                >
                  {formatCurrency(selectedVariant?.price ?? product.minPrice)}
                </motion.p>

                <div className="mb-10 pb-8 border-b border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description ??
                      'Exquisitely crafted with premium materials, this piece embodies the ethereal beauty and timeless elegance that define the Cyan Jewelry collection.'}
                  </p>
                </div>

                <div className="mb-10">
                  <label className="block text-sm mb-4 tracking-wide">Select Variant</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.variantCode}
                        onClick={() => setSelectedVariantCode(variant.variantCode)}
                        className={`py-4 px-4 border transition-all duration-200 ${
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

                <motion.div
                  className="space-y-4 mb-10"
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
                        collection: product.brand || 'Cyan Jewelry',
                        price: selectedVariant?.price ?? product.minPrice,
                        image: resolveMediaUrl(selectedVariant?.media[0] ?? product.gallery[0]),
                      })
                    }
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-white py-5 hover:bg-secondary transition-all duration-300 tracking-wide flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Shopping Bag
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        collection: product.brand || 'Cyan Jewelry',
                        price: product.minPrice,
                        image: resolveMediaUrl(product.gallery[0]),
                      })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full border py-5 transition-all duration-300 tracking-wide flex items-center justify-center gap-3 ${
                      isInWishlist(product.id)
                        ? 'border-accent bg-accent text-white'
                        : 'border-primary text-primary hover:bg-muted'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                    {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                  </motion.button>
                </motion.div>

                <div className="space-y-5 text-sm border-t border-border pt-8">
                  <div className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Complimentary Shipping</p>
                      <p className="text-muted-foreground">Free shipping on all orders over $500</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Lifetime Warranty</p>
                      <p className="text-muted-foreground">Professional care and lifetime warranty included</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Gift Packaging</p>
                      <p className="text-muted-foreground">Elegantly wrapped in our signature packaging</p>
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
