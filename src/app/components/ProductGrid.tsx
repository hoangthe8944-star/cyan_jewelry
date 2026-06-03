import { useRef } from 'react';

import { motion, useInView } from 'motion/react';

import { resolveMediaUrl } from '../api';
import type { ProductCardItem } from '../lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: ProductCardItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  priceFormatter?: (value: number) => string;
}

export function ProductGrid({
  products,
  eyebrow,
  title = 'Sản phẩm mới',
  description = 'Khám phá những thiết kế mới nhất vừa có mặt tại Oriven',
  priceFormatter,
}: ProductGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6">
        <motion.div
          className="mb-8 text-center sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow ? (
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground sm:mb-3 sm:text-sm">{eyebrow}</p>
          ) : null}
          <h2 className="mb-2 font-sterling text-[28px] sm:mb-3 sm:text-[40px]">{title}</h2>
          <p className="text-sm tracking-wide text-muted-foreground sm:text-base">{description}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
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
              priceFormatter={priceFormatter}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
