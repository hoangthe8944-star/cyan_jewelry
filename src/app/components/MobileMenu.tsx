import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { storefrontApi } from '../api';
import { useShop } from '../context/ShopContext';
import type { CategoryNode } from '../lib/types';

export function MobileMenu() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useShop();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    storefrontApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const handleCategoryNavigate = (slug: string) => {
    navigate(`/products?category=${slug}`);
    closeMenu();
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={closeMenu}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-sterling text-[24px]">Danh mục</h2>
              <button onClick={closeMenu} className="text-foreground transition-colors hover:text-accent">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-6">
              <div className="space-y-1 border-b border-border pb-6">
                <button
                  type="button"
                  onClick={() => handleNavigate('/')}
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted"
                >
                  <span className="tracking-wide">Trang chủ</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('/products')}
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted"
                >
                  <span className="tracking-wide">Sản phẩm</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('/products?featured=true')}
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted"
                >
                  <span className="tracking-wide">Sản phẩm nổi bật</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('/about')}
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted"
                >
                  <span className="tracking-wide">Về chúng tôi</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors" />
                </button>
              </div>

              <div className="mt-6">
                <div className="mb-4 px-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Danh mục sản phẩm
                </div>

                <div className="space-y-4">
                  {categories.length === 0 ? (
                    <p className="px-4 text-sm text-muted-foreground">Đang tải danh mục...</p>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleCategoryNavigate(category.slug)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-muted"
                        >
                          <span>{category.name}</span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                        {category.children.length > 0 ? (
                          <div className="space-y-1 border-l border-border pl-4">
                            {category.children.map((child) => (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => handleCategoryNavigate(child.slug)}
                                className="block w-full px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                              >
                                {child.name}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="px-4 text-sm text-muted-foreground">Khám phá bộ sưu tập này</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </nav>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
