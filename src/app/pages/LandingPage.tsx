import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

import { resolveMediaPosterUrl, resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { Banner, CollectionSummary, LandingPageTheme, MediaAsset } from '../lib/types';

function sortBanners(banners: Banner[]) {
  return [...banners].sort((left, right) => (left.displayOrder ?? 999) - (right.displayOrder ?? 999));
}

function pickLatestCollection(collections: CollectionSummary[]) {
  return [...collections].sort((left, right) => {
    const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return (left.displayOrder ?? 999) - (right.displayOrder ?? 999);
  })[0] ?? null;
}

function pickThemeTitle(theme: LandingPageTheme | null) {
  return (
    theme?.seo?.title?.trim() ||
    theme?.headline?.trim() ||
    theme?.heading?.trim() ||
    theme?.title?.trim() ||
    theme?.name?.trim() ||
    'Oriven Jewelry tôn vinh vẻ đẹp hiện đại qua những thiết kế tinh tế và bền giá trị.'
  );
}

function pickThemeDescription(theme: LandingPageTheme | null) {
  return (
    theme?.seo?.description?.trim() ||
    theme?.description?.trim() ||
    theme?.summary?.trim() ||
    theme?.body?.trim() ||
    'Mỗi chế tác là một dấu ấn riêng, được tạo nên để đồng hành cùng cảm xúc cá nhân và những khoảnh khắc đáng được lưu giữ theo thời gian.'
  );
}

function pickThemeEyebrow(theme: LandingPageTheme | null) {
  return theme?.eyebrow?.trim() || theme?.badgeLabel?.trim() || 'Oriven Jewelry';
}

const SUPPORTING_DETAILS = [
  {
    label: 'Chế tác thủ công',
    value: 'Thiết kế được hoàn thiện với nhịp độ chậm rãi và độ chính xác cao.',
  },
  {
    label: 'Chất liệu tuyển chọn',
    value: 'Ưu tiên bề mặt sáng, bền và phù hợp cho những lần đeo thường nhật.',
  },
  {
    label: 'Trải nghiệm riêng',
    value: 'Tư vấn bộ sưu tập và gợi ý quà tặng theo nhu cầu cá nhân.',
  },
];

function LandingBackgroundMedia({ media, enabled }: { media?: MediaAsset | null; enabled: boolean }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!enabled || !media) {
    return null;
  }

  if (media.mediaType === 'MP4' && !videoFailed) {
    return (
      <video
        src={resolveMediaUrl(media)}
        poster={resolveMediaPosterUrl(media)}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={() => setVideoFailed(true)}
        // @ts-expect-error fetchpriority is a valid HTML attribute
        fetchpriority="high"
      />
    );
  }

  return (
    <ImageWithFallback
      src={resolveMediaPosterUrl(media)}
      alt={media.altText ?? 'Landing page media'}
      className="absolute inset-0 h-full w-full object-cover"
      // @ts-expect-error fetchPriority is a valid React attribute
      fetchPriority="high"
    />
  );
}

