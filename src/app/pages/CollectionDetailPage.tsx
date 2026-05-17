import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import type { CollectionDetail } from '../lib/types';

export function CollectionDetailPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      return;
    }

    storefrontApi
      .getCollectionBySlug(slug)
      .then(setCollection)
      .catch((err: Error) => setError(err.message));
  }, [slug]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-24">
        <div className="mx-auto max-w-[1800px] px-6">
          <button
            onClick={() => navigate('/collections')}
            className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại bộ sưu tập</span>
          </button>

          {error ? (
            <div className="py-10 text-center text-sm text-red-600">Không thể tải bộ sưu tập: {error}</div>
          ) : null}

          {!collection ? (
            <div className="py-20 text-center text-muted-foreground">Đang tải bộ sưu tập...</div>
          ) : (
            <>
              <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
                <div className="overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={resolveMediaUrl(collection.coverMedia)}
                    alt={collection.name}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Bộ sưu tập</p>
                  <h1 className="mb-5 font-sterling text-[42px] leading-tight text-primary lg:text-[56px]">
                    {collection.name}
                  </h1>
                  <p className="mb-4 text-[15px] leading-8 text-slate-700">
                    {collection.description || collection.summary || 'Nội dung bộ sưu tập đang được cập nhật.'}
                  </p>
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
                    {collection.productCount} sản phẩm
                  </p>
                </div>
              </div>

              <ProductGrid
                products={collection.products}
                eyebrow="Sản phẩm trong bộ sưu tập"
                title={collection.name}
                description={collection.summary || 'Khám phá các thiết kế nổi bật trong bộ sưu tập này.'}
              />
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
