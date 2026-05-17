import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';

import { storefrontApi } from '../api';
import { useShop } from '../context/ShopContext';
import type { CategoryNode } from '../lib/types';

function ProductsDropdown({
  categories,
  compact,
  onNavigateProducts,
  onNavigateCategory,
}: {
  categories: CategoryNode[];
  compact: boolean;
  onNavigateProducts: () => void;
  onNavigateCategory: (slug: string) => void;
}) {
  const linkClass = compact
    ? 'text-sm tracking-wide text-white transition-colors hover:text-accent-light'
    : 'text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light';

  const menuClass = compact
    ? 'fixed left-1/2 top-[142px] z-50 mt-4 w-screen -translate-x-1/2 border-y border-white/10 bg-primary/95 py-6 text-white shadow-2xl backdrop-blur-[18px]'
    : 'fixed left-1/2 top-[196px] z-50 mt-4 w-screen -translate-x-1/2 border-y border-white/10 bg-black/70 py-6 text-white shadow-2xl backdrop-blur-[18px]';

  return (
    <div className="group relative">
      <button className={`relative z-[60] ${linkClass}`} type="button" onClick={onNavigateProducts}>
        Sản phẩm
      </button>
      <div className="pointer-events-none fixed left-1/2 top-0 h-[320px] w-screen -translate-x-1/2 group-hover:pointer-events-auto" />
      <div
        className={`invisible absolute opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${menuClass}`}
      >
        {categories.length === 0 ? (
          <div className="py-6 text-center text-sm text-white/70">Đang tải danh mục...</div>
        ) : (
          <div className="mx-auto max-w-[1800px] px-6">
            <div className="grid grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => onNavigateCategory(category.slug)}
                    className="text-left font-medium uppercase tracking-[0.2em] text-white transition-colors hover:text-accent-light"
                  >
                    {category.name}
                  </button>
                  {category.children.length > 0 ? (
                    <div className="space-y-2 border-l border-white/10 pl-4">
                      {category.children.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onNavigateCategory(child.slug)}
                          className="block text-left text-sm text-white/75 transition-colors hover:text-accent-light"
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/55">Khám phá bộ sưu tập này</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSearchOpen, setIsMobileMenuOpen, wishlist, getCartCount } = useShop();

  const isHomePage = location.pathname === '/';
  const navigateToProducts = () => navigate('/products');
  const navigateToCategory = (slug: string) => navigate(`/products?category=${slug}`);
  const navigateToFeatured = () => navigate('/products?featured=true');
  const navigateToAbout = () => navigate('/about');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    storefrontApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (isScrolled || !isHomePage) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-accent bg-primary/80 backdrop-blur-[15px] transition-all duration-300 ease-in-out">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6 lg:gap-12">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white transition-colors hover:text-accent-light lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="font-sterling text-[25px] tracking-wide text-white transition-all duration-300 hover:text-accent-light"
              >
                Oriven Jewelry
              </button>
              <nav className="hidden items-center gap-8 lg:flex">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm tracking-wide text-white transition-colors hover:text-accent-light"
                >
                  Trang chủ
                </button>
                <ProductsDropdown
                  categories={categories}
                  compact
                  onNavigateProducts={navigateToProducts}
                  onNavigateCategory={navigateToCategory}
                />
                <button
                  onClick={navigateToFeatured}
                  className="text-sm tracking-wide text-white transition-colors hover:text-accent-light"
                >
                  Sản phẩm nổi bật
                </button>
                <button
                  onClick={navigateToAbout}
                  className="text-sm tracking-wide text-white transition-colors hover:text-accent-light"
                >
                  Về chúng tôi
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white transition-colors hover:text-accent-light"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="hidden text-white transition-colors hover:text-accent-light md:block"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </button>
              <button className="relative text-white transition-colors hover:text-accent-light" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                    {wishlist.length}
                  </span>
                ) : null}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="relative text-white transition-colors hover:text-accent-light"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {getCartCount() > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                    {getCartCount()}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent transition-all duration-300 ease-in-out">
      <div className="mx-auto max-w-[1800px] px-6">
        <div className="flex items-center justify-center border-b border-white/10 py-6">
          <button
            onClick={() => navigate('/')}
            className="font-sterling text-[56px] tracking-[0.3em] text-white transition-all duration-300 ease-in-out hover:text-accent-light lg:text-[72px]"
            style={{
              textShadow: '0px 3px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            ORIVEN JEWELRY
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 py-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white transition-colors hover:text-accent-light lg:hidden"
            aria-label="Open menu"
            style={{
              filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
            }}
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            <button
              onClick={() => navigate('/')}
              className="text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Trang chủ
            </button>
            <ProductsDropdown
              categories={categories}
              compact={false}
              onNavigateProducts={navigateToProducts}
              onNavigateCategory={navigateToCategory}
            />
            <button
              onClick={navigateToFeatured}
              className="text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Sản phẩm nổi bật
            </button>
            <button
              onClick={navigateToAbout}
              className="text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Về chúng tôi
            </button>
          </nav>

          <div className="hidden h-4 w-px bg-white/30 lg:block" />

          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white transition-colors hover:text-accent-light"
              aria-label="Search"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              className="hidden text-white transition-colors hover:text-accent-light md:block"
              aria-label="Account"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <User className="h-4 w-4" />
            </button>
            <button
              className="relative text-white transition-colors hover:text-accent-light"
              aria-label="Wishlist"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                  {wishlist.length}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="relative text-white transition-colors hover:text-accent-light"
              aria-label="Shopping bag"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              {getCartCount() > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                  {getCartCount()}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
