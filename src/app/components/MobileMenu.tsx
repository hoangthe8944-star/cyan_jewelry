import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';

const menuItems = [
  { label: 'Hàng mới', href: '#new' },
  { label: 'Trang sức', href: '#jewelry' },
  { label: 'Đồng hồ', href: '#watches' },
  { label: 'Phụ kiện', href: '#accessories' },
  { label: 'Quà tặng', href: '#gifts' },
  { label: 'Thế giới Oriven', href: '#world' },
];

export function MobileMenu() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useShop();

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-sterling text-[24px]">Danh mục</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-accent transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-6">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-4 px-4 hover:bg-muted transition-colors group"
                    >
                      <span className="tracking-wide">{item.label}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-border space-y-3">
                <a
                  href="#account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 hover:bg-muted transition-colors text-sm"
                >
                  Tài khoản của tôi
                </a>
                <a
                  href="#stores"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 hover:bg-muted transition-colors text-sm"
                >
                  Tìm cửa hàng
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 hover:bg-muted transition-colors text-sm"
                >
                  Liên hệ
                </a>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
