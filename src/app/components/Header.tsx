import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';

import { storefrontApi } from '../api';
import { useShop } from '../context/ShopContext';
import { clearAuthUser, getAuthUser, type AuthUser } from '../lib/auth';
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
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [menuTop, setMenuTop] = useState(compact ? 142 : 196);

  useEffect(() => {
    const updateMenuTop = () => {
      if (!triggerRef.current) {
        return;
      }

      const { bottom } = triggerRef.current.getBoundingClientRect();
      setMenuTop(compact ? bottom : bottom + 16);
    };

    updateMenuTop();
    window.addEventListener('resize', updateMenuTop);
    window.addEventListener('scroll', updateMenuTop, true);

    return () => {
      window.removeEventListener('resize', updateMenuTop);
      window.removeEventListener('scroll', updateMenuTop, true);
    };
  }, [compact]);

  const linkClass = compact
    ? 'text-sm tracking-wide text-white transition-colors hover:text-accent-light'
    : 'text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light';

  const menuClass = compact
    ? 'fixed inset-x-0 z-50 border-y border-white/10 bg-primary/95 py-8 text-white shadow-2xl backdrop-blur-[18px]'
    : 'fixed inset-x-0 z-50 border-y border-white/10 bg-black/70 py-6 text-white shadow-2xl backdrop-blur-[18px]';
  const hoverBridgeClass = compact
    ? 'pointer-events-none absolute left-1/2 top-full h-10 w-32 -translate-x-1/2 group-hover:pointer-events-auto'
    : 'pointer-events-none absolute left-1/2 top-full h-10 w-28 -translate-x-1/2 group-hover:pointer-events-auto';

  return (
    <div ref={triggerRef} className={compact ? 'group' : 'group relative'}>
      <button className={`relative z-[60] ${linkClass}`} type="button" onClick={onNavigateProducts}>
        Sản phẩm
      </button>
      <div className={hoverBridgeClass} />
      <div
        className={compact 
          ? `invisible opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${menuClass}`
          : `invisible absolute opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${menuClass}`
        }
        style={{ top: `${menuTop}px` }}
      >
        {categories.length === 0 ? (
          <div className="py-6 text-center text-sm text-white/70">Đang tải danh mục...</div>
        ) : (
          <div className="mx-auto max-w-[1800px] px-6">
            <div className={compact ? "grid grid-cols-3 gap-12 max-w-[1200px] mx-auto" : "grid grid-cols-3 gap-6"}>
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

function AccountDropdown({
  compact,
  authUser,
  onLogout,
}: {
  compact: boolean;
  authUser: AuthUser | null;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const iconClass = compact ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className="group relative hidden md:block">
      <button
        className="hidden text-white transition-colors hover:text-accent-light md:block"
        aria-label="Tài khoản"
        style={!compact ? { filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))' } : undefined}
      >
        <User className={iconClass} />
      </button>
      <div className="pointer-events-none absolute right-0 top-full h-6 w-56 group-hover:pointer-events-auto" />
      <div className="invisible absolute right-0 top-full z-[70] mt-4 min-w-[240px] translate-y-2 border border-[rgba(163,107,49,0.24)] bg-white/98 p-2 opacity-0 shadow-[0_24px_60px_rgba(17,33,45,0.18)] backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {authUser ? (
          <>
            <div className="border-b border-[rgba(163,107,49,0.16)] px-4 py-3">
              <p className="text-sm font-medium text-foreground">{authUser.fullName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{authUser.email}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="block w-full px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              Thông tin tài khoản
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-orders')}
              className="block w-full px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              Đơn hàng của tôi
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="block w-full px-4 py-3 text-left text-sm text-destructive transition-colors hover:bg-muted"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="block w-full px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="block w-full px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              Tạo tài khoản
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LandingHeader({ isScrolled, authUser }: { isScrolled: boolean; authUser: AuthUser | null }) {
  const navigate = useNavigate();

  if (isScrolled) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/28 backdrop-blur-[18px] transition-all duration-300">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="font-sterling text-[24px] tracking-[0.18em] text-white transition-colors hover:text-accent-light lg:text-[30px]"
          >
            ORIVEN JEWELRY
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="rounded-full bg-[#f2e2cf] px-5 py-2.5 text-xs uppercase tracking-[0.24em] text-[#1b130f] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Bắt đầu
            </button>
            <button
              type="button"
              onClick={() => navigate(authUser ? '/account' : '/login')}
              className="rounded-full border border-white/16 bg-white/6 px-5 py-2.5 text-xs uppercase tracking-[0.24em] text-white backdrop-blur transition-colors duration-300 hover:bg-white/12"
            >
              {authUser ? 'Tài khoản' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent transition-all duration-300 ease-in-out">
      <div className="mx-auto max-w-[1800px] px-6">
        <div className="flex items-center justify-center py-8 lg:py-10">
          <button
            onClick={() => navigate('/')}
            className="font-sterling text-[42px] tracking-[0.34em] text-white transition-colors hover:text-accent-light lg:text-[68px]"
            style={{ textShadow: '0px 3px 12px rgba(0, 0, 0, 0.18)' }}
          >
            ORIVEN JEWELRY
          </button>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(getAuthUser());
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSearchOpen, setIsMobileMenuOpen, wishlist, getCartCount } = useShop();

  const isLandingPage = location.pathname === '/';
  const isHomeHeroPage = location.pathname === '/home';
  const navigateToStoreHome = () => navigate('/home');
  const navigateToProducts = () => navigate('/products');
  const navigateToCollections = () => navigate('/collections');
  const navigateToCategory = (slug: string) => navigate(`/products?category=${slug}`);
  const navigateToAbout = () => navigate('/about');
  const navigateToNews = () => navigate('/news');

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

  useEffect(() => {
    const syncAuthUser = () => setAuthUser(getAuthUser());

    syncAuthUser();
    window.addEventListener('storage', syncAuthUser);
    window.addEventListener('focus', syncAuthUser);

    return () => {
      window.removeEventListener('storage', syncAuthUser);
      window.removeEventListener('focus', syncAuthUser);
    };
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    setAuthUser(null);
    navigate('/login');
  };

  if (isLandingPage) {
    return <LandingHeader isScrolled={isScrolled} authUser={authUser} />;
  }

  if (isScrolled || !isHomeHeroPage) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-accent bg-primary/80 backdrop-blur-[15px] transition-all duration-300 ease-in-out">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6 lg:gap-12">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white transition-colors hover:text-accent-light lg:hidden"
                aria-label="Mở menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={navigateToStoreHome}
                className="font-sterling text-[25px] tracking-wide text-white transition-all duration-300 hover:text-accent-light"
              >
                Oriven Jewelry
              </button>
              <nav className="hidden items-center gap-8 lg:flex">
                <button
                  onClick={navigateToStoreHome}
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
                  onClick={navigateToCollections}
                  className="text-sm tracking-wide text-white transition-colors hover:text-accent-light"
                >
                  Bộ sưu tập
                </button>
                <button
                  onClick={navigateToAbout}
                  className="text-sm tracking-wide text-white transition-colors hover:text-accent-light"
                >
                  Về chúng tôi
                </button>
                <button
                  onClick={navigateToNews}
                  className="text-sm tracking-wide text-white transition-colors hover:text-accent-light"
                >
                  Tin tức
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white transition-colors hover:text-accent-light"
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </button>
              <AccountDropdown compact authUser={authUser} onLogout={handleLogout} />
              <button
                onClick={() => navigate(authUser ? '/account' : '/login')}
                className="text-white transition-colors hover:text-accent-light block md:hidden"
                aria-label="Tài khoản"
              >
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/wishlist')}
                className="relative text-white transition-colors hover:text-accent-light"
                aria-label="Yêu thích"
              >
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
                aria-label="Giỏ hàng"
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
            onClick={navigateToStoreHome}
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
            aria-label="Mở menu"
            style={{
              filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
            }}
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            <button
              onClick={navigateToStoreHome}
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
              onClick={navigateToCollections}
              className="text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Bộ sưu tập
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
            <button
              onClick={navigateToNews}
              className="text-xs uppercase tracking-wider text-white transition-colors hover:text-accent-light"
              style={{
                textShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Tin tức
            </button>
          </nav>

          <div className="hidden h-4 w-px bg-white/30 lg:block" />

          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white transition-colors hover:text-accent-light"
              aria-label="Tìm kiếm"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Search className="h-4 w-4" />
            </button>
            <AccountDropdown compact={false} authUser={authUser} onLogout={handleLogout} />
            <button
              onClick={() => navigate(authUser ? '/account' : '/login')}
              className="text-white transition-colors hover:text-accent-light block md:hidden"
              aria-label="Tài khoản"
              style={{
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <User className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="relative text-white transition-colors hover:text-accent-light"
              aria-label="Yêu thích"
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
              aria-label="Giỏ hàng"
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
