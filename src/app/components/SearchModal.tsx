import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useShop } from '../context/ShopContext';
import type { ProductCardItem } from '../lib/types';

function formatVndCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ProductCardItem[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setKeywordSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      storefrontApi
        .getSearchSuggestions(searchQuery)
        .then((response) => {
          setResults(response.productSuggestions);
          setKeywordSuggestions(response.keywordSuggestions);
        })
        .catch(() => {
          setResults([]);
          setKeywordSuggestions([]);
        });
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
          className="fixed inset-0 z-50 flex flex-col bg-white"
        >
          <div className="border-b border-accent bg-primary/80 backdrop-blur-[15px]">
            <div className="mx-auto max-w-4xl px-6 py-8">
              <div className="mb-2 flex items-center gap-6">
                <Search className="h-7 w-7 flex-shrink-0 text-white" />
                <input
                  type="text"
                  placeholder="Tìm trang sức, bộ sưu tập..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="flex-1 bg-transparent text-[28px] font-sterling text-white outline-none placeholder:text-white/50"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="flex-shrink-0 text-white transition-colors hover:text-accent-light"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
              <p className="ml-[52px] text-sm text-white/70">
                {searchQuery.trim() ? `${results.length} gợi ý sản phẩm` : ''}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-6 py-12">
              {!searchQuery.trim() ? (
                <div className="py-20 text-center">
                  <Search className="mx-auto mb-6 h-20 w-20 text-muted-foreground opacity-20" />
                  <h2 className="mb-3 font-sterling text-[32px]">Tìm kiếm sản phẩm</h2>
                  <p className="text-lg text-muted-foreground">
                    Bắt đầu nhập để xem sản phẩm và từ khóa gợi ý từ storefront Oriven
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="py-20 text-center">
                  <h2 className="mb-3 font-sterling text-[32px]">Không tìm thấy kết quả</h2>
                  <p className="text-lg text-muted-foreground">
                    Không tìm thấy sản phẩm phù hợp với &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {keywordSuggestions.length > 0 ? (
                    <div>
                      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        Từ khóa gợi ý
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {keywordSuggestions.map((keyword) => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => setSearchQuery(keyword)}
                            className="border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                          >
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                        className="group text-left"
                      >
                        <div className="mb-4 aspect-[3/4] overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={resolveMediaUrl(product.gallery[0])}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                          {product.brand || 'Oriven Jewelry'}
                        </p>
                        <h3 className="mb-2 text-lg transition-colors group-hover:text-accent">
                          {product.name}
                        </h3>
                        <p className="font-medium text-accent">{formatVndCurrency(product.minPrice)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
