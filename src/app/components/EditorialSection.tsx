import { useRef } from 'react';

import { motion, useInView, useScroll, useTransform } from 'motion/react';

import { ImageWithFallback } from './figma/ImageWithFallback';
import { resolveMediaUrl } from '../api';
import type { EditorialSummary } from '../lib/types';

export function EditorialSection({ editorials }: { editorials: EditorialSummary[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);
  const featuredEditorial = editorials[0];

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6">
        <motion.div
          className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <motion.div style={{ y }} className="w-full h-[120%]">
            <ImageWithFallback
              src={resolveMediaUrl(featuredEditorial?.coverMedia)}
              alt={featuredEditorial?.title ?? 'Discover More'}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent"
            style={{ opacity }}
          />
          <div className="absolute inset-0 flex items-center px-12 lg:px-20">
            <div className="max-w-2xl">
              <motion.h2
                className="font-sterling text-white text-[48px] lg:text-[56px] mb-4 leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {featuredEditorial?.title ?? 'The Art of Luxury'}
              </motion.h2>
              <motion.p
                className="text-white/90 text-lg mb-8 tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {featuredEditorial?.summary ??
                  'Experience the ethereal beauty of handcrafted jewelry. Each piece tells a story of elegance, precision, and timeless design.'}
              </motion.p>
              <motion.button
                className="bg-accent text-white px-10 py-4 hover:bg-accent-light hover:text-primary transition-all duration-300 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(163, 107, 49, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                Discover More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
