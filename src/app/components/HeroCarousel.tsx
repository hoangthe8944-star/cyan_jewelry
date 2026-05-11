import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { ImageWithFallback } from './figma/ImageWithFallback';
import { resolveMediaUrl } from '../api';
import type { Banner } from '../lib/types';

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentBanner = banners[currentSlide];

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (currentSlide >= banners.length) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  if (!currentBanner) {
    return <div className="relative overflow-hidden h-[600px] lg:h-[700px] bg-muted" />;
  }

  return (
    <div className="relative overflow-hidden h-[600px] lg:h-[700px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            {currentBanner.media.mediaType === 'MP4' ? (
              <video
                src={resolveMediaUrl(currentBanner.media)}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <ImageWithFallback
                src={resolveMediaUrl(currentBanner.media)}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-3xl">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-sterling text-[48px] lg:text-[64px] text-white mb-4 leading-tight"
                >
                  {currentBanner.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-white/90 text-lg mb-8 tracking-wide"
                >
                  {currentBanner.ctaLabel ?? 'Discover our ethereal collection'}
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
                  className="bg-primary text-white px-12 py-4 hover:bg-secondary transition-all duration-300 tracking-wide"
                >
                  Explore Collection
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {banners.map((slide, index) => (
          <motion.button
            key={slide.id}
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
