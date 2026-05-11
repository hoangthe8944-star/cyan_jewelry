import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { formatCurrency, resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useShop } from '../context/ShopContext';
import type { ProductCardItem } from '../lib/types';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ProductCardItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      storefrontApi
        .searchProducts(searchQuery)
        .then((response) => setResults(response.items))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {isSearchOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 flex flex-col"
        >
          <div className="bg-primary/80 backdrop-blur-[15px] border-b border-accent">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="flex items-center gap-6 mb-2">
                <Search className="w-7 h-7 text-white flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for jewelry, collections..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="flex-1 bg-transparent outline-none text-white text-[28px] font-sterling placeholder:text-white/50"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white hover:text-accent-light transition-colors flex-shrink-0"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              <p className="text-white/70 text-sm ml-[52px]">
                {searchQuery.trim() ? `${results.length} results found` : ''}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-12">
              {!searchQuery.trim() ? (
                <div className="text-center py-20">
                  <Search className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-20" />
                  <h2 className="font-sterling text-[32px] mb-3">Search Our Collection</h2>
                  <p className="text-muted-foreground text-lg">
                    Start typing to discover exquisite jewelry pieces
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-20">
                  <h2 className="font-sterling text-[32px] mb-3">No Results Found</h2>
                  <p className="text-muted-foreground text-lg">
                    We couldn&apos;t find any products matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="group text-left"
                    >
                      <div className="aspect-[3/4] bg-muted mb-4 overflow-hidden">
                        <ImageWithFallback
                          src={resolveMediaUrl(product.gallery[0])}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs tracking-wider text-muted-foreground mb-1 uppercase">
                        {product.brand || 'Cyan Jewelry'}
                      </p>
                      <h3 className="text-lg mb-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-accent font-medium">{formatCurrency(product.minPrice)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
