import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

const allProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1767921482419-d2d255b5b700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBuZWNrbGFjZSUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Azure Dreams Necklace',
    collection: 'Cyan x Oceanic',
    price: '2,890',
    category: 'Necklaces',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1774504347388-3d01f7cac097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxlbGVnYW50JTIwZWFycmluZ3MlMjBqZXdlbHJ5fGVufDF8fHx8MTc3ODQzMDczN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Sapphire Elegance Earrings',
    collection: 'Cyan x Royal',
    price: '1,650',
    category: 'Earrings',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1767921777873-81818b812a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBicmFjZWxldCUyMGpld2Vscnl8ZW58MXx8fHwxNzc4MzAxOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Midnight Sapphire Bracelet',
    collection: 'Cyan x Celestial',
    price: '3,240',
    category: 'Bracelets',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605102062083-ae61a51393f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Eternal Brilliance Ring',
    collection: 'Cyan x Forever',
    price: '5,890',
    category: 'Rings',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1767921783351-b026a735f708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBuZWNrbGFjZSUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Ocean Treasures Necklace',
    collection: 'Cyan x Aquatic',
    price: '2,450',
    category: 'Necklaces',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1778182553300-7593326ca29d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxlbGVnYW50JTIwZWFycmluZ3MlMjBqZXdlbHJ5fGVufDF8fHx8MTc3ODQzMDczN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Golden Seashell Drops',
    collection: 'Cyan x Maritime',
    price: '1,290',
    category: 'Earrings',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1763029513623-37d488cb97b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBicmFjZWxldCUyMGpld2Vscnl8ZW58MXx8fHwxNzc4MzAxOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Diamond Cascade Bracelet',
    collection: 'Cyan x Radiance',
    price: '4,780',
    category: 'Bracelets',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1662434923232-0164224dbdb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Infinite Love Ring',
    collection: 'Cyan x Romance',
    price: '3,950',
    category: 'Rings',
  },
];

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                {searchQuery.trim() && `${filteredProducts.length} results found`}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-12">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-20">
                  <Search className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-20" />
                  <h2 className="font-sterling text-[32px] mb-3">Search Our Collection</h2>
                  <p className="text-muted-foreground text-lg">
                    Start typing to discover exquisite jewelry pieces
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <h2 className="font-sterling text-[32px] mb-3">No Results Found</h2>
                  <p className="text-muted-foreground text-lg">
                    We couldn't find any products matching "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="group text-left"
                    >
                      <div className="aspect-[3/4] bg-muted mb-4 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs tracking-wider text-muted-foreground mb-1 uppercase">
                        {product.collection}
                      </p>
                      <h3 className="text-lg mb-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-accent font-medium">${product.price}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
