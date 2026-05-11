import { Heart, ShoppingBag, Check, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';

const allProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1767921482419-d2d255b5b700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBuZWNrbGFjZSUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Azure Dreams Necklace',
    collection: 'Cyan x Oceanic',
    price: '2,890',
    badge: 'New',
    category: 'Necklaces',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1774504347388-3d01f7cac097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxlbGVnYW50JTIwZWFycmluZ3MlMjBqZXdlbHJ5fGVufDF8fHx8MTc3ODQzMDczN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Sapphire Elegance Earrings',
    collection: 'Cyan x Royal',
    price: '1,650',
    badge: 'Exclusive',
    category: 'Earrings',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1767921777873-81818b812a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBicmFjZWxldCUyMGpld2Vscnl8ZW58MXx8fHwxNzc4MzAxOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Midnight Sapphire Bracelet',
    collection: 'Cyan x Celestial',
    price: '3,240',
    badge: 'Limited Edition',
    category: 'Bracelets',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605102062083-ae61a51393f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Eternal Brilliance Ring',
    collection: 'Cyan x Forever',
    price: '5,890',
    badge: 'New',
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

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState('One Size');

  const product = allProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[24px] mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-8 py-3 hover:bg-secondary transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const sizes = ['One Size', 'Small', 'Medium', 'Large'];

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="relative aspect-square bg-muted overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {product.badge && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-8 left-8 bg-accent text-white px-5 py-2 text-sm tracking-wider"
              >
                {product.badge}
              </motion.span>
            )}
          </motion.div>

          <div className="flex flex-col">
            <div className="flex-1">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm tracking-wider text-muted-foreground mb-3 uppercase"
              >
                {product.collection}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-sterling text-[40px] lg:text-[48px] mb-4 leading-tight"
              >
                {product.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-accent text-[32px] font-medium mb-8"
              >
                ${product.price}
              </motion.p>

              <div className="mb-10 pb-8 border-b border-border">
                <p className="text-muted-foreground leading-relaxed">
                  Exquisitely crafted with premium materials, this piece embodies the ethereal
                  beauty and timeless elegance that define the Cyan Jewelry collection. Each
                  detail has been meticulously designed to create a statement of luxury and
                  sophistication.
                </p>
              </div>

              <div className="mb-10">
                <label className="block text-sm mb-4 tracking-wide">Select Size</label>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <span className="text-sm">{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                className="space-y-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-white py-5 hover:bg-secondary transition-all duration-300 tracking-wide flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Shopping Bag
                </motion.button>
                <motion.button
                  onClick={() => toggleWishlist(product)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full border py-5 transition-all duration-300 tracking-wide flex items-center justify-center gap-3 ${
                    isInWishlist(product.id)
                      ? 'border-accent bg-accent text-white'
                      : 'border-primary text-primary hover:bg-muted'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`}
                  />
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </motion.button>
              </motion.div>

              <div className="space-y-5 text-sm border-t border-border pt-8">
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Complimentary Shipping</p>
                    <p className="text-muted-foreground">
                      Free shipping on all orders over $500
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Lifetime Warranty</p>
                    <p className="text-muted-foreground">
                      Professional care and lifetime warranty included
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Gift Packaging</p>
                    <p className="text-muted-foreground">
                      Elegantly wrapped in our signature packaging
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
