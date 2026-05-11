import { useRef } from 'react';

import { motion, useInView } from 'motion/react';

import { ImageWithFallback } from './figma/ImageWithFallback';
import { resolveMediaUrl } from '../api';
import type { CategoryNode } from '../lib/types';

export function CategorySection({ categories }: { categories: CategoryNode[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-muted">
      <div className="max-w-[1800px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-sterling text-[40px] mb-3">Shop by Category</h2>
          <p className="text-muted-foreground tracking-wide">
            Curated collections for every occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category.id}
              className="group relative aspect-square overflow-hidden cursor-pointer"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.9, y: 50 }
              }
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div className="w-full h-full" whileHover={{ scale: 1.1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
                <ImageWithFallback
                  src={resolveMediaUrl(category.coverMedia)}
                  alt={category.name}
                  className="w-full h-full object-cover"
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
                  className="font-sterling text-white text-[32px] tracking-wide"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
