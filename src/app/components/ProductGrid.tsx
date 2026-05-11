import { ProductCard } from './ProductCard';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1767921482419-d2d255b5b700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBuZWNrbGFjZSUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Azure Dreams Necklace',
    collection: 'Cyan x Oceanic',
    price: '2,890',
    badge: 'New',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1774504347388-3d01f7cac097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxlbGVnYW50JTIwZWFycmluZ3MlMjBqZXdlbHJ5fGVufDF8fHx8MTc3ODQzMDczN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Sapphire Elegance Earrings',
    collection: 'Cyan x Royal',
    price: '1,650',
    badge: 'Exclusive',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1767921777873-81818b812a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBicmFjZWxldCUyMGpld2Vscnl8ZW58MXx8fHwxNzc4MzAxOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Midnight Sapphire Bracelet',
    collection: 'Cyan x Celestial',
    price: '3,240',
    badge: 'Limited Edition',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605102062083-ae61a51393f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Eternal Brilliance Ring',
    collection: 'Cyan x Forever',
    price: '5,890',
    badge: 'New',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1767921783351-b026a735f708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBuZWNrbGFjZSUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Ocean Treasures Necklace',
    collection: 'Cyan x Aquatic',
    price: '2,450',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1778182553300-7593326ca29d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxlbGVnYW50JTIwZWFycmluZ3MlMjBqZXdlbHJ5fGVufDF8fHx8MTc3ODQzMDczN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Golden Seashell Drops',
    collection: 'Cyan x Maritime',
    price: '1,290',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1763029513623-37d488cb97b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBicmFjZWxldCUyMGpld2Vscnl8ZW58MXx8fHwxNzc4MzAxOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Diamond Cascade Bracelet',
    collection: 'Cyan x Radiance',
    price: '4,780',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1662434923232-0164224dbdb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc4NDMwNzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Infinite Love Ring',
    collection: 'Cyan x Romance',
    price: '3,950',
  },
];

export function ProductGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-[1800px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-sterling text-[40px] mb-3">New Arrivals</h2>
          <p className="text-muted-foreground tracking-wide">
            Discover our latest ethereal creations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              collection={product.collection}
              price={product.price}
              badge={product.badge}
              index={index}
            />
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-10 py-3 hover:bg-secondary transition-all duration-300 tracking-wide"
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
