import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import type { EditorialSummary } from '../lib/types';

const brandStory = [
  'Oriven Jewelry được tạo nên từ một niềm tin rất rõ ràng: trang sức không chỉ hoàn thiện diện mạo, mà còn cần lưu giữ cảm xúc. Mỗi bộ sưu tập được xây dựng quanh vẻ tự tin điềm tĩnh của người phụ nữ hiện đại, nơi sự mềm mại và bản lĩnh có thể cùng hiện diện trong một ngôn ngữ thiết kế.',
  'Tinh thần thiết kế của chúng tôi kết hợp tỷ lệ vượt thời gian với góc nhìn đương đại. Oriven ưu ái những đường nét tinh gọn, bề mặt giàu ánh sáng và các chi tiết được tiết chế vừa đủ để mỗi thiết kế thanh lịch ngay từ ánh nhìn đầu tiên nhưng vẫn để lại dư vị lâu dài.',
  'Với Oriven, trang sức không chỉ là món phụ kiện mà còn là cách đánh dấu những khoảnh khắc cá nhân. Từ nhịp sống thường ngày đến những cột mốc đáng nhớ, chúng tôi tạo ra các thiết kế đủ gần gũi để đồng hành mỗi ngày và đủ đặc biệt để trở thành một phần trong câu chuyện riêng của người đeo.',
] as const;

export function AboutUsPage() {
  const [editorials, setEditorials] = useState<EditorialSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storefrontApi
      .getEditorials()
      .then((response) => setEditorials(response.slice(0, 3)))
      .catch((err: Error) => {
        setEditorials([]);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const featuredStory = editorials[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <section className="border-b border-border bg-[linear-gradient(180deg,rgba(18,42,66,0.05),rgba(255,255,255,0.95))]">
          <div className="mx-auto grid max-w-[1800px] gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-muted-foreground">Về Oriven</p>
              <h1 className="font-sterling text-[42px] leading-[1.05] text-primary lg:text-[72px]">
                Một thương hiệu trang sức hiện đại được định hình bởi cảm xúc, sự tinh gọn và nét sang trọng lặng lẽ.
              </h1>
              <div className="mt-8 space-y-5 text-base leading-8 text-foreground/80 lg:text-lg">
                {brandStory.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm bg-primary px-6 py-8 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Tinh thần thiết kế</p>
                <h2 className="mt-4 font-sterling text-[28px]">Thanh lịch nhưng có dấu ấn</h2>
                <p className="mt-4 text-sm leading-7 text-white/80">
                  Mỗi thiết kế được tạo ra để khác biệt vừa đủ, cân bằng giữa tính tạo hình và cảm giác dễ đeo trong đời sống hằng ngày.
                </p>
              </div>
              <div className="rounded-sm border border-border bg-white px-6 py-8">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cam kết thương hiệu</p>
                <h2 className="mt-4 font-sterling text-[28px] text-primary">Được tạo ra để luôn mang tính cá nhân</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Oriven ưu tiên giá trị bền lâu hơn những xu hướng thoáng qua, để mỗi món trang sức có thể đồng hành cùng người đeo vượt ra ngoài một mùa mốt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Chế tác và góc nhìn</p>
              <h2 className="font-sterling text-[32px] text-primary lg:text-[48px]">
                Chúng tôi xây dựng những bộ sưu tập chỉn chu cho hiện tại và vẫn còn giá trị trong nhiều năm tới.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Mỗi lần ra mắt đều được dẫn dắt bởi sự tiết chế, cảm nhận tinh tế về chất liệu và mong muốn tạo nên những thiết kế xứng đáng nằm trong bộ sưu tập cá nhân của khách hàng.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Thiết kế có chủ đích',
                body: 'Chúng tôi tinh giản hình khối đến khi chỉ còn lại những đường nét cốt lõi nhất, để chi tiết và tỷ lệ tự cất lên tiếng nói của mình.',
              },
              {
                title: 'Chất liệu được nâng tầm',
                body: 'Bề mặt, ánh sáng và độ hoàn thiện được xem như một phần của câu chuyện thiết kế, tạo chiều sâu cho từng món trang sức mà không gây rối mắt.',
              },
              {
                title: 'Giá trị trong đời sống',
                body: 'Các bộ sưu tập được tạo nên để chuyển mình tự nhiên giữa nhịp sống hằng ngày và những dịp thật sự đáng nhớ.',
              },
            ].map((item) => (
              <article key={item.title} className="border border-border bg-muted/20 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Giá trị</p>
                <h3 className="mt-4 font-sterling text-[24px] text-primary">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-primary/[0.03]">
          <div className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Câu chuyện mới nhất</p>
                <h2 className="font-sterling text-[32px] text-primary lg:text-[48px]">
                  Nội dung động được lấy trực tiếp từ API hiện tại
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Phần này được tải động để trang giới thiệu luôn kết nối với những câu chuyện thương hiệu và editorial mới nhất từ hệ thống của bạn.
              </p>
            </div>

            {error ? (
              <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                Không thể tải nội dung editorial: {error}
              </div>
            ) : null}

            {!error && isLoading ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="min-h-[420px] animate-pulse bg-muted" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse border border-border bg-white p-6">
                      <div className="h-3 w-24 bg-muted" />
                      <div className="mt-4 h-8 w-3/4 bg-muted" />
                      <div className="mt-4 h-4 w-full bg-muted" />
                      <div className="mt-2 h-4 w-5/6 bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {!error && !isLoading && editorials.length === 0 ? (
              <div className="border border-dashed border-border bg-white px-6 py-12 text-center">
                <h3 className="font-sterling text-[28px] text-primary">Chưa có câu chuyện editorial</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  API đã được kết nối sẵn. Khi có dữ liệu, các bài viết sẽ tự động hiển thị tại đây.
                </p>
              </div>
            ) : null}

            {!error && !isLoading && editorials.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <article className="group relative min-h-[420px] overflow-hidden rounded-sm bg-primary text-white">
                  <ImageWithFallback
                    src={resolveMediaUrl(featuredStory?.coverMedia)}
                    alt={featuredStory?.title ?? 'Editorial nổi bật'}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/20" />
                  <div className="relative flex h-full flex-col justify-end p-8 lg:p-10">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">Bài viết nổi bật</p>
                    <h3 className="mt-4 max-w-2xl font-sterling text-[34px] leading-tight lg:text-[46px]">
                      {featuredStory?.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                      {featuredStory?.summary || 'Khám phá góc nhìn mới nhất đang định hình thế giới trang sức Oriven.'}
                    </p>
                    {featuredStory ? (
                      <Link
                        to={`/products?featured=true`}
                        className="mt-6 inline-flex w-fit items-center gap-2 border border-white/30 px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-white hover:text-primary"
                      >
                        Xem bộ sưu tập
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </article>

                <div className="space-y-4">
                  {editorials.map((editorial) => (
                    <article key={editorial.id} className="border border-border bg-white p-6 transition-colors hover:border-primary/40">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {editorial.topics[0] ?? 'Editorial'}
                      </p>
                      <h3 className="mt-3 font-sterling text-[26px] leading-tight text-primary">{editorial.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {editorial.summary || 'Một câu chuyện thương hiệu mới từ kho nội dung editorial của Oriven.'}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
