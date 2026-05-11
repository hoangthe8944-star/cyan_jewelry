import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useShop();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continue Shopping</span>
        </button>

        <h1 className="font-sterling text-[40px] mb-8">Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-20 h-20 text-muted-foreground mb-6" />
            <h2 className="text-[24px] mb-3">Your bag is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add items to get started
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-10 py-4 hover:bg-secondary transition-all duration-300"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-border">
                  <div className="w-32 h-40 bg-muted flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.collection}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-accent font-medium text-lg mb-4">${item.price}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4 border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-3 hover:bg-muted transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm min-w-[30px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-3 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total: ${(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-muted p-8 sticky top-24">
                <h2 className="font-sterling text-[24px] mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${getCartTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-sm text-accent">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                  <span className="text-lg">Total</span>
                  <span className="font-sterling text-[28px] text-accent">
                    ${getCartTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button className="w-full bg-primary text-white py-4 mb-3 hover:bg-secondary transition-all duration-300 tracking-wide">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full border border-primary text-primary py-4 hover:bg-muted transition-all duration-300 tracking-wide"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground space-y-2">
                  <p>✓ Free shipping on orders over $500</p>
                  <p>✓ Easy returns within 30 days</p>
                  <p>✓ Secure payment processing</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}
