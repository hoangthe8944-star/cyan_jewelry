import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import type { EditorialSummary } from '../lib/types';

const brandStory = [
  'Oriven Jewelry duoc tao nen tu mot niem tin rat ro rang: trang suc khong chi hoan thien dien mao, ma con can luu giu cam xuc. Moi bo suu tap duoc xay dung quanh ve tu tin diem tinh cua nguoi phu nu hien dai, noi su mem mai va ban linh co the cung hien dien trong mot ngon ngu thiet ke.',
  'Tinh than thiet ke cua chung toi ket hop ty le vuot thoi gian voi goc nhin duong dai. Oriven uu ai nhung duong net tinh gon, be mat giau anh sang va cac chi tiet duoc tiet che vua du de moi thiet ke thanh lich ngay tu anh nhin dau tien nhung van de lai du vi lau dai.',
  'Voi Oriven, trang suc khong chi la mon phu kien ma con la cach danh dau nhung khoanh khac ca nhan. Tu nhip song thuong ngay den nhung cot moc dang nho, chung toi tao ra cac thiet ke du gan gui de dong hanh moi ngay va du dac biet de tro thanh mot phan trong cau chuyen rieng cua nguoi deo.',
] as const;

const values = [
  {
    title: 'Thiet ke co chu dich',
    body: 'Chung toi tinh gian hinh khoi den khi chi con lai nhung duong net cot loi nhat, de chi tiet va ty le tu cat len tieng noi cua minh.',
  },
  {
    title: 'Chat lieu duoc nang tam',
    body: 'Be mat, anh sang va do hoan thien duoc xem nhu mot phan cua cau chuyen thiet ke, tao chieu sau cho tung mon trang suc ma khong gay roi mat.',
  },
  {
    title: 'Gia tri trong doi song',
    body: 'Cac bo suu tap duoc tao nen de chuyen minh tu nhien giua nhip song hang ngay va nhung dip that su dang nho.',
  },
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
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/68">Ve Oriven</p>
              <h1 className="font-sterling text-[42px] leading-tight text-primary">
                Mot thuong hieu trang suc hien dai duoc dinh hinh boi cam xuc, su tinh gon va net sang trong lang le.
              </h1>
              <div className="mt-8 space-y-5 text-base leading-8 text-foreground/92 lg:text-lg">
                {brandStory.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm bg-primary px-6 py-8 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-white/72">Tinh than thiet ke</p>
                <h2 className="mt-4 font-sterling text-[28px]">Thanh lich nhung co dau an</h2>
                <p className="mt-4 text-sm leading-7 text-white/90">
                  Moi thiet ke duoc tao ra de khac biet vua du, can bang giua tinh tao hinh va cam giac de deo trong
                  doi song hang ngay.
                </p>
              </div>
              <div className="rounded-sm border border-border bg-white px-6 py-8">
                <p className="text-xs uppercase tracking-[0.25em] text-foreground/62">Cam ket thuong hieu</p>
                <h2 className="mt-4 font-sterling text-[28px] text-primary">Duoc tao ra de luon mang tinh ca nhan</h2>
                <p className="mt-4 text-sm leading-7 text-foreground/82">
                  Oriven uu tien gia tri ben lau hon nhung xu huong thoang qua, de moi mon trang suc co the dong hanh
                  cung nguoi deo vuot ra ngoai mot mua mot.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-foreground/65">Che tac va goc nhin</p>
              <h2 className="font-sterling text-[32px] text-primary lg:text-[48px]">
                Chung toi xay dung nhung bo suu tap chin chu cho hien tai va van con gia tri trong nhieu nam toi.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-foreground/82">
              Moi lan ra mat deu duoc dan dat boi su tiet che, cam nhan tinh te ve chat lieu va mong muon tao nen nhung
              thiet ke xung dang nam trong bo suu tap ca nhan cua khach hang.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <article key={item.title} className="border border-border bg-muted/20 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">Gia tri</p>
                <h3 className="mt-4 font-sterling text-[24px] text-primary">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-foreground/80">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-primary/[0.03]">
          <div className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-foreground/65">Cau chuyen moi nhat</p>
                <h2 className="font-sterling text-[32px] text-primary lg:text-[48px]">
                  Nhung cau chuyen moi nhat tu Oriven
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-foreground/82">
                Noi Oriven chia se nhung cam hung thiet ke, cau chuyen bo suu tap va goc nhin moi xoay quanh ve dep
                hien dai ma thuong hieu dang theo duoi.
              </p>
            </div>

            {error ? (
              <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                Khong the tai noi dung editorial: {error}
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
                <h3 className="font-sterling text-[28px] text-primary">Chua co cau chuyen editorial</h3>
                <p className="mt-3 text-sm text-foreground/72">
                  Khi co bai viet moi, nhung cau chuyen tu Oriven se xuat hien tai day de ban tiep tuc kham pha them ve
                  thuong hieu.
                </p>
              </div>
            ) : null}

            {!error && !isLoading && editorials.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <article className="group relative min-h-[420px] overflow-hidden rounded-sm bg-primary text-white">
                  <ImageWithFallback
                    src={resolveMediaUrl(featuredStory?.coverMedia)}
                    alt={featuredStory?.title ?? 'Editorial noi bat'}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/20" />
                  <div className="relative flex h-full flex-col justify-end p-8 lg:p-10">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">Bai viet noi bat</p>
                    <h3 className="mt-4 max-w-2xl font-sterling text-[34px] leading-tight lg:text-[46px]">
                      {featuredStory?.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/88">
                      {featuredStory?.summary || 'Kham pha goc nhin moi nhat dang dinh hinh the gioi trang suc Oriven.'}
                    </p>
                    {featuredStory ? (
                      <Link
                        to={`/news/${featuredStory.slug}`}
                        className="mt-6 inline-flex w-fit items-center gap-2 border border-white/30 px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-white hover:text-primary"
                      >
                        Doc bai viet
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </article>

                <div className="space-y-4">
                  {editorials.map((editorial) => (
                    <Link
                      key={editorial.id}
                      to={`/news/${editorial.slug}`}
                      className="block border border-border bg-white p-6 transition-colors hover:border-primary/40"
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">
                        {editorial.topics[0] ?? 'Editorial'}
                      </p>
                      <h3 className="mt-3 font-sterling text-[26px] leading-tight text-primary">{editorial.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground/78">
                        {editorial.summary || 'Mot cau chuyen thuong hieu moi tu kho noi dung editorial cua Oriven.'}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary">
                        Xem noi dung
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 border border-primary px-5 py-3 text-xs uppercase tracking-[0.24em] text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Xem tat ca news
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
