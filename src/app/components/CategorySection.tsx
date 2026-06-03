import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion, useInView } from 'motion/react';

import { resolveMediaUrl } from '../api';
import type { CategoryNode } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CategorySection({ categories }: { categories: CategoryNode[] }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-muted py-12 sm:py-20">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6">
        <motion.div
          className="mb-8 text-center sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-2 font-sterling text-[28px] sm:mb-3 sm:text-[40px]">Danh mục sản phẩm</h2>
          <p className="text-sm tracking-wide text-muted-foreground sm:text-base">
            Những lựa chọn được tuyển chọn cho từng phong cách và dịp khác nhau
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => navigate(`/products?category=${category.slug}`)}
              className="group relative aspect-[3/4] overflow-hidden text-left sm:aspect-square"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 50 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="h-full w-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <ImageWithFallback
                  src={resolveMediaUrl(category.coverMedia)}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 0.95 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.h3
                  className="font-sterling text-[20px] tracking-wide text-white sm:text-[28px] lg:text-[32px]"
                  initial={{ y: 0 }}
                  whileHover={{ y: -10, scale: 1.1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {category.name}
                </motion.h3>
              </div>
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1 bg-accent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
