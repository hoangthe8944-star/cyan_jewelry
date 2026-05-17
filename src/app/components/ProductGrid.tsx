import { useRef } from 'react';

import { motion, useInView } from 'motion/react';

import { resolveMediaUrl } from '../api';
import type { ProductCardItem } from '../lib/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products }: { products: ProductCardItem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-[1800px] px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-3 font-sterling text-[40px]">Sản phẩm mới</h2>
          <p className="tracking-wide text-muted-foreground">
            Khám phá những thiết kế mới nhất vừa có mặt tại Oriven
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
