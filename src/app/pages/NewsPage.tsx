import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import type { EditorialSummary } from '../lib/types';

export function NewsPage() {
  const [editorials, setEditorials] = useState<EditorialSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storefrontApi
      .getEditorials()
      .then(setEditorials)
      .catch((err: Error) => {
        setEditorials([]);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const featuredStory = editorials[0];
  const remainingStories = editorials.slice(1);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <section className="border-b border-border bg-[linear-gradient(180deg,rgba(18,42,66,0.05),rgba(255,255,255,0.98))]">
          <div className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/65">News</p>
            <h1 className="max-w-4xl font-sterling text-[42px] leading-tight text-primary lg:text-[58px]">
              Những câu chuyện, cảm hứng thiết kế và góc nhìn mới nhất từ Oriven Jewelry.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-foreground/85 lg:text-lg">
              Tại đây, toàn bộ nội dung tin tức và editorial của thương hiệu được tập hợp để bạn theo dõi các bộ sưu
              tập, cảm hứng sáng tạo và những câu chuyện phía sau từng thiết kế.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
          {error ? (
            <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              Không thể tải nội dung tin tức: {error}
            </div>
          ) : null}

          {!error && isLoading ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-[460px] animate-pulse bg-muted" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse border border-border bg-white p-6">
                    <div className="h-3 w-24 bg-muted" />
                    <div className="mt-4 h-8 w-4/5 bg-muted" />
                    <div className="mt-4 h-4 w-full bg-muted" />
                    <div className="mt-2 h-4 w-3/4 bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!error && !isLoading && editorials.length === 0 ? (
            <div className="border border-dashed border-border bg-white px-6 py-12 text-center">
              <h2 className="font-sterling text-[30px] text-primary">Chưa có bài viết nào</h2>
              <p className="mt-3 text-sm text-foreground/70">
                Khi có nội dung mới từ Oriven, các bài viết sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : null}

          {!error && !isLoading && featuredStory ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Link
                to={`/news/${featuredStory.slug}`}
                className="group relative min-h-[460px] overflow-hidden rounded-sm bg-primary text-white"
              >
                <ImageWithFallback
                  src={resolveMediaUrl(featuredStory.coverMedia)}
                  alt={featuredStory.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/15" />
                <div className="relative flex h-full flex-col justify-end p-8 lg:p-10">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">Bài viết nổi bật</p>
                  <h2 className="mt-4 max-w-2xl font-sterling text-[34px] leading-tight lg:text-[48px]">
                    {featuredStory.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                    {featuredStory.summary || 'Khám phá góc nhìn mới nhất từ Oriven Jewelry.'}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white">
                    Xem nội dung
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {remainingStories.map((editorial) => (
                  <Link
                    key={editorial.id}
                    to={`/news/${editorial.slug}`}
                    className="group border border-border bg-white p-6 transition-colors hover:border-primary/45"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">
                      {editorial.topics[0] ?? 'Editorial'}
                    </p>
                    <h3 className="mt-3 font-sterling text-[26px] leading-tight text-primary transition-colors group-hover:text-accent">
                      {editorial.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-foreground/75">
                      {editorial.summary || 'Một câu chuyện thương hiệu mới từ Oriven Jewelry.'}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary">
                      Đọc bài viết
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </PageTransition>
  );
}
