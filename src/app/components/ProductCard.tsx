import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heart, ShoppingBag } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { formatCurrency, optimizeProductCardImageUrl } from '../api';
import { useShop } from '../context/ShopContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  id: string;
  slug: string;
  image: string;
  name: string;
  collection: string;
  price: number;
  badge?: string;
  index?: number;
  priceFormatter?: (value: number) => string;
}

export function ProductCard({
  id,
  slug,
  image,
  name,
  collection,
  price,
  badge,
  index = 0,
  priceFormatter = formatCurrency,
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useShop();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [imageFitMode, setImageFitMode] = useState<'cover' | 'contain'>('cover');
  const product = { id, slug, image, name, collection, price, badge };

  useEffect(() => {
    let isMounted = true;
    const previewImage = new window.Image();

    previewImage.onload = () => {
      if (!isMounted || !previewImage.naturalWidth || !previewImage.naturalHeight) {
        return;
      }

      const ratio = previewImage.naturalWidth / previewImage.naturalHeight;
      const nextMode = ratio > 1.15 || ratio < 0.62 ? 'contain' : 'cover';
      setImageFitMode(nextMode);
    };

    previewImage.onerror = () => {
      if (isMounted) {
        setImageFitMode('cover');
      }
    };

    previewImage.src = image;

    return () => {
      isMounted = false;
    };
  }, [image]);

  const imageSrc = useMemo(
    () => optimizeProductCardImageUrl(image, imageFitMode),
    [image, imageFitMode]
  );
  const imageClassName =
    imageFitMode === 'contain'
      ? 'h-full w-full object-contain p-5 md:p-6'
      : 'h-full w-full object-cover object-center';

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-pointer bg-white"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${slug}`)}
    >
      <motion.div
        className={`relative aspect-[3/4] overflow-hidden sm:aspect-[3/4] ${
          imageFitMode === 'contain'
            ? 'bg-[linear-gradient(180deg,#fbf8f4_0%,#f3eee7_100%)]'
            : 'bg-muted'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <ImageWithFallback src={imageSrc} alt={name} className={imageClassName} />
        </motion.div>
        {badge ? (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.07 + 0.3 }}
            className="absolute left-2 top-2 bg-accent px-2 py-0.5 text-[10px] tracking-wider text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs"
          >
            {badge}
          </motion.span>
        ) : null}
        <motion.button
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist(product);
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute right-2 top-2 p-1.5 opacity-100 transition-all duration-300 sm:right-4 sm:top-4 sm:p-2 md:opacity-0 md:group-hover:opacity-100 ${
            isInWishlist(id) ? 'bg-accent text-white' : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isInWishlist(id) ? 'fill-white' : ''}`} />
        </motion.button>
        <motion.button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/product/${slug}`);
          }}
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 bg-primary py-2 text-white opacity-0 transition-all duration-300 hover:bg-secondary group-hover:opacity-100 sm:bottom-4 sm:left-4 sm:right-4 sm:gap-2 sm:py-3"
        >
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs tracking-wide sm:text-sm">Chọn phiên bản</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="py-2.5 sm:py-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: index * 0.07 + 0.2 }}
      >
        <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground sm:mb-1 sm:text-xs">{collection}</p>
        <h3 className="mb-1 line-clamp-2 text-xs tracking-wide transition-colors group-hover:text-accent sm:mb-2 sm:text-sm">{name}</h3>
        <p className="text-xs font-medium tracking-wide text-accent sm:text-base">{priceFormatter(price)}</p>
      </motion.div>
    </motion.div>
  );
}
