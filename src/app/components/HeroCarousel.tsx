import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1770777352898-f0f02bcfb44f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBqZXdlbHJ5JTIwZWRpdG9yaWFsJTIwZmFzaGlvbnxlbnwxfHx8fDE3Nzg0MzA3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Embrace the Cyan Fantasy',
    subtitle: 'Discover our ethereal collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1767249622437-dd837fc5ff3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBqZXdlbHJ5JTIwZWRpdG9yaWFsJTIwZmFzaGlvbnxlbnwxfHx8fDE3Nzg0MzA3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Met Gala 2026: Cyan Couture',
    subtitle: 'Elevate your elegance',
  },
  {
    image: 'https://images.unsplash.com/photo-1763906473317-c9193c8ef05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBqZXdlbHJ5JTIwZWRpdG9yaWFsJTIwZmFzaGlvbnxlbnwxfHx8fDE3Nzg0MzA3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Luxury Redefined',
    subtitle: 'Timeless pieces for modern souls',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
            <ImageWithFallback
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-3xl">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-sterling text-[48px] lg:text-[64px] text-white mb-4 leading-tight"
                >
                  {heroSlides[currentSlide].title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-white/90 text-lg mb-8 tracking-wide"
                >
                  {heroSlides[currentSlide].subtitle}
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
