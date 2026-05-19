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
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${slug}`)}
    >
      <motion.div
        className={`relative aspect-[3/4] overflow-hidden ${
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
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute left-4 top-4 bg-accent px-3 py-1 text-xs tracking-wider text-white"
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
          className={`absolute right-4 top-4 p-2 opacity-0 transition-all duration-300 group-hover:opacity-100 ${
            isInWishlist(id) ? 'bg-accent text-white' : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-white' : ''}`} />
        </motion.button>
        <motion.button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/product/${slug}`);
          }}
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-primary py-3 text-white opacity-0 transition-all duration-300 hover:bg-secondary group-hover:opacity-100"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm tracking-wide">Chọn phiên bản</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="py-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{collection}</p>
        <h3 className="mb-2 text-sm tracking-wide transition-colors group-hover:text-accent">{name}</h3>
        <p className="font-medium tracking-wide text-accent">{priceFormatter(price)}</p>
      </motion.div>
    </motion.div>
  );
}
