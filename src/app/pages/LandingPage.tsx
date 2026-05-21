import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

import { resolveMediaPosterUrl, resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { Banner } from '../lib/types';

function pickOpeningBanner(banners: Banner[]) {
  return banners.find((banner) => banner.displayOrder === 0) ?? null;
}

function sortBanners(banners: Banner[]) {
  return [...banners].sort((left, right) => (left.displayOrder ?? 999) - (right.displayOrder ?? 999));
}

function LandingMedia({ banner }: { banner: Banner | null }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!banner) {
    return null;
  }

  if (banner.media.mediaType === 'MP4' && !videoFailed) {
    return (
      <video
        src={resolveMediaUrl(banner.media)}
        poster={resolveMediaPosterUrl(banner.media)}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={() => setVideoFailed(true)}
      />
    );
  }

  return (
    <ImageWithFallback
      src={resolveMediaPosterUrl(banner.media)}
      alt={banner.title}
      className="h-full w-full object-cover"
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
  const [banner, setBanner] = useState<Banner | null>(null);
  const [subBanners, setSubBanners] = useState<Banner[]>([]);

  useEffect(() => {
    Promise.all([storefrontApi.getBanners('MAIN'), storefrontApi.getBanners('SUB')])
      .then(([mainBanners, subBannerResponse]) => {
        setBanner(pickOpeningBanner(mainBanners));
        setSubBanners(sortBanners(subBannerResponse).slice(0, 2));
      })
      .catch(() => {
        setBanner(null);
        setSubBanners([]);
      });
  }, []);

  const title = 'Oriven Jewelry tôn vinh vẻ đẹp hiện đại qua những thiết kế tinh tế và bền giá trị.';
  const description =
    'Mỗi chế tác là một dấu ấn riêng, được tạo nên để đồng hành cùng cảm xúc cá nhân và những khoảnh khắc đáng được lưu giữ theo thời gian.';

  return (
    <div className="relative overflow-hidden bg-[#160f0d] text-white">
      {banner ? (
        <div className="absolute inset-0">
          <LandingMedia banner={banner} />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(12,8,7,0.22)_0%,_rgba(12,8,7,0.14)_45%,_rgba(12,8,7,0.28)_100%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-6 pb-20 pt-[180px] lg:px-10">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:items-end">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/70 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Oriven Jewelry
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12 }}
              className="mt-8 max-w-4xl font-sterling text-[32px] leading-[1.12] text-white sm:text-[42px] lg:text-[60px]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.24 }}
              className="mt-7 max-w-2xl text-base leading-8 text-white/78 lg:text-lg"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.36 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#f2e2cf] px-8 py-4 text-sm uppercase tracking-[0.28em] text-[#1b130f] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Vào Home
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/collections')}
                className="rounded-full border border-white/16 bg-white/8 px-8 py-4 text-sm uppercase tracking-[0.28em] text-white backdrop-blur transition-colors duration-300 hover:bg-white/12"
              >
                Khám phá thương hiệu
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42 }}
            className="space-y-5 rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
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
  );
}
