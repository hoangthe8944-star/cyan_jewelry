import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const {
    setIsSearchOpen,
    setIsMobileMenuOpen,
    wishlist,
    getCartCount,
  } = useShop();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-primary/80 backdrop-blur-[15px] border-b border-accent'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? 'py-3' : 'py-5'
          }`}
        >
          <div className="flex items-center gap-6 lg:gap-12">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white hover:text-accent-light transition-colors"
              aria-label="Open menu"
              style={{
                filter: isScrolled ? 'none' : 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/')}
              className={`font-sterling tracking-wide text-white transition-all duration-300 ease-in-out hover:text-accent-light ${
                isScrolled ? 'text-[25px] scale-90' : 'text-[28px] scale-100'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              Cyan Jewelry
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#"
                className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                style={{
                  textShadow: isScrolled ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                New In
              </a>
              <a
                href="#"
                className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                style={{
                  textShadow: isScrolled ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Jewelry
              </a>
              <a
                href="#"
                className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                style={{
                  textShadow: isScrolled ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Watches
              </a>
              <a
                href="#"
                className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                style={{
                  textShadow: isScrolled ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Accessories
              </a>
              <a
                href="#"
                className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                style={{
                  textShadow: isScrolled ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Gifts
              </a>
              <a
                href="#"
                className="text-sm tracking-wide text-white hover:text-accent-light transition-colors"
                style={{
                  textShadow: isScrolled ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                World of Cyan
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-accent-light transition-colors"
              aria-label="Search"
              style={{
                filter: isScrolled ? 'none' : 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="text-white hover:text-accent-light transition-colors hidden md:block"
              aria-label="Account"
              style={{
                filter: isScrolled ? 'none' : 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
            >
              <User className="w-5 h-5" />
            </button>
            <button
              className="text-white hover:text-accent-light transition-colors relative"
              aria-label="Wishlist"
              style={{
                filter: isScrolled ? 'none' : 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
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
              style={{
                filter: isScrolled ? 'none' : 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1))',
              }}
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
