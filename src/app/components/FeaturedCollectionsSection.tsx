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
  title = 'Những bộ sưu tập nổi bật',
  description = 'Các bộ sưu tập được xuất bản từ storefront sẽ xuất hiện tại đây để phản ánh đúng nội dung đang có trên hệ thống.',
}: FeaturedCollectionsSectionProps) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

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
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-foreground/62">{eyebrow}</p>
            <h2 className="font-sterling text-[38px] text-primary lg:text-[46px]">{title}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-foreground/75">{description}</p>
        </motion.div>

        {collections.length === 0 ? (
          <div className="border border-dashed border-border bg-white px-6 py-14 text-center">
            <h3 className="font-sterling text-[30px] text-primary">Chưa có bộ sưu tập để hiển thị</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-foreground/72">
              Section này đã được nối với API collections. Nếu hiện vẫn trống, khả năng cao là backend chưa có bộ sưu
              tập nào ở trạng thái publish hoặc endpoint đang trả về rỗng.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {collections.slice(0, 4).map((collection, index) => (
              <motion.button
                key={collection.id}
                type="button"
                onClick={() => navigate(`/collections/${collection.slug}`)}
                className="group overflow-hidden bg-white text-left"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={resolveMediaUrl(collection.coverMedia)}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 py-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">Bộ sưu tập</p>
                  <h3 className="font-sterling text-[28px] leading-tight text-primary">{collection.name}</h3>
                  <p className="line-clamp-3 text-sm leading-7 text-foreground/75">
                    {collection.summary || 'Khám phá bộ sưu tập mới nhất vừa được xuất bản trên storefront.'}
                  </p>
                  <p className="text-xs uppercase tracking-[0.22em] text-foreground/55">
                    {collection.productCount} sản phẩm
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
