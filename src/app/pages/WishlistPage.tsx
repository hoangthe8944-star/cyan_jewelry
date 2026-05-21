import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';

import { formatCurrency } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { useShop } from '../context/ShopContext';

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <button
            onClick={() => navigate('/home')}
            className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang chủ
          </button>

          <div className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-8">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Yêu thích</p>
              <h1 className="font-sterling text-[40px] text-primary lg:text-[52px]">Sản phẩm đã lưu</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/75 lg:text-base">
                
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-accent" />
              {wishlist.length} sản phẩm
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-border bg-muted/35 px-8 py-16 text-center">
              <h2 className="font-sterling text-[28px] text-primary">Chưa có sản phẩm yêu thích</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-foreground/70">
                Khi bạn bấm vào biểu tượng trái tim trên sản phẩm, món đó sẽ xuất hiện tại đây trong suốt phiên làm việc hiện tại.
              </p>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="mt-8 rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.24em] text-white transition-colors hover:bg-secondary"
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {wishlist.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_20px_60px_rgba(18,28,45,0.08)]"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="block w-full text-left"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </button>

                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{product.collection}</p>
                      <h3 className="mt-2 font-sterling text-[24px] leading-tight text-primary">{product.name}</h3>
                      <p className="mt-3 text-lg font-medium text-accent">{formatCurrency(product.price)}</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product);
                          navigate('/cart');
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-secondary"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Thêm vào giỏ
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-muted"
                      >
                        <Trash2 className="h-4 w-4" />
                        Bỏ lưu
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
