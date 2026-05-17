import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import type { CollectionSummary } from '../lib/types';

export function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    storefrontApi
      .getCollections()
      .then(setCollections)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-24">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Bộ sưu tập</p>
            <h1 className="mb-4 font-sterling text-[40px] text-primary lg:text-[52px]">Khám phá bộ sưu tập</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Những bộ sưu tập được đồng bộ trực tiếp từ storefront để bạn khám phá theo từng chủ đề và phong cách.
            </p>
          </div>

          {error ? (
            <div className="py-10 text-center text-sm text-red-600">Không thể tải bộ sưu tập: {error}</div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection, index) => (
              <motion.button
                key={collection.id}
                type="button"
                onClick={() => navigate(`/collections/${collection.slug}`)}
                className="group overflow-hidden bg-white text-left"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
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
                  <h3 className="font-sterling text-[28px] leading-tight text-primary">{collection.name}</h3>
                  <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {collection.summary || 'Bộ sưu tập đang được cập nhật nội dung giới thiệu.'}
                  </p>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {collection.productCount} sản phẩm
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
