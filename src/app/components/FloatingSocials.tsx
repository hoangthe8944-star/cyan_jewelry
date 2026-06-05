import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/orivenjewelry.offical',
    color: '#E1306C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590086295000',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@orivenjewelry.official',
    color: '#00f2ea',
    icon: (
      <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
        <path d="M448 209.91a210.06 210.06 0 01-122.77-39.25v178.72A162.55 162.55 0 11185 188.31v89.89a74.62 74.62 0 1052.23 71.18V0h88a121.18 121.18 0 001.86 22.17A122.18 122.18 0 00381 102.39a121.43 121.43 0 0067 20.14z" />
      </svg>
    ),
  },
] as const;

export function FloatingSocials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-20 right-6 z-[60] flex flex-col-reverse items-end gap-3">
      {SOCIALS.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.3 + index * 0.1,
            ease: 'easeOut',
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:text-white"
          style={{
            background:
              hoveredIndex === index
                ? `linear-gradient(135deg, ${social.color}dd, ${social.color}88)`
                : 'rgba(17, 33, 45, 0.85)',
            boxShadow:
              hoveredIndex === index
                ? `0 0 20px ${social.color}44, 0 8px 32px rgba(0,0,0,0.3)`
                : '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          {social.icon}

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium tracking-wide text-white"
                style={{
                  background: 'rgba(17, 33, 45, 0.92)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                {social.name}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Glow ring on hover */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow: `0 0 0 2px ${social.color}33, 0 0 12px ${social.color}22`,
            }}
          />
        </motion.a>
      ))}
    </div>
  );
}
