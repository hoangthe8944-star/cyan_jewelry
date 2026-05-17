import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion, useInView } from 'motion/react';

import { resolveMediaUrl } from '../api';
import type { CollectionSummary } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedCollectionsSectionProps {
  collections: CollectionSummary[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function FeaturedCollectionsSection({
  collections,
  eyebrow = 'Featured Collections',
  title = 'Những bộ sưu tập nổi bật từ Cyan',
  description = 'Dữ liệu này đang được lấy trực tiếp từ featuredCollections của backend storefront để homepage phản ánh đúng nội dung đã publish.',
}: FeaturedCollectionsSectionProps) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  if (collections.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="bg-[linear-gradient(180deg,rgba(18,42,66,0.04),rgba(255,255,255,0.98))] py-20">
      <div className="mx-auto max-w-[1800px] px-6">
        <motion.div
          className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
            <h2 className="font-sterling text-[38px] text-primary lg:text-[46px]">{title}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {collections.slice(0, 1).map((collection) => (
            <motion.button
              key={collection.id}
              type="button"
              onClick={() => navigate(`/products?featured=true`)}
              className="group relative min-h-[460px] overflow-hidden text-left"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7 }}
            >
              <ImageWithFallback
                src={resolveMediaUrl(collection.coverMedia)}
                alt={collection.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/65 to-primary/10" />
              <div className="relative flex h-full flex-col justify-end p-8 text-white lg:p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Collection spotlight</p>
                <h3 className="mt-4 max-w-2xl font-sterling text-[36px] leading-tight lg:text-[48px]">
                  {collection.name}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                  {collection.summary || 'Khám phá bộ sưu tập được tuyển chọn và đồng bộ từ backend storefront.'}
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.28em] text-white/75">
                  {collection.productCount} sản phẩm
                </p>
              </div>
            </motion.button>
          ))}

          <div className="space-y-4">
            {collections.slice(1, 4).map((collection, index) => (
              <motion.button
                key={collection.id}
                type="button"
                onClick={() => navigate(`/products?featured=true`)}
                className="group flex w-full items-start gap-4 border border-border bg-white p-4 text-left transition-colors hover:border-primary/40"
                initial={{ opacity: 0, x: 24 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                transition={{ duration: 0.55, delay: index * 0.1 + 0.15 }}
              >
                <div className="aspect-[4/5] w-28 flex-shrink-0 overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={resolveMediaUrl(collection.coverMedia)}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Featured</p>
                  <h3 className="mt-2 font-sterling text-[28px] leading-tight text-primary">{collection.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {collection.summary || 'Bộ sưu tập đã được publish từ backend Cyan.'}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {collection.productCount} sản phẩm
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
