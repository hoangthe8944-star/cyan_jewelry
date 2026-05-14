import { useState } from 'react';

import { motion } from 'motion/react';

import { resolveMediaPosterUrl, resolveMediaUrl } from '../api';
import type { Banner } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

function BannerMedia({ banner }: { banner: Banner }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (banner.media.mediaType === 'MP4' && !videoFailed) {
    return (
      <video
        src={resolveMediaUrl(banner.media)}
        poster={resolveMediaPosterUrl(banner.media)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

export function SubBannerSection({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-6 py-8 lg:py-10">
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-6 lg:grid-cols-2">
        {banners.map((banner, index) => (
          <motion.article
            key={banner.id}
            className="group relative min-h-[280px] overflow-hidden bg-muted"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.12 }}
          >
            <BannerMedia banner={banner} />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <h3 className="font-sterling text-[30px] leading-tight lg:text-[36px]">{banner.title}</h3>
              {banner.ctaLabel ? (
                <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/80">{banner.ctaLabel}</p>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
