import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { storefrontApi } from '../api';
import { useShop } from '../context/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
    ? 'text-sm tracking-wide text-white hover:text-accent-light transition-colors'
    : 'text-xs tracking-wider text-white hover:text-accent-light transition-colors uppercase';

  const menuClass = compact
    ? 'absolute left-[50vw] top-full z-50 mt-4 w-screen -translate-x-1/2 border-y border-white/10 bg-primary/95 py-6 text-white shadow-2xl backdrop-blur-[18px]'
    : 'absolute left-[50vw] top-full z-50 mt-4 w-screen -translate-x-1/2 border-y border-white/10 bg-black/70 py-6 text-white shadow-2xl backdrop-blur-[18px]';

  return (
    <div className="relative group">
      <button className={linkClass} type="button" onClick={onNavigateProducts}>
        Product
      </button>
      <div className="pointer-events-none absolute left-[50vw] top-full h-4 w-screen -translate-x-1/2 group-hover:pointer-events-auto" />
      <div className={`invisible absolute opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${menuClass}`}>
        {categories.length === 0 ? (
          <div className="py-6 text-center text-sm text-white/70">Loading categories...</div>
        ) : (
          <div className="mx-auto max-w-[1800px] px-6">
            <div className="grid grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => onNavigateCategory(category.slug)}
                    className="text-left font-medium uppercase tracking-[0.2em] text-white hover:text-accent-light transition-colors"
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
                    <p className="text-sm text-white/55">Explore this collection</p>
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
  const {
    setIsSearchOpen,
    setIsMobileMenuOpen,
    wishlist,
    getCartCount,
  } = useShop();

  const isHomePage = location.pathname === '/';
  const navigateToProducts = () => navigate('/products');
  const navigateToCategory = (slug: string) => navigate(`/products?category=${slug}`);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30);
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

  // Always show compact header on non-home pages
  if (isScrolled || !isHomePage) {
    // Scrolled State - Original Horizontal Layout
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-[15px] border-b border-accent transition-all duration-300 ease-in-out">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6 lg:gap-12">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-white hover:text-accent-light transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="font-sterling tracking-wide text-white text-[25px] hover:text-accent-light transition-all duration-300"
              >
                Cyan Jewelry
              </button>
              <nav className="hidden lg:flex items-center gap-8">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                >
                  Home
                </button>
                <ProductsDropdown
                  categories={categories}
                  compact
                  onNavigateProducts={navigateToProducts}
                  onNavigateCategory={navigateToCategory}
                />
                <button className="text-sm tracking-wide text-white hover:text-accent-light transition-colors">
                  New Collection
                </button>
                <button className="text-sm tracking-wide text-white hover:text-accent-light transition-colors">
                  About Us
                </button>
                {/* <a href="#" className="text-sm tracking-wide text-white hover:text-accent-light transition-colors">
                  Gifts
                </a>
                <a href="#" className="text-sm tracking-wide text-white hover:text-accent-light transition-colors">
                  World of Cyan
                </a> */}
              </nav>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-accent-light transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="text-white hover:text-accent-light transition-colors hidden md:block"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                className="text-white hover:text-accent-light transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="text-white hover:text-accent-light transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Not Scrolled State - Two Row Centered Layout
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ease-in-out">
      <div className="max-w-[1800px] mx-auto px-6">
        {/* Top Row - Brand Name */}
        <div className="flex items-center justify-center py-6 border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="font-sterling tracking-[0.3em] text-white text-[56px] lg:text-[72px] hover:text-accent-light transition-all duration-300 ease-in-out"
            style={{
              textShadow: '0px 3px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            CYAN JEWELRY
          </button>
        </div>

        {/* Bottom Row - Navigation & Icons (Centered) */}
        <div className="flex items-center justify-center py-4 gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-white hover:text-accent-light transition-colors"
            aria-label="Open menu"
            style={{
              filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
            }}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-xs tracking-wider text-white hover:text-accent-light transition-colors uppercase"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Home
            </button>
            <ProductsDropdown
              categories={categories}
              compact={false}
              onNavigateProducts={navigateToProducts}
              onNavigateCategory={navigateToCategory}
            />
            <button
              className="text-xs tracking-wider text-white hover:text-accent-light transition-colors uppercase"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              New Collection
            </button>
            <button
              className="text-xs tracking-wider text-white hover:text-accent-light transition-colors uppercase"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              About Us
            </button>
            {/* <a
              href="#"
              className="text-xs tracking-wider text-white hover:text-accent-light transition-colors uppercase"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Gifts
            </a>
            <a
              href="#"
              className="text-xs tracking-wider text-white hover:text-accent-light transition-colors uppercase"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              World of Cyan
            </a> */}
          </nav>

          {/* Divider */}
          <div className="hidden lg:block w-px h-4 bg-white/30"></div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-accent-light transition-colors"
              aria-label="Search"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="text-white hover:text-accent-light transition-colors hidden md:block"
              aria-label="Account"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <User className="w-4 h-4" />
            </button>
            <button
              className="text-white hover:text-accent-light transition-colors relative"
              aria-label="Wishlist"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="text-white hover:text-accent-light transition-colors relative"
              aria-label="Shopping bag"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
