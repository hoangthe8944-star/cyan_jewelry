import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { resolveMediaPosterUrl, resolveMediaUrl } from '../api';
import type { Banner } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

type HeroSlide = {
  title: string;
  subtitle: string;
  redirectUrl?: string | null;
  media: Banner['media'];
};

function mapBannerToSlide(banner: Banner): HeroSlide {
  return {
    title: banner.title,
    subtitle: banner.ctaLabel || banner.slug.replace(/-/g, ' '),
    redirectUrl: banner.redirectUrl,
    media: banner.media,
  };
}

function HeroMedia({ slide, title }: { slide: HeroSlide; title: string }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (slide.media.mediaType === 'MP4' && !videoFailed) {
    return (
      <video
        src={resolveMediaUrl(slide.media)}
        poster={resolveMediaPosterUrl(slide.media)}
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
      src={resolveMediaPosterUrl(slide.media)}
      alt={title}
      className="h-full w-full object-cover"
    />
  );
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = banners.map(mapBannerToSlide);

  useEffect(() => {
    setCurrentSlide(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (heroSlides.length === 0) {
    return null;
  }

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="relative overflow-hidden h-[600px] lg:h-[700px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            <HeroMedia slide={activeSlide} title={activeSlide.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center text-center px-6 pb-16 lg:pb-20">
              <div className="max-w-2xl">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-sterling text-[32px] lg:text-[42px] text-white mb-3 leading-tight"
                >
                  {activeSlide.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-white/90 text-sm lg:text-base mb-6 tracking-wide"
                >
                  {activeSlide.subtitle}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-3 text-sm hover:bg-secondary transition-all duration-300 tracking-wide"
                  onClick={() => {
                    if (activeSlide.redirectUrl) {
                      window.location.href = activeSlide.redirectUrl;
                      return;
                    }

                    navigate('/collections');
                  }}
                >
                  Khám phá bộ sưu tập
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
