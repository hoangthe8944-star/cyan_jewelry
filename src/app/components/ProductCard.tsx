import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heart, ShoppingBag } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { formatCurrency } from '../api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  id: string;
  slug: string;
  image: string;
  name: string;
  collection: string;
  price: number;
  badge?: string;
  index?: number;
}

export function ProductCard({ id, slug, image, name, collection, price, badge, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const product = { id, slug, image, name, collection, price, badge };

  return (
    <motion.div
      ref={ref}
      className="group relative bg-white cursor-pointer"
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
        className="relative aspect-[3/4] overflow-hidden bg-muted"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover" />
        </motion.div>
        {badge ? (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-xs tracking-wider"
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
          className={`absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isInWishlist(id) ? 'bg-accent text-white' : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(id) ? 'fill-white' : ''}`} />
        </motion.button>
        <motion.button
          onClick={(event) => {
            event.stopPropagation();
            addToCart(product);
          }}
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute bottom-4 left-4 right-4 bg-primary text-white py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-secondary flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm tracking-wide">Quick Add</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="py-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        <p className="text-xs tracking-wider text-muted-foreground mb-1 uppercase">
          {collection}
        </p>
        <h3 className="text-sm mb-2 tracking-wide group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-accent font-medium tracking-wide">{formatCurrency(price)}</p>
      </motion.div>
    </motion.div>
  );
}
