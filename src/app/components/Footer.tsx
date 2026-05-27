import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const footerLinks = [
    {
      title: 'Mua sắm',
      links: [
        { label: 'Hàng mới về', href: '#' },
        { label: 'Dây chuyền', href: '#' },
        { label: 'Hoa tai', href: '#' },
        { label: 'Vòng tay', href: '#' },
        { label: 'Nhẫn', href: '#' },
      ],
    },
    {
      title: 'Giới thiệu',
      links: [
        { label: 'Câu chuyện thương hiệu', href: '#' },
        { label: 'Chế tác', href: '#' },
        { label: 'Phát triển bền vững', href: '#' },
        { label: 'Báo chí', href: '#' },
      ],
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { label: 'Liên hệ', href: '#' },
        { label: 'Vận chuyển và đổi trả', href: '#' },
        { label: 'Hướng dẫn kích cỡ', href: '#' },
        { label: 'Hướng dẫn bảo quản', href: '#' },
      ],
    },
  ];

  return (
    <footer ref={ref} className="bg-primary py-16 text-white">
      <div className="mx-auto max-w-[1800px] px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-4 font-sterling text-[24px]">Oriven Jewelry</h3>
            <p className="text-sm leading-relaxed text-white/70">
              Tôn vinh vẻ đẹp thanh lịch qua những thiết kế tinh tế và kỹ thuật chế tác bền giá trị theo thời gian.
            </p>
          </motion.div>

          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
            >
              <h4 className="mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: (sectionIndex + 1) * 0.1 + linkIndex * 0.05,
                    }}
                  >
                    <motion.div
                      className="inline-block transition-colors hover:text-accent"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label === 'Câu chuyện thương hiệu' ? (
                        <Link to="/about">{link.label}</Link>
                      ) : (
                        <a href={link.href}>{link.label}</a>
                      )}
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/50"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>&copy; 2026 Oriven Jewelry. Bảo lưu mọi quyền.</p>
        </motion.div>
      </div>
    </footer>
  );
}
