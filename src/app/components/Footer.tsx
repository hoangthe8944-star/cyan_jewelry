import { motion, useInView } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { storefrontApi } from '../api';
import type { CategoryNode } from '../lib/types';

function flattenCategories(categories: CategoryNode[]) {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children)]);
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [categories, setCategories] = useState<CategoryNode[]>([]);

  useEffect(() => {
    storefrontApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const categoryHrefLookup = useMemo(() => {
    const flattened = flattenCategories(categories);
    const entries = new Map<string, string>();

    flattened.forEach((category) => {
      entries.set(normalizeText(category.name), `/products?category=${category.slug}`);
    });

    return entries;
  }, [categories]);

  const resolveCategoryHref = (label: string) => {
    return categoryHrefLookup.get(normalizeText(label)) ?? '/products';
  };

  const footerLinks = [
    {
      title: 'Mua sắm',
      links: [
        { label: 'Hàng mới về', to: '/products' },
        { label: 'Dây chuyền', to: resolveCategoryHref('Dây chuyền') },
        { label: 'Hoa tai', to: resolveCategoryHref('Hoa tai') },
        { label: 'Vòng tay', to: resolveCategoryHref('Vòng tay') },
        { label: 'Nhẫn', to: resolveCategoryHref('Nhẫn') },
      ],
    },
    {
      title: 'Giới thiệu',
      links: [
        { label: 'Câu chuyện thương hiệu', to: '/about' },
        { label: 'Chế tác', to: '/craft' },
        { label: 'Phát triển bền vững', to: '/sustainability' },
        { label: 'Báo chí', to: '/news' },
      ],
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { label: 'Liên hệ', to: '/contact' },
        { label: 'Vận chuyển và đổi trả', to: '/shipping-returns' },
        { label: 'Hướng dẫn kích cỡ', to: '/size-guide' },
        { label: 'Hướng dẫn bảo quản', to: '/care-guide' },
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
                      <Link to={link.to}>{link.label}</Link>
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
