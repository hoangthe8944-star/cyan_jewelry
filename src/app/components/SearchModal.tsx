import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { useShop } from '../context/ShopContext';
import type { ProductCardItem } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
          className="fixed inset-0 z-50 flex flex-col bg-[#11212D] text-white"
        >
          {/* Header section with search bar */}
          <div className="border-b border-[#A36B31]/30 bg-[#11212D]/95 backdrop-blur-[15px]">
            <div className="mx-auto max-w-4xl px-6 py-8">
              <div className="mb-2 flex items-center gap-3 sm:gap-6">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-[#A36B31]" />
                <input
                  type="text"
                  placeholder="Tìm trang sức, bộ sưu tập..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="flex-1 bg-transparent text-[18px] sm:text-[24px] font-sterling text-white outline-none placeholder:text-white/40 border-b border-transparent focus:border-[#A36B31]/50 pb-1 transition-all duration-300"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="flex-shrink-0 text-white/70 transition-colors hover:text-white"
                  aria-label="Đóng tìm kiếm"
                >
                  <X className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>
              </div>
              <p className="ml-[52px] text-xs uppercase tracking-wider text-white/50">
                {searchQuery.trim() ? `${results.length} gợi ý sản phẩm` : 'Nhập từ khóa tìm kiếm'}
              </p>
            </div>
          </div>

          {/* Results section */}
          <div className="flex-1 overflow-y-auto bg-[#0F1C26]">
            <div className="mx-auto max-w-6xl px-6 py-12">
              {!searchQuery.trim() ? (
                <div className="py-20 text-center">
                  <Search className="mx-auto mb-6 h-16 w-16 text-[#A36B31] opacity-40 animate-pulse" />
                  <h2 className="mb-3 font-sterling text-[28px] sm:text-[32px] text-[#f2e2cf]">Tìm kiếm sản phẩm</h2>
                  <p className="max-w-md mx-auto text-sm sm:text-base text-white/60 leading-7">
                    Bắt đầu nhập để xem sản phẩm và từ khóa gợi ý từ storefront Oriven Jewelry
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="py-20 text-center">
                  <h2 className="mb-3 font-sterling text-[28px] sm:text-[32px] text-[#f2e2cf]">Không tìm thấy kết quả</h2>
                  <p className="text-sm sm:text-base text-white/60">
                    Không tìm thấy sản phẩm phù hợp với &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {keywordSuggestions.length > 0 ? (
                    <div>
                      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">
                        Từ khóa gợi ý
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {keywordSuggestions.map((keyword) => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => setSearchQuery(keyword)}
                            className="border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#A36B31] hover:text-[#f2e2cf]"
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
                        <div className="mb-4 aspect-[3/4] overflow-hidden bg-[#11212D]/50 border border-white/5 relative">
                          <ImageWithFallback
                            src={resolveMediaUrl(product.gallery[0])}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                        </div>
                        <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                          {product.brand || 'Oriven Jewelry'}
                        </p>
                        <h3 className="mb-2 text-base sm:text-lg text-white/90 transition-colors group-hover:text-[#f2e2cf]">{product.name}</h3>
                        <p className="font-semibold text-[#A36B31]">{formatVndCurrency(product.minPrice)}</p>
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