function SubBannerCard({ banner }: { banner: Banner }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (banner.redirectUrl) {
          window.location.href = banner.redirectUrl;
        }
      }}
      className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/6 text-left backdrop-blur transition-colors hover:bg-white/10"
    >
      <div className="relative h-36 overflow-hidden">
        <ImageWithFallback
          src={resolveMediaPosterUrl(banner.media)}
          alt={banner.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/50">Sắp ra mắt</p>
        <h3 className="font-sterling text-[22px] leading-tight text-white">{banner.title}</h3>
        {banner.ctaLabel ? <p className="text-sm leading-6 text-white/72">{banner.ctaLabel}</p> : null}
      </div>
    </button>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<LandingPageTheme | null>(null);
  const [subBanners, setSubBanners] = useState<Banner[]>([]);
  const [featuredCollection, setFeaturedCollection] = useState<CollectionSummary | null>(null);

  useEffect(() => {
    Promise.allSettled([
      storefrontApi.getLandingTheme(),
      storefrontApi.getBanners('SUB'),
      storefrontApi.getCollections(),
    ]).then((results) => {
      const [themeResult, subBannerResult, collectionResult] = results;

      setTheme(themeResult.status === 'fulfilled' ? themeResult.value : null);
      setSubBanners(
        subBannerResult.status === 'fulfilled' ? sortBanners(subBannerResult.value).slice(0, 2) : []
      );
      setFeaturedCollection(
        collectionResult.status === 'fulfilled' ? pickLatestCollection(collectionResult.value) : null
      );
    });
  }, []);

  const title = pickThemeTitle(theme);
  const description = pickThemeDescription(theme);
  const eyebrow = pickThemeEyebrow(theme);
  const primaryButtonLabel = theme?.primaryButtonLabel?.trim() || 'Vào trang chủ';
  const primaryButtonUrl = theme?.primaryButtonUrl?.trim() || '/home';
  const secondaryButtonLabel = theme?.secondaryButtonLabel?.trim() || 'Khám phá thương hiệu';
  const secondaryButtonUrl = theme?.secondaryButtonUrl?.trim() || '/collections';
  const hasThemeData = Boolean(theme);
  const heroMedia = theme?.heroMedia ?? theme?.media;

  return (
    <>
      <div className={`relative overflow-hidden text-white ${hasThemeData ? 'bg-white' : 'bg-black'}`}>
        <LandingBackgroundMedia media={heroMedia} enabled={hasThemeData} />
        <div
          className={`absolute inset-0 ${
            hasThemeData
              ? 'bg-[linear-gradient(135deg,_rgba(18,12,10,0.42)_0%,_rgba(18,12,10,0.18)_45%,_rgba(18,12,10,0.5)_100%)]'
              : 'bg-[linear-gradient(135deg,_rgba(0,0,0,0.72)_0%,_rgba(0,0,0,0.55)_45%,_rgba(0,0,0,0.78)_100%)]'
          }`}
        />

        <section className="relative mx-auto max-w-[1600px] px-6 pb-20 pt-[126px] lg:px-10 lg:pt-[132px]">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_400px] lg:items-start">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/70 backdrop-blur"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {eyebrow}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.12 }}
                className="mt-6 max-w-4xl font-sterling text-[30px] leading-[1.08] text-white sm:text-[40px] lg:text-[52px]"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.24 }}
                className="mt-5 max-w-xl text-[15px] leading-7 text-white/78 lg:text-base"
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.36 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => navigate(primaryButtonUrl)}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#f2e2cf] px-7 py-3.5 text-sm uppercase tracking-[0.24em] text-[#1b130f] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {primaryButtonLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(secondaryButtonUrl)}
                  className="rounded-full border border-white/16 bg-white/8 px-7 py-3.5 text-sm uppercase tracking-[0.24em] text-white backdrop-blur transition-colors duration-300 hover:bg-white/12"
                >
                  {secondaryButtonLabel}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.48 }}
                className="mt-7 grid gap-3 md:grid-cols-3"
              >
                {SUPPORTING_DETAILS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-md"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/52">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/76">{item.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.42 }}
              className="space-y-4 rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/55">Sắp ra mắt</p>
              {subBanners.length > 0 ? (
                subBanners.map((item) => <SubBannerCard key={item.id} banner={item} />)
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-6 text-sm leading-7 text-white/72">
                  Các nội dung sắp ra mắt sẽ hiển thị tại đây từ hệ thống sub banner.
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      <section className="bg-[#fbf7f2] px-6 py-16 text-[#1c120d] lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
            className="rounded-[36px] border border-black/8 bg-white/80 p-6 lg:p-8"
          >
            {featuredCollection ? (
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.8fr)] lg:gap-12">
                <div className="overflow-hidden rounded-[28px] bg-[#f6efe7]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={resolveMediaPosterUrl(featuredCollection.coverMedia)}
                      alt={featuredCollection.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="max-w-[460px] justify-self-center lg:justify-self-start">
                  <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7668]">
                    {featuredCollection.name}
                  </p>
                  <h2 className="mt-4 font-sterling text-[32px] leading-[1.08] text-[#1c120d] sm:text-[40px] lg:text-[54px]">
                    Bộ sưu tập của chúng tôi
                  </h2>
                  <p className="mt-5 text-base leading-8 text-[#5b473b] lg:text-[17px]">
                    {featuredCollection.summary ||
                      'Khám phá bộ sưu tập mới với tinh thần thanh lịch, cân bằng giữa vẻ đẹp đương đại và cảm xúc cá nhân.'}
                  </p>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => navigate(`/collections/${featuredCollection.slug}`)}
                      className="inline-flex items-center justify-center gap-3 rounded-none border border-[#2e2019] bg-transparent px-6 py-3 text-sm uppercase tracking-[0.24em] text-[#1c120d] transition-colors hover:bg-[#f6efe7]"
                    >
                      Vào
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-black/8 bg-white/72 p-6 text-sm leading-7 text-[#4d3a31]">
                Collection mới sẽ hiển thị tại đây khi dữ liệu được trả về từ hệ thống.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
