import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, LoaderCircle, Minus, Plus, ShoppingBag, X } from 'lucide-react';

import { API_BASE_URL, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import { buildCartItemKey, useShop } from '../context/ShopContext';
import { saveRecentOrder } from '../lib/orderHistory';
import type { OrderAddress, OrderCustomer, OrderPayload } from '../lib/types';
import { getAuthUser } from '../lib/auth';

function formatVndCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

interface CheckoutFormState {
  fullName: string;
  phoneNumber: string;
  email: string;
  line1: string;
  ward: string;
  district: string;
  province: string;
  note: string;
}

type CheckoutPaymentMethod = 'MOMO' | 'COD' | 'VNPAY';

const INITIAL_FORM: CheckoutFormState = {
  fullName: '',
  phoneNumber: '',
  email: '',
  line1: '',
  ward: '',
  district: '',
  province: '',
  note: '',
};

function trimOrUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('MOMO');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const authUser = getAuthUser();

  useEffect(() => {
    if (authUser) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.fullName,
        email: prev.email || authUser.email,
      }));
    }
  }, []);

  const cartSubtotal = getCartTotal();
  const invalidCartItems = useMemo(() => cart.filter((item) => !item.variantCode), [cart]);

  const handleInputChange = (field: keyof CheckoutFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0 || invalidCartItems.length > 0) {
      return;
    }

    setSubmitting(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);

    try {
      const customer: OrderCustomer = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        ...(trimOrUndefined(form.email) ? { email: trimOrUndefined(form.email) } : {}),
        ...(authUser ? { userId: authUser.id } : {}),
      };

      const shippingAddress: OrderAddress = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        line1: form.line1.trim(),
        ...(trimOrUndefined(form.ward) ? { ward: trimOrUndefined(form.ward) } : {}),
        ...(trimOrUndefined(form.district) ? { district: trimOrUndefined(form.district) } : {}),
        ...(trimOrUndefined(form.province)
          ? {
              city: trimOrUndefined(form.province),
              province: trimOrUndefined(form.province),
            }
          : {}),
        country: 'VN',
      };

      const payload: OrderPayload = {
        customer,
        shippingAddress,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          variantCode: item.variantCode!,
        })),
        shippingFee: 0,
        paymentMethod,
        ...(trimOrUndefined(form.note) ? { note: trimOrUndefined(form.note) } : {}),
        ...(authUser ? { userId: authUser.id } : {}),
        ...(paymentMethod === 'MOMO'
          ? {
              momoPayment: {
                orderInfo: `Thanh toan don hang OrivenJewelry ${Date.now()}`,
                redirectUrl: `${window.location.origin}/payment/callback`,
                ipnUrl: `${API_BASE_URL}/api/public/payments/momo/ipn`,
                requestType: 'CAPTURE_WALLET',
                lang: 'vi',
              },
            }
          : {}),
      };

      const response = await storefrontApi.createOrder(payload);
      saveRecentOrder(response.order);

      if ((paymentMethod === 'MOMO' || paymentMethod === 'VNPAY') && response.payUrl) {
        window.location.href = response.payUrl;
        return;
      }

      clearCart();
      setCheckoutSuccess(
        paymentMethod === 'COD'
          ? `Đã đặt hàng COD thành công${response.order.orderCode ? `, mã đơn ${response.order.orderCode}` : ''}.`
          : `Đã tạo đơn hàng${response.order.orderCode ? ` ${response.order.orderCode}` : ''} nhưng backend chưa trả về payUrl cho ${paymentMethod}.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể khởi tạo thanh toán.';

      if (paymentMethod === 'MOMO' && /MoMo payment is not enabled/i.test(message)) {
        setPaymentMethod('COD');
        setCheckoutError('Backend Cyan chưa bật MoMo. Mình đã chuyển sang COD để bạn có thể tiếp tục đặt hàng.');
      } else if (paymentMethod === 'VNPAY' && /VNPay payment is not enabled/i.test(message)) {
        setPaymentMethod('COD');
        setCheckoutError('Backend Cyan chưa bật VNPay. Mình đã chuyển sang COD để bạn có thể tiếp tục đặt hàng.');
      } else {
        setCheckoutError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <button
            onClick={() => navigate('/home')}
            className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Tiếp tục mua sắm</span>
          </button>

          <h1 className="mb-8 font-sterling text-[40px]">Giỏ hàng</h1>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="mb-6 h-20 w-20 text-muted-foreground" />
              <h2 className="mb-3 text-[24px]">Giỏ hàng của bạn đang trống</h2>
              <p className="mb-8 text-muted-foreground">Hãy thêm sản phẩm để bắt đầu mua sắm</p>
              <button
                onClick={() => navigate('/home')}
                className="bg-primary px-10 py-4 text-white transition-all duration-300 hover:bg-secondary"
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {invalidCartItems.length > 0 ? (
                  <div className="border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                    Có {invalidCartItems.length} sản phẩm được thêm từ danh sách nhưng chưa có biến thể hợp lệ. Vui lòng
                    mở chi tiết sản phẩm và chọn phiên bản trước khi thanh toán MoMo.
                  </div>
                ) : null}

                {cart.map((item) => {
                  const cartKey = buildCartItemKey(item);

                  return (
                    <div key={cartKey} className="flex gap-6 border-b border-border pb-6">
                      <div className="h-40 w-32 flex-shrink-0 bg-muted">
                        <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex justify-between">
                          <div>
                            <h3 className="text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.collection}</p>
                            {item.productType ? (
                              <p className="mt-1 text-sm text-muted-foreground">Kiểu sản phẩm: {item.productType}</p>
                            ) : null}
                            {item.productTypeCode ? (
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Mã kiểu: {item.productTypeCode}
                              </p>
                            ) : null}
                            {item.variantLabel ? (
                              <p className="mt-1 text-sm text-muted-foreground">Phiên bản: {item.variantLabel}</p>
                            ) : null}
                            {item.variantId ? (
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Mã biến thể: {item.variantId}
                              </p>
                            ) : null}
                            {item.variantStyleCode || item.variantModelCode ? (
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                {item.variantStyleCode ? `Style: ${item.variantStyleCode}` : ''}
                                {item.variantStyleCode && item.variantModelCode ? ' · ' : ''}
                                {item.variantModelCode ? `Model: ${item.variantModelCode}` : ''}
                              </p>
                            ) : null}
                          </div>
                          <button
                            onClick={() => removeFromCart(cartKey)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="mb-4 text-lg font-medium text-accent">{formatVndCurrency(item.price)}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-4 border border-border">
                            <button
                              onClick={() => updateQuantity(cartKey, item.quantity - 1)}
                              className="p-3 transition-colors hover:bg-muted"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[30px] text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cartKey, item.quantity + 1)}
                              className="p-3 transition-colors hover:bg-muted"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Thành tiền: {formatVndCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <form onSubmit={handleCheckout} className="sticky top-24 space-y-6 bg-muted p-8">
                  <div>
                    <h2 className="font-sterling text-[24px]">Thanh toán</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Điền thông tin nhận hàng và chọn phương thức thanh toán phù hợp.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phương thức thanh toán</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('MOMO')}
                        className={`border px-4 py-3 text-sm transition-colors ${
                          paymentMethod === 'MOMO'
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-white text-foreground hover:border-primary'
                        }`}
                      >
                        MoMo
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('VNPAY')}
                        className={`border px-4 py-3 text-sm transition-colors ${
                          paymentMethod === 'VNPAY'
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-white text-foreground hover:border-primary'
                        }`}
                      >
                        VNPAY
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`border px-4 py-3 text-sm transition-colors ${
                          paymentMethod === 'COD'
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-white text-foreground hover:border-primary'
                        }`}
                      >
                        COD
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === 'MOMO' && 'Nếu backend đã bật MoMo, hệ thống sẽ chuyển bạn sang cổng thanh toán.'}
                      {paymentMethod === 'VNPAY' && 'Hệ thống sẽ chuyển bạn sang cổng thanh toán VNPay để hoàn tất đơn hàng.'}
                      {paymentMethod === 'COD' && 'Thanh toán khi nhận hàng, không cần chuyển sang cổng thanh toán.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      required
                      value={form.fullName}
                      onChange={(event) => handleInputChange('fullName', event.target.value)}
                      placeholder="Họ và tên"
                      className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <input
                      required
                      value={form.phoneNumber}
                      onChange={(event) => handleInputChange('phoneNumber', event.target.value)}
                      placeholder="Số điện thoại"
                      className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => handleInputChange('email', event.target.value)}
                      placeholder="Email"
                      className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <input
                      required
                      value={form.line1}
                      onChange={(event) => handleInputChange('line1', event.target.value)}
                      placeholder="Địa chỉ cụ thể"
                      className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={form.ward}
                        onChange={(event) => handleInputChange('ward', event.target.value)}
                        placeholder="Phường / Xã"
                        className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                      />
                      <input
                        value={form.district}
                        onChange={(event) => handleInputChange('district', event.target.value)}
                        placeholder="Quận / Huyện"
                        className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                      />
                    </div>
                    <input
                      required
                      value={form.province}
                      onChange={(event) => handleInputChange('province', event.target.value)}
                      placeholder="Tỉnh / Thành phố"
                      className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <textarea
                      value={form.note}
                      onChange={(event) => handleInputChange('note', event.target.value)}
                      placeholder="Ghi chú đơn hàng"
                      rows={3}
                      className="w-full resize-none border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="space-y-4 border-b border-t border-border py-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatVndCurrency(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vận chuyển</span>
                      <span className="text-sm text-accent">Miễn phí</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phương thức</span>
                      <span>{paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg">Tổng cộng</span>
                    <span className="font-sterling text-[28px] text-accent">{formatVndCurrency(cartSubtotal)}</span>
                  </div>

                  {checkoutSuccess ? (
                    <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {checkoutSuccess}
                    </div>
                  ) : null}

                  {checkoutError ? (
                    <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {checkoutError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting || invalidCartItems.length > 0}
                    className="flex w-full items-center justify-center gap-3 bg-primary py-4 text-white transition-all duration-300 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                    <span>
                      {submitting
                        ? 'Đang xử lý đơn hàng...'
                        : paymentMethod === 'MOMO'
                          ? 'Thanh toán với MoMo'
                          : paymentMethod === 'VNPAY'
                            ? 'Thanh toán với VNPAY'
                            : 'Đặt hàng COD'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/home')}
                    className="w-full border border-primary py-4 text-primary transition-all duration-300 hover:bg-muted"
                  >
                    Tiếp tục mua sắm
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
