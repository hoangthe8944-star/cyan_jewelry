import { useRef } from 'react';

import { motion, useInView } from 'motion/react';

import { ProductCard } from './ProductCard';
import { resolveMediaUrl } from '../api';
import type { ProductCardItem } from '../lib/types';

export function ProductGrid({ products }: { products: ProductCardItem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-[1800px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-sterling text-[40px] mb-3">Bộ sưu tập mới</h2>
          <p className="text-muted-foreground tracking-wide">
            Khám phá những thiết kế mới nhất vừa có mặt tại Oriven
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
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
      </div>
    </section>
  );
}
