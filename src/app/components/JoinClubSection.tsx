import { motion } from 'motion/react';

export function JoinClubSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#11212D] py-20 text-white lg:py-28"
      style={{
        backgroundImage: 'url("/joinclub.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" /> {/* Dark overlay with slight blur */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="font-sterling text-[30px] leading-tight sm:text-[40px] lg:text-[48px] text-white"
        >
          Tham gia Oriven Club
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-3xl mx-auto text-base leading-7 text-white/80 lg:text-lg"
          style={{
            textShadow: '0 0 5px rgba(255,255,255,0.3)',
          }}
        >
          Khám phá những ưu đãi độc quyền, bộ sưu tập mới nhất và trải nghiệm thành viên cao cấp.
          Đắm mình vào thế giới trang sức tinh xảo cùng Oriven.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="w-full max-w-sm rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-base text-white placeholder-white/50 backdrop-blur-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-8 py-3.5 text-base uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/25"
            style={{
              boxShadow: '0 0 10px rgba(255,255,255,0.1), 0 0 20px rgba(0,255,255,0.1)',
            }}
          >
            Tham gia ngay
          </button>
        </motion.form>
      </div>
      {/* Additional subtle glow and reflection effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#00FFFF]/10 to-transparent animate-pulse-subtle" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#8A2BE2]/10 to-transparent animate-pulse-subtle animation-delay-2000" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFFFFF]/5 to-transparent animate-pulse-subtle animation-delay-4000" />
      </div>
    </section>
  );
}
