import { createContext, useContext, useState, ReactNode } from 'react';

import type { ShopProduct } from '../lib/types';

interface CartItem extends ShopProduct {
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: ShopProduct[];
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  addToCart: (product: ShopProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: ShopProduct) => void;
  isInWishlist: (productId: string) => boolean;
  setIsSearchOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<ShopProduct[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addToCart = (product: ShopProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = (product: ShopProduct) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((item) => item.id === productId);

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        isSearchOpen,
        isMobileMenuOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        setIsSearchOpen,
        setIsMobileMenuOpen,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
