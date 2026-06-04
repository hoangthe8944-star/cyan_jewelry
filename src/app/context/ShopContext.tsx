import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

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
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: ShopProduct) => void;
  isInWishlist: (productId: string) => boolean;
  setIsSearchOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'Oriven-cart';
const WISHLIST_STORAGE_KEY = 'Oriven-wishlist';

function readCartFromSession(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const value = window.sessionStorage.getItem(CART_STORAGE_KEY);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readWishlistFromSession(): ShopProduct[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const value = window.sessionStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildCartItemKey(product: Pick<CartItem, 'id' | 'variantCode'>) {
  return `${product.id}::${product.variantCode ?? 'default'}`;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(readCartFromSession);
  const [wishlist, setWishlist] = useState<ShopProduct[]>(readWishlistFromSession);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.sessionStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback((product: ShopProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => buildCartItemKey(item) === buildCartItemKey(product));
      if (existing) {
        return prev.map((item) =>
          buildCartItemKey(item) === buildCartItemKey(product)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cartKey: string) => {
    setCart((prev) => prev.filter((item) => buildCartItemKey(item) !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (buildCartItemKey(item) === cartKey ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((product: ShopProduct) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.some((item) => item.id === productId), [wishlist]);

  const getCartTotal = useCallback(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const getCartCount = useCallback(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

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
        clearCart,
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
